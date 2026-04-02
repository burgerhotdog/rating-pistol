import { STATS } from '@/lookups';
import { computeRating, generateArtifact, computeTotalStat, buildSourceMapList, getSetCounts, getSetEffects } from '@/utils';

const DAILY_RESIN = {
  'genshin-impact': 180,
  'honkai-star-rail': 240,
  'wuthering-waves': 240,
  'zenless-zone-zero': 320,
};

const COST_PER_RUN = {
  'genshin-impact': 20,
  'honkai-star-rail': 40,
  'wuthering-waves': 60,
  'zenless-zone-zero': 60,
};

const BONUS_RESIN = {
  'genshin-impact': 60,
  'honkai-star-rail': 160,
  'wuthering-waves': 120,
  'zenless-zone-zero': 180,
};

const DROPS_PER_RUN = {
  'genshin-impact': 1.065,
  'honkai-star-rail': 2.1,
  'wuthering-waves': 4.33,
  'zenless-zone-zero': 3.25,
};

function match_penalty(current, target) {
  if (!target) return 1;

  const relativeDeficit = (target - current) / target;
  if (relativeDeficit <= 0) return 1;

  return Math.exp(-1 * relativeDeficit);
};

export function simulateBuildAfterWeek(gameId, charId, build, iter, criteria, buffs) {
  const resinPerWeek = DAILY_RESIN[gameId] * 7 + BONUS_RESIN[gameId];
  const runsPerWeek = resinPerWeek / COST_PER_RUN[gameId];
  const dropsPerWeek = Math.floor(runsPerWeek * DROPS_PER_RUN[gameId]);

  const { weaponId } = iter;

  let control = computeRating(gameId, charId, iter, criteria, buffs);
  let newIter = iter;

  // wuwa gets 20 free 4 costs per week
  if (gameId === 'wuthering-waves') {
    for (let i = 0; i < 20; i++) {
      const [, newArtifact] = generateArtifact(gameId, true);
      if (!newArtifact.setId) continue;
      newArtifact.cost = 4;
      newArtifact.mainStatFlatId = 'FLAT_ATK';
      newArtifact.mainStatFlatValue = 150;

      let costCounter = 0;
      for (const [index, equip] of newIter.equipList.entries()) {
        if (equip && (4 !== equip.cost)) continue;
        costCounter++;
        if (costCounter > 1) break;
        const newEquipList = newIter.equipList.map((currentEcho, idx) => {
          if (index !== idx) return currentEcho;
          return newArtifact;
        });
        const newRating = computeRating(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);
        if (!criteria.MATCH) {
          if (newRating < control) continue;
          control = newRating;
          newIter = { weaponId, equipList: newEquipList };
        } else {
          const bestSwapPenalty = criteria.MATCH
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

          if (newRating * newPenalty < control * bestSwapPenalty) continue;
          control = newRating;
          newIter = { weaponId, equipList: newEquipList };
        }
      }
    }
  }

  // wuwa gets 15 free 3 costs per week
  if (gameId === 'wuthering-waves') {
    for (let i = 0; i < 15; i++) {
      const [, newArtifact] = generateArtifact(gameId, true);
      if (!newArtifact.setId) continue;
      newArtifact.cost = 3;
      newArtifact.mainStatFlatId = 'FLAT_ATK';
      newArtifact.mainStatFlatValue = 100;

      let costCounter = 0;
      for (const [index, equip] of newIter.equipList.entries()) {
        if (equip && (3 !== equip.cost)) continue;
        costCounter++;
        if (costCounter > 2) break;
        const newEquipList = newIter.equipList.map((currentEcho, idx) => {
          if (index !== idx) return currentEcho;
          return newArtifact;
        });
        const newRating = computeRating(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);
        if (!criteria.MATCH) {
          if (newRating < control) continue;
          control = newRating;
          newIter = { weaponId, equipList: newEquipList };
        } else {
          const bestSwapPenalty = criteria.MATCH
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

          if (newRating * newPenalty < control * bestSwapPenalty) continue;
          control = newRating;
          newIter = { weaponId, equipList: newEquipList };
        }
      }
    }
  }

  for (let i = 0; i < dropsPerWeek; i++) {
    const [slotIndex, newArtifact] = generateArtifact(gameId);

    // Ignore wrong set
    if (!newArtifact.setId) continue;

    // Wuwa logic is different
    if (gameId === 'wuthering-waves') {
      // slotIndex actually refers to the artifact cost
      const cost = slotIndex ? 3 : 1;
      newArtifact.cost = cost;
      if (cost === 3) {
        newArtifact.mainStatFlatId = 'FLAT_ATK';
        newArtifact.mainStatFlatValue = 100;
      } else {
        newArtifact.mainStatFlatId = 'FLAT_HP';
        newArtifact.mainStatFlatValue = 2280;
      }

      // since echos aren't locked to a specific slot, we can swap out any of our pieces that are the same cost
      // for simplicity the builds are locked to 43311
      let bestSwapIter = newIter;
      let bestSwapRating = control;
      let costCounter = 0;
      for (const [index, equip] of newIter.equipList.entries()) {
        if (equip && (cost !== equip.cost)) continue;
        costCounter++;
        if (costCounter > 2) break;
        const newEquipList = newIter.equipList.map((currentEcho, idx) => {
          if (index !== idx) return currentEcho;
          return newArtifact;
        });
        const newRating = computeRating(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);
        if (!criteria.MATCH) {
          if (newRating < bestSwapRating) continue;
          bestSwapRating = newRating;
          bestSwapIter = { weaponId, equipList: newEquipList };
        } else {
          const bestSwapPenalty = criteria.MATCH
            .map((stat) => {
              const currentValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, bestSwapIter));
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

          if (newRating * newPenalty < bestSwapRating * bestSwapPenalty) continue;
          bestSwapRating = newRating;
          bestSwapIter = { weaponId, equipList: newEquipList };
        }
      }
      newIter = bestSwapIter;
      control = bestSwapRating;
      continue;
    }

    const newEquipList = newIter.equipList.map((currentArtifact, index) => {
      if (index !== slotIndex) return currentArtifact;
      return newArtifact;
    });
    
    const newRating = computeRating(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);

    if (!criteria.MATCH) {
      if (newRating < control) continue;
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
      
      if (newRating * newPenalty < control * controlPenalty) continue;
      control = newRating;
      newIter = { weaponId, equipList: newEquipList };
    }
  }

  return newIter;
}
