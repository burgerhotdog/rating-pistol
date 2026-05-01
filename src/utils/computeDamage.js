import { RATING, MISC } from '@/data';
import { getSkill } from '@/utils';

function rotateFromIdReverse(team, startId) {
  const index = team.findIndex(m => m?.memberId === startId);

  if (index === -1) {
    throw new Error("startId not found in team");
  }

  return [
    team[index],
    ...team.slice(0, index).reverse(),
    ...team.slice(index + 1).reverse(),
  ];
}

export function computeDamage(gameId, characterId, build, team) {
  const rotation = rotateFromIdReverse(team, characterId).flatMap(({ memberId, rotation }) => {
    return rotation.map(step => {
      if (step.includes('_')) return step;
      return `${step}_${memberId}`;
    });
  });
  return RATING[gameId].computeDamage(characterId, build, rotation, team);
}

export function computeDamageBreakdown(gameId, characterId, build, team) {
  if (!build) return [];

  const rotation = rotateFromIdReverse(team, characterId).flatMap(({ memberId, rotation }) => {
    return rotation.map(step => {
      if (step.includes('_')) return step;
      return `${step}_${memberId}`;
    });
  });

  const grouped = {};
  for (const step of rotation) {
    const damage = RATING[gameId].computeDamage(characterId, build, [step], team);
    const { considered } = getSkill(gameId, step);
    grouped[considered] = (grouped[considered] ?? 0) + damage;
  }

  return Object.entries(grouped)
    .map(([abilityId, value]) => ({ name: MISC[gameId].ABILITY_TYPES[abilityId], value }))
    .sort((a, b) => b.value - a.value);
}
