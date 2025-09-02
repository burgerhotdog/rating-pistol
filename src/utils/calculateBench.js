import { INFO_DATA, STAT_DATA } from '@data';

export default (gameId, fullWeights, mainstats) => {
  const { NUM_MAINSTATS } = INFO_DATA[gameId];
  let toAllocate = NUM_MAINSTATS * (gameId === 'ww' ? 5 : 8);

  // allocate 2 substats to each possible different substat (1 for wuwa)
  const substats = Object.entries(STAT_DATA[gameId])
    .filter(([, { subValue }]) => subValue)
    .map(([stat]) => ({ stat, rolls: (gameId === 'ww' ? 0 : 1) }));

  toAllocate -= Object.entries(substats).length * (gameId === 'ww' ? 1 : 2);

  // divide the remaining rolls among the weighted substats
  const totalWeights = Object.values(fullWeights)
    .reduce((acc, weight) => acc + weight, 0);
  const rollsPerUnit = toAllocate / totalWeights;

  for (const line of substats) {
    const weight = fullWeights[line.stat];
    if (!weight) continue;

    const statFreq = gameId !== 'ww'
      ? mainstats.filter(stat => stat === line.stat).length
      : 0;
    const threshold = (NUM_MAINSTATS - statFreq) * (gameId === 'ww' ? 1 : 2);
    line.rolls += Math.min(rollsPerUnit * weight, threshold);
  }

  return substats.reduce((acc, { stat, rolls }) => {
    return acc + rolls * (fullWeights[stat] ?? 0);
  }, 0);
};
