import { MISC } from '@/data';

const STACK_MULTIPLIER = {
  'spectroFrazzle': [0.24, 0.4355, 0.6298, 0.8251, 1.02, 1.216, 1.409, 1.605, 1.8, 1.995],
  'aeroErosion': [0.36, 0.899, 1.799, 2.698, 3.597, 4.497],
};

export const buildStatusFootprint = (ctx, statusId, stacks) => {
  const { cache, state } = ctx;
  const status = MISC[cache.gameId].STATUSES[statusId];

  const enemyStatMap = {};

  for (const { stacks = 1, effect } of [
    ...(cache.passive.enemy ?? []).map((effect) => ({ effect })),
    ...Object.values(state.debuffs),
  ]) {
    const { chance = 1, statMap } = effect;
    if (!statMap) continue;

    for (const statId in statMap) {
      enemyStatMap[statId] ??= 0;
      enemyStatMap[statId] += statMap[statId] * stacks * chance;
    }
  }

  const baseDmg = 3674 * 1.25078 * (STACK_MULTIPLIER[statusId]?.[stacks - 1] ?? 0);
  const bonuses = 1 + (enemyStatMap[`${statusId}DmgAmp%`] ?? 0);

  const totalRes = 0.1 - (enemyStatMap[`${status.element}ResReduction%`] ?? 0);

  let resMult;
  if (totalRes < 0) {
    resMult = 1 - totalRes / 2;
  } else if (totalRes < 0.8) {
    resMult = 1 - totalRes;
  } else {
    resMult = 1 / (5 * totalRes + 1);
  }

  return {
    key: `other:${statusId}`,
    ownerId: 'other',
    type: 'damage',
    dmgType: 'status',
    fixed: baseDmg * bonuses * resMult,
  };
};

export function applyStatus(negativeStatuses, status, stacks) {
  const tracker = negativeStatuses[status.id];

  if (!tracker) {
    negativeStatuses[status.id] = {
      stacks: Math.min(stacks, status.maxStacks),
      tickTimer: status.tickInterval,
      duration: status.duration,
    };
  } else {
    tracker.stacks = Math.min(tracker.stacks + stacks, status.maxStacks);
    tracker.duration = status.duration;
  }
}
