import CHARACTERS from "./data/CHARACTERS";
import WEAPONS from "./data/WEAPONS";
import SETS from "./data/SETS";
import { MAINSTATS, SUBSTATS } from "./data/STATS";

const getScore = (cid, cdata) => {
  console.log("Running getScore for: ", cid);

  // create refs for readability
  const charRef = CHARACTERS[cid];
  const weapRef = WEAPONS[cdata.weapon];
  const setRef = SETS[cdata.set];

  // sum character and weapon base stats
  const baseStats = {};
  Object.entries(charRef.base).forEach(([key, value]) => {
    baseStats[key] = value + (weapRef.base[key] || 0);
  });

  console.log("baseStats: ", baseStats);

  // sum up mainstats and substats
  const mainstatSums = {};
  const substatSums = {};
  for (let i = 0; i < 5; i++) {
    // mainstats
    let mainKey = cdata.mainstats[i];
    let mainValue = MAINSTATS[i][mainKey];
    if (mainKey && mainValue) {
      mainstatSums[mainKey] = (mainstatSums[mainKey] || 0) + mainValue;
    }

    // substats
    for (let j = 0; j < 4; j++) {
      let subKey = cdata.substats[i][j].key;
      let subValue = Number(cdata.substats[i][j].value);
      if (subKey && subValue) {
        substatSums[subKey] = (substatSums[subKey] || 0) + subValue;
      }
    }
  }
  
  // trim off excess crit rate from substatSums
  const otherCrit = 5 +
    (charRef.stats["CRIT Rate"] || 0) +
    (weapRef.stats["CRIT Rate"] || 0) +
    (setRef.stats["CRIT Rate"] || 0) + 
    (mainstatSums["CRIT Rate"] || 0);
  
  const subCrit = substatSums["CRIT Rate"] || 0;
  
  if (otherCrit + subCrit > 100) {
    substatSums["CRIT Rate"] = Math.max(100 - otherCrit, 0);
    console.log("Removed excess CRIT Rate, CRIT Rate set to: ", Math.max(100 - otherCrit, 0));
  }

  console.log("mainstatSums: ", mainstatSums);
  console.log("substatSums: ", substatSums);

  // calculate score of substatSums
  console.log("Begin score calculation");
  let score = 0;
  Object.entries(substatSums).forEach(([key, value]) => {
    if (charRef.weights[key]) { // if stat is in weights
      const weight = charRef.weights[key];
      const normalize = SUBSTATS[key];
      console.log("Scoring stat: ", key, value);
      console.log("Normalize, Weight: ", normalize, weight);
      score += (value / normalize) * weight;
      console.log("Added amount to score: ", (value / normalize) * weight);
    } else if (baseStats[key] && charRef.weights[key + "%"]) { // base stats
      // convert to %
      const valuePercent = (value / baseStats[key]) * 100;
      const weight = charRef.weights[key + "%"];
      const normalize = SUBSTATS[key + "%"];
      console.log("Scoring base stat: ", key, value);
      console.log("valuePercent, Normalize, Weight: ", valuePercent, normalize, weight);
      score += (valuePercent / normalize) * weight;
      console.log("Added amount to score: ", (valuePercent / normalize) * weight);
    }
  });

  console.log("score: ", score);

  // simulate perfect substat distribution
  const simSubstatSums = {};

  // match energy recharge and calculate that in rolls
  simSubstatSums["Energy Recharge"] = substatSums["Energy Recharge"] || 0;
  const simEnergyRolls = Math.ceil(simSubstatSums["Energy Recharge"] / SUBSTATS["Energy Recharge"]);

  console.log("Energy recharge: ", simSubstatSums["Energy Recharge"], "Rolls: ", simEnergyRolls);

  const getLargestKey = (obj) => {
    const entries = Object.entries(obj);
    if (entries.length === 0) {
      return ""; // Handle empty object case
    }
    return entries.reduce((maxKey, [key, value]) =>
      value > obj[maxKey] ? key : maxKey
    , Object.keys(obj)[0]); // Initialize with the first key
  };

  // allocate substats
  let rollsLeft = Math.max(40 - simEnergyRolls, 0);
  const availableWeights = { ...charRef.weights };
  let rollCount0 = 0;
  let rollCount1 = 0;
  let rollCount2 = 0;
  let rollCount3 = 0;
  let rollCount4 = 0;
  while (rollsLeft > 0) {
    console.log("Rolls left to allocate: ", rollsLeft);
    let biggestWeightStat = getLargestKey(availableWeights);
    if (!biggestWeightStat) {
      console.log("No more available weights");
      break;
    }

    console.log("Allocating this weight: ", biggestWeightStat);

    let using0 = rollCount0 < 8 ? true : false;
    let using1 = rollCount1 < 8 ? true : false;
    let using2 = rollCount2 < 8 ? true : false;
    let using3 = rollCount3 < 8 ? true : false;
    let using4 = rollCount4 < 8 ? true : false;

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
      (using0 ? ((rollCount0 === 0) ? 5 : 1) : 0) +
      (using1 ? ((rollCount1 === 0) ? 5 : 1) : 0) +
      (using2 ? ((rollCount2 === 0) ? 5 : 1) : 0) +
      (using3 ? ((rollCount3 === 0) ? 5 : 1) : 0) +
      (using4 ? ((rollCount4 === 0) ? 5 : 1) : 0);
    
    if (using0) {
      if (rollCount0 === 0) {
        rollCount0 = 5;
      } else {
        rollCount0++;
      }
    }

    if (using1) {
      if (rollCount1 === 0) {
        rollCount1 = 5;
      } else {
        rollCount1++;
      }
    }

    if (using2) {
      if (rollCount2 === 0) {
        rollCount2 = 5;
      } else {
        rollCount2++;
      }
    }

    if (using3) {
      if (rollCount3 === 0) {
        rollCount3 = 5;
      } else {
        rollCount3++;
      }
    }

    if (using4) {
      if (rollCount4 === 0) {
        rollCount4 = 5;
      } else {
        rollCount4++;
      }
    }

    if (rollsLeft < maxTimesToRoll) {
      maxTimesToRoll = rollsLeft;
    }

    simSubstatSums[biggestWeightStat] = (simSubstatSums[biggestWeightStat] || 0) + (maxTimesToRoll * SUBSTATS[biggestWeightStat]);
    console.log("Adding this many rolls: ", maxTimesToRoll);
    console.log("Value of 1 roll: ", SUBSTATS[biggestWeightStat]);
    console.log("Total amount in simSubstatSums: ", simSubstatSums[biggestWeightStat]);

    delete availableWeights[biggestWeightStat];
    rollsLeft -= maxTimesToRoll;
  }

  console.log("Substat allocation complete");
  console.log("simSubstatSums: ", simSubstatSums);

  // calculate score for sim stats
  console.log("Begin score2 calculation");
  let score2 = 0;
  Object.entries(simSubstatSums).forEach(([key, value]) => {
    if (charRef.weights[key]) { // if stat is in weights
      const weight = charRef.weights[key];
      const normalize = SUBSTATS[key];
      console.log("Scoring stat: ", key, value);
      console.log("Normalize, Weight: ", normalize, weight);
      score2 += (value / normalize) * weight;
      console.log("Added amount to score: ", (value / normalize) * weight);
    } else if (baseStats[key] && charRef.weights[key + "%"]) { // base stats
      // convert to %
      const valuePercent = (value / baseStats[key]) * 100;
      const weight = charRef.weights[key + "%"];
      const normalize = SUBSTATS[key + "%"];
      console.log("Scoring base stat: ", key, value);
      console.log("valuePercent, Normalize, Weight: ", valuePercent, normalize, weight);
      score2 += (valuePercent / normalize) * weight;
      console.log("Added amount to score: ", (valuePercent / normalize) * weight);
    }
  });

  console.log("score2: ", score2)

  const finalscore = Math.round((score / score2) * 100);
  return finalscore.toString();
};

export default getScore;
