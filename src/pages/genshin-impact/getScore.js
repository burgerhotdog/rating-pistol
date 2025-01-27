import CHARACTERS from "./data/CHARACTERS";
import WEAPONS from "./data/WEAPONS";
import SETS from "./data/SETS";
import MAINSTATS from "./data/MAINSTATS";
import SUBSTATS from "./data/SUBSTATS";
import NORMALIZE from "./data/NORMALIZE";

function percentage(value, total) {
  return (value / total) * 100;
}

const getScore = (cid, cdata) => {
  console.log("ID + DATA: ", cid, cdata);
  // create refs for readability
  const charRef = CHARACTERS[cid];
  const weapRef = WEAPONS[cdata.weapon];
  const setRef = SETS[cdata.set];

  // sum character and weapon base stats
  const baseStats = {};
  Object.entries(charRef.base).forEach(([key, value]) => {
    baseStats[key] = value + (weapRef.base[key] || 0);
  });

  // sum up all the mainstats and substats
  const pieceStats = {};
  for (let i = 0; i < 5; i++) {
    // mainstat
    let mainKey = cdata.pieces[i].mainstat;
    let mainVal = MAINSTATS[i][mainKey];
    if (mainKey && mainVal) {
      pieceStats[mainKey] = (pieceStats[mainKey] || 0) + mainVal;
    }

    // substats
    for (let j = 0; j < 4; j++) {
      let subKey = cdata.pieces[i].substats[j].key;
      let subVal = Number(cdata.pieces[i].substats[j].value);
      if (subKey && subVal) {
        pieceStats[subKey] = (pieceStats[subKey] || 0) + subVal;
      }
    }
  }
  
  // remove crit rate over 100
  const startingCrit = 5 +
    (charRef.stats["CRIT Rate"] || 0) +
    (weapRef.stats["CRIT Rate"] || 0) +
    (setRef.stats["CRIT Rate"] || 0);
  
  const pieceCrit = (pieceStats["CRIT Rate"] || 0);
  
  if (startingCrit + pieceCrit > 100) {
    pieceStats["CRIT Rate"] = 100 - startingCrit;
  }

  // calculate score
  // loop thru pieceStats
  let score = 0;
  Object.entries(pieceStats).forEach(([key, value]) => {
    if (charRef.weights[key]) { // if stat is in weights
      const weight = charRef.weights[key];
      const normalize = NORMALIZE[key];
      score += (value / normalize) * weight;
      console.log("in score", value, normalize, weight);
    } else if (baseStats[key] && charRef.weights[key + "%"]) { // base stats
      // convert to %
      const valuePercent = (value / baseStats[key]) * 100;
      const weight = charRef.weights[key + "%"];
      const normalize = NORMALIZE[key + "%"];
      score += (valuePercent / normalize) * weight;
      console.log("in score", value, valuePercent, normalize, weight);
    }
  });

  console.log("baseStats: ", baseStats);
  console.log("pieceStats: ", pieceStats);
  console.log("score: ", score);

  // simulate perfect substat distribution
  const simStats = { "HP": 4780, "ATK": 311 };

  // extract energy recharge from pieces
  console.log("Matching energy: ");
  const pieceEnergy = pieceStats["Energy Recharge"] || 0;
  console.log("user build has this much energy: ", pieceEnergy);

  // match simulated build to energy recharge
  let simEnergyRolls = 0;
  let energyLeft = pieceEnergy;
  let useErMainstat = false;
  if (energyLeft >= MAINSTATS[2]["Energy Recharge"]) {
    simStats["Energy Recharge"] = MAINSTATS[2]["Energy Recharge"];
    energyLeft -= MAINSTATS[2]["Energy Recharge"];
    useErMainstat = true;
  } else {
    simStats["Energy Recharge"] = 0;
  }

  while (energyLeft > 0) {
    simStats["Energy Recharge"] += SUBSTATS["Energy Recharge"];
    energyLeft -= SUBSTATS["Energy Recharge"];
    simEnergyRolls++;
  }

  console.log("must match this many energy rolls: ", simEnergyRolls);
  // allocate mainstats
  console.log("Allocating Mainstats:");
  const getLargestKey = (obj1, obj2) => {
    const keysToCheck = Object.keys(obj2);
    if (keysToCheck.length === 0) return null; // Handle case when obj2 has no keys
  
    return keysToCheck.reduce((maxKey, key) => {
      if (!obj1[key]) return maxKey; // Skip keys not in obj1
      return obj1[key] > (obj1[maxKey] || 0) ? key : maxKey;
    }, null);
  };
  
  let p3main = "";
  if (!useErMainstat) {
    p3main = getLargestKey(charRef.weights, MAINSTATS[2])
    simStats[p3main] = (simStats[p3main] || 0) + MAINSTATS[2][p3main];
  } else {
    p3main = "Energy Recharge";
  }
  console.log("p3main: ", p3main, simStats[p3main]);

  const p4main = getLargestKey(charRef.weights, MAINSTATS[3])
  simStats[p4main] = (simStats[p4main] || 0) + MAINSTATS[3][p4main];
  console.log("p4main: ", p4main, simStats[p4main]);

  const p5main = getLargestKey(charRef.weights, MAINSTATS[4])
  simStats[p5main] = (simStats[p5main] || 0) + MAINSTATS[4][p5main];
  console.log("p5main: ", p5main, simStats[p5main]);

  // allocate substats
  console.log("Allocating Substats: ");
  let substatsLeft = Math.max(40 - simEnergyRolls, 0);
  const unusedWeights = {...SUBSTATS};
  console.log("unusedWeights", unusedWeights);
  let leftin1 = 8;
  let leftin2 = 8;
  let leftin3 = 8;
  let leftin4 = 8;
  let leftin5 = 8;
  while (substatsLeft > 0) {
    console.log("Subs left to allocate: ", substatsLeft);
    let biggestWeightStat = getLargestKey(charRef.weights, unusedWeights);
    if (!biggestWeightStat) break;
    console.log("Allocating this weight: ", biggestWeightStat);
    let numTimesMainstat = 0;
    let using1 = leftin1 > 0 ? true : false;
    let using2 = leftin2 > 0 ? true : false;
    let using3 = leftin3 > 0 ? true : false;
    let using4 = leftin4 > 0 ? true : false;
    let using5 = leftin5 > 0 ? true : false;
    if (biggestWeightStat === p3main) {
      numTimesMainstat++;
      using3 = false;
    }
    if (biggestWeightStat === p4main) {
      numTimesMainstat++;
      using4 = false;
    }
    if (biggestWeightStat === p5main) {
      numTimesMainstat++;
      using5 = false;
    }
    let maxTimesToRoll = 0 +
      (using1 ? ((leftin1 === 8) ? 5 : 1) : 0) +
      (using2 ? ((leftin2 === 8) ? 5 : 1) : 0) +
      (using3 ? ((leftin3 === 8) ? 5 : 1) : 0) +
      (using4 ? ((leftin4 === 8) ? 5 : 1) : 0) +
      (using5 ? ((leftin5 === 8) ? 5 : 1) : 0);
    
    if (using1) {
      if (leftin1 === 8) {
        leftin1 = 3;
      } else {
        leftin1--;
      }
    }
    if (using2) {
      if (leftin2 === 8) {
        leftin2 = 3;
      } else {
        leftin2--;
      }
    }
    if (using3) {
      if (leftin3 === 8) {
        leftin3 = 3;
      } else {
        leftin3--;
      }
    }
    if (using4) {
      if (leftin4 === 8) {
        leftin4 = 3;
      } else {
        leftin4--;
      }
    }
    if (using5) {
      if (leftin5 === 8) {
        leftin5 = 3;
      } else {
        leftin5--;
      }
    }

    if (substatsLeft < maxTimesToRoll) {
      maxTimesToRoll = substatsLeft;
    }

    simStats[biggestWeightStat] = (simStats[biggestWeightStat] || 0) + (maxTimesToRoll * SUBSTATS[biggestWeightStat]);
    console.log("Adding this many rolls: ", maxTimesToRoll);
    console.log("Value of 1 roll: ", SUBSTATS[biggestWeightStat]);
    console.log("Total amount in simStats: ", simStats[biggestWeightStat]);

    substatsLeft -= maxTimesToRoll;
    delete unusedWeights[biggestWeightStat];
  }

  console.log("simStats: ", simStats);
  // calculate score again
  let score2 = 0;
  Object.entries(simStats).forEach(([key, value]) => {
    if (charRef.weights[key]) { // if stat is in weights
      const weight = charRef.weights[key];
      const normalize = NORMALIZE[key];
      score2 += (value / normalize) * weight;
      console.log("in score2", value, normalize, weight);
    } else if (baseStats[key] && charRef.weights[key + "%"]) { // base stats
      // convert to %
      const valuePercent = (value / baseStats[key]) * 100;
      const weight = charRef.weights[key + "%"];
      const normalize = NORMALIZE[key + "%"];
      score2 += (valuePercent / normalize) * weight;
      console.log("in score2", value, valuePercent, normalize, weight);
    }
  });

  console.log("score2: ", score2)


  return "0";
};

export default getScore;
