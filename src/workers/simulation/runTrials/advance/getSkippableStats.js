import { MAINSTAT, SUBSTAT } from '@/data';

function getUselessStats(options, baseScore, evaluateEquipMap) {
  const entries = Object.entries(options);
  const useless = [];

  for (const [stat, { value }] of entries) {
    const { score } = evaluateEquipMap({ [stat]: value });
    if (score <= baseScore) useless.push(stat);
  }

  if (useless.length === entries.length) return [];
  return useless;
}

function getSkippableMainstats(gameId, baseScore, evaluateEquipMap) {
  const skippableMainstats = {};
  for (const [key, mainstats] of Object.entries(MAINSTAT[gameId])) {
    const uselessStats = getUselessStats(mainstats, baseScore, evaluateEquipMap);
    if (uselessStats.length === Object.keys(mainstats).length) {
      skippableMainstats[key] = new Set();
    } else {
      skippableMainstats[key] = new Set(uselessStats);
    }
  }
  return skippableMainstats;
}

function getSkippableSubstats(gameId, baseScore, evaluateEquipMap) {
  const substats = SUBSTAT[gameId];
  const uselessStats = getUselessStats(substats, baseScore, evaluateEquipMap);
  if (uselessStats.length === Object.keys(substats).length) {
    return new Set();
  } else {
    return new Set(uselessStats);
  }
}

export const getSkippableStats = (gameId, baseScore, evaluateEquipMap) => ({
  mainstats: getSkippableMainstats(gameId, baseScore, evaluateEquipMap),
  substats: getSkippableSubstats(gameId, baseScore, evaluateEquipMap),
});
