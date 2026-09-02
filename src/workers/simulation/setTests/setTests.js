import { CHARACTER, ECHO, SET, WW } from '@/data';
import { appliesToCharId, isEnabledEcho, isEnabledSet, isStaticBuff, toMergedObj } from '@/utils';
import { normAction } from '../cache/actions';
import { normEffect, resolveEffectTokens } from '../cache/effects';
import { runVariantDps } from '../variantDps';

import { buildUsefulSetBonuses } from './buildUsefulSetBonuses';

const TOTAL_SLOTS = 5;

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

function assignPartition(groups, usefulSetBonuses) {
  const results = [];
 
  function recurse(groupIdx, used, chosen) {
    if (groupIdx === groups.length) {
      results.push(chosen);
      return;
    }
 
    const { size, count } = groups[groupIdx];
    const candidates = [...usefulSetBonuses[size]]
      .filter((setId) => !used.has(setId));
 
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
        (
          mCache.setCounts[effect.sourceId] ||
          effect.sourceId === mCache.mainEcho
        )
      ))
  );

  const nonEchoRotation = mCache.rotation
    .filter((action) =>
      action.type !== 'echoSkill' ||
      action.ownerId !== charId
    );

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
      const rotation = withEchoAction(nonEchoRotation, echoAction, ECHO[echoId]?.timing);
 
      return runVariantDps(cache, equipMaps, charId, {
        effects,
        sourceStatMap: mCache.menuMap,
        testStatMap,
        memberOverride: { rotation },
      });
    };

    if (!echoCandidates.length) {
      return { dps: runWithEcho(null), echoId: null };
    }

    let best = { dps: -Infinity, echoId: null };

    for (const echo of echoCandidates) {
      const dps = runWithEcho(echo.id);
      if (dps > best.dps) {
        best = { dps, echoId: echo.id };
      }
    }

    return best;
  };

  // Pass 1: Find which sets are worth combining, ignoring main echo so a lucky echo match can't prop up a dead set
  const { dps: baselineDps } = runTest([], { testEcho: false });
  const usefulSetBonuses = buildUsefulSetBonuses(gameId, TOTAL_SLOTS, baselineDps, runTest);

  // Pass 2: build the actual results, with main echo candidates tested
  const results = {};
  results.none = baselineDps;

  const PASS_2_TYPES = [[5], [3, 2], [2, 2, 1]];

  for (const sizes of PASS_2_TYPES) {
    const assignments = assignPartition(toSizeGroups(sizes), usefulSetBonuses);
    const seen2pc = new Set();

    for (const assignment of assignments) {
      if (sizes.includes(2)) {
        const key = get2pcKey(gameId, assignment);

        if (seen2pc.has(key)) continue;
        seen2pc.add(key);
      }

      const effectSources = assignment.map(({ size, setId }) => ({
        rawEffects: SET[gameId][setId].effects,
        pieceCount: size,
        sourceId: setId,
      }));

      const { dps, echoId } = runTest(effectSources);
      const key = assignment.map(({ setId, size }) => `${setId}_${size}`).join('+');
      const keyWithEcho = echoId != null ? `${key}|${echoId}` : key;

      results[keyWithEcho] = dps;
    }
  }

  return results;
}

function get2pcKey(gameId, assignment) {
  return assignment
    .filter(({ size }) => size === 2)
    .map(({ setId }) => SET[gameId][setId].halfStat)
    .sort()
    .join('|');
}