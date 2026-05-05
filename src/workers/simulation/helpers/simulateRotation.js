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
  } = getSkill("wuthering-waves", actionKey);
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

function parseActiveEffects(gameId, memberId, team) {
  const index = team.indexOf(m => m.memberId === memberId);

  const teammateOrder = [
    ...team.slice(index),
    ...team.slice(0, index),
  ].slice(1).reverse();

  const allyActionOrder = teammateOrder.flatMap(member => member.rotation);
  const activeEffectMap = {};

  for (const actionKey of allyActionOrder) {
    const [ownerId, skillId, actionId] = actionKey.split('-');
    const validTargets = resolveValidTargets(team, index, ownerId);
    const actionTrigger = `${skillId}-${actionId}`;

    // remove effects that expire before action occurs
    const { duration = 0, offset = 0 } = getSkill(gameId, actionKey);
    for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
      if (effectEntry.timeRemaining - offset <= 0) {
        delete activeEffectMap[effectKey];
      }
    }

    // add effects triggered by current action
    const { effects = [] } = CHARACTERS[gameId][ownerId];
    for (const [effectIndex, effect] of effects.entries()) {
      const { trigger, target } = effect;
      if (trigger !== actionTrigger) continue; // wrong trigger
      if (!validTargets.includes(target)) continue; // wrong target

      const { maxStacks = 1, duration, maxProcs } = effect;
      const effectKey = `${ownerId}-${effectIndex}`;
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

export function simulateRotation(gameId, rawTeam) {
  // remove null members
  const team = rawTeam.filter(member => member.memberId);

  // first build member contexts before calculating damage
  // this contains info on buffs applied before each member's rotation
  const memberContexts = {};
  for (const { memberId, build = {} } of team) {
    memberContexts[memberId] = {
      activeEffectMap: parseActiveEffects(gameId, memberId, team),
      statMap: compileStatMap(gameId, memberId, build, team, 'combat'),
    };
  }

  // now calculate the damage/healing/shielding produced by each action
  const actionMap = {};
  for (const { memberId, rotation } of team) {
    const context = memberContexts[memberId];
    const { activeEffectMap, statMap } = context;

    const { effects = [] } = CHARACTERS[gameId][memberId];
    for (const actionKey of rotation) {
      const [, skillId, actionId] = actionKey.split('-');
      const actionTrigger = `${skillId}-${actionId}`;

      // remove effects that expire before action occurs
      const { duration = 0, offset = 0 } = getSkill(gameId, actionKey);
      for (const [effectKey, effectEntry] of Object.entries(activeEffectMap)) {
        if (effectEntry.timeRemaining - offset <= 0) {
          delete activeEffectMap[effectKey];
        }
      }

      // add effects triggered by current action before computing damage
      for (const [effectIndex, effect] of effects.entries()) {
        const { trigger, target } = effect;
        if (trigger !== actionTrigger) continue; // wrong trigger
        if (target !== 'self' && target !== 'team') continue; // wrong target

        const { maxStacks = 1, duration, maxProcs } = effect;
        const effectKey = `${memberId}-${effectIndex}`;
        const currentStacks = activeEffectMap[effectKey]?.stacks ?? 0;

        // just refresh buff timer if already max stacks
        activeEffectMap[effectKey] = {
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
      const { considered } = getSkill(gameId, actionKey);
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
