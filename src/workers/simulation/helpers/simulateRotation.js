import { CHARACTERS, RATING } from '@/data';
import { compileStatMap, mergeStatMaps, getSkill } from '@/utils';

function simulateAction(gameId, actionKey, statMap, activeEffectMap) {
  const [characterId, skillId, actionId] = actionKey.split('-');
  const { element } = CHARACTERS[gameId][characterId];
  const { computeBase, computeBonuses, computeReductions } = RATING[gameId];
  const {
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
  const effectStatMap = Object.entries(activeEffectMap).map(([effectKey, stacks]) => {
    const [ownerId, ei] = effectKey.split('-');
    const { statMap = {} } = CHARACTERS[gameId][ownerId].effects[ei];
    return Object.fromEntries(Object.entries(statMap).map(([statId, statValue]) => ([statId, statValue * stacks])));
  }).reduce((acc, statMap) => mergeStatMaps(acc, statMap), {});
  const statMapWithEffects = mergeStatMaps(statMap, effectStatMap);
  const adjustedStatMap = modifiers ? mergeStatMaps(statMapWithEffects, modifiers) : statMapWithEffects;
  
  const baseDmg = computeBase(adjustedStatMap, attr, multipliers);
  const bonuses = computeBonuses(adjustedStatMap, element, dmgTypes);
  const reductions = computeReductions(adjustedStatMap, element, dmgTypes);

  return { damage: baseDmg * bonuses * reductions };
}

function parseTeammateEffects(gameId, memberId, index, team) {
  const teammateOrder = [
    ...team.slice(index),
    ...team.slice(0, index),
  ].slice(1).reverse();

  const fullActionOrder = teammateOrder.flatMap(member => member.rotation);

  const activeEffects = {};
  for (const actionKey of fullActionOrder) {
    const [ownerId, skillId, actionId] = actionKey.split('-');
    if (ownerId === memberId) continue;

    const validTargets = [
      'team',
      'ally',
      ...(index === 0 ? ['first'] : []),
      ...(team.findIndex(m => m.memberId === ownerId) === (1 + index) ? ['next'] : []),
      ...((team.findIndex(m => m.memberId === ownerId) === 0) && (index === team.length - 1) ? ['next'] : []),
    ];

    const { effects = [] } = CHARACTERS[gameId][ownerId];
    for (const [ei, { trigger, target, maxStacks = 1 }] of effects.entries()) {
      if (trigger !== `${skillId}-${actionId}`) continue; // effect wasn't triggered by this action
      if (!validTargets.includes(target)) continue; // effect doesn't apply to this target

      const effectKey = `${ownerId}-${ei}`;
      const activeStacks = activeEffects[effectKey] ?? 0;
      if (activeStacks < maxStacks) {
        activeEffects[effectKey] = activeStacks + 1;
      }
    }
  }
  return activeEffects;
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

export function simulateRotation(gameId, team) {
  const actionMap = {};

  for (const [index, member] of team.entries()) {
    const { memberId, build = {}, rotation } = member;
    if (!memberId) continue;

    const memberEffects = CHARACTERS[gameId][memberId].effects ?? [];
    const activeEffectMap = parseTeammateEffects(gameId, memberId, index, team);
    const statMap = compileStatMap(gameId, memberId, build, team, 'combat');

    for (const actionKey of rotation) {
      const [ownerId, skillId, actionId] = actionKey.split('-');
      if (ownerId !== memberId) continue;

      for (const [ei, { trigger, target, maxStacks = 1 }] of memberEffects.entries()) {
        if (trigger !== `${skillId}-${actionId}`) continue;
        if (!['self', 'team'].includes(target)) continue;

        const effectKey = `${memberId}-${ei}`;
        const activeStacks = activeEffectMap[effectKey] ?? 0;
        if (activeStacks < maxStacks) {
          activeEffectMap[effectKey] = activeStacks + 1;
        }
      }
  
      const { damage = 0, healing = 0 } = simulateAction(gameId, actionKey, statMap, activeEffectMap);
      actionMap[actionKey] = {
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };
    }
  }

  return actionMap;
}
