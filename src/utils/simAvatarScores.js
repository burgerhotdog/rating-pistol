import { AVATAR_DATA, STAT_DATA } from "@data";

const ITERATIONS = 10000;

const simAvatarScores = (gameId, avatarId, equipRatings, mainstats) => {
  const scores = new Array(ITERATIONS).fill(0);
  const numTries = mainstats.map((stat, index) =>
    STAT_DATA[gameId][stat].mainChance[index]
  );

  for (let i = 0; i < ITERATIONS; i++) {
    let scoreSum = 0;
    for (let j = 0; j < equipRatings.length; j++) {
      const scoreTries = [];
      for (let k = 0; k < numTries[j]; k++) {
        const random = Math.floor(Math.random() * equipRatings[j].scoreData.length);
        scoreTries.push(equipRatings[j].scoreData[random]);
      }
      const highest = Math.max(...scoreTries);
      scoreSum += highest;
    }

    scores[i] = scoreSum;
  }

  return scores.sort((a, b) => a - b);
};

export default simAvatarScores;
