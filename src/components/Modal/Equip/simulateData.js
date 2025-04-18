import { INFO_DATA, STAT_DATA } from "@data";
import getRollValue from "@utils/getRollValue";
import { getStatPool, getRandomMultiplier } from "./simulationConstants";

const ITERATIONS = 10000;

const simulateData = (gameId, mainstat, weights) => {
  const scores = new Array(ITERATIONS).fill(0);
  // remove mainstat from substat pool
  const startingPool = getStatPool[gameId].filter(([stat]) =>
    gameId === "ww" || stat !== mainstat
  );

  for (let i = 0; i < ITERATIONS; i++) {
    let statPool = [...startingPool];

    // adding each substat line (weighted selection)
    let substats = [];
    for (let j = 0; j < INFO_DATA[gameId].SUB_LEN; j++) {
      const totalWeight = statPool.reduce((acc, [, weight]) => acc + weight, 0);
      const random = Math.floor(Math.random() * totalWeight) + 1;

      let cumulative = 0;
      for (let k = 0; k < statPool.length; k++) {
        const [stat, weight] = statPool[k];
        cumulative += weight;
        if (random <= cumulative) {
          const multiplier = getRandomMultiplier(gameId);
          const value = STAT_DATA[gameId][stat].subValue * multiplier;
          substats.push({ stat, value });
          statPool.splice(k, 1);
          break;
        };
      }
    }

    // adding the rest of the rolls
    if (gameId !== "ww") {
      // 1 in 4 artifacts gets an extra upgrade
      const upgrades = Math.floor(Math.random() * 4) ? 4 : 5;
      for (let j = 0; j < upgrades; j++) {
        const randomIndex = Math.floor(Math.random() * 4);
        const { stat } = substats[randomIndex];
        const multiplier = getRandomMultiplier(gameId);
        const addValue = STAT_DATA[gameId][stat].subValue * multiplier;
        substats[randomIndex].value += addValue;
      }
    }

    scores[i] = getRollValue(gameId, substats, weights);
  }
  return scores;
};

export default simulateData;
