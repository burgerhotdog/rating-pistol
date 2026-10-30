import { CHARACTER, WW } from '@/data';
import { getTotals } from '@/utils';
import { runRotation } from '../rotation';
import { computeDuration } from '../duration';

function getPermutations(arr) {
  if (arr.length <= 1) return [arr];

  return arr.flatMap((id, i) =>
    getPermutations(arr.filter((_, j) => i !== j))
      .map((rest) => [id, ...rest])
  );
}

function testOrder(cache, equipMaps, order) {
  const testCache = {
    ...cache,
    ...(order.length === 5 ? {
      rotationOrder: order,
    } : {
      memberIds: order,
    }),
  };

  const { snapshots, bonusEnergy } = runRotation(testCache, equipMaps);
  const totals = getTotals(snapshots);
  const { time, source } = computeDuration(testCache, equipMaps, bonusEnergy);
  const dps = totals.damage / time * 1000;

  return {
    rotationOrder: order,
    snapshots,
    bonusEnergy,
    time,
    source,
    dps,
  };
}

function getTestOrders(gameId, memberIds) {
  const [first, ...rest] = memberIds;

  if (
    gameId === WW &&
    CHARACTER[WW][first].unison &&
    memberIds.length === 3
  ) {
    const [a, b, c] = memberIds;
    return [[a, b, a, b, c]];
  }

  const permutations = getPermutations(rest);
  return permutations.map((perm) => [first, ...perm]);
}

export function getRotationOrder(cache, equipMaps) {
  let bestResults = { dps: 0 };

  const testOrders = getTestOrders(cache.gameId, cache.memberIds);

  for (const order of testOrders) {
    const testResults = testOrder(cache, equipMaps, order);

    if (testResults.dps > bestResults.dps) {
      bestResults = testResults;
    }
  }

  return bestResults;
}
