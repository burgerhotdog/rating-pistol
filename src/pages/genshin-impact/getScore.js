import charData from "./data/charData";
import weapData from "./data/weapData";
import setData from "./data/setData";

const MAINSTAT_VALUES = {
  hpp: 46.6,
  atkp: 46.6,
  defp: 58.3,
  em: 186.5,
  er: 51.8,
  anemo: 46.6,
  geo: 46.6,
  electro: 46.6,
  dendro: 46.6,
  hydro: 46.6,
  pyro: 46.6,
  cryo: 46.6,
  physical: 58.3,
  cr: 31.1,
  cd: 62.2,
  hb: 35.9,
}

function percentage(value, total) {
  return (value / total) * 100;
}

const getScore = (id, char) => {
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
  const mainstatValuesMap = char.pieces
    .flatMap(piece => piece.mainstat) // consolidate mainstats to 1 array
    .filter(main => main) // filter out blank mainstats
    .slice(2) // dont include first 2 pieces
    .reduce((totals, main) => { // combine same mainstat values
      totals[main] = (totals[main] || 0) + MAINSTAT_VALUES[main];
      return totals;
    }, {});
  
  // sum up all the substats to a single object
  const substatValuesMap = char.pieces
    .flatMap(piece => piece.substats) // consolidate all pieces to 1 piece
    .filter(sub => sub.name) // filter out blank substats
    .reduce((totals, sub) => { // combine same substat values
      if (basestats[sub.name]) { // convert flat stats to percentage stats
        totals[sub.name + "p"] = (totals[sub.name + "p"] || 0) + percentage(Number(sub.value), basestats[sub.name]);
      } else {
        totals[sub.name] = (totals[sub.name] || 0) + Number(sub.value);
      }
      return totals;
    }, {});
  
  // combine substats with mainstats
  const combinedValuesMap = { ...substatValuesMap }; // Start with a copy of substatTotals
  Object.entries(mainstatValuesMap).forEach(([key, value]) => {
    // Add mainstat values to combinedTotals, summing if the key exists in substatTotals
    combinedTotals[key] = (combinedTotals[key] || 0) + value;
  });

  // exclude er over energyReq, penalize not having enough er
  const externalEr = 100 +
    (charRef.ascension.er || 0) +
    (charRef.passivestats.er || 0) +
    (weaponRef.stat.er || 0) +
    (setRef.stat.er || 0);
  
  const totalEr = externalEr + (combinedValuesMap.er || 0);
  if (totalEr > charRef.energyReq) { // too much er
    combinedValuesMap.er = Math.max(charRef.energyReq - externalEr, 0);
  } else { // not enough er
    combinedValuesMap.er = (combinedValuesMap.er || 0) - (charRef.energyReq - totalEr);
  }
  
  // exclude cr over 100
  const externalCr = 5 +
    (charRef.ascension.cr || 0) +
    (charRef.passivestats.cr || 0) +
    (weaponRef.stat.cr || 0) +
    (setRef.stat.cr || 0);
  
  const totalCr = externalCr + (combinedValuesMap.cr || 0);
  if (totalCr > 100) {
    combinedValuesMap.cr = 100 - externalCr;
  }

  // calculate score
  let score = 0;
  Object.entries(combinedValuesMap).forEach(([key, value]) => {
    const weight = key === "er" ? 1 : (weightsRef[key] || 0);
    const normalize = 10 / MAINSTAT_VALUES[key];
    score += weight * normalize * value;
  });

  return Math.round(percentage(score, 50));
};

export default getScore;
