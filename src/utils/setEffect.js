import { SETS } from '@/lookups';

export function getSetCounts(equipList) {
  return equipList.reduce((acc, equip) => {
    const setId = equip?.setId;
    acc[setId] = (acc[setId] ?? 0) + 1;
    return acc;
  }, {});
}

export function getSetEffects(setCounts, gameId) {
  const effectsPerSet = Object.entries(setCounts).flatMap(([setId, activePieces]) => {
    const definition = SETS[gameId][setId]?.EFFECT;
    if (!definition) return {}; // unknown set, skip

    const activeEffects = Object.entries(definition)
      .filter(([number]) => activePieces >= Number(number))
      .map(([, { FIXED_STATS }]) => FIXED_STATS);

    if (activeEffects.length === 0) return {};

    return activeEffects.reduce((acc, FIXED_STATS) => {
      const statsList = Object.entries(FIXED_STATS);
      for (const [statId, statValue] of statsList) {
        acc[statId] = (acc[statId] ?? 0) + statValue;
      }
      return acc;
    }, {});
  });

  // combine
  return effectsPerSet.reduce((acc, effects) => {
    for (const [statId, statValue] of Object.entries(effects)) {
      acc[statId] = (acc[statId] ?? 0) + statValue;
    }
    return acc;
  }, {});
}
