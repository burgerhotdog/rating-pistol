import { MISC } from '@/data';

const LEVEL_MODIFIER = 3674;

const STATUS_MVS = {
  'spectroFrazzle': [3000, 5439, 7878, 10317, 12756, 15195, 17634, 20073, 22512, 24951, 33268, 41585, 49902],
  'aeroErosion': [4500, 11250, 22500, 33750, 45000, 56250, 67500, 78750, 90000, 101250, 112500, 123750],
  'fusionBurst': [8400, 15229, 22058, 28888, 35717, 42546, 49375, 56204, 63034, 69863, 93150, 116438, 139726],
  'electroFlare': [5000, 9065, 13130, 17195, 21260, 25325, 29390, 33455, 37520, 41585, 55447, 69308, 83170],
  'glacioChafe': [2450, 4442, 6434, 8426, 10417, 12409, 14401, 16393, 18385, 20377, 27169, 33961, 40753],
};

export const buildStatusFootprint = (ctx, statusId, stacks) => {
  const { helpers, cache, state } = ctx;
  const { getResMult, getDefMult } = helpers;
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

  const baseDmg = LEVEL_MODIFIER * (STATUS_MVS[statusId]?.[stacks - 1] ?? 0);
  const bonuses = 1 + (enemyStatMap[`${statusId}DmgAmp%`] ?? 0);

  const resMult = getResMult(status.element, enemyStatMap);
  const defMult = getDefMult(enemyStatMap);

  return {
    key: `other:${statusId}`,
    ownerId: 'other',
    type: 'damage',
    dmgType: 'status',
    fixed: baseDmg * bonuses * resMult * defMult,
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
