import { computeDamage, computeTotalStat, buildSourceMapList, mergeStatMaps } from '@/utils';
import { weightedLottery } from './weightedLottery';
import { upgradeArtifact } from './upgradeArtifact';
import { STATS } from '@/data';

const RESIN_DATA = {
  "genshin-impact": {
    weeklyBonusResin: 60,
    dailyResin: 180,
    costPerRun: 20,
    dropsPerRun: 1.065,
  },
  "honkai-star-rail": {
    weeklyBonusResin: 160,
    dailyResin: 240,
    costPerRun: 40,
    dropsPerRun: 2.1,
  },
  "wuthering-waves": {
    weeklyBonusResin: 120,
    dailyResin: 240,
    costPerRun: 60,
    dropsPerRun: 4.33,
  },
  "zenless-zone-zero": {
    weeklyBonusResin: 180,
    dailyResin: 320,
    costPerRun: 60,
    dropsPerRun: 3.25,
  },
};

export function findBenchmarkWeek(weeklyScores, minGain = 0.01) {
  for (let i = 1; i < weeklyScores.length; i++) {
    const prev = weeklyScores[i - 1];
    const curr = weeklyScores[i];
    if (!Number.isFinite(prev) || prev <= 0) continue;

    const gain = (curr - prev) / prev;
    if (gain < minGain) return i;
  }
  return -1;
}

export function getAverageScores(trials, weekCount) {
  const averages = [];
  for (let week = 0; week <= weekCount; week++) {
    let sum = 0;
    for (const trial of trials) sum += trial.scores[week];
    averages.push(sum / trials.length);
  }
  return averages;
}

export function generateArtifact(gameId, isCost4 = false) {
  const { MAIN_STAT_TYPES } = STATS[gameId];

  // Random set
  const setId = Math.floor(Math.random() * 2);

  // Random slot (wuwa calc is different)
  const slotIndex = isCost4 ? 2 : gameId === 'wuthering-waves'
    ? Math.floor(Math.random() * 2)
    : Math.floor(Math.random() * MAIN_STAT_TYPES.length);

  // Main stat
  const mainStatOptions = MAIN_STAT_TYPES[slotIndex];
  const mainStatWeights = Object.values(mainStatOptions).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(mainStatOptions)[weightedLottery(mainStatWeights)];
  const mainStatValue = mainStatOptions[mainStatId].VALUE;

  // Sub stat list
  const subStatList = upgradeArtifact(gameId, mainStatId);

  return [slotIndex, { setId, mainStatId, mainStatValue, subStatList }];
}


function match_penalty(current, target) {
  if (!target) return 1;

  const relativeDeficit = (target - current) / target;
  if (relativeDeficit <= 0) return 1;

  return Math.exp(-1 * relativeDeficit);
};

export function simulateBuildAfterWeek(gameId, charId, build, iter, criteria, buffs) {
  const { weeklyBonusResin, dailyResin, costPerRun, dropsPerRun } = RESIN_DATA[gameId];
  const resinPerWeek = dailyResin * 7 + weeklyBonusResin;
  const runsPerWeek = resinPerWeek / costPerRun;
  const dropsPerWeek = Math.floor(runsPerWeek * dropsPerRun);

  const { weaponId } = iter;

  let control = computeDamage(gameId, charId, iter, criteria, buffs);
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
        const newRating = computeDamage(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);
        if (!criteria.match) {
          if (newRating < control) continue;
          control = newRating;
          newIter = { weaponId, equipList: newEquipList };
        } else {
          const bestSwapPenalty = criteria.match
            .map((stat) => {
              const currentValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, newIter)));
              const targetValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, build)));
              return match_penalty(currentValue, targetValue);
            })
            .reduce((acc, mult) => acc * mult, 1);

          const newPenalty = criteria.match
            .map((stat) => {
              const currentValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, { weaponId, equipList: newEquipList })));
              const targetValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, build)));
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
        const newRating = computeDamage(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);
        if (!criteria.match) {
          if (newRating < control) continue;
          control = newRating;
          newIter = { weaponId, equipList: newEquipList };
        } else {
          const bestSwapPenalty = criteria.match
            .map((stat) => {
              const currentValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, newIter)));
              const targetValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, build)));
              return match_penalty(currentValue, targetValue);
            })
            .reduce((acc, mult) => acc * mult, 1);

          const newPenalty = criteria.match
            .map((stat) => {
              const currentValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, { weaponId, equipList: newEquipList })));
              const targetValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, build)));
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
        const newRating = computeDamage(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);
        if (!criteria.match) {
          if (newRating < bestSwapRating) continue;
          bestSwapRating = newRating;
          bestSwapIter = { weaponId, equipList: newEquipList };
        } else {
          const bestSwapPenalty = criteria.match
            .map((stat) => {
              const currentValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, bestSwapIter)));
              const targetValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, build)));
              return match_penalty(currentValue, targetValue);
            })
            .reduce((acc, mult) => acc * mult, 1);

          const newPenalty = criteria.match
            .map((stat) => {
              const currentValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, { weaponId, equipList: newEquipList })));
              const targetValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, build)));
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
    
    const newRating = computeDamage(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);

    if (!criteria.match) {
      if (newRating < control) continue;
      control = newRating;
      newIter = { weaponId, equipList: newEquipList };
    } else {
      const controlPenalty = criteria.match
        .map((stat) => {
          const currentValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, newIter)));
          const targetValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, build)));
          return match_penalty(currentValue, targetValue);
        })
        .reduce((acc, mult) => acc * mult, 1);

      const newPenalty = criteria.match
        .map((stat) => {
          const currentValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, { weaponId, equipList: newEquipList })));
          const targetValue = computeTotalStat(stat, mergeStatMaps(...buildSourceMapList(gameId, charId, build)));
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
