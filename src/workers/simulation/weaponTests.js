import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON } from '@/data';
import { getAttr, getTotals, compileBaseMap, toMergedObj } from '@/utils';
import { runRotation } from './rotation';
import { toNormalizedEffect } from './cache/effects';

function getNormalizedWeaponEffects(rawEffects, gameId, ownerId, sourceId, weaponRank, memberIds) {
  const normalized = {};

  for (const [index, rawEffect] of rawEffects.entries()) {
    const effect = toNormalizedEffect(rawEffect, {
      gameId,
      ownerId,
      sourceId,
      effectIndex: index,
      weaponRank,
      memberIds,
    });

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

function getModifiedCache(cache, charId, weapon, weaponRank) {
  const moddedCache = { ...cache };

  const baseMap = compileBaseMap(cache.gameId, charId, weapon.id);
  const equipMap = cache.member[charId].equipMap;
  const statMap = toMergedObj(baseMap, equipMap);

  moddedCache.member = {
    ...cache.member,
    [charId]: {
      ...cache.member[charId],
      baseMap,
      statMap,
    },
  };

  const weaponEffects = getNormalizedWeaponEffects(weapon.effects, cache.gameId, charId, weapon.id, weaponRank, cache.memberIds);
  const moddedEffects = { ...weaponEffects };
  for (const effect of Object.values(cache.effects)) {
    if (effect.sourceId !== cache.member[charId].weaponId) {
      moddedEffects[effect.id] = effect;
    }
  }

  moddedCache.effects = moddedEffects;

  return moddedCache;
}

const ENERGY_ATTR = {
  [GI]: 'energyRecharge%',
  [HSR]: 'energyRegenerationRate%',
  [WW]: 'energyRegen%',
  [ZZZ]: 'energyRegen%',
};

export function weaponTests(cache, equipMaps, charId) {
  // er penalty
  const energyAttr = ENERGY_ATTR[cache.gameId];
  const mCache = cache.member[charId];

  const energyReq = getAttr(energyAttr, mCache.statMap);

  function getPenalty(testStatMap) {
    if (!mCache.energy) return 1;

    const testEnergy = getAttr(energyAttr, testStatMap);
    if (testEnergy >= energyReq) return 1;

    const testCharDuration = mCache.duration * (energyReq / testEnergy);
    const addedTime = testCharDuration - mCache.duration;
    return cache.rotationDuration / (cache.rotationDuration + addedTime);
  }

  // weapons to test
  const allowedWeaponType = CHARACTER[cache.gameId][charId].type;
  const weaponsToTest = Object.values(WEAPON[cache.gameId])
    .filter((weapon) => weapon.type === allowedWeaponType);

  const weaponResults = {};

  for (const weapon of weaponsToTest) {
    // R1
    const moddedCacheR1 = getModifiedCache(cache, charId, weapon, 1);
    const testSummaryR1 = runRotation(moddedCacheR1, equipMaps);
    const rawDpsR1 = getTotals(testSummaryR1).damage / cache.rotationDuration * 1000
    const dpsR1 = rawDpsR1 * getPenalty(moddedCacheR1.member[charId].statMap);

    // R5
    const moddedCacheR5 = getModifiedCache(cache, charId, weapon, 5);
    const testSummaryR5 = runRotation(moddedCacheR5, equipMaps);
    const rawDpsR5 = getTotals(testSummaryR5).damage / cache.rotationDuration * 1000
    const dpsR5 = rawDpsR5 * getPenalty(moddedCacheR5.member[charId].statMap);

    weaponResults[weapon.id] = [dpsR1, dpsR5];
  }

  return weaponResults;
}
