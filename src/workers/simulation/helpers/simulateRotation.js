import { CHARACTERS, RATING } from '@/data';
import { compileStatMap, mergeStatMaps, getSkill, getEffect } from '@/utils';

function resolveValidTargets(team, index, ownerId) {
  const ownerIndex = team.findIndex(m => m.memberId === ownerId);
  return [
    'team',
    'ally',
    ...(index === 0 ? ['first'] : []),
    ...(ownerIndex === (1 + index) ? ['next'] : []),
    ...((ownerIndex === 0) && (index === team.length - 1) ? ['next'] : []),
  ];
}

function simulateAction(gameId, actionKey, statMap, activeEffectMap) {
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
  } = getSkill(gameId, actionKey);
  if (considered === "HEAL") return {};
  if (considered === "SHIELD") return {};
  if (considered === "BUFF") return {};
  if (!multipliers) return {};

  const dmgTypes = [considered, special].filter(Boolean);
  if (input === 'CA') dmgTypes.push('CA');

  const effectStatMap = Object.entries(activeEffectMap).map(([effectKey, { stacks }]) => {
    const { statMap } = getEffect(gameId, effectKey);
    if (!statMap) return {};
    return Object.fromEntries(Object.entries(statMap).map(([statId, statValue]) => ([statId, statValue * stacks])));
  }).reduce((acc, m) => mergeStatMaps(acc, m), {});
  const statMapWithEffects = mergeStatMaps(statMap, effectStatMap);
  const adjustedStatMap = modifiers ? mergeStatMaps(statMapWithEffects, modifiers) : statMapWithEffects;
  
  const baseDmg = computeBase(adjustedStatMap, attr, multipliers);
  const bonuses = computeBonuses(adjustedStatMap, element, dmgTypes);
  const reductions = computeReductions(adjustedStatMap, element, dmgTypes);

  return { damage: baseDmg * bonuses * reductions };
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
    const { ownerId, duration = 0, offset = 0 } = getSkill(gameId, actionKey);
    const validTargets = resolveValidTargets(team, index, ownerId);

    // remove effects that expire before action occurs
    for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
      if (effectEntry.timeRemaining - offset <= 0) {
        delete activeEffectMap[effectKey];
      }
    }

    // add effects triggered by current action
    for (const effect of actionEffects[ownerId][actionKey] ?? []) {
      const { effectKey, target, maxStacks = 1, duration, maxProcs } = effect;
      if (!validTargets.includes(target)) continue; // wrong target

      const currentStacks = activeEffectMap[effectKey]?.stacks ?? 0;
      // just refresh buff timer if already max stacks
      activeEffectMap[effectKey] = {
        stacks: Math.min(currentStacks + 1, maxStacks),
        timeRemaining: duration ?? Infinity,
        procsRemaining: maxProcs ?? Infinity,
      };
    }

    // subtract action duration from time remaining from all effects and delete if it expires
    for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
      if (effectEntry.timeRemaining - duration <= 0) {
        delete activeEffectMap[effectKey];
      } else {
        effectEntry.timeRemaining -= duration;
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

function resolveActionEffects(gameId, characterId) {
  const { effects } = CHARACTERS[gameId][characterId];
  if (!effects) return {};

  const resolved = {};
  for (const [effectIndex, effect] of effects.entries()) {
    const effectKey = `${characterId}-${effectIndex}`;
    const { trigger } = effect;
    if (!trigger) throw new Error(`invalid trigger for effect in characterId ${characterId}`);

    const triggers = Array.isArray(trigger) ? trigger : [trigger];
    for (const key of triggers) {
      const actionKey = `${characterId}-${key}`
      if (!resolved[actionKey]) resolved[actionKey] = [];
      resolved[actionKey].push({ effectKey, ...effect });
    }
  }
  return resolved;
}

export function simulateRotation(gameId, rawTeam) {
  // remove null members
  const team = rawTeam.filter(member => member.memberId);

  // member actionEffects
  const actionEffects = {};
  for (const { memberId } of team) {
    actionEffects[memberId] = resolveActionEffects(gameId, memberId);
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
      const { considered, duration = 0, offset = 0 } = getSkill(gameId, actionKey);
      // remove effects that expire before action occurs
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
        if (effectEntry.timeRemaining - offset <= 0) {
          delete activeEffectMap[effectKey];
        }
      }

      // add effects triggered by current action before computing damage
      for (const effect of actionEffects[memberId][actionKey] ?? []) {
        const { effectKey, target, maxStacks = 1, duration, maxProcs } = effect;
        if (target !== 'self' && target !== 'team') continue; // wrong target

        const currentStacks = activeEffectMap[effectKey]?.stacks ?? 0;
        activeEffectMap[effectKey] = { // just refresh buff timer if already max stacks
          stacks: Math.min(currentStacks + 1, maxStacks),
          timeRemaining: duration ?? Infinity,
          procsRemaining: maxProcs ?? Infinity,
        };
      }

      // damage calculation
      const { damage = 0, healing = 0 } = simulateAction(gameId, actionKey, statMap, activeEffectMap);
      actionMap[actionKey] = {
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };

      // proc effects in activeEffectMap that have procs
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
        const { ownerId, procs } = getEffect(gameId, effectKey);
        if (!procs) continue;

        let remaining = effectEntry.procsRemaining;
        for (const { action, filter, times = 1 } of procs) {
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
          );

          actionMap[effectActionkey] = {
            damage: (actionMap[effectActionkey]?.damage ?? 0) + procDamage * actualTimes,
            healing: (actionMap[effectActionkey]?.healing ?? 0) + procHealing * actualTimes,
          };

          remaining -= actualTimes;
        }

        // delete effects if all procs are used up
        if (remaining === 0) {
          delete activeEffectMap[effectKey];
        }
      }

      // subtract action duration from time remaining from all effects and delete if it expires
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
        if (effectEntry.timeRemaining - duration <= 0) {
          delete activeEffectMap[effectKey];
        } else {
          effectEntry.timeRemaining -= duration;
        }
      }
    }
  }

  return actionMap;
}
