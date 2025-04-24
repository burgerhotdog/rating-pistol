import { INFO_DATA } from "@data";
const ITERATIONS = 10000;

const getPlayerType = () => {
  const random = Math.floor(Math.random() * 10);
  if (random < 1) return 5;
  if (random < 3) return 3;
  if (random < 6) return 2;
  return 1;
}

const simAvatarScores = (gameId, equipRatings) => {
  const scores = new Array(ITERATIONS).fill(0);

  for (let i = 0; i < ITERATIONS; i++) {
    let sumValue = 0;
    const numTriesMult = getPlayerType();

    for (let j = 0; j < equipRatings.length; j++) {
      const numTries = (5 - INFO_DATA[gameId].EQUIP_RARITY[j]) * numTriesMult;
      const rvs = [];
      for (let k = 0; k < numTries; k++) {
        const random = Math.floor(Math.random() * equipRatings[j].simScores.length);
        const rv = equipRatings[j].simScores[random];
        rvs.push(rv);
      }
      const highest = Math.max(...rvs);
      sumValue += highest;
    }

    scores[i] = sumValue;
  }

  return scores.sort((a, b) => a - b);
};

export default simAvatarScores;
