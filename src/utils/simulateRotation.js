import { CHARACTERS, MVS, RATING } from '@/data';
import { compileStatMap, mergeStatMaps, getSkill } from '@/utils';

export function simulateAction(gameId, actionKey, statMap) {
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
  const adjustedStatMap = modifiers ? mergeStatMaps(statMap, modifiers) : statMap;
  
  const baseDmg = computeBase(adjustedStatMap, attr, multipliers);
  const bonuses = computeBonuses(adjustedStatMap, element, dmgTypes);
  const reductions = computeReductions(adjustedStatMap, element, dmgTypes);

  return { damage: baseDmg * bonuses * reductions };
}

function parseTeammateEffects(gameId, memberId, index, team) {
  const teammateOrder = [
    ...team.slice(index),
    ...team.slice(0, index),
  ].reverse();

  const fullActionOrder = teammateOrder.flatMap(member => member.rotation);

  let effectStatMap = {};
  for (const actionKey of fullActionOrder) {
    const [ownerId, skillId, actionId] = actionKey.split('-');
    if (ownerId === memberId) continue;

    const ownerEffects = CHARACTERS[gameId][ownerId].effects;
    if (!ownerEffects) continue;

    const validTargets = [
      'team',
      'ally',
      ...(index === 0 ? ['first'] : []),
      ...(team.findIndex(m => m.memberId === ownerId) === (1 + index) ? ['next'] : []),
      ...((team.findIndex(m => m.memberId === ownerId) === 0) && (index === team.length - 1) ? ['next'] : []),
    ];

    for (const effect of ownerEffects) {
      if (effect.trigger !== `${skillId}-${actionId}`) continue;
      if (!validTargets.includes(effect.target)) continue;

      effectStatMap = mergeStatMaps(effectStatMap, effect.statMap);
    }
  }
  return effectStatMap;
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
    const effectStatMap = parseTeammateEffects(gameId, memberId, index, team);
    const statMap = compileStatMap(gameId, memberId, build, team, 'combat');

    const mergedMap = mergeStatMaps(statMap, effectStatMap);
    for (const actionKey of rotation) {
      const [ownerId, skillId, actionId] = actionKey.split('-');
      if (ownerId !== memberId) continue;

      for (const effect of memberEffects) {
        if (effect.trigger !== `${skillId}-${actionId}`) continue;
        if (!['self', 'team'].includes(effect.target)) continue;

        for (const [effStatId, effStatValue] of Object.entries(effect.statMap)) {
          mergedMap[effStatId] = (mergedMap[effStatId] ?? 0) + effStatValue;
        }
      }
  
      const { damage = 0, healing = 0 } = simulateAction(gameId, actionKey, mergedMap);
      actionMap[actionKey] = {
        damage: (actionMap[actionKey]?.damage ?? 0) + damage,
        healing: (actionMap[actionKey]?.healing ?? 0) + healing,
      };
    }
  }

  return actionMap;
}
