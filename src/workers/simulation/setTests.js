import { CHARACTER, ECHO, SET, WW } from '@/data';
import { appliesToCharId, isEnabledEcho, isEnabledSet, isStaticBuff, toMergedObj } from '@/utils';
import { normAction } from './cache/actions';
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

function getNormalizedEchoEffects(gameId, ownerId, echoId, memberIds, weaponRank) {
  const charData = CHARACTER[gameId][ownerId];
  const rawEffects = ECHO[echoId]?.effects ?? [];
  const sharedNormCtx = { gameId, ownerId, sourceId: echoId, sourceType: 'echo', memberIds, weaponRank };

  const normalized = {};
  for (const [index, rawEffect] of rawEffects.entries()) {
    if (!isEnabledEcho(rawEffect, charData)) continue;

    const normCtx = { ...sharedNormCtx, index };
    const effect = normEffect(normCtx, rawEffect);
    normalized[effect.id] = effect;
  }

  return resolveEffectTokens(normalized);
}

function buildEchoAction(gameId, echoId, ownerId, teamSize) {
  const rawAction = ECHO[echoId]?.action;
  if (!rawAction) return undefined;
  return normAction(gameId, rawAction, { ownerId, category: 'echoSkill', index: 0, teamSize });
}

// Mirrors the main echo insertion timing in compileCache's getConvertedRotation
function withEchoAction(rotation, echoAction, timing) {
  if (!echoAction) return rotation;

  const result = [...rotation];
  let insertAtIndex = result.length;
  if (timing === 'start') {
    insertAtIndex = result[0]?.type === 'introSkill' ? 1 : 0;
  } else if (result.at(-1)?.type === 'outroSkill') {
    insertAtIndex = -1;
  }
  result.splice(insertAtIndex, 0, echoAction);
  return result;
}

// Candidate main echoes must belong to one of the sets under test in this pass, and have a usable skill
function getEchoCandidates(gameId, testSetIds) {
  if (gameId !== WW || !testSetIds.length) return [];
  const includesSet32 = testSetIds.includes(32);
  return Object.values(ECHO).filter((echo) => {
    if (!echo.action && !echo.effects?.length) return false;
    if (!echo.sets.some((setId) => testSetIds.includes(setId))) return false;

    // Exception: when set 32 is part of this test, disallow 4-cost echoes
    // that come from any of the *other* sets being tested (i.e. not set 32 itself)
    if (includesSet32 && echo.cost === 4 && !echo.sets.includes(32)) {
      return false;
    }

    return true;
  });
}

export function setTests(cache, equipMaps, charId) {
  const gameId = cache.gameId;
  const mCache = cache.member[charId];

  const nonSetEffects = Object.fromEntries(
    Object.entries(cache.effects)
      .filter(([, effect]) => !(
        effect.ownerId === charId &&
        (mCache.setCounts[effect.sourceId] || effect.sourceId === mCache.mainEcho)
      ))
  );

  // Rotation with the member's actual main echo skill stripped out, so each test can insert its own
  const baseRotation = mCache.rotation.filter(
    (action) => !(action.type === 'echoSkill' && action.ownerId === charId)
  );

  const setDatasList = Object.values(SET[gameId]);
  const setsByTier = {};
  for (let tier = 1; tier <= TOTAL_SLOTS; tier++) {
    setsByTier[tier] = setDatasList
      .filter((setData) => setData.bonuses.includes(tier))
      .map((setData) => setData.id);
  }

  const results = {};

  const runTest = (effectSources, { testEcho = true } = {}) => {
    const setEffects = getNormalizedSetEffects(effectSources, gameId, charId, cache.memberIds);
    const testSetIds = testEcho ? effectSources.map(({ sourceId }) => sourceId) : [];
    const echoCandidates = getEchoCandidates(gameId, testSetIds);

    const runWithEcho = (echoId) => {
      const echoEffects = echoId != null
        ? getNormalizedEchoEffects(gameId, charId, echoId, cache.memberIds, mCache.weaponRank)
        : {};
      const effects = { ...nonSetEffects, ...setEffects, ...echoEffects };
 
      const staticBuffMaps = Object.values(effects)
        .filter((effect) => effect.ownerId === charId && isStaticBuff(effect) && appliesToCharId(effect, charId))
        .map((effect) => effect.buff.stats);
      const testStatMap = toMergedObj(mCache.baseMap, mCache.equipMap, ...staticBuffMaps);

      const echoAction = echoId != null ? buildEchoAction(gameId, echoId, charId, cache.teamSize) : undefined;
      const rotation = withEchoAction(baseRotation, echoAction, ECHO[echoId]?.timing);
 
      return runVariantDps(cache, equipMaps, charId, {
        effects,
        sourceStatMap: mCache.menuMap,
        testStatMap,
        memberOverride: { rotation },
      });
    };

    if (!echoCandidates.length) return { dps: runWithEcho(null), echoId: null };

    let best = { dps: -Infinity, echoId: null };
    for (const echo of echoCandidates) {
      const dps = runWithEcho(echo.id);
      if (dps > best.dps) best = { dps, echoId: echo.id };
    }
    return best;
  };

  const buildId = (assignment) =>
    assignment.map(({ setId, size }) => `${setId}_${size}`).join('+');

  const withEchoKey = (key, echoId) => (echoId != null ? `${key}|${echoId}` : key);

  // Pass 1: find which sets are worth combining, ignoring main echo so a lucky echo match can't prop up a dead set
  const { dps: baselineDps } = runTest([], { testEcho: false });
  const soloNoEchoDps = {};
  const soloPositive = {};

  for (let tier = 1; tier <= TOTAL_SLOTS; tier++) {
    const positiveSets = new Set();
 
    for (const setId of setsByTier[tier]) {
      const setData = SET[gameId][setId];

      const { dps } = runTest([{
        rawEffects: setData.effects,
        pieceCount: tier,
        sourceId: setId,
      }], { testEcho: false });

      let prevTier = 1;
      let prevTierDps = baselineDps;
      while (prevTier < tier) {
        const prevComboKey = `${setId}_${prevTier}`;
        if (soloNoEchoDps[prevComboKey] && soloNoEchoDps[prevComboKey] > prevTierDps) {
          prevTierDps = soloNoEchoDps[prevComboKey];
        }
        prevTier++;
      }

      if (dps > prevTierDps) {
        soloNoEchoDps[`${setId}_${tier}`] = dps;
        positiveSets.add(setId);
      }
    }
 
    soloPositive[tier] = positiveSets;
  }

  // Pass 2: build the actual results, with main echo candidates tested
  results.none = baselineDps;

  for (let tier = 1; tier <= TOTAL_SLOTS; tier++) {
    for (const setId of soloPositive[tier]) {
      const setData = SET[gameId][setId];
      const { dps, echoId } = runTest([{
        rawEffects: setData.effects,
        pieceCount: tier,
        sourceId: setId,
      }]);
      results[withEchoKey(`${setId}_${tier}`, echoId)] = dps;
    }
  }

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
 
      const { dps, echoId } = runTest(effectSources);
      results[withEchoKey(buildId(assignment), echoId)] = dps;
    }
  }
 
  return results;
}
