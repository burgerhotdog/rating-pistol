import CHARACTERS from "../data/CHARACTERS";
import WEAPONS from "../data/WEAPONS";
import { SUBSTATS } from "../data/STATS";

const TOTAL_ROLLS = 25;
const MAX_ROLLS_PER_PIECE = 5;
const INITIAL_ROLL_INCREMENT = 1;

const combine_basestats = (charBase, weapBase) => {
  return Object.entries(charBase).reduce((basestats, [key, value]) => {
    basestats[key] = value + (weapBase[key] || 0);
    return basestats;
  }, {});
};

const combine_substats = (substatsArr) => {
  const substats = {};
  for (let i = 0; i < substatsArr.length; i++) {
    for (let j = 0; j < substatsArr[i].length; j++) {
      const key = substatsArr[i][j][0];
      const value = Number(substatsArr[i][j][1]);
      if (!key || !value) continue;
      substats[key] = (substats[key] || 0) + value;
    }
  }
  return substats;
};

const getLargestWeight = (weights) => {
  const entries = Object.entries(weights);
  if (entries.length === 0) return "";
  return entries.reduce((maxWeight, [key, value]) =>
    value > weights[maxWeight] ? key : maxWeight, Object.keys(weights)[0]);
};

const simulate_substats = (substats, weights, mainstatsArr) => {
  // Match energy recharge and calculate that in rolls
  const sim_substats = { "Energy Regen": substats["Energy Regen"] || 0};
  const simEnergyRolls = Math.ceil(sim_substats["Energy Regen"] / SUBSTATS["Energy Regen"]);
  let rollsLeft = Math.max(TOTAL_ROLLS - simEnergyRolls, 0);
  const availableWeights = { ...weights };
  const rollCount = new Array(mainstatsArr.length).fill(0);
  while (rollsLeft > 0) {
    // get stat to roll
    const largestWeight = getLargestWeight(availableWeights);
    if (!largestWeight) break;

    // figure out which pieces are given rolls
    const usingPiece = new Array(mainstatsArr.length).fill(false);
    for (let i = 0; i < mainstatsArr.length; i++) {
      usingPiece[i] = rollCount[i] < MAX_ROLLS_PER_PIECE ? true : false;
    }

    // add rolls to timesToRoll and increment rollCount
    let timesToRoll = 0;
    for (let i = 0; i < mainstatsArr.length; i++) {
      if (!usingPiece[i]) continue;
      timesToRoll++;
      rollCount[i]++;
    }

    if (timesToRoll > rollsLeft) {
      timesToRoll = rollsLeft;
    }

    // add rolls to sim_substats
    sim_substats[largestWeight] = (sim_substats[largestWeight] || 0) + (timesToRoll * SUBSTATS[largestWeight]);

    // remove stat from available weights
    delete availableWeights[largestWeight];
    rollsLeft -= timesToRoll;
  }

  return sim_substats;
};

const calculatePoints = (statsObj, weights, basestats, includeEnergy) => {
  let points = 0;
  Object.entries(statsObj).forEach(([key, value]) => {
    if (weights[key] || (key === "Energy Regen" && includeEnergy)) {
      const weight = key === "Energy Regen" ? 1 : weights[key];
      const normalize = SUBSTATS[key];
      points += (value / normalize) * weight;
    } else if (basestats[key] && weights[key + "%"]) {
      const valuePercent = (value / basestats[key]) * 100;
      const weight = weights[key + "%"];
      const normalize = SUBSTATS[key + "%"];
      points += (valuePercent / normalize) * weight;
    }
  });
  return points;
};

const getScore = (cid, cdata) => {
  // Combine basestats
  const basestats = combine_basestats(CHARACTERS[cid].base, WEAPONS[cdata.weapon].base);
  console.log("basestats: ", basestats);

  // Combine substats
  const substats = combine_substats(cdata.substats);
  console.log("substats: ", substats);

  // Simulate perfect substats
  const sim_substats = simulate_substats(substats, CHARACTERS[cid].weights, cdata.mainstats);
  console.log("sim_substats: ", sim_substats);

  // Calculate points
  const points = calculatePoints(substats, CHARACTERS[cid].weights, basestats, CHARACTERS[cid].includeEnergy);
  const sim_points = calculatePoints(sim_substats, CHARACTERS[cid].weights, basestats, CHARACTERS[cid].includeEnergy);
  console.log("points: ", points);
  console.log("sim_points: ", sim_points);

  // Calculate score
  const score = Math.round((points / sim_points) * 100);
  return score.toString();
};

export default getScore;
