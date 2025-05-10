import { STAT_DATA } from "@data";

const ITERATIONS = 10000;

const getNumTries = (gameId, mainstats) => {
  switch (gameId) {
    case "gi": {
      const mainChances = mainstats.map((stat, index) => STAT_DATA.gi[stat].mainChance[index]);
      const sortedChances = [...mainChances].sort((a, b) => a - b);
      const lowest = sortedChances[0];
      const secondLowest = sortedChances[1];
      mainChances[mainChances.indexOf(lowest)] = secondLowest * 2;
      return mainChances.map(chance => Math.min(10, Math.round(chance / secondLowest)));
    }
    case "hsr": {
      const mainChances = mainstats.map((stat, index) => STAT_DATA.hsr[stat].mainChance[index]);
      const firstHalf = mainChances.slice(0, 4);
      const secondHalf = mainChances.slice(4);
      const minFirstHalf = Math.min(...firstHalf);
      const minSecondHalf = Math.min(...secondHalf);
      return [
        ...firstHalf.map(chance => Math.min(10, Math.round(chance / minFirstHalf))),
        ...secondHalf.map(chance => Math.min(10, Math.round(chance / minSecondHalf)))
      ];
    }
    case "ww": {
      const mainChances = mainstats.map((stat, index) => STAT_DATA.ww[stat].mainChance[index]);
      const noEquipped = mainChances.slice(1);
      const minChance = Math.min(...noEquipped);
      return [3, ...noEquipped.map(chance => Math.min(10, Math.round(chance / minChance)))];
    }
    case "zzz": {
      const mainChances = mainstats.map((stat, index) => STAT_DATA.zzz[stat].mainChance[index]);
      const minChance = Math.min(...mainChances);
      return mainChances.map(chance => Math.min(10, Math.round(chance / minChance)));
    }
  };
};

const simAvatarScores = (gameId, equipRatings, mainstats) => {
  const scores = new Array(ITERATIONS).fill(0);
  const numTries = getNumTries(gameId, mainstats);

  for (let i = 0; i < ITERATIONS; i++) {
    let scoreSum = 0;
    for (let j = 0; j < equipRatings.length; j++) {
      const scoreTries = [];
      for (let k = 0; k < numTries[j]; k++) {
        const random = Math.floor(Math.random() * equipRatings[j].rawSimScores.length);
        scoreTries.push(equipRatings[j].rawSimScores[random]);
      }
      const highest = Math.max(...scoreTries);
      scoreSum += highest;
    }

    scores[i] = scoreSum;
  }

  return scores.sort((a, b) => a - b);
};

export default simAvatarScores;
