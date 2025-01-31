import CHARACTERS from "../data/CHARACTERS";
import WEAPONS from "../data/WEAPONS";
import SETS from "../data/SETS";
import { MAINSTATS, SUBSTATS } from "../data/STATS";

const calculateBaseStats = (charRef, weapRef) => {
  return Object.entries(charRef.base).reduce((baseStats, [key, value]) => {
    baseStats[key] = value + (weapRef.base[key] || 0);
    return baseStats;
  }, {});
};

const calculateStatScore = (key, value, charRef, baseStats) => {
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
  console.log("Running getScore for: ", cid);

  const charRef = CHARACTERS[cid];
  const weapRef = WEAPONS[cdata.weapon];
  const setRef = SETS[cdata.set];

  const baseStats = calculateBaseStats(charRef, weapRef);
  console.log("baseStats: ", baseStats);

  const mainstatSums = {};
  const substatSums = {};

  // Sum mainstats and substats
  for (let i = 0; i < 5; i++) {
    // Mainstats
    let mainKey = cdata.mainstats[i];
    let mainValue = MAINSTATS[i][mainKey];
    if (mainKey && mainValue) {
      mainstatSums[mainKey] = (mainstatSums[mainKey] || 0) + mainValue;
    }

    // Substats
    for (let j = 0; j < 5; j++) {
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
  (setRef.stats["CRIT Rate"] || 0) + 
  (mainstatSums["CRIT Rate"] || 0);

  const subCrit = substatSums["CRIT Rate"] || 0;

  if (otherCrit + subCrit > 100) {
    substatSums["CRIT Rate"] = Math.max(100 - otherCrit, 0);
  }

  console.log("mainstatSums: ", mainstatSums);
  console.log("substatSums: ", substatSums);

  // Calculate score for substatSums
  let score = 0;
  Object.entries(substatSums).forEach(([key, value]) => {
    score += calculateStatScore(key, value, charRef, baseStats);
  });

  console.log("score: ", score);

  // Simulate perfect substat distribution
  // Match energy and calculate that in rolls
  const simSubstatSums = { "Energy Regen": substatSums["Energy Regen"] || 0};
  const simEnergyRolls = Math.ceil(simSubstatSums["Energy Regen"] / SUBSTATS["Energy Regen"]);
  let rollsLeft = Math.max(25 - simEnergyRolls, 0);

  // allocate substats
  const availableWeights = { ...charRef.weights };
  let rollCount0 = 0;
  let rollCount1 = 0;
  let rollCount2 = 0;
  let rollCount3 = 0;
  let rollCount4 = 0;
  while (rollsLeft > 0) {
    let biggestWeightStat = getLargestKey(availableWeights);
    if (!biggestWeightStat) {
      break;
    }

    let using0 = rollCount0 < 5 ? true : false;
    let using1 = rollCount1 < 5 ? true : false;
    let using2 = rollCount2 < 5 ? true : false;
    let using3 = rollCount3 < 5 ? true : false;
    let using4 = rollCount4 < 5 ? true : false;

    if (biggestWeightStat === cdata.mainstats[2]) {
      using2 = false;
    }

    if (biggestWeightStat === cdata.mainstats[3]) {
      using3 = false;
    }

    if (biggestWeightStat === cdata.mainstats[4]) {
      using4 = false;
    }

    let maxTimesToRoll = 0 +
      (using0 ? 1 : 0) +
      (using1 ? 1 : 0) +
      (using2 ? 1 : 0) +
      (using3 ? 1 : 0) +
      (using4 ? 1 : 0);
    
    if (using0) {
      rollCount0++;
    }

    if (using1) {
      rollCount1++;
    }

    if (using2) {
      rollCount2++;
    }

    if (using3) {
      rollCount3++;
    }

    if (using4) {
      rollCount4++;
    }

    if (rollsLeft < maxTimesToRoll) {
      maxTimesToRoll = rollsLeft;
    }

    simSubstatSums[biggestWeightStat] = (simSubstatSums[biggestWeightStat] || 0) + (maxTimesToRoll * SUBSTATS[biggestWeightStat]);

    delete availableWeights[biggestWeightStat];
    rollsLeft -= maxTimesToRoll;
  }

  console.log("simSubstatSums: ", simSubstatSums);

  // Calculate score for simulated substat distribution
  let score2 = 0;
  Object.entries(simSubstatSums).forEach(([key, value]) => {
    score2 += calculateStatScore(key, value, charRef, baseStats);
  });
  
  console.log("score2: ", score2)

  const finalscore = Math.round((score / score2) * 100);
  return finalscore.toString();
};

export default getScore;
