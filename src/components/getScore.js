const combine_basestats = (charBase, weapBase) => {
  return Object.entries(charBase).reduce((basestats, [key, value]) => {
    basestats[key] = value + (weapBase[key] || 0);
    return basestats;
  }, {});
};

const combine_substats = (substatsArr) => {
  const substats = {};
  for (let i = 0; i < substatsArr.length; i++) {
    for (let j = 0; j < Object.keys(substatsArr[i]).length; j++) {
      const key = substatsArr[i][j][0];
      const value = Number(substatsArr[i][j][1]);
      if (!key || !value) continue;
      substats[key] = (substats[key] || 0) + value;
    }
  }
  return substats;
};

const getLargestWeight = (weights) => {
  const entries = Object.entries(weights);
  if (entries.length === 0) return "";
  return entries.reduce((maxWeight, [key, value]) =>
    value > weights[maxWeight] ? key : maxWeight, Object.keys(weights)[0]);
};

const simulate_substats = (substats, weights, mainstatsArr, SUBSTATS, gameType) => {
  // Match stat(er,spd,_,er) and calculate that in rolls
  const sim_substats = {};
  let matchStat = "";
  let matchStat2 = "";
  let simMatchRolls = 0;
  let TOTAL_ROLLS = 48;
  let MAX_ROLLS_PER_PIECE = 8;
  let FIXED_STAT_UNTIL_WHEN = 3;
  let INITIAL_ROLL_INCREMENT = 5;
  if (gameType === "GI") {
    matchStat = "ENERGY_RECHARGE";
    TOTAL_ROLLS = 40;
    FIXED_STAT_UNTIL_WHEN = 2;
  } else if (gameType === "HSR") {
    matchStat = "SPD";
    matchStat2 = "EFFECT_HIT_RATE"
    FIXED_STAT_UNTIL_WHEN = 2;
  } else if (gameType === "WW") {
    matchStat = "ENERGY_REGEN";
    TOTAL_ROLLS = 25;
    MAX_ROLLS_PER_PIECE = 5;
    FIXED_STAT_UNTIL_WHEN = 0;
    INITIAL_ROLL_INCREMENT = 1;
  }
  const availableWeights = { ...weights };
  if (matchStat) {
    sim_substats[matchStat] = substats[matchStat] || 0;
    simMatchRolls += Math.ceil(sim_substats[matchStat] / SUBSTATS[matchStat]?.value);
    delete availableWeights[matchStat];
  }
  if (matchStat2) {
    sim_substats[matchStat2] = substats[matchStat2] || 0;
    simMatchRolls += Math.ceil(sim_substats[matchStat2] / SUBSTATS[matchStat2]?.value);
    delete availableWeights[matchStat2];
  }
  let rollsLeft = Math.max(TOTAL_ROLLS - simMatchRolls, 0);
  const rollCount = new Array(mainstatsArr.length).fill(0);
  while (rollsLeft > 0) {
    // get stat to roll
    const largestWeight = getLargestWeight(availableWeights);
    if (!largestWeight) break;

    // figure out which pieces are given rolls
    const usingPiece = new Array(mainstatsArr.length).fill(false);
    for (let i = 0; i < mainstatsArr.length; i++) {
      usingPiece[i] = rollCount[i] < MAX_ROLLS_PER_PIECE ? true : false;
      if (i < FIXED_STAT_UNTIL_WHEN) continue;
      if (largestWeight === mainstatsArr[i]) {
        usingPiece[i] = false;
      }
    }

    // add rolls to timesToRoll and increment rollCount
    let timesToRoll = 0;
    for (let i = 0; i < mainstatsArr.length; i++) {
      if (!usingPiece[i]) continue;
      if (rollCount[i] === 0) {
        timesToRoll += INITIAL_ROLL_INCREMENT;
        rollCount[i] += INITIAL_ROLL_INCREMENT;
      } else {
        timesToRoll++;
        rollCount[i]++;
      }
    }

    if (timesToRoll > rollsLeft) {
      timesToRoll = rollsLeft;
    }

    // add rolls to sim_substats
    sim_substats[largestWeight] = (sim_substats[largestWeight] || 0) + (timesToRoll * SUBSTATS[largestWeight]?.value);

    // remove stat from available weights
    delete availableWeights[largestWeight];
    rollsLeft -= timesToRoll;
  }

  return sim_substats;
};

const calculatePoints = (statsObj, weights, basestats, SUBSTATS) => {
  let points = 0;
  Object.entries(statsObj).forEach(([key, value]) => {
    if (weights[key]) {
      const weight = weights[key];
      const normalize = SUBSTATS[key]?.value;
      points += (value / normalize) * weight;
    } else if (basestats[key] && weights[key.substring(5)]) {
      const valuePercent = (value / basestats[key]) * 100;
      const weight = weights[key.substring(5)];
      const normalize = SUBSTATS[key.substring(5)]?.value;
      points += (valuePercent / normalize) * weight;
    }
  });
  return points;
};

const getScore = (gameType, gameData, cid, cdata) => {
  const { CHAR, WEAP } = gameData;
  const SUBSTATS = gameData.INFO.SUBSTATS;
  if (!cdata.weapon) return "N/A";

  // Combine basestats
  const basestats = combine_basestats(CHAR[cid].base, WEAP[cdata.weapon].base);
  console.log("basestats: ", basestats);

  // Combine substats
  const substats = combine_substats(cdata.substats);
  console.log("substats: ", substats);

  // Simulate perfect substats
  const sim_substats = simulate_substats(substats, CHAR[cid].weights, cdata.mainstats, SUBSTATS, gameType);
  console.log("sim_substats: ", sim_substats);

  // Calculate points
  const points = calculatePoints(substats, CHAR[cid].weights, basestats, SUBSTATS);
  const sim_points = calculatePoints(sim_substats, CHAR[cid].weights, basestats, SUBSTATS);
  console.log("points: ", points);
  console.log("sim_points: ", sim_points);

  // Calculate score
  return Math.round((points / sim_points) * 100);
};

export default getScore;
