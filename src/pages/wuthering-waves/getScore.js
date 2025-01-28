import CHARACTERS from "./data/CHARACTERS";
import WEAPONS from "./data/WEAPONS";
import SETS from "./data/SETS";
import MAINSTATS from "./data/MAINSTATS";
import SUBSTATS from "./data/SUBSTATS";
import { NORMALIZE_4, NORMALIZE_3, NORMALIZE_1 } from "./data/NORMALIZE";

const EXTRA_VALUES = [
  { // 0
    "ATK": 150,
  },
  { // 1
    "ATK": 100,
  },
  { // 2
    "ATK": 100,
  },
  { // 3
    "HP": 2280,
  },
  { // 4
    "HP": 2280,
  },
];

const getScore = (cid, cdata) => {
  return "0";
  // create refs for readability
  const charRef = charData[id];
  const weaponRef = weapData[char.weapon];
  const setRef = setData[char.set];
  const weightsRef = charData[id].weights;

  // get basestat values (character + weapon)
  const basestats = { ...charRef.basestats };
  Object.entries(weaponRef.basestats).forEach(([key, value]) => {
    basestats[key] += value;
  });

  // sum up all the mainstats to a single object
  const mainstatValues = char.pieces
    .flatMap(piece => piece.mainstat) // consolidate mainstats to 1 array
    .filter(main => main) // filter out blank mainstats
    .reduce((totals, main) => { // combine same mainstat values
      totals[main] = (totals[main] || 0) + MAINSTAT_VALUES[main];
      return totals;
    }, {});
  
  // sum up all the substats to a single object
  const substatValues = char.pieces
    .flatMap(piece => piece.substats) // consolidate all pieces to 1 piece
    .filter(sub => sub.key) // filter out blank substats
    .reduce((totals, sub) => { // combine same substat values
      if (basestats[sub.key]) { // convert flat stats to percentage stats
        totals[sub.key + "p"] = (totals[sub.key + "p"] || 0) + percentage(Number(sub.value), basestats[sub.key]);
      } else {
        totals[sub.key] = (totals[sub.key] || 0) + Number(sub.value);
      }
      return totals;
    }, {});
  
  // combine substats with mainstats
  const combinedValues = { ...substatValues }; // Start with a copy of substatTotals
  Object.entries(mainstatValues).forEach(([key, value]) => {
    // Add mainstat values to combinedValues, summing if the key exists in substatTotals
    combinedValues[key] = (combinedValues[key] || 0) + value;
  });

  // exclude er over energyReq, penalize not having enough er
  const externalEr = 100 +
    (charRef.minorfortes.er || 0) +
    (charRef.passivestats.er || 0) +
    (weaponRef.stats.er || 0) +
    (setRef.stats.er || 0);
  
  const totalEr = externalEr + (combinedValues.er || 0);
  if (totalEr > charRef.energyReq) { // too much er
    combinedValues.er = Math.max(charRef.energyReq - externalEr, 0);
  } else { // not enough er
    combinedValues.er = (combinedValues.er || 0) - (charRef.energyReq - totalEr);
  }
  
  // exclude cr over 100
  const externalCr = 5 +
    (charRef.minorfortes.cr || 0) +
    (charRef.passivestats.cr || 0) +
    (weaponRef.stats.cr || 0) +
    (setRef.stats.cr || 0);
  
  const totalCr = externalCr + (combinedValues.cr || 0);
  if (totalCr > 100) {
    combinedValues.cr = 100 - externalCr;
  }

  // calculate score
  let score = 0;
  Object.entries(combinedValues).forEach(([key, value]) => {
    const weight = key === "er" ? 1 : (weightsRef[key] || 0);
    const normalize = 10 / MAINSTAT_VALUES[key];
    score += weight * normalize * value;
  });

  return Math.max(0, Math.round(percentage(score, 67)));
};

export default getScore;
