import CHARACTERS from "../data/CHARACTERS";
import WEAPONS from "../data/WEAPONS";
import SETS from "../data/SETS";
import { MAINSTATS, SUBSTATS } from "../data/STATS";

const getScore = (cid, cdata) => {
  return "0";
  // create refs for readability
  const charRef = charData[id];
  const weaponRef = weapData[char.weapon];
  const set1Ref = setData[char.set1];
  const set2Ref = setData[char.set2];
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
    .slice(2) // dont include first 2 pieces
    .reduce((totals, main) => { // combine same mainstat values
      totals[main] = (totals[main] || 0) + MAINSTAT_VALUES[main];
      return totals;
    }, {});
  
  // sum up all the substats to a single object
  const substatValues = char.pieces
    .flatMap(piece => piece.substats) // consolidate all pieces to 1 piece
    .filter(sub => sub.key) // filter out blank substats
    .reduce((totals, sub) => { // combine same substat values
      if (basestats[sub.key] && sub.key !== "spd") { // convert flat stats to percentage stats
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

  // exclude spd over spdReq, penalize not having enough spd
  const externalSpd = basestats.spd +
    (charRef.minorTraces.spd || 0) +
    (charRef.passivestats.spd || 0) +
    ((charRef.passivestats.spdp || 0) * 0.01 * basestats.spd) +
    (weaponRef.stats.spd || 0) +
    ((weaponRef.stats.spdp || 0) * 0.01 * basestats.spd) +
    (set1Ref.stats.spd || 0) +
    ((set1Ref.stats.spdp || 0) * 0.01 * basestats.spd) +
    (set2Ref.stats.spd || 0) +
    ((set2Ref.stats.spdp || 0) * 0.01 * basestats.spd);
  
  const totalSpd = externalSpd + (combinedValues.spd || 0);
  if (totalSpd > charRef.spdReq) { // too much spd
    combinedValues.spd = Math.max(charRef.spdReq - externalSpd, 0);
  } else if (totalSpd < charRef.spdReq) { // not enough spd
    combinedValues.spd = (combinedValues.spd || 0) - (charRef.spdReq - totalSpd);
  }

  // exclude ehr over ehrReq, penalize not having enough ehr
  const externalEhr = 0 +
    (charRef.minorTraces.ehr || 0) +
    (charRef.passivestats.ehr || 0) +
    (weaponRef.stats.ehr || 0) +
    (set1Ref.stats.ehr || 0) +
    (set2Ref.stats.ehr || 0);
  
  const totalEhr = externalEhr + (combinedValues.ehr || 0);
  if (totalEhr > charRef.ehrReq) { // too much ehr
    combinedValues.ehr = Math.max(charRef.ehrReq - externalEhr, 0);
  } else if (totalEhr < charRef.ehrReq) { // not enough ehr
    combinedValues.ehr = (combinedValues.ehr || 0) - (charRef.ehrReq - totalEhr);
  }
  
  // exclude cr over 100
  const externalCr = 5 +
    (charRef.minorTraces.cr || 0) +
    (charRef.passivestats.cr || 0) +
    (weaponRef.stats.cr || 0) +
    (set1Ref.stats.cr || 0) +
    (set2Ref.stats.cr || 0);
  
  const totalCr = externalCr + (combinedValues.cr || 0);
  if (totalCr > 100) {
    combinedValues.cr = 100 - externalCr;
  }

  // calculate score
  let score = 0;
  Object.entries(combinedValues).forEach(([key, value]) => {
    const weight = (key === "spd" || key === "ehr") ? 1 : (weightsRef[key] || 0);
    const normalize = 10 / MAINSTAT_VALUES[key];
    score += weight * normalize * value;
  });

  return Math.max(0, Math.round(percentage(score, 65)));
};

export default getScore;
