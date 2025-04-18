import { INFO_DATA } from "@data";

const ITERATIONS = 10000;

const simulateAvatarRVs = (gameId, equipRatings) => {
  const scores = new Array(ITERATIONS).fill(0);

  for (let i = 0; i < ITERATIONS; i++) {
    let sumValue = 0;

    const playerType = Math.floor(Math.random() * 10);
    const isWhale = playerType < 1;
    const isDolphin = playerType < 2;
    const numTriesMult = isWhale ? 8 : isDolphin ? 4 : 2;

    for (let j = 0; j < equipRatings.length; j++) {
      const numTries = (4 - INFO_DATA[gameId].EQUIP_RARITY[j]) * numTriesMult;
      const rvs = [];
      for (let k = 0; k < numTries; k++) {
        const random = Math.floor(Math.random() * equipRatings[j].simData.length);
        const rv = equipRatings[j].simData[random];
        rvs.push(rv);
      }
      const highest = Math.max(...rvs);
      sumValue += highest;
    }

    scores[i] = sumValue;
  }

  return scores.sort((a, b) => a - b);
};

export default simulateAvatarRVs;
