import { CHARACTER, SET, MISC } from '@/data';
import { getAttr, getTotals, isEnabledSet } from '@/utils';
import { runRotation } from './rotation';
import { normEffect } from './cache/effects';

function getNormalizedSetEffects(rawEffects, gameId, ownerId, sourceId, memberIds) {
  const normalized = {};
  const sharedNormCtx = {
    gameId,
    ownerId,
    sourceId,
    sourceType: 'set',
    memberIds,
  };

  const charData = CHARACTER[gameId][ownerId];
  for (const [index, rawEffect] of rawEffects.entries()) {
    if (!isEnabledSet(rawEffect, 5, charData)) continue;

    const normCtx = { ...sharedNormCtx, index };
    const effect = normEffect(normCtx, rawEffect);
    normalized[effect.id] = effect;
  }

  // Resolve tokens
  const resolveEffectId = (key, sourceId) =>
    key.includes(':')
      ? key
      : Object.values(normalized)
        .filter((effect) => effect.sourceId === sourceId)
        .find((effect) => effect.key === key).id;

  function walkBooleanTree(node, onLeaf) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('and' in node) {
      node.and.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('or' in node) {
      node.or.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('not' in node) {
      walkBooleanTree(node.not, onLeaf);
      return;
    }
    onLeaf(node);
  }

  function traverseFilter(node, sourceId) {
    walkBooleanTree(node, (leaf) => {
      if ('has' in leaf) return; // generic has (e.g. action.has) - not an effect reference

      const [key, value] = Object.entries(leaf)[0];
      if (key === 'effectStacks') {
        resolveEffectStacksKeys(value, sourceId);
        return;
      }
      traverseFilter(value, sourceId);
    });
  }

  function resolveEffectStacksKeys(value, sourceId) {
    walkBooleanTree(value, (leaf) => {
      if ('has' in leaf) {
        if (Array.isArray(leaf.has)) {
          leaf.has = leaf.has.map((key) => resolveEffectId(key, sourceId));
        } else if (leaf.has !== '*') {
          leaf.has = resolveEffectId(leaf.has, sourceId);
        }
        return;
      }

      // remaining keys are effect ids being compared (stacks thresholds etc.)
      for (const key of Object.keys(leaf)) {
        const comparison = leaf[key];
        delete leaf[key];
        leaf[resolveEffectId(key, sourceId)] = comparison;
      }
    });
  }

  for (const effect of Object.values(normalized)) {
    const { sourceId } = effect;

    for (const field in effect) {
      if (/^on[A-Z]\w*Do[A-Z]\w*$/.test(field)) {
        const resolved = {};
        for (const [key, stacks] of Object.entries(effect[field])) {
          const id = resolveEffectId(key, sourceId);
          resolved[id] = stacks;
        }
        effect[field] = resolved;
      }
    }

    if (effect.apply?.filter) {
      traverseFilter(effect.apply.filter, sourceId);
    }

    if (effect.remove?.filter) {
      traverseFilter(effect.remove.filter, sourceId);
    }

    if (effect.use?.filter) {
      traverseFilter(effect.use.filter, sourceId);
    }

    if (effect.buff?.filter) {
      traverseFilter(effect.buff.filter, sourceId);
    }
  }


  return normalized;
}

function getModifiedCache(cache, charId, setData) {
  const moddedCache = { ...cache };

  const setEffects = getNormalizedSetEffects(setData.effects, cache.gameId, charId, setData.id, cache.memberIds);
  const moddedEffects = { ...setEffects };
  for (const effect of Object.values(cache.effects)) {
    if (!cache.member[charId].setCounts[effect.sourceId]) {
      moddedEffects[effect.id] = effect;
    }
  }

  moddedCache.effects = moddedEffects;

  return moddedCache;
}

export function setTests(cache, equipMaps, charId) {
  // er penalty
  const { energyAttr } = MISC[cache.gameId];
  const mCache = cache.member[charId];

  const energyReq = getAttr(energyAttr, mCache.menuMap);

  function getPenalty(testMenuMap) {
    if (!mCache.energy) return 1;

    const testEnergy = getAttr(energyAttr, testMenuMap);
    if (testEnergy >= energyReq) return 1;

    const testCharDuration = mCache.duration * (energyReq / testEnergy);
    const addedTime = testCharDuration - mCache.duration;
    return cache.rotationDuration / (cache.rotationDuration + addedTime);
  }

  // sets to test
  const setsToTest =
    Object.values(SET[cache.gameId])
      .filter((setData) => setData.bonuses.includes(5));

  const setResults = {};

  for (const setData of setsToTest) {
    const moddedCache = getModifiedCache(cache, charId, setData);
    const concertoExtraTime = moddedCache.member[charId].concertoPenalty
      ? ((100 / 92) * moddedCache.member[charId].duration - moddedCache.member[charId].duration)
      : 0;
    const testSnapshots = runRotation(moddedCache, equipMaps);
    const rawDps = getTotals(testSnapshots).damage / (cache.rotationDuration + concertoExtraTime) * 1000;
    const dps = rawDps * getPenalty(moddedCache.member[charId].menuMap);

    setResults[setData.id] = dps;
  }

  return setResults;
}
