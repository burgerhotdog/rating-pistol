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

function simulateAction(gameId, actionKey, statMap, activeEffectMap, passivesMap) {
  const [characterId] = actionKey.split('-');
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
  for (const [effectKey, { stacks }] of Object.entries(activeEffectMap)) {
    const effect = getEffectMeta(gameId, effectKey);
    if (!effect.statMap || !matchesEffectFilter(effect, actionKey)) continue;
    for (const [statId, val] of Object.entries(effect.statMap)) {
      effectStatMap[statId] = (effectStatMap[statId] ?? 0) + val * stacks;
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

function applyEffectModifiers(effectIndex, effectMeta, allEffectModifiers) {
  let resolved = effectMeta;

  for (const { effectIndex: modEffectIndex, add = {}, set = {} } of allEffectModifiers) {
    if (modEffectIndex !== effectIndex) continue;
    if (resolved === effectMeta) resolved = {
      ...effectMeta,
      statMap: effectMeta.statMap ? { ...effectMeta.statMap } : undefined,
      procs: effectMeta.procs ? [...toArray(effectMeta.procs)] : undefined,
    }; // prevent mutation

    for (const [field, value] of Object.entries(add)) {
      if (field === 'statMap') {
        resolved.statMap = mergeStatMaps(resolved.statMap ?? {}, value);
        continue;
      }

      if (field === 'procs') {
        resolved.procs = [...toArray(resolved.procs), ...toArray(value)];
        continue;
      }

      if (typeof value === 'number') {
        resolved[field] = (resolved[field] ?? 0) + value;
      }

      if (typeof value === 'string') {
        resolved[field] = [...toArray(resolved[field]), value];
      }
    }

    for (const [field, value] of Object.entries(set)) {
      resolved[field] = value;
    }
  }

  return resolved;
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

function resolveActionEffects(gameId, characterId, memberRank) {
  const { effects } = CHARACTERS[gameId][characterId];
  if (!effects) return {};

  const unlockedEffects = effects.filter(effect => {
    if (effect.rank == null) return true;
    return memberRank >= effect.rank;
  });

  const allEffectModifiers = unlockedEffects.flatMap(meta => toArray(meta.effectModifiers));

  const passive = [];
  const active = {};
  for (const [effectIndex, effect] of effects.entries()) {
    const effectKey = `${characterId}-${effectIndex}`;
    if (effect.rank != null && memberRank < effect.rank) continue;

    const resolvedEffect = applyEffectModifiers(effectIndex, effect, allEffectModifiers);
    const { trigger } = resolvedEffect;

    if (!trigger) {
      passive.push({ effectKey, ...resolvedEffect });
      continue;
    }

    for (const key of toArray(trigger)) {
      const actionKey = `${characterId}-${key}`
      if (!active[actionKey]) active[actionKey] = [];
      active[actionKey].push({ effectKey, ...resolvedEffect });
    }
  }
  return { active, passive };
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
  memberIndex,
  sourceId,
  actionKey,
  actionEffects,
  activeEffectMapMap,
  times = 1,
}) {
  for (const [id, activeEffectMap] of Object.entries(activeEffectMapMap)) {
    const validTargets = ['team', id === sourceId ? 'self' : 'ally'];

    if (memberIndex[id] === 0) validTargets.push('first');
    if (((memberIndex[id] + 1) % team.length) === memberIndex[sourceId]) {
      validTargets.push('next');
    }

    for (const effect of actionEffects[sourceId][actionKey] ?? []) {
      const {
        effectKey,
        target = 'self',
        maxStacks = 1,
        duration,
        maxProcs,
      } = effect;

      if (!validTargets.includes(target)) continue;

      const currentStacks = activeEffectMap[effectKey]?.stacks ?? 0;

      activeEffectMap[effectKey] = {
        stacks: Math.min(currentStacks + times, maxStacks),
        timeRemaining: duration ?? Infinity,
        procsRemaining: maxProcs ?? Infinity,
      };
    }
  }
}

function processProcEffects({
  gameId,
  sourceId,
  actionKey,
  considered,
  actionEffects,
  activeEffectMapMap,
  statMapMap,
  passivesMap,
  team,
  memberIndex,
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
          activeEffectMapMap[effectOwnerId],
          passivesMap[effectOwnerId]
        );

        actionMap[effectActionKey] = {
          damage: (actionMap[effectActionKey]?.damage ?? 0) + procDamage * effectEntry.stacks * times,
          healing: (actionMap[effectActionKey]?.healing ?? 0) + procHealing * effectEntry.stacks * times,
        };
      }

      applyTriggeredEffects({
        team,
        memberIndex,
        sourceId: effectOwnerId,
        actionKey: effectActionKey,
        actionEffects,
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
  const memberIndex = Object.fromEntries(team.map((m, i) => [m.memberId, i]));

  const actionEffects = {};
  const passivesMap = {};
  const statMapMap = {};
  for (const { memberId, rank, build = {} } of team) {
    const resolved = resolveActionEffects(gameId, memberId, rank);
    actionEffects[memberId] = resolved.active ?? {};
    passivesMap[memberId] = resolved.passive ?? [];
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
    const procCooldownMap = {};
    for (const actionKey of prevRotationActionOrder) {
      const { ownerId: actionOwnerId, considered, duration: actionDuration = 1000, offset = 500 } = getActionMeta(gameId, actionKey);

      expireEffects(activeEffectMapMap, offset);
      tickProcCooldowns(procCooldownMap, offset);
      applyTriggeredEffects({
        team,
        memberIndex,
        sourceId: actionOwnerId,
        actionKey,
        actionEffects,
        activeEffectMapMap,
      });    
      processProcEffects({
        gameId,
        sourceId: actionOwnerId,
        actionKey,
        considered,
        actionEffects,
        activeEffectMapMap,
        statMapMap,
        passivesMap,
        team,
        memberIndex,
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
        memberIndex,
        sourceId: memberId,
        actionKey,
        actionEffects,
        activeEffectMapMap,
      });

      // damage calculation
      const { damage = 0, healing = 0 } = simulateAction(gameId, actionKey, statMapMap[memberId], activeEffectMapMap[memberId], passivesMap[memberId]);
      actionMap[actionKey] = {
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };

      processProcEffects({
        gameId,
        sourceId: memberId,
        actionKey,
        considered,
        actionEffects,
        activeEffectMapMap,
        statMapMap,
        passivesMap,
        team,
        memberIndex,
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
