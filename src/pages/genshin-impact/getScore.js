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
      console.log(value, normalize, weight);
    } else if (baseStats[key] && charRef.weights[key + "%"]) { // base stats
      // convert to %
      const valuePercent = (value / baseStats[key]) * 100;
      const weight = charRef.weights[key + "%"];
      const normalize = NORMALIZE[key + "%"];
      score += (valuePercent / normalize) * weight;
      console.log(value, valuePercent, normalize, weight);
    }
  });

  console.log(baseStats, pieceStats, score);

  // simulate perfect substat distribution
  const simStats = { "HP": 4780, "ATK": 311 };

  // extract energy recharge from pieces
  const pieceEnergy = pieceStats["Energy Recharge"] || 0;

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
    simEnergyRolls++;
  }

  // allocate mainstats
  const getLargestKey = (obj1, obj2) => {
    const keysToCheck = Object.keys(obj2);
    if (keysToCheck.length === 0) return null; // Handle case when obj2 has no keys
  
    return keysToCheck.reduce((maxKey, key) => {
      if (obj1[key] === undefined) return maxKey; // Skip keys not in obj1
      return obj1[key] > (obj1[maxKey] || -Infinity) ? key : maxKey;
    }, null);
  };
  
  if (!useErMainstat) {
    const p3main = getLargestKey(charRef.weights, MAINSTATS[2])
    simStats[p3main] = MAINSTATS[2][p3main];
  }

  const p4main = getLargestKey(charRef.weights, MAINSTATS[3])
  simStats[p4main] = MAINSTATS[3][p4main];

  const p5main = getLargestKey(charRef.weights, MAINSTATS[4])
  simStats[p5main] = MAINSTATS[4][p5main];

  // allocate substats
  let substatsLeft = 40;
  // todo


  return "0";
};

export default getScore;
