import { MISC } from '@/data';
import { compileStatMap, mergeStatMaps, computeTotalStat } from '@/utils';

const MAX_PROC_DEPTH = 4;

const matchesUseOn = (action, effect) => {
  const { useOnAction, useOnType, useOnTagged, useOnCast, useOnConsidered } = effect;

  if (!(useOnAction || useOnType || useOnTagged || useOnCast || useOnConsidered)) return true;

  if (useOnAction) {
    if (useOnAction.includes(action.key)) return true;
  }

  if (useOnType) {
    if (useOnType.includes(action.type)) return true;
  }

  if (useOnTagged) {
    for (const tag of action.tagged) {
      if (useOnTagged.includes(tag)) return true;
    }
  }

  if (useOnCast) {
    for (const type of action.cast) {
      if (useOnCast.includes(type)) return true;
    }
  }

  if (useOnConsidered && action.considered) {
    for (const type of action.considered) {
      if (useOnConsidered.includes(type)) return true;
    }
  }

  return false;
};

const matchesUseIf = (effect, effectTrackers) => {
  const { useIfStatus } = effect;

  if (!useIfStatus) {
    return true;
  } else {
    if (useIfStatus.includes('any')) {
      if (Object.keys(effectTrackers.enemyStatuses).length) return true;
    }

    for (const id of useIfStatus) {
      if (effectTrackers.enemyStatuses[id]) return true;
    }

    return false;
  }
};

const matchesUseFilter = (action, effect, effectTrackers) =>
  matchesUseOn(action, effect) && matchesUseIf(effect, effectTrackers);

// Evaluates each variable-stat entry against the current sourceStatMap.
// Each entry scales a stat (statId) proportionally to another stat (source),
// e.g. "gain +2% ATK per 100 DEF above 500". Results are capped at `max`.
const resolveVariableStatMap = (variableStatMap = {}, sourceStatMap = {}) => {
  const resolved = {};

  for (const statId in variableStatMap) {
    const detailList = variableStatMap[statId];

    for (const details of detailList) {
      const { source, step, offset = 0, value, max = Infinity } = details;
      const totalStat = computeTotalStat(source, sourceStatMap);
      const mult = Math.max((totalStat - offset) / step, 0);

      resolved[statId] ??= 0;
      resolved[statId] += Math.min(mult * value, max);
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
const buildFootprint = (ctx, {
  action,
  effectTrackers,
  activeId,
  compiledStatMap,
  characterId,
  repeatCount = 1,
}) => {
  const { gameId, cache } = ctx;

  const footprint = {
    actionKey: action.key,
    owner: action.ownerId,
    type: action.type,
    element: action.element,
    times: action.times,
    considered: action.considered,
    compressedMultipliers: action.compressedMultipliers,
    repeatCount,
    fixedDamage: 0,
    fixedHealing: 0,
    // Set below
    ownerBaseStatMap: null,  // only set for teammate actions with charVariableEffectSpecs
    constantEffectContribs: {},
    fixedVariableContribs: {},
    charVariableEffectSpecs: [],
    charConstantEffectContribsForSource: {},
    enemyStatMap: {},
  };

  // This footprint does nothing
  if (!action.compressedMultipliers || action.type === 'shield') {
    return footprint;
  }

  // Build enemy stat map snapshot
  const enemyStatMap = {};

  // Passive effects
  for (const member in cache.link) {
    const { passive } = cache.link[member];
    if (!passive.enemy) continue;

    for (const effect of passive.enemy) {
      const { statMap, chance } = effect;
      if (!statMap) continue;

      for (const stat in statMap) {
        enemyStatMap[stat] ??= 0;
        enemyStatMap[stat] += statMap[stat] * chance;
      }
    }
  }

  // Active effects
  for (const effectKey in effectTrackers.enemy) {
    const { stacks, effect } = effectTrackers.enemy[effectKey];
    if (!effect.statMap) continue;

    for (const statId in effect.statMap) {
      enemyStatMap[statId] ??= 0;
      enemyStatMap[statId] += effect.statMap[statId] * stacks;
    }
  }
  footprint.enemyStatMap = enemyStatMap;

  // Classify effect statMap contributions
  // constantEffectContribs — flat stat boosts that don't depend on any character's variable stats (same for every build, resolved immediately)
  // fixedVariableContribs — teammate variable effects whose owner's stats are already fixed, so they can also be pre-resolved now
  // charVariableEffectSpecs — the character's own variable effects that scale off their stats, so they must be re-evaluated per artifact build
  const constantEffectContribs = {};
  const fixedVariableContribs = {};
  const charVariableEffectSpecs = [];

  const passiveEffects = [];
  for (const memberId in cache.link) {
    passiveEffects.push(...(cache.link[memberId].passive[action.ownerId] ?? []));
  }

  const effectsToEval = [
    ...passiveEffects.map(effect => ({ effect })),
    ...Object.values(activeId === action.ownerId ? effectTrackers.active : effectTrackers.inactive),
    ...Object.values(effectTrackers.byMember[action.ownerId]),
  ];

  for (const { stacks = 1, effect } of effectsToEval) {
    if (!matchesUseFilter(action, effect, effectTrackers)) continue;

    const effectScale = effect.chance * stacks;

    if (effect.statMap) {
      for (const [stat, value] of Object.entries(effect.statMap)) {
        constantEffectContribs[stat] ??= 0;
        constantEffectContribs[stat] += value * effectScale;
      }
    }

    if (effect.variableStatMap) {
      if (effect.owner === characterId) {
        // Must be re-evaluated per artifact — record the spec
        charVariableEffectSpecs.push({ variableStatMap: effect.variableStatMap, stacks, chance: effect.chance });
      } else {
        // Teammate's variable effect: owner's statMap is fixed, pre-resolve now
        const ownerCurrentStatMap = getCurrentStatMap(effect.owner, effectTrackers, compiledStatMap, activeId);
        const resolvedStatMap = resolveVariableStatMap(effect.variableStatMap, ownerCurrentStatMap);
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
      for (const { stacks, effect } of Object.values(trackerMap)) {
        const { statMap, chance = 1 } = effect;
        if (!statMap) continue;

        for (const [statId, value] of Object.entries(statMap)) {
          charConstant[statId] ??= 0;
          charConstant[statId] += value * stacks * chance;
        }
      }
    }

    addConstantFromMap(effectTrackers.byMember[characterId]);
    addConstantFromMap(activeId === characterId ? effectTrackers.active : effectTrackers.inactive);

    // Also include passive effects (weapon passives, innate buffs) which never
    // enter tracker maps but do contribute to the character's constant stat base.
    for (const effect of Object.values(cache.effect[characterId])) {
      if (!effect.isPassive || !effect.statMap) continue;
      const { statMap, chance = 1 } = effect;
      for (const [statId, value] of Object.entries(statMap)) {
        charConstant[statId] = (charConstant[statId] ?? 0) + value * chance;
      }
    }

    footprint.charConstantEffectContribsForSource = charConstant;
  }

  // For teammate actions affected by charVariableEffectSpecs, store the owner's
  // base statMap so evaluateRotationSummary can reconstruct statMapWithEffects.
  if (action.ownerId !== characterId && charVariableEffectSpecs.length > 0) {
    footprint.ownerBaseStatMap = compiledStatMap[action.ownerId];
  }

  // ── Pre-compute fixed damage for teammate actions ────────────────────
  if (action.ownerId !== characterId && charVariableEffectSpecs.length === 0) {
    const ownerStatMap = compiledStatMap[action.ownerId];
    const effectStatMap = mergeStatMaps(constantEffectContribs, fixedVariableContribs);
    const statMapWithEffects = mergeStatMaps(ownerStatMap, effectStatMap);

    // per element in compressed
    for (const element in action.compressedMultipliers) {
      const compressed = action.compressedMultipliers[element];

      const baseValue = computeBase(statMapWithEffects, compressed);

      if (action.type === 'heal') {
        const healingBonus = computeTotalStat('HB', statMapWithEffects);
        footprint.fixedHealing += baseValue * (1 + healingBonus) * action.times * repeatCount;
      } else {
        const bonuses = computeBonuses(statMapWithEffects, action.considered, element, enemyStatMap);
        const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);
        footprint.fixedDamage += baseValue * bonuses * reductions * action.times * repeatCount;
      }
    }
  }

  return footprint;
};

// Base damage before crits/bonuses/reductions:
const computeBase = (statMap, compressed) => {
  const flatMv = statMap.FLAT_MV ?? 0;
  const percentMv = statMap.PERCENT_MV ?? 0;
  let totalMvPart = 0;

  for (const attr in compressed.mv) {
    const attrValue = computeTotalStat(attr, statMap);
    const mv = compressed.mv[attr] ?? 0;

    totalMvPart += attrValue * (mv + flatMv * compressed.hitCount);
  }

  return totalMvPart * (1 + percentMv) + compressed.flat;
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
const getCurrentStatMap = (memberId, effectTrackers, compiledStatMap, activeId) => {
  const baseStats = { ...compiledStatMap[memberId] };
  const activeTracker = activeId === memberId ? effectTrackers.active : effectTrackers.inactive;

  function addConstantEffectStats(trackerMap) {
    for (const { stacks, effect } of Object.values(trackerMap)) {
      const { statMap } = effect;
      if (!statMap) continue;

      for (const [stat, value] of Object.entries(statMap)) {
        baseStats[stat] ??= 0;
        baseStats[stat] += value * stacks;
      }
    }
  }

  addConstantEffectStats(effectTrackers.byMember[memberId]);
  addConstantEffectStats(activeTracker);

  function addVariableEffectStats(trackerMap) {
    for (const { stacks, effect } of Object.values(trackerMap)) {
      const { variableStatMap } = effect;
      if (!variableStatMap) continue;

      const resolvedStatMap = resolveVariableStatMap(variableStatMap, baseStats);
      for (const [stat, value] of Object.entries(resolvedStatMap)) {
        baseStats[stat] ??= 0;
        baseStats[stat] += value * stacks;
      }
    }
  }

  addVariableEffectStats(effectTrackers.byMember[memberId]);
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

// Core effect-application function. For a given action + trigger ('cast' or 'hit'),
// checks all conditions and cooldowns, then writes updated stacks/timers into the relevant tracker maps.
function applyEffects(ctx, { action, effectTrackers, applyCooldownMap = {}, times = 1, trigger = 'cast' }) {
  const { gameId, cache } = ctx;

  if (trigger === 'cast' && action.cast) {
    const removeFromMap = (trackerMap) => {
      for (const { effect } of Object.values(trackerMap)) {
        if (effect.owner !== action.ownerId) continue;

        if (effect.removeOnCast) {
          if (action.cast.some(c => effect.removeOnCast.includes(c))) {
            delete trackerMap[effect.key];
          }
        }
      }
    };

    removeFromMap(effectTrackers.active);
    removeFromMap(effectTrackers.inactive);
    for (const memberTracker of Object.values(effectTrackers.byMember)) {
      removeFromMap(memberTracker);
    }
  }

  const triggeredEffects = new Set(cache.link[action.ownerId].active[action.key]?.[trigger] ?? []);
  if (triggeredEffects.size === 0) return;

  const inflictedStatuses = new Set();

  function applyEffect(tracker, effect) {
    const { intervalCooldown, intervalOffset } = effect;
    const currentStacks = tracker[effect.key]?.stacks ?? 0;

    tracker[effect.key] = {
      stacks: Math.min(currentStacks + times, effect.maxStacks),
      timeRemaining: effect.duration,
      usesRemaining: effect.maxUses,
      ...(intervalCooldown ? { procTimer: tracker[effect.key]?.procTimer ?? intervalOffset } : {}),
      effect,
    };
  }

  for (const effect of triggeredEffects) {
    const { applyIfStatus, applyIfInflict } = effect;
    if (applyCooldownMap[effect.owner]?.[effect.id]) continue;
    if (applyIfInflict) continue;

    if (applyIfStatus) {
      const hasStatus = applyIfStatus === 'any'
        ? hasAnyNegativeStatus(gameId, effectTrackers)
        : hasEnemyStatus(applyIfStatus, effectTrackers) > 0;
      if (!hasStatus) continue;
    }

    for (const target of effect.applyTo) {
      if (target === 'active' || target === 'inactive') {
        applyEffect(effectTrackers[target], effect);
      } else if (target === 'enemy') {
        if (effect.statMap) {
          applyEffect(effectTrackers.enemy, effect);
        }
        if (effect.statusMap) {
          for (const statusId in effect.statusMap) {
            const status = MISC[gameId].STATUSES[statusId];
            const currentTracker = effectTrackers.enemyStatuses[statusId];
            const stacksToApply = effect.statusMap[status];

            if (!currentTracker) {
              const tracker = {
                stacks: Math.min(stacksToApply * times, status.maxStacks),
                tickTimer: status.tickInterval,
              };

              if (status.duration) {
                tracker.duration = status.duration;
              }

              effectTrackers.enemyStatuses[statusId] = tracker;
            } else {
              currentTracker.stacks = Math.min(currentTracker.stacks + stacksToApply * times, status.maxStacks);

              if (status.duration) {
                currentTracker.duration = status.duration;
              }
            }

            inflictedStatuses.add(statusId);
          }
        }
      } else {
        applyEffect(effectTrackers.byMember[target], effect);
      }
    }

    if (effect.applyCooldown > 0) {
      applyCooldownMap[effect.owner] ??= {};
      applyCooldownMap[effect.owner][effect.id] = effect.applyCooldown;
    }
  }

  for (const effect of triggeredEffects) {
    const { applyCooldown, applyIfInflict } = effect;
    if (!applyIfInflict || !inflictedStatuses.has(applyIfInflict)) continue;
    if (applyCooldownMap[effect.owner]?.[effect.id]) continue;

    for (const target of effect.applyTo) {
      if (target === 'active' || target === 'inactive') {
        applyEffect(effectTrackers[target], effect);
      } else if (target === 'enemy') {
        if (effect.statMap) {
          applyEffect(effectTrackers.enemy, effect);
        }
      } else {
        applyEffect(effectTrackers.byMember[target], effect);
      }
    }
    if (applyCooldown > 0) {
      applyCooldownMap[effect.owner] ??= {};
      applyCooldownMap[effect.owner][effect.id] = applyCooldown;
    }
  }
}

// Advances (and expires) all active effects by the action's timing window.
// `offset` is used to check expiry (effects expiring before the action mid-point
// are gone), while `duration` is the full advance applied to survivors.
function advanceEffects(effectTrackers, offset, duration) {
  function advanceMap(trackerMap) {
    for (const [id, tracker] of Object.entries(trackerMap)) {
      if (tracker.timeRemaining - offset <= 0) {
        delete trackerMap[id];
      } else {
        tracker.timeRemaining -= duration;
      }
    }
  }
  const { byMember, active, inactive, enemy } = effectTrackers;
  advanceMap(active);
  advanceMap(inactive);
  advanceMap(enemy);
  for (const member in byMember) {
    advanceMap(byMember[member]);
  };
}

// Decrements all active proc/apply cooldowns by `delta` ms and removes expired ones.
function tickProcCooldowns(followUpCooldownMap, delta) {
  for (const member in followUpCooldownMap) {
    for (const [cooldownKey, cooldownRemaining] of Object.entries(followUpCooldownMap[member])) {
      const nextValue = cooldownRemaining - delta;
      if (nextValue <= 0) delete followUpCooldownMap[member][cooldownKey];
      else followUpCooldownMap[member][cooldownKey] = nextValue;
    }
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
      if (state.duration <= 0) {
        delete effectTrackers.enemyStatuses[statusName];
        continue;
      }
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

// Decrements `usesRemaining` for all effects that triggered and removes effects that have exhausted their remaining uses.
function decayProcCounts(compiledStatMap, effectTrackers, action) {
  const { active, inactive, enemy, byMember } = effectTrackers;

  function decayMap(trackerMap) {
    for (const [id, tracker] of Object.entries(trackerMap)) {
      if (tracker.usesRemaining === Infinity) continue;

      const { effect } = tracker;
      if (effect.followUpAction || effect.intervalAction) continue;
      if (!matchesUseFilter(action, effect, effectTrackers)) continue;

      tracker.usesRemaining -= 1;
      if (tracker.usesRemaining <= 0) {
        delete trackerMap[id];
      }
    }
  }

  decayMap(active);
  decayMap(inactive);
  decayMap(enemy);
  for (const member in byMember) {
    decayMap(byMember[member]);
  }
}

// Fires action-triggered followUp procs from all active tracker maps.
// These are one-shot or limited-use procs that fire when a matching action occurs,
// as opposed to interval procs which fire on a timer.
function processFollowUpProcs(action, ctx, depth) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { cache, effectTrackers, followUpCooldownMap, activeId } = ctx;
  const { byMember, active, inactive } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const tracker of Object.values(trackerMap)) {
      const { stacks, effect } = tracker;
      if (!effect.followUpAction || followUpCooldownMap[effect.owner]?.[effect.id]) continue;
      if (!matchesUseFilter(action, effect, effectTrackers)) continue;

      const procActions = [];
      for (const action of effect.followUpAction) {
        if (typeof action === 'string') {
          const procAction = cache.action[effect.owner][action];
          procActions.push(procAction);
        } else {
          procActions.push(action);
        }
      }

      // Set cooldown BEFORE recursing so re-entrant calls to processFollowUpProcs
      // (from within the proc action itself) see it as blocked and skip.
      if (effect.followUpCooldown) {
        followUpCooldownMap[effect.owner] ??= {};
        followUpCooldownMap[effect.owner][effect.id] = effect.followUpCooldown;
      }

      tracker.usesRemaining--;
      if (tracker.usesRemaining <= 0) {
        delete trackerMap[effect.key];
      }

      for (const action of procActions) {
        processAction(action, ctx, depth + 1, stacks * effect.times, effect.times);
      }
    }
  }

  processTrackerMap(byMember[action.ownerId]);
  processTrackerMap(activeId === action.ownerId ? active : inactive);
}

// Fires timer-based (interval) procs. Called once per rotation action with
// the action's duration as `elapsed`. Effects fire repeatedly while their timer is <= 0,
// re-arming after each fire by adding intervalCooldown back to the timer.
function processIntervalProcs(ctx, elapsed, depth) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { cache, effectTrackers } = ctx;
  const { byMember } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const tracker of Object.values(trackerMap)) {
      const { stacks, effect } = tracker;
      const { intervalAction, intervalCooldown, times } = effect;
      if (!intervalAction) continue;

      tracker.procTimer -= elapsed;
      while (tracker.procTimer <= 0) {
        const procActions = [];
        for (const action of intervalAction) {
          if (typeof action === 'string') {
            const procAction = cache.action[effect.owner][action];
            procActions.push(procAction);
          } else {
            procActions.push(action);
          }
        }

        for (const action of procActions) {
          processAction(action, ctx, depth + 1, stacks * times, times);
        }

        tracker.usesRemaining--;
        if (tracker.usesRemaining <= 0) {
          delete trackerMap[effect.key];
          break;
        }

        tracker.procTimer += intervalCooldown;
      }
    }
  }

  for (const memberTracker of Object.values(byMember)) {
    processTrackerMap(memberTracker);
  }
}

function processTopLevelAction(action, ctx) {
  const { gameId, compiledStatMap, effectTrackers, applyCooldownMap, followUpCooldownMap, characterId } = ctx;
  const { duration, offset } = action;
  const remaining = duration - offset;

  // ── Cast (t = 0) ───────────────────────────────────────────────────
  applyEffects(ctx, { ...ctx, action, trigger: 'cast' });

  // ── Pre-hit window (t = 0 → offset) ───────────────────────────
  advanceEffects(effectTrackers, offset, offset);
  tickEnemyStatuses(gameId, effectTrackers, offset);
  processIntervalProcs(ctx, offset, 0);
  tickProcCooldowns(followUpCooldownMap, offset);
  tickProcCooldowns(applyCooldownMap, offset);

  // ── Contact (t = offset) ───────────────────────────────────────────
  if (ctx.recordFootprint) {
    ctx.footprints.push(buildFootprint(ctx, {
      action,
      effectTrackers,
      activeId: ctx.activeId,
      compiledStatMap,
      characterId,
      repeatCount: 1,
    }));
  }
  applyEffects(ctx, { ...ctx, action, trigger: 'hit' });

  // ── Post-hit window (t = offset → end) ─────────────────────────
  // Contact effects are now in the tracker, so this one call handles them too
  advanceEffects(effectTrackers, 0, remaining);
  tickEnemyStatuses(gameId, effectTrackers, remaining);
  processIntervalProcs(ctx, remaining, 0);
  tickProcCooldowns(followUpCooldownMap, remaining);
  tickProcCooldowns(applyCooldownMap, remaining);

  // ── Follow-ups + cleanup ───────────────────────────────────────────
  processFollowUpProcs(action, ctx, 0);
  decayProcCounts(compiledStatMap, effectTrackers, action);
}

function processProcAction(action, ctx, depth, repeatCount, applyTimes) {
  if (depth >= MAX_PROC_DEPTH) return;
  applyEffects(ctx, { ...ctx, action, times: applyTimes, trigger: 'cast' });

  if (ctx.recordFootprint) {
    ctx.footprints.push(buildFootprint(ctx, { ...ctx, action, repeatCount }));
  }

  applyEffects(ctx, { ...ctx, action, times: applyTimes, trigger: 'hit' });
  processFollowUpProcs(action, ctx, depth);
}

function processAction(action, ctx, depth, repeatCount = 1, applyTimes = 1) {
  if (depth >= MAX_PROC_DEPTH) return;
  if (depth === 0) processTopLevelAction(action, ctx);
  else processProcAction(action, ctx, depth, repeatCount, applyTimes);
}

export const compileRotation = (gameId, rawTeam, characterId, cache) => {
  const team = rawTeam.filter(m => m.memberId);

  const compiledStatMap = {};
  for (const member of team) {
    compiledStatMap[member.memberId] = compileStatMap(gameId, member.memberId, member.build ?? {});
  }

  const effectTrackers = {
    byMember: Object.fromEntries(team.map(m => [m.memberId, {}])),
    active: {},
    inactive: {},
    enemy: {},
    enemyStatuses: {},
  };
  const applyCooldownMap = {};
  const followUpCooldownMap = {};

  // Shared context object threaded through all processAction calls. activeId is
  // mutated per rotation action to track which member is the current rotation actor.
  const ctx = {
    gameId,
    cache,
    compiledStatMap,
    effectTrackers,
    applyCooldownMap,
    followUpCooldownMap,
    characterId,
    activeId: null,
    recordFootprint: false,
    footprints: [],
  };

  // ── Priming pass ──────────────────────────────────────────────────────────
  // Replay the full rotation without recording footprints to warm up the effect
  // trackers into a steady-state snapshot (effects that will actually be active).
  for (const { memberId, rotation } of team.toReversed()) {
    ctx.activeId = memberId;
    for (const actionKey of rotation) {
      const action = cache.action[memberId][actionKey];
      processAction(action, ctx, 0);
    }
  }

  // ── Damage pass: record footprints ────────────────────────────────────────
  // Replay the rotation a second time, this time capturing a footprint at each
  // damage evaluation point. The footprints are later re-evaluated cheaply by
  // evaluateRotationSummary with different character builds.

  ctx.recordFootprint = true;

  for (const { memberId, rotation } of team.toReversed()) {
    ctx.activeId = memberId;
    for (const actionKey of rotation) {
      const action = cache.action[memberId][actionKey];
      processAction(action, ctx, 0);
    }
  }

  return { gameId, characterId, footprints: ctx.footprints };
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
      times,
      considered,
      repeatCount,
      constantEffectContribs,
      fixedVariableContribs,
      charVariableEffectSpecs,
      charConstantEffectContribsForSource,
      enemyStatMap,
    } = footprint;

    byMember[owner] ??= {};
    byMember[owner][actionKey] ??= { considered, damage: 0, healing: 0 };

    if (type === 'shield' || !footprint.compressedMultipliers) continue;

    // Pre-computed fixed result for non-character actions with no char variable effects
    if (footprint.fixedDamage) {
      byMember[owner][actionKey].damage += footprint.fixedDamage;
      continue;
    }

    if (footprint.fixedHealing) {
      byMember[owner][actionKey].healing += footprint.fixedHealing;
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

    // per element in compressed
    for (const element in footprint.compressedMultipliers) {
      const compressed = footprint.compressedMultipliers[element];

      const baseValue = computeBase(statMapWithEffects, compressed);

      if (type === 'heal') {
        const healingBonus = computeTotalStat('HB', statMapWithEffects);
        byMember[owner][actionKey].healing += baseValue * (1 + healingBonus) * times * repeatCount;
      } else {
        const bonuses = computeBonuses(statMapWithEffects, footprint.considered, element, enemyStatMap);
        const reductions = computeReductions(gameId, statMapWithEffects, element, enemyStatMap);
        byMember[owner][actionKey].damage += baseValue * bonuses * reductions * times * repeatCount;
      }
    }
  }

  return { other, byMember };
};
