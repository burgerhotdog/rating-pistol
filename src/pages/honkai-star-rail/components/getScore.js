import CHARACTERS from "../data/CHARACTERS";
import WEAPONS from "../data/WEAPONS";
import SETS from "../data/SETS";
import { MAINSTATS, SUBSTATS } from "../data/STATS";

const calculateBase = (charRef, weapRef) => {
  return Object.entries(charRef.base).reduce((baseStats, [key, value]) => {
    baseStats[key] = value + (weapRef.base[key] || 0);
    return baseStats;
  }, {});
};

const calculatePoints = (key, value, charRef, baseStats) => {
  if (charRef.weights[key]) {
    const weight = charRef.weights[key];
    const normalize = SUBSTATS[key];
    return (value / normalize) * weight;
  } else if (baseStats[key] && charRef.weights[key + "%"]) {
    const valuePercent = (value / baseStats[key]) * 100;
    const weight = charRef.weights[key + "%"];
    const normalize = SUBSTATS[key + "%"];
    return (valuePercent / normalize) * weight;
  }
  return 0;
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

const getScore = (cid, cdata) => {
  const charRef = CHARACTERS[cid];
  const weapRef = WEAPONS[cdata.weapon];
  const set1Ref = SETS[cdata.set1];
  const set2Ref = SETS[cdata.set2];

  // Calculate base stats (char + weap)
  const baseStats = calculateBase(charRef, weapRef);
  console.log("baseStats: ", baseStats);

  // SUM UP STATS
  // Sum mainstats and substats
  const mainstatSums = {};
  const substatSums = {};
  for (let i = 0; i < 6; i++) {
    // Mainstats
    let mainKey = cdata.mainstats[i];
    let mainValue = MAINSTATS[i][mainKey];
    if (mainKey && mainValue) {
      mainstatSums[mainKey] = (mainstatSums[mainKey] || 0) + mainValue;
    }

    // Substats
    for (let j = 0; j < 4; j++) {
      let subKey = cdata.substats[i][j].key;
      let subValue = Number(cdata.substats[i][j].value);
      if (subKey && subValue) {
        substatSums[subKey] = (substatSums[subKey] || 0) + subValue;
      }
    }
  }

  // Remove CRIT Rate exceeding 100
  const otherCrit = 5 +
  (charRef.stats["CRIT Rate"] || 0) +
  (weapRef.stats["CRIT Rate"] || 0) +
  (set1Ref.stats["CRIT Rate"] || 0) + 
  (set2Ref.stats["CRIT Rate"] || 0) + 
  (mainstatSums["CRIT Rate"] || 0);

  const subCrit = substatSums["CRIT Rate"] || 0;

  if (otherCrit + subCrit > 100) {
    substatSums["CRIT Rate"] = Math.max(100 - otherCrit, 0);
  }

  console.log("mainstatSums: ", mainstatSums);
  console.log("substatSums: ", substatSums);

  // SIMULATE PERFECT SUBSTAT DISTRIBUTION
  // Match spd and calculate that in rolls
  const simSubstatSums = { "SPD": substatSums["SPD"] || 0};
  const simSpdRolls = Math.ceil(simSubstatSums["SPD"] / SUBSTATS["SPD"]);
  let rollsLeft = Math.max(48 - simSpdRolls, 0);

  // allocate substats
  const availableWeights = { ...charRef.weights };
  const rollCount = [0, 0, 0, 0, 0, 0];
  while (rollsLeft > 0) {
    // get stat to roll
    const biggestWeightStat = getLargestKey(availableWeights);
    if (!biggestWeightStat) break;

    // figure out which pieces are given rolls
    const usingPiece = [false, false, false, false, false, false];
    for (let i = 0; i < 6; i++) {
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
      (usingPiece[4] ? ((rollCount[4] === 0) ? 5 : 1) : 0) +
      (usingPiece[5] ? ((rollCount[5] === 0) ? 5 : 1) : 0);

    if (rollsLeft < maxTimesToRoll) {
      maxTimesToRoll = rollsLeft;
    }

    // add rolls to sum
    simSubstatSums[biggestWeightStat] = (simSubstatSums[biggestWeightStat] || 0) + (maxTimesToRoll * SUBSTATS[biggestWeightStat]);

    
    // cleanup
    // increment individual roll counts
    for (let i = 0; i < 6; i++) {
      if (!usingPiece[i]) continue;
      if (rollCount[i] === 0) {
        rollCount[i] = 5;
      } else {
        rollCount[i]++;
      }
    }

    // remove stat from available weights
    delete availableWeights[biggestWeightStat];

    // decrement amount of rolls left
    rollsLeft -= maxTimesToRoll;
  }

  console.log("simSubstatSums: ", simSubstatSums);

  // POINTS CALCULATION
  // Calculate points for substatSums
  let statPoints = 0;
  Object.entries(substatSums).forEach(([key, value]) => {
    statPoints += calculatePoints(key, value, charRef, baseStats);
  });

  console.log("statPoints: ", statPoints);

  // Calculate points for simulated substat distribution
  let simPoints = 0;
  Object.entries(simSubstatSums).forEach(([key, value]) => {
    simPoints += calculatePoints(key, value, charRef, baseStats);
  });
  
  console.log("simPoints: ", simPoints)

  // Calculate final score
  const finalScore = Math.round((statPoints / simPoints) * 100);
  return finalScore.toString();
};

export default getScore;
