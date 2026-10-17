import { MAINSTAT, SUBSTAT } from '@/data';

function getSkippable(options, isStatUseful) {
  const useless = [];

  for (const { stat, value } of options) {
    if (!isStatUseful(stat, value)) {
      useless.push(stat);
    }
  }

  if (useless.length === options.length) {
    return [];
  }

  return useless;
}

export const buildSkippable = (gameId, runEquipMap) => {
  const { score: baseScore } = runEquipMap({});

  const isStatUseful = (stat, value) =>
    runEquipMap({ [stat]: value }).score > baseScore;

  const mainstats = {};
  for (const [key, mainstatDatas] of Object.entries(MAINSTAT[gameId])) {
    const options = Object.values(mainstatDatas);
    const skippable = getSkippable(options, isStatUseful);
    mainstats[key] = new Set(skippable);
  }

  const options = Object.values(SUBSTAT[gameId]);
  const skippable = getSkippable(options, isStatUseful);
  const substats = new Set(skippable);

  return { mainstats, substats };
};
