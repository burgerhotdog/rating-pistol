import { CHARACTERS, RATING } from '@/data';
import { compileStatMap, mergeStatMaps, getSkill, getEffect, computeTotalStat } from '@/utils';

function resolveValidTargets(team, index, ownerId) {
  const ownerIndex = team.findIndex(m => m.memberId === ownerId);
  const nextIndex = (index + 1) % team.length;
  return [
    'team',
    'ally',
    ...(index === 0 ? ['first'] : []),
    ...(ownerIndex === nextIndex ? ['next'] : []),
  ];
}

function matchesEffectFilter(effect, actionKey) {
  const { actionFilter } = effect;
  if (!actionFilter) return true;

  const filterKeys = Array.isArray(actionFilter) ? actionFilter : [actionFilter];
  return filterKeys.includes(actionKey.split('-').slice(1));
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
  } = getSkill(gameId, actionKey);

  if (considered === "SHIELD") return {};
  if (considered === "BUFF") return {};
  if (!multipliers) return {};

  const dmgTypes = [considered, special].filter(Boolean);
  if (input === 'CA') dmgTypes.push('CA');

  const effectStatMap = Object.entries(activeEffectMap)
    .map(([effectKey, { stacks }]) => {
      const effect = getEffect(gameId, effectKey);
      const { statMap } = effect;
      if (!statMap) return null;
      if (!matchesEffectFilter(effect, actionKey)) return null;

      return Object.fromEntries(
        Object.entries(statMap).map(([statId, statValue]) => [
          statId,
          statValue * stacks,
        ])
      );
    })
    .filter(Boolean)
    .reduce((acc, m) => mergeStatMaps(acc, m), {});

  const passiveStatMap = passivesMap
    .map(effect => {
      const { chance = 1, statMap } = effect;
      if (!statMap) return null;
      if (!matchesEffectFilter(effect, actionKey)) return null;

      return Object.fromEntries(
        Object.entries(statMap).map(([statId, statValue]) => [
          statId,
          statValue * chance,
        ])
      );
    })
    .filter(Boolean)
    .reduce((acc, m) => mergeStatMaps(acc, m), {});

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

function parseActiveEffects(gameId, memberId, team, actionEffects) {
  const index = team.findIndex(m => m.memberId === memberId);

  const teammateOrder = [
    ...team.slice(index),
    ...team.slice(0, index),
  ].slice(1).reverse();

  const allyActionOrder = teammateOrder.flatMap(member => member.rotation);
  const activeEffectMap = {};

  for (const actionKey of allyActionOrder) {
    const { ownerId, duration: actionDuration = 0, offset = 0 } = getSkill(gameId, actionKey);
    const validTargets = resolveValidTargets(team, index, ownerId);

    // remove effects that expire before action occurs
    for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
      if (effectEntry.timeRemaining - offset <= 0) {
        delete activeEffectMap[effectKey];
      }
    }

    // add effects triggered by current action
    for (const effect of actionEffects[ownerId][actionKey] ?? []) {
      const { effectKey, target = 'self', maxStacks = 1, duration: effectDuration, maxProcs } = effect;
      if (!validTargets.includes(target)) continue; // wrong target

      const currentStacks = activeEffectMap[effectKey]?.stacks ?? 0;
      // just refresh buff timer if already max stacks
      activeEffectMap[effectKey] = {
        stacks: Math.min(currentStacks + 1, maxStacks),
        timeRemaining: effectDuration ?? Infinity,
        procsRemaining: maxProcs ?? Infinity,
      };
    }

    // subtract action duration from time remaining from all effects and delete if it expires
    for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
      if (effectEntry.timeRemaining - actionDuration <= 0) {
        delete activeEffectMap[effectKey];
      } else {
        effectEntry.timeRemaining -= actionDuration;
      }
    }
  }

  return activeEffectMap;
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

function resolveActionEffects(gameId, characterId, memberRank = 0) {
  const { effects } = CHARACTERS[gameId][characterId];
  if (!effects) return {};

  const passive = [];
  const active = {};
  for (const [effectIndex, effect] of effects.entries()) {
    const effectKey = `${characterId}-${effectIndex}`;
    const { trigger } = effect;
    if (effect.rank != null && memberRank < effect.rank) continue;

    if (!trigger) {
      passive.push({ effectKey, ...effect });
      continue;
    }

    const triggers = Array.isArray(trigger) ? trigger : [trigger];
    for (const key of triggers) {
      const actionKey = `${characterId}-${key}`
      if (!active[actionKey]) active[actionKey] = [];
      active[actionKey].push({ effectKey, ...effect });
    }
  }
  return { active, passive };
}

export function simulateRotation(gameId, rawTeam) {
  // remove null members
  const team = rawTeam.filter(member => member.memberId);

  // member actionEffects
  const actionEffects = {};
  const passivesMap = {};
  for (const { memberId, rank } of team) {
    const resolved = resolveActionEffects(gameId, memberId, rank);
    actionEffects[memberId] = resolved.active ?? {};
    passivesMap[memberId] = resolved.passive ?? [];
  }

  // first build member contexts before calculating damage
  // this contains info on buffs applied before each member's rotation
  const memberContexts = {};
  for (const { memberId, build = {} } of team) {
    memberContexts[memberId] = {
      statMap: compileStatMap(gameId, memberId, build, team, 'combat'),
      activeEffectMap: parseActiveEffects(gameId, memberId, team, actionEffects),
    };
  }

  // now calculate the damage/healing/shielding produced by each action
  const actionMap = {};
  for (const { memberId, rotation } of team) {
    const context = memberContexts[memberId];
    const { activeEffectMap, statMap } = context;

    for (const actionKey of rotation) {
      const { considered, duration: actionDuration = 1000, offset = 500 } = getSkill(gameId, actionKey);
      // remove effects that expire before action occurs
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
        if (effectEntry.timeRemaining - offset <= 0) {
          delete activeEffectMap[effectKey];
        }
      }

      // add effects triggered by current action before computing damage
      for (const effect of actionEffects[memberId][actionKey] ?? []) {
        const { effectKey, target = 'self', maxStacks = 1, duration: effectDuration, maxProcs } = effect;
        if (target !== 'self' && target !== 'team') continue; // wrong target

        const currentStacks = activeEffectMap[effectKey]?.stacks ?? 0;
        activeEffectMap[effectKey] = { // just refresh buff timer if already max stacks
          stacks: Math.min(currentStacks + 1, maxStacks),
          timeRemaining: effectDuration ?? Infinity,
          procsRemaining: maxProcs ?? Infinity,
        };
      }

      // damage calculation
      const { damage = 0, healing = 0 } = simulateAction(gameId, actionKey, statMap, activeEffectMap, passivesMap[memberId]);
      actionMap[actionKey] = {
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };

      // tick procsRemaining for non procs type effects
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
        if (effectEntry.procsRemaining === Infinity) continue;

        const effect = getEffect(gameId, effectKey);
        if (effect.procs) continue; // these will be handled separately

        if (!matchesEffectFilter(effect, actionKey)) continue;

        effectEntry.procsRemaining -= 1;
        if (effectEntry.procsRemaining <= 0) delete activeEffectMap[effectKey];
      }

      // proc effects in activeEffectMap that have procs
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
        const { ownerId, procs } = getEffect(gameId, effectKey);
        if (!procs) continue;

        let remaining = effectEntry.procsRemaining;
        for (const { action, actionKeyTrigger, filter, times = 1 } of procs) {
          if (actionKeyTrigger) {
            const actionKeyTriggerFilter = Array.isArray(actionKeyTrigger) ? actionKeyTrigger : [actionKeyTrigger];
            if (!actionKeyTriggerFilter.includes(actionKey)) continue;
          }

          const actualTimes = Math.min(times, remaining);
          if (actualTimes === 0) continue;

          const matchesFilter = !filter || (typeof filter === 'string' ? filter === considered : filter.includes(considered));
          if (!matchesFilter) continue;
          
          const effectActionkey = `${ownerId}-${action}`;
          const ownerContext = memberContexts[ownerId];

          const { damage: procDamage = 0, healing: procHealing = 0 } = simulateAction(
            gameId,
            effectActionkey,
            ownerContext.statMap,
            ownerContext.activeEffectMap,
            passivesMap[ownerId]
          );

          actionMap[effectActionkey] = {
            damage: (actionMap[effectActionkey]?.damage ?? 0) + procDamage * effectEntry.stacks * actualTimes,
            healing: (actionMap[effectActionkey]?.healing ?? 0) + procHealing * effectEntry.stacks * actualTimes,
          };

          remaining -= actualTimes;
        }

        // delete effects if all procs are used up
        if (remaining === 0) delete activeEffectMap[effectKey];
        effectEntry.procsRemaining = remaining;
      }

      // subtract action duration from time remaining from all effects and delete if it expires
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
        if (effectEntry.timeRemaining - actionDuration <= 0) delete activeEffectMap[effectKey];
        else effectEntry.timeRemaining -= actionDuration;
      }
    }
  }

  return actionMap;
}
