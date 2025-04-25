import { STAT_DATA } from "@data";

const ITERATIONS = 10000;

const getInvestmentLevel = () => {
  const random = Math.floor(Math.random() * 10);
  if (random < 2) return 4;
  if (random < 7) return 2;
  return 1;
}

const simAvatarScores = (gameId, equipRatings, mainstats) => {
  const scores = new Array(ITERATIONS).fill(0);

  for (let i = 0; i < ITERATIONS; i++) {
    let scoreSum = 0;
    const numTriesMult = getInvestmentLevel();

    for (let j = 0; j < equipRatings.length; j++) {
      if (!mainstats[j]) continue;
      const numTries = STAT_DATA[gameId][mainstats[j]].mainTries * numTriesMult;
      const scoreTries = [];
      for (let k = 0; k < numTries; k++) {
        const random = Math.floor(Math.random() * equipRatings[j].simScores.length);
        scoreTries.push(equipRatings[j].simScores[random]);
      }
      const highest = Math.max(...scoreTries);
      scoreSum += highest;
    }

    scores[i] = scoreSum;
  }

  return scores.sort((a, b) => a - b);
};

export default simAvatarScores;
