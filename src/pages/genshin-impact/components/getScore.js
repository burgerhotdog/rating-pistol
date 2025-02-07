import CHARACTERS from "../data/CHARACTERS";
import WEAPONS from "../data/WEAPONS";
import { SUBSTATS } from "../data/STATS";

const combine_basestats = (charBase, weapBase) => {
  return Object.entries(charBase).reduce((basestats, [key, value]) => {
    basestats[key] = value + (weapBase[key] || 0);
    return basestats;
  }, {});
};

const combine_substats = (substatsArr) => {
  const substats = {};
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      const key = substatsArr[i][j][0];
      const value = Number(substatsArr[i][j][1]);
      if (!key || !value) continue;
      substats[key] = (substats[key] || 0) + value;
    }
  }
  return substats;
};

const getLargestKey = (obj) => {
  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return ""; // Handle empty object case
  }
  return entries.reduce((maxKey, [key, value]) =>
    value > obj[maxKey] ? key : maxKey
  , Object.keys(obj)[0]); // Initialize with the first key
};

const simulate_substats = (substats, charRef, cdata) => {
  // Match energy recharge and calculate that in rolls
  const sim_substats = { "Energy Recharge": substats["Energy Recharge"] || 0};
  const simEnergyRolls = Math.ceil(sim_substats["Energy Recharge"] / SUBSTATS["Energy Recharge"]);
  let rollsLeft = Math.max(40 - simEnergyRolls, 0);

  // allocate substats
  const availableWeights = { ...charRef.weights };
  const rollCount = [0, 0, 0, 0, 0];
  while (rollsLeft > 0) {
    // get stat to roll
    const biggestWeightStat = getLargestKey(availableWeights);
    if (!biggestWeightStat) break;

    // figure out which pieces are given rolls
    const usingPiece = [false, false, false, false, false];
    for (let i = 0; i < 5; i++) {
      usingPiece[i] = rollCount[i] < 8 ? true : false;
      if (i < 2) continue;
      if (biggestWeightStat === cdata.mainstats[i]) {
        usingPiece[i] = false;
      }
    }

    // figure out how many rolls are given
    let maxTimesToRoll = 0 +
      (usingPiece[0] ? ((rollCount[0] === 0) ? 5 : 1) : 0) +
      (usingPiece[1] ? ((rollCount[1] === 0) ? 5 : 1) : 0) +
      (usingPiece[2] ? ((rollCount[2] === 0) ? 5 : 1) : 0) +
      (usingPiece[3] ? ((rollCount[3] === 0) ? 5 : 1) : 0) +
      (usingPiece[4] ? ((rollCount[4] === 0) ? 5 : 1) : 0);

    if (rollsLeft < maxTimesToRoll) {
      maxTimesToRoll = rollsLeft;
    }

    // add rolls to sum
    sim_substats[biggestWeightStat] = (sim_substats[biggestWeightStat] || 0) + (maxTimesToRoll * SUBSTATS[biggestWeightStat]);

    // cleanup
    // increment individual roll counts
    for (let i = 0; i < 5; i++) {
      if (!usingPiece[i]) continue;
      if (rollCount[i] === 0) {
        rollCount[i] = 5;
      } else {
        rollCount[i]++;
      }
    }

    // remove stat from available weights
    delete availableWeights[biggestWeightStat];
    rollsLeft -= maxTimesToRoll;
  }

  return sim_substats;
};

const calculatePoints = (statsObj, charRef, basestats) => {
  let points = 0;
  Object.entries(statsObj).forEach(([key, value]) => {
    if (charRef.weights[key]) {
      const weight = charRef.weights[key];
      const normalize = SUBSTATS[key];
      points += (value / normalize) * weight;
    } else if (basestats[key] && charRef.weights[key + "%"]) {
      const valuePercent = (value / basestats[key]) * 100;
      const weight = charRef.weights[key + "%"];
      const normalize = SUBSTATS[key + "%"];
      points += (valuePercent / normalize) * weight;
    }
  });
  return points;
};

const getScore = (cid, cdata) => {
  const charRef = CHARACTERS[cid];
  const weapRef = WEAPONS[cdata.weapon];

  // Combine basestats
  const basestats = combine_basestats(charRef.base, weapRef.base);
  console.log("basestats: ", basestats);

  // Combine substats
  const substats = combine_substats(cdata.substats);
  console.log("substats: ", substats);

  // Simulate perfect substats
  const sim_substats = simulate_substats(substats, charRef, cdata);
  console.log("sim_substats: ", sim_substats);

  // Calculate points
  const points = calculatePoints(substats, charRef, basestats);
  const sim_points = calculatePoints(sim_substats, charRef, basestats);
  console.log("points: ", points);
  console.log("sim_points: ", sim_points);

  // Calculate score
  const score = Math.round((points / sim_points) * 100);
  return score.toString();
};

export default getScore;
