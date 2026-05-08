import { CHARACTERS } from '@/data';
import { compileStatMap, mergeStatMaps, getActionMeta, getEffectMeta, computeTotalStat, toArray } from '@/utils';

const CHARACTER_LEVEL = 90;
const ENEMY_LEVEL = 100;
const BASE_RES = 0.1;

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

function computeReductions(statMap, element, dmgTypes) {
  // Enemy resistance multiplier
  let resIgnore = statMap[`IGNORE_${element}`] ?? 0
  for (const type of dmgTypes) {
    resIgnore += statMap[`IGNORE_${element}_${type}`] ?? 0;
  }
  const totalRes = BASE_RES - resIgnore;
  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  // Enemy defense multiplier
  const enemyDef = 8 * ENEMY_LEVEL + 792;
  let defIgnore = statMap["IGNORE_DEF"] ?? 0;
  for (const type of dmgTypes) {
    defIgnore += statMap[`IGNORE_DEF_${type}`] ?? 0;
  }
  const defMult = (800 + 8 * CHARACTER_LEVEL) / (800 + 8 * CHARACTER_LEVEL + enemyDef * (1 - defIgnore))

  return resMult * defMult;
}

function matchesEffectFilter(effect, actionKey) {
  const { actionFilter } = effect;
  if (!actionFilter) return true;

  return toArray(actionFilter).includes(actionKey.split('-').slice(1).join('-'));
}

function simulateAction(gameId, actionKey, statMap, activeEffectMapMap, characterId, activeId, passivesMap) {
  const { element } = CHARACTERS[gameId][characterId];
  const {
    input,
    considered,
    special,
    modifiers,
    attr,
    multipliers,
    times,
  } = getActionMeta(gameId, actionKey);

  if (considered === "SHIELD") return {};
  if (considered === "BUFF") return {};
  if (!multipliers) return {};

  const dmgTypes = [considered, special].filter(Boolean);
  if (input === 'CA') dmgTypes.push('CA');

  const effectStatMap = {};
  
  // Include character-specific effects
  const activeEffectMap = activeEffectMapMap[characterId] ?? {};
  for (const [effectKey, { stacks }] of Object.entries(activeEffectMap)) {
    const effect = getEffectMeta(gameId, effectKey);
    if (!effect.statMap || !matchesEffectFilter(effect, actionKey)) continue;
    for (const [statId, val] of Object.entries(effect.statMap)) {
      effectStatMap[statId] = (effectStatMap[statId] ?? 0) + val * stacks;
    }
  }

  // Apply team effects (always applicable)
  if (activeEffectMapMap["__team__"]) {
    for (const [effectKey, { stacks }] of Object.entries(activeEffectMapMap["__team__"])) {
      const effect = getEffectMeta(gameId, effectKey);
      if (!effect.statMap || !matchesEffectFilter(effect, actionKey)) continue;
      for (const [statId, val] of Object.entries(effect.statMap)) {
        effectStatMap[statId] = (effectStatMap[statId] ?? 0) + val * stacks;
      }
    }
  }

  // Apply active-target effects only if the action owner matches the current actor
  if (activeId === characterId && activeEffectMapMap["__active__"]) {
    for (const [effectKey, { stacks }] of Object.entries(activeEffectMapMap["__active__"])) {
      const effect = getEffectMeta(gameId, effectKey);
      if (!effect.statMap || !matchesEffectFilter(effect, actionKey)) continue;
      for (const [statId, val] of Object.entries(effect.statMap)) {
        effectStatMap[statId] = (effectStatMap[statId] ?? 0) + val * stacks;
      }
    }
  }

  const passiveStatMap = {};
  for (const effect of passivesMap) {
    const { chance = 1, statMap } = effect;
    if (!statMap || !matchesEffectFilter(effect, actionKey)) continue;
    for (const [statId, val] of Object.entries(statMap)) {
      passiveStatMap[statId] = (passiveStatMap[statId] ?? 0) + val * chance;
    }
  }

  const statMapWithEffects = mergeStatMaps(statMap, effectStatMap, passiveStatMap);
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
  const reductions = computeReductions(adjustedStatMap, element, dmgTypes);

  return { damage: baseDmg * bonuses * reductions * times };
}

export function normalizeTeam(team, teamFinalStats = {}) {
  return team.map(m => {
    if (m.build) return m;
    const finalStats = teamFinalStats[m.memberId];
    return {
      ...m,
      build: {
        weaponId: m.weaponId,
        setCounts: m.setCounts,
        ...(finalStats ? { statMap: finalStats } : {}),
      },
    };
  });
}

function resolveActionEffects(gameId, characterId, rank) {
  const { effects = [] } = CHARACTERS[gameId][characterId];
  const unlockedEffects = effects.filter(meta => (meta.rank ?? 0) <= rank).map(meta => {
    const resolved = {
      target: meta.target ?? 'self',
      maxStacks: meta.maxStacks ?? 1,
      duration: meta.duration ?? Infinity,
      maxProcs: meta.maxProcs ?? Infinity,
      cooldown: meta.cooldown ?? 0,
      ...(meta.statMap && {
        statMap: {
          ...meta.statMap,
        },
      }),
      ...(meta.trigger && {
        trigger: toArray(meta.trigger).map(id => `${characterId}-${id}`),
      }),
      ...(meta.actionFilter && {
        actionFilter: toArray(meta.actionFilter).map(id => `${characterId}-${id}`),
      }),
      ...(meta.procs && {
        procs: toArray(meta.procs).map(proc => ({
          times: proc.times ?? 1,
          action: toArray(proc.action).map(id => `${characterId}-${id}`),
          ...(proc.filter && {
            filter: toArray(proc.filter),
          }),
          ...(proc.actionKeyTrigger && {
            actionKeyTrigger: toArray(proc.actionKeyTrigger).map(id => `${characterId}-${id}`),
          }),
        })),
      }),
    };

    for (const [rankLock, { duration, maxProcs, statMap, procs }] of Object.entries(meta.rankModifiers ?? {})) {
      if (Number(rankLock) > rank) continue;
      if (duration) resolved.duration += duration;
      if (maxProcs) resolved.maxProcs += maxProcs;
      if (statMap) resolved.statMap = mergeStatMaps(resolved.statMap, statMap);
      if (procs) {
        const resolvedProcs = toArray(procs).map(proc => ({
          times: proc.times ?? 1,
          action: toArray(proc.action).map(id => `${characterId}-${id}`),
          ...(proc.filter && {
            filter: toArray(proc.filter),
          }),
          ...(proc.actionKeyTrigger && {
            actionKeyTrigger: toArray(proc.actionKeyTrigger).map(id => `${characterId}-${id}`),
          }),
        }));
        resolved.procs = [...(resolved.procs ?? []), ...resolvedProcs];
      }
    }

    return resolved;
  });

  const passive = [];
  const active = {};
  for (const [index, meta] of unlockedEffects.entries()) {
    const effect = { ...meta, effectKey: `${characterId}-${index}` };

    if (!meta.trigger) passive.push(effect);
    else for (const actionKey of meta.trigger) {
      if (!active[actionKey]) active[actionKey] = [];
      active[actionKey].push(effect);
    }
  }
  return { passive, active };
}

function expireEffects(activeEffectMapMap, delta) {
  for (const activeEffectMap of Object.values(activeEffectMapMap)) {
    for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
      if (effectEntry.timeRemaining - delta <= 0) {
        delete activeEffectMap[effectKey];
      }
    }
  }
}

function tickEffectDurations(activeEffectMapMap, delta) {
  for (const activeEffectMap of Object.values(activeEffectMapMap)) {
    for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
      if (effectEntry.timeRemaining - delta <= 0) {
        delete activeEffectMap[effectKey];
      } else {
        effectEntry.timeRemaining -= delta;
      }
    }
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

function applyTriggeredEffects({
  team,
  idToIndex,
  sourceId,
  actionKey,
  actionToEffects,
  activeEffectMapMap,
  times = 1,
}) {
  // Handle team-target effects in shared map
  for (const effect of actionToEffects[sourceId][actionKey] ?? []) {
    const { effectKey, target, maxStacks, duration, maxProcs } = effect;
    if (target !== 'team' && target !== 'active') continue;

    const targetKey = `__${target}__`;
    const currentStacks = activeEffectMapMap[targetKey][effectKey]?.stacks ?? 0;

    activeEffectMapMap[targetKey][effectKey] = {
      stacks: Math.min(currentStacks + times, maxStacks),
      timeRemaining: duration,
      procsRemaining: maxProcs,
    };
  }

  // Handle other targets in per-character maps
  for (const [id, activeEffectMap] of Object.entries(activeEffectMapMap)) {
    if (id === "__team__" || id === "__active__") continue; // Skip the special effect maps

    const validTargets = [id === sourceId ? 'self' : 'ally'];

    if (idToIndex[id] === 0) validTargets.push('first');
    if (((idToIndex[id] + 1) % team.length) === idToIndex[sourceId]) {
      validTargets.push('next');
    }

    for (const effect of actionToEffects[sourceId][actionKey] ?? []) {
      const { effectKey, target, maxStacks, duration, maxProcs } = effect;
      if (target === 'team' || target === 'active') continue; // Already handled above
      if (!validTargets.includes(target)) continue;

      const currentStacks = activeEffectMap[effectKey]?.stacks ?? 0;

      activeEffectMap[effectKey] = {
        stacks: Math.min(currentStacks + times, maxStacks),
        timeRemaining: duration,
        procsRemaining: maxProcs,
      };
    }
  }
}

function processProcEffects({
  gameId,
  sourceId,
  activeId = sourceId,
  actionKey,
  considered,
  actionToEffects,
  activeEffectMapMap,
  statMapMap,
  passivesMap,
  team,
  idToIndex,
  procCooldownMap,
  actionMap = null,
}) {
  for (const [effectKey, effectEntry] of Object.entries(activeEffectMapMap[sourceId] ?? {})) {
    const { ownerId: effectOwnerId, procs, cooldown: effectCooldown = 0 } = getEffectMeta(gameId, effectKey);
    if (!procs) continue;

    let remaining = effectEntry.procsRemaining;
    for (const [procIndex, procMeta] of toArray(procs).entries()) {
      const { action, actionKeyTrigger, filter, times = 1, cooldown: procCooldown = null } = procMeta;
      if (actionKeyTrigger && !toArray(actionKeyTrigger).includes(actionKey)) continue;

      const matchesFilter = !filter || (typeof filter === 'string' ? filter === considered : filter.includes(considered));
      if (!matchesFilter) continue;

      const cooldown = procCooldown ?? effectCooldown;
      const cooldownKey = procCooldown == null ? effectKey : `${effectKey}-${procIndex}`;
      if ((procCooldownMap[cooldownKey] ?? 0) > 0) continue;

      const effectActionKey = `${effectOwnerId}-${action}`;

      if (actionMap) {
        const { damage: procDamage = 0, healing: procHealing = 0 } = simulateAction(
          gameId,
          effectActionKey,
          statMapMap[effectOwnerId],
          activeEffectMapMap,
          effectOwnerId,
          activeId,
          passivesMap[effectOwnerId]
        );

        actionMap[effectActionKey] = {
          damage: (actionMap[effectActionKey]?.damage ?? 0) + procDamage * effectEntry.stacks * times,
          healing: (actionMap[effectActionKey]?.healing ?? 0) + procHealing * effectEntry.stacks * times,
        };
      }

      applyTriggeredEffects({
        team,
        idToIndex,
        sourceId: effectOwnerId,
        actionKey: effectActionKey,
        actionToEffects,
        activeEffectMapMap,
        times,
      });

      if (cooldown > 0) {
        procCooldownMap[cooldownKey] = cooldown;
      }

      remaining -= times;
    }

    effectEntry.procsRemaining = remaining;
  }
}

function decayProcCounts(gameId, activeEffectMapMap, actionKey) {
  for (const activeEffectMap of Object.values(activeEffectMapMap)) {
    for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
      if (effectEntry.procsRemaining === Infinity) continue;

      const effectMeta = getEffectMeta(gameId, effectKey);
      if (!matchesEffectFilter(effectMeta, actionKey)) continue;

      if (!effectMeta.procs) effectEntry.procsRemaining -= 1;
      if (effectEntry.procsRemaining <= 0) delete activeEffectMap[effectKey];
    }
  }
}

export function simulateRotation(gameId, rawTeam) {
  // remove null members
  const team = rawTeam.filter(member => member.memberId);

  // create caches for faster lookup
  const idToIndex = Object.fromEntries(team.map((m, i) => [m.memberId, i]));
  const actionToEffects = {};
  const passivesMap = {};
  const statMapMap = {};
  for (const { memberId, rank, build = {} } of team) {
    const { passive, active } = resolveActionEffects(gameId, memberId, rank);
    actionToEffects[memberId] = active;
    passivesMap[memberId] = passive;
    statMapMap[memberId] = compileStatMap(gameId, memberId, build, team, 'combat');
  }

  const actionMap = {};
  for (const [index, { memberId, rotation }] of team.entries()) {
    // create activeEffects iterators
    const prevRotationActionOrder = [
      ...team.slice(index),
      ...team.slice(0, index),
      team[index],
    ].slice(1).reverse().flatMap(m => m.rotation);
    const activeEffectMapMap = Object.fromEntries(team.map(m => [m.memberId, {}]));
    activeEffectMapMap["__team__"] = {};
    activeEffectMapMap["__active__"] = {};
    const procCooldownMap = {};
    for (const actionKey of prevRotationActionOrder) {
      const { ownerId: actionOwnerId, considered, duration: actionDuration = 1000, offset = 500 } = getActionMeta(gameId, actionKey);

      expireEffects(activeEffectMapMap, offset);
      tickProcCooldowns(procCooldownMap, offset);
      applyTriggeredEffects({
        team,
        idToIndex,
        sourceId: actionOwnerId,
        actionKey,
        actionToEffects,
        activeEffectMapMap,
      });    
      processProcEffects({
        gameId,
        sourceId: actionOwnerId,
        activeId: actionOwnerId,
        actionKey,
        considered,
        actionToEffects,
        activeEffectMapMap,
        statMapMap,
        passivesMap,
        team,
        idToIndex,
        procCooldownMap,
      });
      decayProcCounts(gameId, activeEffectMapMap, actionKey);
      tickEffectDurations(activeEffectMapMap, actionDuration);
      tickProcCooldowns(procCooldownMap, actionDuration);
    }

    // now iterate through each action
    for (const actionKey of rotation) {
      const { considered, duration: actionDuration = 1000, offset = 500 } = getActionMeta(gameId, actionKey);

      expireEffects(activeEffectMapMap, offset);
      tickProcCooldowns(procCooldownMap, offset);
      applyTriggeredEffects({
        team,
        idToIndex,
        sourceId: memberId,
        actionKey,
        actionToEffects,
        activeEffectMapMap,
      });

      // damage calculation
      const { damage = 0, healing = 0 } = simulateAction(gameId, actionKey, statMapMap[memberId], activeEffectMapMap, memberId, memberId, passivesMap[memberId]);
      actionMap[actionKey] = {
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };

      processProcEffects({
        gameId,
        sourceId: memberId,
        activeId: memberId,
        actionKey,
        considered,
        actionToEffects,
        activeEffectMapMap,
        statMapMap,
        passivesMap,
        team,
        idToIndex,
        procCooldownMap,
        actionMap,
      });

      decayProcCounts(gameId, activeEffectMapMap, actionKey);

      tickEffectDurations(activeEffectMapMap, actionDuration);
      tickProcCooldowns(procCooldownMap, actionDuration);
    }
  }

  return actionMap;
}
