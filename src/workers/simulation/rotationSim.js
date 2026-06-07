import { MISC } from '@/data';
import { compileStatMap, mergeStatMaps, computeTotalStat } from '@/utils';

const compileStatMapCache = new WeakMap();

const MAX_PROC_DEPTH = 4;

// Evaluates each variable-stat entry against the current sourceStatMap.
// Each entry scales a stat (statId) proportionally to another stat (source),
// e.g. "gain +2% ATK per 100 DEF above 500". Results are capped at `max`.
const resolveVariableStatMap = (variableStatMap = {}, sourceStatMap = {}) => {
  const resolved = {};
  for (const [statId, detailList] of Object.entries(variableStatMap)) {
    for (const details of detailList) {
      const { source, step, offset = 0, value, max = Infinity } = details;
      const totalStat = computeTotalStat(source, sourceStatMap);
      const mult = Math.max((totalStat - offset) / step, 0);
      const variableStatValue = Math.min(mult * value, max);
      resolved[statId] = (resolved[statId] ?? 0) + variableStatValue;
    }
  }
  return resolved;
};

// ─── Footprint building ───────────────────────────────────────────────────────

/**
 * Build a footprint for a single simulateAction call site.
 *
 * A footprint captures everything needed to recompute the damage without
 * re-running the effect simulation:
 *
 * - For teammate actions with no character variable effects, `fixedDamage` /
 *   `fixedHealing` is pre-computed immediately.
 * - For character actions (or any action affected by charVariableEffectSpecs),
 *   the footprint stores enough data for `evaluateRotationSummary` to replay
 *   the damage math cheaply.
 */
const buildFootprint = ({
  gameId,
  action,
  effectTrackers,
  activeId,
  memberMap,
  characterId,
  repeatCount = 1,
  defCache,
}) => {
  const {
    owner: actionOwner,
    element,
    type,
    considered,
    attr,
    sumMv,
    sumTimes,
    sumFlat,
    times = 1,
  } = action;

  // Base shape
  const footprint = {
    actionKey: action.key,
    owner: actionOwner,
    type,
    element,
    attr,
    sumFlat,
    sumMv,
    sumTimes,
    times,
    considered,
    repeatCount,
    fixedDamage: null,
    fixedHealing: null,
    // Set below
    ownerBaseStatMap: null,  // only set for teammate actions with charVariableEffectSpecs
    constantEffectContribs: {},
    fixedVariableContribs: {},
    charVariableEffectSpecs: [],
    charConstantEffectContribsForSource: {},
    enemyStatMap: {},
  };

  // This footprint does nothing
  if (type === 'shield' || type === 'buff' || (!sumFlat && !sumMv)) {
    return footprint;
  }

  // Build enemy stat map snapshot
  const enemyStatMap = {};
  for (const { stacks, effectDef } of Object.values(effectTrackers.enemy)) {
    const { statMap } = effectDef;
    if (!statMap) continue;

    for (const [stat, value] of Object.entries(statMap)) {
      enemyStatMap[stat] ??= 0;
      enemyStatMap[stat] += value * stacks;
    }
  }
  footprint.enemyStatMap = enemyStatMap;

  // Classify effect contributions
  // constantEffectContribs — flat stat boosts that don't depend on any character's variable stats (same for every build, resolved immediately)
  // fixedVariableContribs — teammate variable effects whose owner's stats are already fixed, so they can also be pre-resolved now
  // charVariableEffectSpecs — the character's own variable effects that scale off their stats, so they must be re-evaluated per artifact build
  const constantEffectContribs = {};
  const fixedVariableContribs = {};
  const charVariableEffectSpecs = [];

  // Include passive effects from the owner's own definitions plus all active tracker maps
  const trackersToEval = [
    ...Object.entries(defCache[actionOwner].effect.effectDefinitions)
      .filter(([, { isPassive }]) => isPassive)
      .map(([key, effectDef]) => ([key, { effectDef }])),
    ...Object.entries(effectTrackers.team),
    ...Object.entries(activeId === actionOwner ? effectTrackers.active : effectTrackers.inactive),
    ...Object.entries(effectTrackers.byMember[actionOwner]),
  ];

  for (const [effectKey, { stacks = 1, effectDef }] of trackersToEval) {
    const {
      useOnAction,
      useOnType,
      useOnTagged,
      useOnCast,
      useOnConsidered,
      chance = 1,
      statMap,
      variableStatMap,
    } = effectDef;

    if (useOnAction && !useOnAction.includes(action.key)) continue;
    if (useOnType && !useOnType.includes(action.type)) continue;
    if (useOnTagged && !action.tagged.some(t => useOnTagged.includes(t))) continue;
    if (useOnCast && !action.cast.some(c => useOnCast.includes(c))) continue;
    if (useOnConsidered && !action.considered.some(c => useOnConsidered.includes(c))) continue;

    const effectOwner = effectKey.split('-')[0];
    const effectScale = chance * stacks;

    if (statMap) {
      for (const [stat, value] of Object.entries(statMap)) {
        constantEffectContribs[stat] ??= 0;
        constantEffectContribs[stat] += value * effectScale;
      }
    }

    if (variableStatMap) {
      if (effectOwner === characterId) {
        // Must be re-evaluated per artifact — record the spec
        charVariableEffectSpecs.push({ variableStatMap, stacks, chance });
      } else {
        // Teammate's variable effect: owner's statMap is fixed, pre-resolve now
        const ownerCurrentStatMap = getCurrentStatMap(effectOwner, effectTrackers, memberMap, defCache, activeId);
        const resolvedStatMap = resolveVariableStatMap(variableStatMap, ownerCurrentStatMap);
        for (const [stat, value] of Object.entries(resolvedStatMap)) {
          fixedVariableContribs[stat] ??= 0;
          fixedVariableContribs[stat] += value * effectScale;
        }
      }
    }
  }

  footprint.constantEffectContribs = constantEffectContribs;
  footprint.fixedVariableContribs = fixedVariableContribs;
  footprint.charVariableEffectSpecs = charVariableEffectSpecs;

  // ── charConstantEffectContribsForSource ───────────────────────────────────
  // Mirrors the first (constant) pass of getCurrentStatMap for the character.
  // Used as the base statMap when resolving charVariableEffectSpecs in
  // evaluateRotationSummary, so that variable effects depending on the
  // character's own stat-scaled buffs are computed correctly.
  if (charVariableEffectSpecs.length > 0) {
    const charConstant = {};

    function addConstantFromMap(trackerMap) {
      for (const { stacks, effectDef } of Object.values(trackerMap)) {
        const { statMap, chance = 1 } = effectDef;
        if (!statMap) continue;

        for (const [statId, value] of Object.entries(statMap)) {
          charConstant[statId] ??= 0;
          charConstant[statId] += value * stacks * chance;
        }
      }
    }

    addConstantFromMap(effectTrackers.byMember[characterId]);
    addConstantFromMap(effectTrackers.team);
    addConstantFromMap(activeId === characterId ? effectTrackers.active : effectTrackers.inactive);

    // Also include passive effects (weapon passives, innate buffs) which never
    // enter tracker maps but do contribute to the character's constant stat base.
    for (const effectDef of Object.values(defCache[characterId].effect.effectDefinitions)) {
      if (!effectDef.isPassive || !effectDef.statMap) continue;
      const { statMap, chance = 1 } = effectDef;
      for (const [statId, value] of Object.entries(statMap)) {
        charConstant[statId] = (charConstant[statId] ?? 0) + value * chance;
      }
    }

    footprint.charConstantEffectContribsForSource = charConstant;
  }

  // For teammate actions affected by charVariableEffectSpecs, store the owner's
  // base statMap so evaluateRotationSummary can reconstruct statMapWithEffects.
  if (actionOwner !== characterId && charVariableEffectSpecs.length > 0) {
    footprint.ownerBaseStatMap = memberMap[actionOwner].statMap;
  }

  // ── Pre-compute fixed damage for teammate actions ────────────────────
  if (actionOwner !== characterId && charVariableEffectSpecs.length === 0) {
    const ownerStatMap = memberMap[actionOwner].statMap;
    const effectStatMap = mergeStatMaps(constantEffectContribs, fixedVariableContribs);
    const statMapWithEffects = mergeStatMaps(ownerStatMap, effectStatMap);
    const baseValue = computeBase(statMapWithEffects, attr, sumMv, sumTimes, sumFlat);

    if (type === 'heal') {
      const healingBonus = computeTotalStat('HB', statMapWithEffects);
      footprint.fixedHealing = baseValue * (1 + healingBonus) * times * repeatCount;
    } else {
      const bonuses = computeBonuses(statMapWithEffects, considered, element, enemyStatMap);
      const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);
      footprint.fixedDamage = baseValue * bonuses * reductions * times * repeatCount;
    }
  }

  return footprint;
};

// Base damage before crits/bonuses/reductions:
//   sumFlat + attr × (sumMv + FLAT_MV × sumTimes) × (1 + PERCENT_MV)
const computeBase = (statMap, attr, sumMv, sumTimes, sumFlat) => {
  const flatMv = statMap.FLAT_MV ?? 0;
  const percentMv = statMap.PERCENT_MV ?? 0;
  const attrValue = computeTotalStat(attr, statMap);
  return sumFlat + attrValue * (sumMv + flatMv * sumTimes) * (1 + percentMv);
};

// Combined multiplier from crits, damage bonus (PERCENT_*), and amplification (AMP_*).
// dmgTypes is the action's `considered` array — each type adds its own PERCENT/AMP bonus.
const computeBonuses = (statMap, considered, element, enemyStatMap) => {
  const critRate = Math.max(Math.min(computeTotalStat('CR', statMap), 1), 0);
  const critDamage = computeTotalStat('CD', statMap) - 1;
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  const dmgTypes = [...considered, ...(element ? [element]: [])];
  let dmgBonusMult = 1 + (statMap['PERCENT_ALL'] ?? 0) + (enemyStatMap['PERCENT_ALL'] ?? 0);
  let ampMult = 1 + (statMap['AMP_ALL'] ?? 0) + (enemyStatMap['AMP_ALL'] ?? 0);

  for (const type of dmgTypes) {
    dmgBonusMult += (statMap[`PERCENT_${type}`] ?? 0) + (enemyStatMap[`PERCENT_${type}`] ?? 0);
    ampMult += (statMap[`AMP_${type}`] ?? 0) + (enemyStatMap[`AMP_${type}`] ?? 0);
  }

  return critMult * dmgBonusMult * ampMult;
};

// Resistance and defence reduction multipliers applied to final damage.
// Uses the game's standard resistance brackets and the character-level def formula.
const computeReductions = (gameId, statMap, element, enemyStatMap) => {
  const { MAX_LEVEL, ENEMY_RES } = MISC[gameId];

  const resIgnore = (statMap[`IGNORE_${element}_RES`] ?? 0) + (enemyStatMap[`SHRED_${element}_RES`] ?? 0);
  const totalRes = ENEMY_RES - resIgnore;
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  const enemyDef = 8 * (MAX_LEVEL + 10) + 792;
  const defIgnore = (statMap['IGNORE_DEF'] ?? 0) + (enemyStatMap['SHRED_DEF'] ?? 0);
  const defMult = (800 + 8 * MAX_LEVEL) / (800 + 8 * MAX_LEVEL + enemyDef * (1 - defIgnore));

  return resMult * defMult;
};

// Computes a member's effective stat map at the current moment by layering active
// effects on top of their base compiled stat map. Two-pass: constant effects first
// (so variable effects can reference the updated values in pass 2).
const getCurrentStatMap = (memberId, effectTrackers, memberMap, defCache, activeId) => {
  const baseStats = { ...memberMap[memberId].statMap };
  const activeTracker = activeId === memberId ? effectTrackers.active : effectTrackers.inactive;

  function addConstantEffectStats(trackerMap) {
    for (const { stacks, effectDef } of Object.values(trackerMap)) {
      const { statMap } = effectDef;
      if (!statMap) continue;

      for (const [stat, value] of Object.entries(statMap)) {
        baseStats[stat] ??= 0;
        baseStats[stat] += value * stacks;
      }
    }
  }

  addConstantEffectStats(effectTrackers.byMember[memberId]);
  addConstantEffectStats(effectTrackers.team);
  addConstantEffectStats(activeTracker);

  function addVariableEffectStats(trackerMap) {
    for (const { stacks, effectDef } of Object.values(trackerMap)) {
      const { variableStatMap } = effectDef;
      if (!variableStatMap) continue;

      const resolvedStatMap = resolveVariableStatMap(variableStatMap, baseStats);
      for (const [stat, value] of Object.entries(resolvedStatMap)) {
        baseStats[stat] ??= 0;
        baseStats[stat] += value * stacks;
      }
    }
  }

  addVariableEffectStats(effectTrackers.byMember[memberId]);
  addVariableEffectStats(effectTrackers.team);
  addVariableEffectStats(activeTracker);

  return baseStats;
};

// ─── Effect application (verbatim from simulateRotation) ─────────────────────

// Returns the current stack count for an enemy status (e.g. Burn, Freeze).
function hasEnemyStatus(statusName, effectTrackers) {
  return effectTrackers.enemyStatuses[statusName]?.stacks ?? 0;
}

// Returns true if any negative status is currently applied to the enemy.
function hasAnyNegativeStatus(gameId, effectTrackers) {
  const statuses = MISC[gameId].NEGATIVE_STATUSES ?? {};
  return Object.keys(statuses).some(name => hasEnemyStatus(name, effectTrackers) > 0);
}

// Core effect-application function. For a given action + trigger ('cast' or 'contact'),
// looks up registered effect keys, checks all conditions and cooldowns, then writes
// updated stacks/timers into the relevant tracker maps. Returns the set of effectKeys
// that were actually applied (used to drive combo proc processing).
function applyEffects({ gameId, action, memberMap, effectTrackers, applyCooldownMap = {}, times = 1, trigger = 'cast', defCache }) {
  const { owner: actionOwner, key, input } = action;

  if (trigger === 'cast' && input) {
    const removeFromMap = (trackerMap) => {
      for (const [effectKey, { effectDef }] of Object.entries(trackerMap)) {
        const effectOwner = effectKey.split('-')[0];
        if (effectOwner !== actionOwner) continue;

        if (effectDef.removeOnCast) {
          if (effectDef.removeOnCast.includes(input)) {
            delete trackerMap[effectKey];
          }
        }
      }
    };

    removeFromMap(effectTrackers.team);
    removeFromMap(effectTrackers.active);
    removeFromMap(effectTrackers.inactive);
    for (const memberTracker of Object.values(effectTrackers.byMember)) {
      removeFromMap(memberTracker);
    }
  }

  const effectsByAction = trigger === 'hit'
    ? defCache[actionOwner].effect.hitEffectsByAction
    : defCache[actionOwner].effect.castEffectsByAction;

  const triggeredEffects = new Set(effectsByAction[key] ?? []);
  if (triggeredEffects.size === 0) return;

  const memberIds = Object.keys(effectTrackers.byMember);
  const teamSize = memberIds.length;

  const validTargetsById = Object.fromEntries(
    memberIds.map(id => {
      const targets = [id === actionOwner ? 'self' : 'ally'];
      if (memberMap[id].index === 0) targets.push('first');
      if ((memberMap[id].index + 1) % teamSize === memberMap[actionOwner].index) targets.push('next');
      return [id, targets];
    })
  );

  const inflictedStatuses = new Set();

  function applyEffect(tracker, effectKey) {
    const effectDef = defCache[actionOwner].effect.effectDefinitions[effectKey];
    const { maxStacks, duration, maxUses, intervalCooldown } = effectDef;
    const currentStacks = tracker[effectKey]?.stacks ?? 0;
    tracker[effectKey] = {
      stacks: Math.min(currentStacks + times, maxStacks),
      timeRemaining: duration,
      usesRemaining: maxUses,
      ...(intervalCooldown ? { procTimer: tracker[effectKey]?.procTimer ?? intervalCooldown } : {}),
      effectDef,
    };
  }

  for (const effect of triggeredEffects) {
    const { applyTo, effectKey, applyCooldown, applyIfEnemyStatus, applyIfInflict } = defCache[actionOwner].effect.effectDefinitions[effect];
    if (applyCooldownMap[effectKey]) continue;
    if (applyIfInflict) continue;

    if (applyIfEnemyStatus) {
      const hasStatus = (applyIfEnemyStatus === true || applyIfEnemyStatus === 'ANY')
        ? hasAnyNegativeStatus(gameId, effectTrackers)
        : hasEnemyStatus(applyIfEnemyStatus, effectTrackers) > 0;
      if (!hasStatus) continue;
    }

    if (applyTo === 'team' || applyTo === 'active' || applyTo === 'inactive') {
      applyEffect(effectTrackers[applyTo], effect);
      if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
      continue;
    }

    if (applyTo === 'enemy') {
      const { statMap: effectStatMap = {}, statusMap = {} } = defCache[actionOwner].effect.effectDefinitions[effect];
      if (Object.keys(effectStatMap).length > 0) applyEffect(effectTrackers.enemy, effect);

      for (const [statusName, stacksToAdd] of Object.entries(statusMap)) {
        const statusDef = MISC[gameId].NEGATIVE_STATUSES?.[statusName];
        if (!statusDef) continue;
        const current = effectTrackers.enemyStatuses[statusName];
        const stacksBefore = current?.stacks ?? 0;
        if (!current) {
          effectTrackers.enemyStatuses[statusName] = {
            stacks: Math.min(stacksToAdd * times, statusDef.maxStacks),
            tickTimer: statusDef.tickInterval,
            ...(statusDef.duration != null ? { duration: statusDef.duration } : {}),
          };
        } else {
          current.stacks = Math.min(current.stacks + stacksToAdd * times, statusDef.maxStacks);
          if (statusDef.refreshOnApply) current.duration = statusDef.duration;
        }
        if ((effectTrackers.enemyStatuses[statusName]?.stacks ?? 0) > stacksBefore) inflictedStatuses.add(statusName);
      }

      if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
      continue;
    }

    for (const [id, validTargets] of Object.entries(validTargetsById)) {
      if (validTargets.includes(applyTo)) applyEffect(effectTrackers.byMember[id], effect);
    }
    if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
  }

  for (const effect of triggeredEffects) {
    const { applyTo, effectKey, applyCooldown, applyIfInflict } = defCache[actionOwner].effect.effectDefinitions[effect];
    if (!applyIfInflict || !inflictedStatuses.has(applyIfInflict)) continue;
    if (applyCooldownMap[effectKey]) continue;

    if (applyTo === 'team' || applyTo === 'active' || applyTo === 'inactive') {
      applyEffect(effectTrackers[applyTo], effect);
      if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
      continue;
    }

    if (applyTo === 'enemy') {
      const { statMap: effectStatMap = {} } = defCache[actionOwner].effect.effectDefinitions[effect];
      if (Object.keys(effectStatMap).length > 0) applyEffect(effectTrackers.enemy, effect);
      if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
      continue;
    }

    for (const [id, validTargets] of Object.entries(validTargetsById)) {
      if (validTargets.includes(applyTo)) applyEffect(effectTrackers.byMember[id], effect);
    }
    if (applyCooldown > 0) applyCooldownMap[effectKey] = applyCooldown;
  }
}

// Advances (and expires) all active effects by the action's timing window.
// `offset` is used to check expiry (effects expiring before the action mid-point
// are gone), while `duration` is the full advance applied to survivors.
function advanceEffects(effectTrackers, offset, duration) {
  function advanceMap(map) {
    for (const [effectKey, effectData] of Object.entries(map)) {
      if (effectData.timeRemaining - offset <= 0) {
        delete map[effectKey];
      } else {
        effectData.timeRemaining -= duration;
      }
    }
  }
  const { byMember, team, active, inactive, enemy } = effectTrackers;
  advanceMap(team);
  advanceMap(active);
  advanceMap(inactive);
  advanceMap(enemy);
  for (const memberTracker of Object.values(byMember)) {
    advanceMap(memberTracker)
  };
}

// Decrements all active proc/apply cooldowns by `delta` ms and removes expired ones.
function tickProcCooldowns(procCooldownMap, delta) {
  for (const [cooldownKey, cooldownRemaining] of Object.entries(procCooldownMap)) {
    const nextValue = cooldownRemaining - delta;
    if (nextValue <= 0) delete procCooldownMap[cooldownKey];
    else procCooldownMap[cooldownKey] = nextValue;
  }
}

// Advances enemy status timers (Burn, Freeze, etc.), firing tick-based stack
// consumption and expiring statuses that have run out of duration.
function tickEnemyStatuses(gameId, effectTrackers, elapsed) {
  const statuses = MISC[gameId].NEGATIVE_STATUSES ?? {};
  for (const [statusName, statusDef] of Object.entries(statuses)) {
    const state = effectTrackers.enemyStatuses[statusName];
    if (!state) continue;
    if (state.duration !== undefined) {
      state.duration -= elapsed;
      if (state.duration <= 0) { delete effectTrackers.enemyStatuses[statusName]; continue; }
    }
    state.tickTimer -= elapsed;
    while (state.tickTimer <= 0 && state.stacks > 0) {
      if (statusDef.consumesOnTick) {
        state.stacks--;
        if (state.stacks === 0) { delete effectTrackers.enemyStatuses[statusName]; break; }
      }
      state.tickTimer += statusDef.tickInterval;
    }
  }
}

// Decrements `usesRemaining` for all effects that triggered a followUp on
// this action, and removes effects that have exhausted their remaining uses.
function decayProcCounts(memberMap, effectTrackers, action) {
  const { team, active, inactive, enemy, byMember } = effectTrackers;

  function decayMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (effectTracker.usesRemaining === Infinity) continue;

      const {
        useOnAction,
        useOnType,
        useOnTagged,
        useOnCast,
        useOnConsidered,
        followUpAction,
        intervalAction,
      } = effectTracker.effectDef;

      if (useOnAction && !useOnAction.includes(action.key)) continue;
      if (useOnType && !useOnType.includes(action.type)) continue;
      if (useOnTagged && !action.tagged.some(t => useOnTagged.includes(t))) continue;
      if (useOnCast && !action.cast.some(c => useOnCast.includes(c))) continue;
      if (useOnConsidered && !action.considered.some(c => useOnConsidered.includes(c))) continue;

      if (!followUpAction && !intervalAction) effectTracker.usesRemaining -= 1;
      if (effectTracker.usesRemaining <= 0) delete trackerMap[effectKey];
    }
  }

  decayMap(team);
  decayMap(active);
  decayMap(inactive);
  decayMap(enemy);
  for (const map of Object.values(byMember)) decayMap(map);
}

// Fires action-triggered followUp procs from all active tracker maps.
// These are one-shot or limited-use procs that fire when a matching action occurs,
// as opposed to interval procs which fire on a timer.
function processFollowUpProcs(action, ctx, depth, onFootprint, defCache) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { effectTrackers, procCooldownMap } = ctx;
  const { key, owner, considered, cast, type } = action;
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    const entries = Object.entries(trackerMap); // snapshot before recursing
    for (const [effectKey, effectTracker] of entries) {
      if (procCooldownMap[effectKey]) continue;

      const { stacks, effectDef } = effectTracker;

      const {
        useOnAction,
        useOnType,
        useOnTagged,
        useOnCast,
        useOnConsidered,
      } = effectDef;

      if (useOnAction && !useOnAction.includes(key)) continue;
      if (useOnType && !useOnType.includes(type)) continue;
      if (useOnTagged && !action.tagged.some(t => useOnTagged.includes(t))) continue;
      if (useOnCast && !cast.some(c => useOnCast.includes(c))) continue;
      if (useOnConsidered && !considered.some(c => useOnConsidered.includes(c))) continue;

      const { followUpAction, followUpCooldown, times } = effectDef;
      if (!followUpAction) continue;

      const procActions = [];
      for (const action of followUpAction) {
        if (typeof action === 'string') {
          const procAction = defCache[effectKey.split('-')[0]].action[action];
          procActions.push(procAction);
        } else {
          procActions.push(action);
        }
      }

      // Set cooldown BEFORE recursing so re-entrant calls to processFollowUpProcs
      // (from within the proc action itself) see it as blocked and skip.
      if (followUpCooldown > 0) {
        procCooldownMap[effectKey] = followUpCooldown;
      }

      for (const action of procActions) {
        processAction(action, ctx, depth + 1, onFootprint, defCache, stacks * times, times);
      }

      effectTracker.usesRemaining--;
    }
  }

  processTrackerMap(byMember[owner]);
  processTrackerMap(team);
  processTrackerMap(active);
  processTrackerMap(inactive);
  processTrackerMap(enemy);
}

// Fires timer-based (interval) procs. Called once per rotation action with
// the action's duration as `elapsed`. Effects fire repeatedly while their timer is <= 0,
// re-arming after each fire by adding intervalCooldown back to the timer.
function processIntervalProcs(ctx, elapsed, depth, onFootprint, defCache) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { effectTrackers, procCooldownMap } = ctx;
  const { byMember, team, active, inactive, enemy } = effectTrackers;

  function processTrackerMap(trackerMap) {
    const entries = Object.entries(trackerMap); // snapshot before recursing
    for (const [effectKey, effectTracker] of entries) {
      const { stacks, effectDef } = effectTracker;
      const { intervalAction, intervalCooldown, times } = effectDef;
      if (!intervalAction || procCooldownMap[effectKey]) continue;

      effectTracker.procTimer -= elapsed;
      while (effectTracker.procTimer <= 0) {
        const procActions = [];
        for (const action of intervalAction) {
          if (typeof action === 'string') {
            const procAction = defCache[effectKey.split('-')[0]].action[action];
            procActions.push(procAction);
          } else {
            procActions.push(action);
          }
        }

        for (const action of procActions) {
          processAction(action, ctx, depth + 1, onFootprint, defCache, stacks * times, times);
        }

        effectTracker.procTimer += intervalCooldown;
        effectTracker.usesRemaining--;
        if (effectTracker.usesRemaining <= 0) {
          delete trackerMap[effectKey];
          break;
        }
      }
    }
  }

  for (const memberTracker of Object.values(byMember)) {
    processTrackerMap(memberTracker);
  }
  processTrackerMap(team);
  processTrackerMap(active);
  processTrackerMap(inactive);
  processTrackerMap(enemy);
}

function processTopLevelAction(action, ctx, onFootprint, defCache) {
  const { gameId, memberMap, effectTrackers, applyCooldownMap, procCooldownMap, characterId } = ctx;
  const { duration, offset } = action;
  const remaining = duration - offset;

  // ── Cast (t = 0) ───────────────────────────────────────────────────
  applyEffects({ ...ctx, action, trigger: 'cast', defCache });

  // ── Pre-contact window (t = 0 → offset) ───────────────────────────
  advanceEffects(effectTrackers, offset, offset);
  tickEnemyStatuses(gameId, effectTrackers, offset);
  processIntervalProcs(ctx, offset, 0, onFootprint, defCache);
  tickProcCooldowns(procCooldownMap, offset);
  tickProcCooldowns(applyCooldownMap, offset);

  // ── Contact (t = offset) ───────────────────────────────────────────
  onFootprint?.(buildFootprint({
    gameId,
    action,
    effectTrackers,
    activeId: ctx.activeId,
    memberMap,
    characterId,
    repeatCount: 1,
    defCache,
  }));
  applyEffects({ ...ctx, action, trigger: 'contact', defCache });

  // ── Post-contact window (t = offset → end) ─────────────────────────
  // Contact effects are now in the tracker, so this one call handles them too
  advanceEffects(effectTrackers, 0, remaining);
  tickEnemyStatuses(gameId, effectTrackers, remaining);
  processIntervalProcs(ctx, remaining, 0, onFootprint, defCache);
  tickProcCooldowns(procCooldownMap, remaining);
  tickProcCooldowns(applyCooldownMap, remaining);

  // ── Follow-ups + cleanup ───────────────────────────────────────────
  processFollowUpProcs(action, ctx, 0, onFootprint, defCache);
  decayProcCounts(memberMap, effectTrackers, action);
  tickProcCooldowns(procCooldownMap, 0); // final pass
}

function processProcAction(action, ctx, depth, onFootprint, repeatCount, applyTimes, defCache) {
  if (depth >= MAX_PROC_DEPTH) return;
  applyEffects({ ...ctx, action, times: applyTimes, trigger: 'cast', defCache });
  onFootprint?.(buildFootprint({ ...ctx, action, repeatCount, defCache }));
  applyEffects({ ...ctx, action, times: applyTimes, trigger: 'contact', defCache });
  processFollowUpProcs(action, ctx, depth, onFootprint, defCache);
}

function processAction(action, ctx, depth, onFootprint, defCache, repeatCount = 1, applyTimes = 1) {
  if (depth >= MAX_PROC_DEPTH) return;
  if (depth === 0) processTopLevelAction(action, ctx, onFootprint, defCache);
  else processProcAction(action, ctx, depth, onFootprint, repeatCount, applyTimes, defCache);
}

export const compileRotation = (gameId, rawTeam, characterId, defCache) => {
  const team = rawTeam.filter(m => m.memberId);

  const memberMap = {};
  for (const [index, member] of team.entries()) {
    const { memberId, build = {} } = member;

    let statMap = compileStatMapCache.get(build);
    if (!statMap) {
      statMap = compileStatMap(gameId, memberId, build);
      compileStatMapCache.set(build, statMap);
    }

    memberMap[memberId] = { index, statMap };
  }

  const effectTrackers = {
    byMember: Object.fromEntries(team.map(m => [m.memberId, {}])),
    team: {},
    active: {},
    inactive: {},
    enemy: {},
    enemyStatuses: {},
  };
  const applyCooldownMap = {};
  const procCooldownMap = {};

  // Shared context object threaded through all processAction calls. activeId is
  // mutated per rotation action to track which member is the current rotation actor.
  const ctx = { gameId, memberMap, effectTrackers, applyCooldownMap, procCooldownMap, characterId, activeId: null };

  // ── Priming pass ──────────────────────────────────────────────────────────
  // Replay the full rotation without recording footprints to warm up the effect
  // trackers into a steady-state snapshot (effects that will actually be active).
  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      ctx.activeId = memberId;
      const action = defCache[memberId].action[actionKey];
      processAction(action, ctx, 0, null, defCache);
    }
  }

  // ── Damage pass: record footprints ────────────────────────────────────────
  // Replay the rotation a second time, this time capturing a footprint at each
  // damage evaluation point. The footprints are later re-evaluated cheaply by
  // evaluateRotationSummary with different character builds.
  const footprints = [];

  for (const { memberId, rotation } of team.toReversed()) {
    for (const actionKey of rotation) {
      ctx.activeId = memberId;
      const action = defCache[memberId].action[actionKey];
      processAction(action, ctx, 0, fp => footprints.push(fp), defCache);
    }
  }

  return { gameId, characterId, footprints };
};

export const evaluateRotation = (compiledRotation, newCharCompiledStatMap) => {
  const { gameId, characterId, footprints } = compiledRotation;
  const other = {};
  const byMember = {};

  for (const footprint of footprints) {
    const {
      actionKey,
      owner,
      type,
      element,
      attr,
      sumFlat,
      sumMv,
      sumTimes,
      times,
      considered,
      repeatCount,
      fixedDamage,
      fixedHealing,
      constantEffectContribs,
      fixedVariableContribs,
      charVariableEffectSpecs,
      charConstantEffectContribsForSource,
      enemyStatMap,
    } = footprint;

    byMember[owner] ??= {};
    byMember[owner][actionKey] ??= { element, considered, damage: 0, healing: 0 };

    if (type === 'shield' || type === 'buff' || (!sumFlat && !sumMv)) continue;

    // Pre-computed fixed result for non-character actions with no char variable effects
    if (fixedDamage != null) {
      byMember[owner][actionKey].damage += fixedDamage;
      continue;
    }

    if (fixedHealing != null) {
      byMember[owner][actionKey].healing += fixedHealing;
      continue;
    }

    // ── Determine the stat map to use as base for this action ────────────────
    // For character actions: newCharCompiledStatMap
    // For teammate actions affected by charVariableEffectSpecs: use teammate's
    // pre-compiled statMap (stored in constantEffectContribs already accounts
    // for the teammate's own base — we just need the owner's base to merge with).
    // NOTE: fixedDamage === null only when owner === characterId OR when
    // charVariableEffectSpecs is non-empty. In the latter case owner may differ.
    const isCharAction = owner === characterId;
    // For teammate actions with charVariableEffectSpecs, ownerBaseStatMap was
    // stored in the footprint during compileRotation.
    const ownerBaseStatMap = isCharAction ? newCharCompiledStatMap : footprint.ownerBaseStatMap ?? {};

    // ── Two-pass variable resolution (mirrors getCurrentStatMap logic) ────────

    // Pass 1: resolve charVariableEffectSpecs using (newCharCompiledStatMap + charConstant)
    // to get the character's "live" stat map at this moment.
    let charCurrentStatMap = newCharCompiledStatMap;
    if (charVariableEffectSpecs.length > 0) {
      const baseForSource = mergeStatMaps(newCharCompiledStatMap, charConstantEffectContribsForSource);
      const resolvedPass1 = {};
      for (const { variableStatMap, stacks, chance } of charVariableEffectSpecs) {
        const r = resolveVariableStatMap(variableStatMap, baseForSource);
        for (const [statId, val] of Object.entries(r)) {
          resolvedPass1[statId] = (resolvedPass1[statId] ?? 0) + val * stacks * chance;
        }
      }
      charCurrentStatMap = mergeStatMaps(newCharCompiledStatMap, charConstantEffectContribsForSource, resolvedPass1);
    }

    // Pass 2: resolve charVariableEffectSpecs using charCurrentStatMap to get
    // the contribution to the damage stat map.
    const charVariableResolved = {};
    if (charVariableEffectSpecs.length > 0) {
      for (const { variableStatMap, stacks, chance } of charVariableEffectSpecs) {
        const r = resolveVariableStatMap(variableStatMap, charCurrentStatMap);
        for (const [statId, val] of Object.entries(r)) {
          charVariableResolved[statId] = (charVariableResolved[statId] ?? 0) + val * stacks * chance;
        }
      }
    }

    const effectStatMap = mergeStatMaps(constantEffectContribs, fixedVariableContribs, charVariableResolved);
    const statMapWithEffects = mergeStatMaps(ownerBaseStatMap, effectStatMap);

    const baseValue = computeBase(statMapWithEffects, attr, sumMv, sumTimes, sumFlat);

    if (type === 'heal') {
      const healingBonus = computeTotalStat('HB', statMapWithEffects);
      byMember[owner][actionKey].healing += baseValue * (1 + healingBonus) * times * repeatCount;
    } else {
      const bonuses = computeBonuses(statMapWithEffects, considered, element, enemyStatMap);
      const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);
      byMember[owner][actionKey].damage += baseValue * bonuses * reductions * times * repeatCount;
    }
  }

  return { other, byMember };
};
