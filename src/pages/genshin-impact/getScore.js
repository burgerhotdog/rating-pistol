import charData from "./data/charData";

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
  // get base stat values
  const basestats = charData[id].basestats;
  basestats.atk += Number(char.weapon.entry.baseatk || 0);

  // sum up all the mainstats to a single object
  const mainstatTotals = char.pieces
    .flatMap(piece => piece.mainstat) // consolidate mainstats to 1 array
    .filter(main => main) // filter out blank mainstats
    .slice(2) // dont include first 2 pieces
    .reduce((totals, main) => { // combine same mainstat values
      totals[main] = (totals[main] || 0) + MAINSTAT_VALUES[main];
      return totals;
    }, {});

  // sum up all the substats to a single object
  const substatTotals = char.pieces
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
  const combinedTotals = { ...substatTotals }; // Start with a copy of substatTotals
  Object.entries(mainstatTotals).forEach(([key, value]) => {
    // Add mainstat values to combinedTotals, summing if the key exists in substatTotals
    combinedTotals[key] = (combinedTotals[key] || 0) + value;
  });
  
  // exclude cr over 100
  const externalCr = 5 +
    Number(char.weapon.entry.stat?.cr || 0) +
    Number(charData[id].ascensionstat?.cr || 0) +
    Number(char.set.entry.stat?.cr || 0);
  
  if (externalCr + (combinedTotals.cr || 0) >= 100) {
    combinedTotals.cr = 100 - externalCr;
  }

  // exclude er over energyReq, penalize not enough er
  const externalEr = 100 +
    Number(char.weapon.entry.stat?.er || 0) +
    Number(charData[id].ascensionstat?.er || 0) +
    Number(char.set.entry.stat?.er || 0);
  
  const currentEr = (combinedTotals.er || 0) + externalEr;
  if (currentEr >= charData[id].energyReq) {
    combinedTotals.er = charData[id].energyReq - externalEr;
  } else {
    combinedTotals.er = (combinedTotals.er || 0) - (charData[id].energyReq - currentEr);
  }

  // calculate score
  let score = 0;
  Object.entries(combinedTotals).forEach(([key, value]) => {
    const weight = charData[id]?.weights[key] || 0;
    const normalize = 10 / MAINSTAT_VALUES[key];
    score += weight * normalize * value;
  });

  return Math.round(percentage(score, 50));
};

export default getScore;
