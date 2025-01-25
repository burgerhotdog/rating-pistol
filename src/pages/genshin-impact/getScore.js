import CHARACTERS from "./data/CHARACTERS";
import WEAPONS from "./data/WEAPONS";
import SETS from "./data/SETS";
import MAINSTATS from "./data/MAINSTATS";
import SUBSTATS from "./data/SUBSTATS";

function percentage(value, total) {
  return (value / total) * 100;
}

const getScore = (id, data) => {
  // create refs for readability
  const charRef = CHARACTERS[id];
  const weapRef = WEAPONS[data.weapon];
  const setRef = SETS[data.set];

  // sum up all the mainstats and substats
  const pieceStats = {};
  for (let i = 0; i < 5; i++) {
    // mainstat
    let mainKey = data.pieces[i].mainstat;
    let mainVal = MAINSTATS[i][mainKey];
    if (mainKey && mainVal) {
      pieceStats[mainKey] = (pieceStats[mainKey] || 0) + mainVal;
    }

    // substats
    for (let j = 0; j < 4; j++) {
      let subKey = data.pieces[i].substats[j].key;
      let subVal = Number(data.pieces[i].substats[j].value);
      if (subKey && subVal) {
        pieceStats[subKey] = (pieceStats[subKey] || 0) + subVal;
      }
    }
  }
  console.log(pieceStats);
  return "0";

  // exclude er over energyReq, penalize not having enough er
  const startingER = 100 +
    (charRef.stats["Energy Recharge"] || 0) +
    (weapRef.stats["Energy Recharge"] || 0) +
    (setRef.stats["Energy Recharge"] || 0);

  const piecesER = (pieceStats["Energy Recharge"] || 0);
  
  const totalER = startingER + piecesER;
  if (totalER > charRef.requirements["Energy Recharge"]) { // too much er
    pieceStats["Energy Recharge"] = Math.max(charRef.energyReq - startingER, 0);
  } else { // not enough er
    pieceStats["Energy Recharge"] = (pieceStats["Energy Recharge"] || 0) - (charRef.energyReq - totalER);
  }
  
  // remove crit rate over 100
  const startingCR = 5 +
    (charRef.stats["CRIT Rate"] || 0) +
    (weapRef.stats["CRIT Rate"] || 0) +
    (setRef.stats["CRIT Rate"] || 0);
  
  const piecesCR = (pieceStats["CRIT Rate"] || 0);
  
  if (startingCR + piecesCR > 100) {
    pieceStats["CRIT Rate"] = 100 - startingCR;
  }

  // calculate score
  let score = 0;
  Object.entries(pieceStats).forEach(([key, value]) => {
    const weight = key === "Energy Recharge" ? 1 : (weightsRef[key] || 0);
    const normalize = SUBSTATS[key];
    score += (value / normalize) * weight;
  });

  return Math.max(0, Math.round(percentage(score, 50))).toString;
};

export default getScore;
