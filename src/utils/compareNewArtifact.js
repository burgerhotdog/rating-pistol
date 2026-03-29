import { computeRating, generateArtifact, computeTotalStat, buildSourceMapList } from '@/utils';

export function compareNewArtifact(gameId, iter) {
  const [slotIndex, newArtifact] = generateArtifact(gameId);

  // Ignore wrong set
  if (!newArtifact.setId) return {};

  const newEquipList = newIter.equipList.map((currentArtifact, index) => {
    if (index !== slotIndex) return currentArtifact;
    return newArtifact;
  });

  const newRating = computeRating(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);

  if (!criteria.MATCH) {
    if (newRating < control) return {};
    control = newRating;
    newIter = { weaponId, equipList: newEquipList };
  } else {
    const controlPenalty = criteria.MATCH
      .map((stat) => {
        const currentValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, newIter));
        const targetValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, build));
        return match_penalty(currentValue, targetValue);
      })
      .reduce((acc, mult) => acc * mult, 1);

    const newPenalty = criteria.MATCH
      .map((stat) => {
        const currentValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, { weaponId, equipList: newEquipList }));
        const targetValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, build));
        return match_penalty(currentValue, targetValue);
      })
      .reduce((acc, mult) => acc * mult, 1);
    
    if (newRating * newPenalty < control * controlPenalty) return {};
    control = newRating;
    newIter = { weaponId, equipList: newEquipList };

    return { isNewBetter: true, iter: newIter };
  }
}
