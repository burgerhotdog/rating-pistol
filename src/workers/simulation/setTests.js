import { CHARACTER, SET } from '@/data';
import { appliesToCharId, isEnabledSet, isStaticBuff, toMergedObj } from '@/utils';
import { normEffect, resolveEffectTokens } from './cache/effects';
import { runVariantDps } from './variantDps';

const TOTAL_SLOTS = 5;

// All integer partitions of n, parts in non-increasing order.
// partitionsOf(5) => [[5], [4, 1], [3, 2], [3, 1, 1], [2, 2, 1], [2, 1, 1, 1], [1, 1, 1, 1, 1]]
function partitionsOf(n, maxPart = n) {
  if (n === 0) return [[]];
 
  const results = [];
  for (let k = Math.min(n, maxPart); k >= 1; k--) {
    for (const rest of partitionsOf(n - k, k)) {
      results.push([k, ...rest]);
    }
  }
  return results;
}

function combinations(arr, k) {
  const results = [];
  const combo = [];
 
  function backtrack(start) {
    if (combo.length === k) {
      results.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      backtrack(i + 1);
      combo.pop();
    }
  }
 
  backtrack(0);
  return results;
}

function toSizeGroups(partition) {
  const counts = new Map();
  for (const size of partition) {
    counts.set(size, (counts.get(size) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.size - a.size);
}

function assignPartition(groups, candidatesBySize) {
  const results = [];
 
  function recurse(groupIdx, used, chosen) {
    if (groupIdx === groups.length) {
      results.push(chosen);
      return;
    }
 
    const { size, count } = groups[groupIdx];
    const candidates = candidatesBySize(size).filter((setId) => !used.has(setId));
 
    for (const combo of combinations(candidates, count)) {
      const newUsed = new Set(used);
      combo.forEach((id) => newUsed.add(id));
 
      recurse(
        groupIdx + 1,
        newUsed,
        [...chosen, ...combo.map((setId) => ({ size, setId }))]
      );
    }
  }
 
  recurse(0, new Set(), []);
  return results;
}

function getNormalizedSetEffects(effectSources, gameId, ownerId, memberIds) {
  const charData = CHARACTER[gameId][ownerId];
  const normalized = {};

  for (const { rawEffects, pieceCount, sourceId } of effectSources) {
    const sharedNormCtx = { gameId, ownerId, sourceId, sourceType: 'set', memberIds };

    for (const [index, rawEffect] of rawEffects.entries()) {
      if (!isEnabledSet(rawEffect, pieceCount, charData)) continue;

      const normCtx = { ...sharedNormCtx, index };
      const effect = normEffect(normCtx, rawEffect);
      normalized[effect.id] = effect;
    }
  }

  return resolveEffectTokens(normalized);
}

export function setTests(cache, equipMaps, charId) {
  const gameId = cache.gameId;
  const mCache = cache.member[charId];

  const nonSetEffects = Object.fromEntries(
    Object.entries(cache.effects)
      .filter(([, effect]) => !mCache.setCounts[effect.sourceId])
  );

  const setDatasList = Object.values(SET[gameId]);
  const setsByTier = {};
  for (let tier = 1; tier <= TOTAL_SLOTS; tier++) {
    setsByTier[tier] = setDatasList
      .filter((setData) => setData.bonuses.includes(tier))
      .map((setData) => setData.id);
  }

  const results = {};

  const runTest = (testId, effectSources) => {
    const setEffects = getNormalizedSetEffects(effectSources, gameId, charId, cache.memberIds);
    const effects = { ...nonSetEffects, ...setEffects };
 
    const staticBuffMaps = Object.values(effects)
      .filter((effect) => effect.ownerId === charId && isStaticBuff(effect) && appliesToCharId(effect, charId))
      .map((effect) => effect.buff.stats);
    const testStatMap = toMergedObj(mCache.baseMap, mCache.equipMap, ...staticBuffMaps);
 
    const result = runVariantDps(cache, equipMaps, charId, {
      effects,
      sourceStatMap: mCache.menuMap,
      testStatMap,
    });
 
    results[testId] = result;
    return result;
  };

  const buildId = (assignment) =>
    assignment.map(({ setId, size }) => `${setId}_${size}`).join('+');

  // Pass 1
  const baselineDps = runTest('none', []);
  const soloPositive = {};

  for (let tier = 1; tier <= TOTAL_SLOTS; tier++) {
    const positiveSets = new Set();
 
    for (const setId of setsByTier[tier]) {
      const setData = SET[gameId][setId];

      const result = runTest(`${setId}_${tier}`, [
        { rawEffects: setData.effects, pieceCount: tier, sourceId: setId },
      ]);
 
      if (result > baselineDps) {
        positiveSets.add(setId);
      }
    }
 
    soloPositive[tier] = positiveSets;
  }

  // Pass 2
  const candidatesBySize = (size) => [...soloPositive[size]];

  const combinablePartitions = partitionsOf(TOTAL_SLOTS)
    .filter((partition) => partition.length > 1);

  for (const partition of combinablePartitions) {
    const groups = toSizeGroups(partition);
    const assignments = assignPartition(groups, candidatesBySize);
 
    for (const assignment of assignments) {
      const effectSources = assignment.map(({ size, setId }) => ({
        rawEffects: SET[gameId][setId].effects,
        pieceCount: size,
        sourceId: setId,
      }));
 
      runTest(buildId(assignment), effectSources);
    }
  }
 
  return results;
}
