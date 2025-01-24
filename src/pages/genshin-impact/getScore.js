import CHARACTERS from "./data/CHARACTERS";
import WEAPONS from "./data/WEAPONS";
import SETS from "./data/SETS";
import MAINSTATS from "./data/MAINSTATS";
import SUBSTATS from "./data/SUBSTATS";

function percentage(value, total) {
  return (value / total) * 100;
}

const getScore = (id, char) => {
  // create refs for readability
  const charRef = CHARACTERS[id];
  const weaponRef = WEAPONS[char.weapon];
  const setRef = SETS[char.set];
  const weightsRef = CHARACTERS[id].weights;

  // sum up all the mainstats to a single object
  // BROKEN
  const mainstatValues = char.pieces
    .flatMap((piece, index) => 
      piece.mainstat ? { main: piece.mainstat, index } : null
    )
    .filter(main => main) // filter out blank mainstats
    .slice(2) // dont include first 2 pieces
    .reduce((totals, main) => { // combine same mainstat values
      totals[main] = (totals[main] || 0) + MAINSTATS[index][main];
      return totals;
    }, {});

  console.log(mainstatValues);
  
  // sum up all the substats to a single object
  const substatValues = char.pieces
    .flatMap(piece => piece.substats) // consolidate all pieces to 1 piece
    .filter(sub => sub.key) // filter out blank substats
    .reduce((totals, sub) => { // combine same substat values
      totals[sub.key] = (totals[sub.key] || 0) + Number(sub.value);
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
    (charRef.ascension["Energy Recharge"] || 0) +
    (charRef.passive["Energy Recharge"] || 0) +
    (weaponRef.stats["Energy Recharge"] || 0) +
    (setRef.stats["Energy Recharge"] || 0);
  
  const totalEr = externalEr + (combinedValues["Energy Recharge"] || 0);
  if (totalEr > charRef.energyReq) { // too much er
    combinedValues["Energy Recharge"] = Math.max(charRef.energyReq - externalEr, 0);
  } else { // not enough er
    combinedValues["Energy Recharge"] = (combinedValues["Energy Recharge"] || 0) - (charRef.energyReq - totalEr);
  }
  
  // exclude cr over 100
  const externalCr = 5 +
    (charRef.ascension["CRIT Rate"] || 0) +
    (charRef.passive["CRIT Rate"] || 0) +
    (weaponRef.stats["CRIT Rate"] || 0) +
    (setRef.stats["CRIT Rate"] || 0);
  
  const totalCr = externalCr + (combinedValues["CRIT Rate"] || 0);
  if (totalCr > 100) {
    combinedValues["CRIT Rate"] = 100 - externalCr;
  }

  // calculate score
  let score = 0;
  Object.entries(combinedValues).forEach(([key, value]) => {
    const weight = key === "Energy Recharge" ? 1 : (weightsRef[key] || 0);
    const normalize = SUBSTATS[key];
    score += (value / normalize) * weight;
  });

  return Math.max(0, Math.round(percentage(score, 50)));
};

export default getScore;
