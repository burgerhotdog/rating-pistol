import { MAINSTAT, SUBSTAT } from '@/data';

function getSkippable(options, baseScore, evaluateEquipMap) {
  const useless = [];

  for (const { id, value } of options) {
    const equipMap = { [id]: value };
    const { score } = evaluateEquipMap(equipMap);

    if (score <= baseScore) {
      useless.push(id);
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
