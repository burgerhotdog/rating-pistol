import { CHARACTERS, RATING } from '@/data';
import { compileStatMap, mergeStatMaps, getActionMeta, getEffectMeta, computeTotalStat, toArray } from '@/utils';

function matchesEffectFilter(effect, actionKey) {
  const { actionFilter } = effect;
  if (!actionFilter) return true;

  return toArray(actionFilter).includes(actionKey.split('-').slice(1).join('-'));
}

function simulateAction(gameId, actionKey, statMap, activeEffectMap, passivesMap) {
  const [characterId] = actionKey.split('-');
  const { element } = CHARACTERS[gameId][characterId];
  const { computeBase, computeBonuses, computeReductions } = RATING[gameId];
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

    for (const effect of actionEffects[sourceId]?.[actionKey] ?? []) {
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
    for (const actionKey of prevRotationActionOrder) {
      const { ownerId: actionOwnerId, duration: actionDuration = 1000, offset = 500 } = getActionMeta(gameId, actionKey);

      expireEffects(activeEffectMapMap, offset);
      applyTriggeredEffects({
        team,
        memberIndex,
        sourceId: actionOwnerId,
        actionKey,
        actionEffects,
        activeEffectMapMap,
      });    
      tickEffectDurations(activeEffectMapMap, actionDuration);
    }

    // now iterate through each action
    for (const actionKey of rotation) {
      const { considered, duration: actionDuration = 1000, offset = 500 } = getActionMeta(gameId, actionKey);

      expireEffects(activeEffectMapMap, offset);
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

      // proc effects in activeEffectMap that have procs
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMapMap[memberId])) {
        const { ownerId: effectOwnerId, procs } = getEffectMeta(gameId, effectKey);
        if (!procs) continue;

        let remaining = effectEntry.procsRemaining;
        for (const { action, actionKeyTrigger, filter, times = 1 } of toArray(procs)) {
          if (actionKeyTrigger && !toArray(actionKeyTrigger).includes(actionKey)) continue;

          const matchesFilter = !filter || (typeof filter === 'string' ? filter === considered : filter.includes(considered));
          if (!matchesFilter) continue;
          
          const effectActionKey = `${effectOwnerId}-${action}`;

          const { damage: procDamage = 0, healing: procHealing = 0 } = simulateAction(
            gameId,
            effectActionKey,
            statMapMap[effectOwnerId],
            activeEffectMapMap[effectOwnerId],
            passivesMap[effectOwnerId]
          );

          applyTriggeredEffects({
            team,
            memberIndex,
            sourceId: effectOwnerId,
            actionKey: effectActionKey,
            actionEffects,
            activeEffectMapMap,
            times,
          });

          actionMap[effectActionKey] = {
            damage: (actionMap[effectActionKey]?.damage ?? 0) + procDamage * effectEntry.stacks * times,
            healing: (actionMap[effectActionKey]?.healing ?? 0) + procHealing * effectEntry.stacks * times,
          };

          remaining -= times;
        }
        effectEntry.procsRemaining = remaining;
      }

      // tick down procsRemaining and delete if invalid
      for (const activeEffectMap of Object.values(activeEffectMapMap)) {
        for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
          if (effectEntry.procsRemaining === Infinity) continue;

          const effectMeta = getEffectMeta(gameId, effectKey);
          if (!matchesEffectFilter(effectMeta, actionKey)) continue;

          if (!effectMeta.procs) effectEntry.procsRemaining -= 1;
          
          if (effectEntry.procsRemaining <= 0) delete activeEffectMap[effectKey];
        }
      }

      tickEffectDurations(activeEffectMapMap, actionDuration);
    }
  }

  return actionMap;
}
