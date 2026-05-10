import { CHARACTERS, MISC } from '@/data';
import { compileStatMap, mergeStatMaps, getAction, computeTotalStat, toArray } from '@/utils';

function computeBase(statMap, attr, multipliers) {
  const flatMv = statMap.FLAT_MV ?? 0;
  const percentMv = statMap.PERCENT_MV ?? 0;
  const attrValue = computeTotalStat(attr, statMap);

  let baseDamage = 0;
  for (const { mv: rawMv, times = 1 } of multipliers) {
    const mv = Array.isArray(rawMv) ? rawMv[9] : rawMv;
    const mvValue = (mv + flatMv) * (1 + percentMv);
    baseDamage += attrValue * mvValue * times;
  }
  return baseDamage;
}

function computeBonuses(statMap, element, dmgTypes) {
  const critRate = Math.max(Math.min(computeTotalStat("CR", statMap), 1), 0);
  const critDamage = computeTotalStat("CD", statMap) - 1;
  const critMult = critRate * (1 + critDamage) + (1 - critRate);

  let dmgBonusMult = 1 + computeTotalStat("ALL", statMap);
  let ampMult = 1 + (statMap["AMP_ALL"] ?? 0);

  for (const type of [element, ...dmgTypes]) {
    dmgBonusMult += computeTotalStat(type, statMap);
    ampMult += statMap[`AMP_${type}`] ?? 0;
  }

  return critMult * dmgBonusMult * ampMult;
}

function computeReductions(gameId, statMap, element, dmgTypes) {
  const { MAX_LEVEL, ENEMY_RES } = MISC[gameId];

  // Enemy resistance multiplier
  let resIgnore = statMap[`IGNORE_${element}`] ?? 0;
  for (const type of dmgTypes) resIgnore += statMap[`IGNORE_${element}_${type}`] ?? 0;
  const totalRes = ENEMY_RES - resIgnore;
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  // Enemy defense multiplier
  const enemyDef = 8 * (MAX_LEVEL + 10) + 792;
  let defIgnore = statMap["IGNORE_DEF"] ?? 0;
  for (const type of dmgTypes) defIgnore += statMap[`IGNORE_DEF_${type}`] ?? 0;
  const defMult = (800 + 8 * MAX_LEVEL) / (800 + 8 * MAX_LEVEL + enemyDef * (1 - defIgnore))

  return resMult * defMult;
}

function simulateAction({ gameId, actionOwner, actionKey, effectTrackers, activeId, members }) {
  const { element } = CHARACTERS[gameId][actionOwner];
  const {
    input,
    considered,
    special,
    modifiers,
    attr,
    multipliers,
    times,
  } = getAction(gameId, actionKey);

  if (considered === "SHIELD") return {};
  if (considered === "BUFF") return {};
  if (!multipliers) return {};

  const dmgTypes = [considered, special].filter(Boolean);
  if (input === 'CA') dmgTypes.push('CA');

  // Build stat map from effects
  const effectStatMap = {};
  for (const [effectKey, { stacks }] of Object.entries(effectTrackers.team)) {
    const effectOwner = effectKey.slice(0, 4);
    const effectIndex = effectKey.slice(5);
    const { actionFilter, statMap } = members[effectOwner].effectDefinitions[effectIndex];
    if (actionFilter && !actionFilter.includes(actionKey)) continue;
    for (const [statId, val] of Object.entries(statMap)) {
      effectStatMap[statId] = (effectStatMap[statId] ?? 0) + val * stacks;
    }
  }
  // Apply active-target effects only if the action owner matches the current actor
  if (activeId === actionOwner) {
    for (const [effectKey, { stacks }] of Object.entries(effectTrackers.active)) {
      const effectOwner = effectKey.slice(0, 4);
      const effectIndex = effectKey.slice(5);
      const { actionFilter, statMap } = members[effectOwner].effectDefinitions[effectIndex];
      if (actionFilter && !actionFilter.includes(actionKey)) continue;
      for (const [statId, val] of Object.entries(statMap)) {
        effectStatMap[statId] = (effectStatMap[statId] ?? 0) + val * stacks;
      }
    }
  }
  
  // Include character-specific effects
  for (const [effectKey, { stacks }] of Object.entries(effectTrackers.byMember[actionOwner])) {
    const effectOwner = effectKey.slice(0, 4);
    const effectIndex = effectKey.slice(5);
    const { actionFilter, statMap } = members[effectOwner].effectDefinitions[effectIndex];
    if (actionFilter && !actionFilter.includes(actionKey)) continue;
    for (const [statId, val] of Object.entries(statMap)) {
      effectStatMap[statId] = (effectStatMap[statId] ?? 0) + val * stacks;
    }
  }

  const passiveStatMap = {};
  for (const effectIndex of members[actionOwner].passiveEffects) {
    const { chance = 1, statMap, actionFilter } = members[actionOwner].effectDefinitions[effectIndex];

    if (actionFilter && !actionFilter.includes(actionKey)) continue;
    for (const [statId, val] of Object.entries(statMap)) {
      passiveStatMap[statId] = (passiveStatMap[statId] ?? 0) + val * chance;
    }
  }

  const statMapWithEffects = mergeStatMaps(members[actionOwner].statMap, effectStatMap, passiveStatMap);
  const adjustedStatMap = modifiers ? mergeStatMaps(statMapWithEffects, modifiers) : statMapWithEffects;

  if (considered === "HEAL") {
    const baseHealing = multipliers.map(mult => {
      const { flat, mv } = mult;
      if (flat) return Array.isArray(flat) ? flat[9] : flat;
      if (mv) return Array.isArray(mv) ? (mv[9] * computeTotalStat(attr, adjustedStatMap)) : (mv * computeTotalStat(attr, adjustedStatMap));
    }).reduce((acc, val) => acc + val, 0);

    const healingBonus = computeTotalStat("HB", adjustedStatMap);
    return { healing: baseHealing * (1 + healingBonus) * times };
  };

  const baseDmg = computeBase(adjustedStatMap, attr, multipliers);
  const bonuses = computeBonuses(adjustedStatMap, element, dmgTypes);
  const reductions = computeReductions(gameId, adjustedStatMap, element, dmgTypes);

  return { damage: baseDmg * bonuses * reductions * times };
}

const normalizeProc = (proc) => ({
  filter: proc.filter && toArray(proc.filter),
  actionKeyTrigger: proc.actionKeyTrigger && toArray(proc.actionKeyTrigger),
  actions: toArray(proc.actions),
  times: proc.times ?? 1,
});

const normalizeEffects = (gameId, characterId, rank) => {
  const effectDefinitions = {};
  const effectsByAction = {};
  const passiveEffects = [];
  (CHARACTERS[gameId][characterId].effects ?? []).filter(meta => (meta.rank ?? 0) <= rank).forEach((meta, index) => {
    const effectKey = `${characterId}-${index}`;
    const trigger = meta.trigger && toArray(meta.trigger);

    const resolved = {
      effectKey,
      trigger,
      target: meta.target ?? 'self',
      maxStacks: meta.maxStacks ?? 1,
      duration: meta.duration ?? Infinity,
      maxProcs: meta.maxProcs ?? Infinity,
      cooldown: meta.cooldown ?? 0,
      actionFilter: meta.actionFilter && toArray(meta.actionFilter),
      statMap: { ...meta.statMap },
      procs: toArray(meta.procs).map(proc => normalizeProc(proc)),
    };

    for (const [rankReq, modifier] of Object.entries(meta.rankModifiers ?? {})) {
      if (Number(rankReq) > rank) continue;

      const { duration, maxProcs, statMap, procs } = modifier;

      if (duration) resolved.duration += duration;
      if (maxProcs) resolved.maxProcs += maxProcs;
      if (statMap) resolved.statMap = mergeStatMaps(resolved.statMap, statMap);

      if (procs) {
        resolved.procs.push(...toArray(procs).map(proc => normalizeProc(proc)));
      }
    }

    effectDefinitions[index] = resolved;

    if (!trigger) {
      passiveEffects.push(index);
      return;
    }

    for (const action of trigger) {
      if (!effectsByAction[action]) effectsByAction[action] = [];
      effectsByAction[action].push(index);
    }
  });

  return { passiveEffects, effectsByAction, effectDefinitions };
};

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

  const { byMember, team, active } = effectTrackers;
  advanceMap(team);
  advanceMap(active);
  for (const memberMap of Object.values(byMember)) {
    advanceMap(memberMap);
  }
}

function tickProcCooldowns(procCooldownMap, delta) {
  for (const [cooldownKey, cooldownRemaining] of Object.entries(procCooldownMap)) {
    const nextValue = cooldownRemaining - delta;
    if (nextValue <= 0) {
      delete procCooldownMap[cooldownKey];
    } else {
      procCooldownMap[cooldownKey] = nextValue;
    }
  }
}

function applyEffects({ members, actionKey, effectTrackers, times = 1 }) {
  const actionOwner = getActionOwner(actionKey);
  const shortActionKey = getShortActionKey(actionKey);

  const member = members[actionOwner];
  if (!member) return;

  const { effectsByAction, effectDefinitions } = member;
  if (!effectsByAction[shortActionKey]) return;

  const memberIds = Object.keys(effectTrackers.byMember);
  const teamSize = memberIds.length;

  const validTargetsById = Object.fromEntries(
    memberIds.map(id => {
      const targets = [id === actionOwner ? 'self' : 'ally'];
      if (members[id].index === 0) targets.push('first');
      if ((members[id].index + 1) % teamSize === members[actionOwner].index) targets.push('next');
      return [id, targets];
    })
  );

  function applyEffect(tracker, effect) {
    const { effectKey, maxStacks, duration, maxProcs } = effectDefinitions[effect];
    const currentStacks = tracker[effectKey]?.stacks ?? 0;
    tracker[effectKey] = {
      stacks: Math.min(currentStacks + times, maxStacks),
      timeRemaining: duration,
      procsRemaining: maxProcs,
    };
  }

  for (const effect of effectsByAction[shortActionKey]) {
    const { target } = effectDefinitions[effect];

    if (target === 'team' || target === 'active') {
      applyEffect(effectTrackers[target], effect);
      continue;
    }

    for (const [id, validTargets] of Object.entries(validTargetsById)) {
      if (validTargets.includes(target)) {
        applyEffect(effectTrackers.byMember[id], effect);
      }
    }
  }
}

function processProcEffects({
  gameId,
  members,
  actionKey,
  considered,
  effectTrackers,
  procCooldownMap,
  actionMap = null,
}) {
  const actionOwner = actionKey.split('-')[0];
  const { byMember, team, active } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (procCooldownMap[effectKey]) continue;

      const [effectOwner, effectIndex] = effectKey.split('-');
      const effectDef = members[effectOwner]?.effectDefinitions?.[effectIndex];
      if (!effectDef) continue;

      const { procs, cooldown } = effectDef;
      if (!procs) continue;

      let remaining = effectTracker.procsRemaining;
      for (const { filter, actionKeyTrigger, actions, times } of procs) {
        if (filter && !filter.includes(considered)) continue;
        if (actionKeyTrigger && !actionKeyTrigger.includes(actionKey)) continue;

        for (const action of actions) {
          const procActionKey = effectOwner + '-' + action;

          if (actionMap) {
            const { damage: procDamage = 0, healing: procHealing = 0 } = simulateAction({
              gameId,
              actionOwner: effectOwner,
              actionKey: procActionKey,
              effectTrackers,
              activeId: actionOwner,
              members,
            });

            actionMap[procActionKey] = {
              damage: (actionMap[procActionKey]?.damage ?? 0) + procDamage * effectTracker.stacks * times,
              healing: (actionMap[procActionKey]?.healing ?? 0) + procHealing * effectTracker.stacks * times,
            };
          }

          applyEffects({ members, actionKey: procActionKey, effectTrackers, times });
        }

        if (cooldown > 0) procCooldownMap[effectKey] = cooldown;
        remaining -= times;
      }

      effectTracker.procsRemaining = remaining;
    }
  }

  processTrackerMap(byMember[actionOwner] ?? {});
  processTrackerMap(team);
  processTrackerMap(active);
}

function decayProcCounts(gameId, members, effectTrackers, actionKey) {
  const { team, active, byMember } = effectTrackers;

  function decayMap(trackerMap) {
    for (const [effectKey, effectTracker] of Object.entries(trackerMap)) {
      if (effectTracker.procsRemaining === Infinity) continue;

      const effectOwner = effectKey.slice(0, 4);
      const effectIndex = effectKey.slice(5);
      const { actionFilter, procs } = members[effectOwner].effectDefinitions[effectIndex];
      if (actionFilter && !actionFilter.includes(actionKey)) continue;

      if (!procs) effectTracker.procsRemaining -= 1;
      if (effectTracker.procsRemaining <= 0) delete trackerMap[effectKey];
    }
  }

  decayMap(team);
  decayMap(active);
  for (const map of Object.values(byMember)) decayMap(map);
}

export function simulateRotation(gameId, rawTeam) {
  // remove null members
  const team = rawTeam.filter(m => m.memberId);

  // create cache for faster lookup
  const members = Object.fromEntries(
    team.map(({ memberId, rank, build = {} }, index) => {
      const { passiveEffects, effectsByAction, effectDefinitions } = normalizeEffects(gameId, memberId, rank);
      return [memberId, {
        index,
        statMap: compileStatMap(gameId, memberId, build, team, 'combat'),
        passiveEffects,
        effectsByAction,
        effectDefinitions,
      }];
    })
  );

  const actionMap = {};
  for (const [index, { memberId, rotation }] of team.entries()) {
    // create structure for tracking active effects for each member
    const prevRotationActionOrder = [
      ...team.slice(index),
      ...team.slice(0, index),
      team[index],
    ].slice(1).reverse().flatMap(m => m.rotation);

    const effectTrackers = {
      byMember: Object.fromEntries(team.map(m => [m.memberId, {}])),
      team: {},
      active: {},
    };

    const procCooldownMap = {};
    for (const actionKey of prevRotationActionOrder) {
      const { considered, duration: actionDuration = 1000, offset = 500 } = getAction(gameId, actionKey);

      applyEffects({ members, actionKey, effectTrackers });
      advanceEffects(effectTrackers, offset, actionDuration);
      tickProcCooldowns(procCooldownMap, offset);
      processProcEffects({ gameId, members, actionKey, considered, effectTrackers, procCooldownMap });
      decayProcCounts(gameId, members, effectTrackers, actionKey);
      tickProcCooldowns(procCooldownMap, actionDuration);
    }

    // now iterate through each action
    for (const actionKey of rotation) {
      const { considered, duration: actionDuration = 1000, offset = 500 } = getAction(gameId, actionKey);

      applyEffects({ members, actionKey, effectTrackers });
      advanceEffects(effectTrackers, offset, actionDuration);
      tickProcCooldowns(procCooldownMap, offset);

      // damage calculation
      const { damage = 0, healing = 0 } = simulateAction({
        gameId,
        actionOwner: memberId,
        actionKey,
        effectTrackers,
        activeId: memberId,
        members,
      });
      actionMap[actionKey] = {
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };

      processProcEffects({ gameId, members, actionKey, considered, effectTrackers, procCooldownMap, actionMap });
      decayProcCounts(gameId, members, effectTrackers, actionKey);
      tickProcCooldowns(procCooldownMap, actionDuration);
    }
  }

  return actionMap;
}

const getActionOwner = (actionKey) => actionKey.split('-')[0];
const getShortActionKey = (actionKey) => actionKey.split('-').slice(1).join('-');
