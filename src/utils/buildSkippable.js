import { MAINSTAT, SUBSTAT } from '@/data';

function getSkippable(options, baseScore, evaluateEquipMap) {
  const useless = [];

  for (const { stat, value } of options) {
    const equipMap = { [stat]: value };
    const { score } = evaluateEquipMap(equipMap);

    if (score <= baseScore) {
      useless.push(stat);
    }
  }

  if (useless.length === options.length) {
    return [];
  }

  return useless;
}

export const buildSkippable = (gameId, baseScore, evaluateEquipMap) => {
  const mainstats = {};

  for (const [key, mainstatDatas] of Object.entries(MAINSTAT[gameId])) {
    const options = Object.values(mainstatDatas);
    const skippable = getSkippable(options, baseScore, evaluateEquipMap);
    mainstats[key] = new Set(skippable);
  }

  const options = Object.values(SUBSTAT[gameId]);
  const skippable = getSkippable(options, baseScore, evaluateEquipMap);
  const substats = new Set(skippable);

  return { mainstats, substats };
};
