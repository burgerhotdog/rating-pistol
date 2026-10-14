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
  const testCache = { ...cache, memberIds: order };

  const { snapshots, bonusEnergy } = runRotation(testCache, equipMaps);
  const totals = getTotals(snapshots);
  const { time, source } = computeDuration(testCache, equipMaps, bonusEnergy);
  const dps = totals.damage / time * 1000;

  return {
    order,
    snapshots,
    bonusEnergy,
    time,
    source,
    dps,
  };
}

export function getRotationOrder(cache, equipMaps) {
  const [first, ...rest] = cache.memberIds;
  let bestResults = { dps: 0 };

  for (const permutation of getPermutations(rest)) {
    const order = [first, ...permutation];
    const testResults = testOrder(cache, equipMaps, order);

    if (testResults.dps > bestResults.dps) {
      bestResults = testResults;
    }
  }

  return bestResults;
}
