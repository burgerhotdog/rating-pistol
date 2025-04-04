import { getStatPool, getRandomMultiplier } from "./simulationConstants";
import { DATA } from "../../importData";
import getRollValue from "./getRollValue";
const ITERATIONS = 10000;

const simulateData = (gameId, mainstat, weights) => {
  const { STAT_INDEX } = DATA[gameId];
  const lineCount = gameId === "ww" ? 5 : 4;
  const scores = new Array(ITERATIONS).fill(0);
  // remove mainstat from substat pool
  const startingPool = getStatPool[gameId].filter(([stat]) =>
    gameId === "ww" || stat !== mainstat
  );

  for (let i = 0; i < ITERATIONS; i++) {
    let statPool = [...startingPool];

    // adding each substat line (weighted selection)
    let substats = [];
    for (let j = 0; j < lineCount; j++) {
      const totalWeight = statPool.reduce((acc, [, weight]) => acc + weight, 0);
      const random = Math.floor(Math.random() * totalWeight) + 1;

      let cumulative = 0;
      for (let k = 0; k < statPool.length; k++) {
        const [stat, weight] = statPool[k];
        cumulative += weight;
        if (random <= cumulative) {
          const multiplier = getRandomMultiplier(gameId);
          const value = STAT_INDEX[stat].value * multiplier;
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
        const addValue = STAT_INDEX[stat].value * multiplier;
        substats[randomIndex].value += addValue;
      }
    }

    scores[i] = getRollValue(gameId, substats, STAT_INDEX, weights);
  }
  return scores;
};

export default simulateData;
