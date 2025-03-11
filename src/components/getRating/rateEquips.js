import getData from "../getData";

const combine_basestats = (charBase, weapBase) => {
  return Object.entries(charBase).reduce((basestats, [key, value]) => {
    basestats[key] = value + (weapBase[key] || 0);
    return basestats;
  }, {});
};

const combine_substats = (equipList) => {
  const substats = {};
  for (const equipObj of equipList) {
    for (const statObj of Object.values(equipObj.statMap)) {
      const { key, value } = statObj;
      if (key && value) {
        substats[key] = (substats[key] || 0) + Number(value);
      }
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

const simulate_substats = (substats, weights, equipList, STAT_INDEX, gameId) => {
  // Match stat(er,spd,_,er) and calculate that in rolls
  const sim_substats = {};
  let matchStat = "";
  let matchStat2 = "";
  let simMatchRolls = 0;
  let TOTAL_ROLLS = 48;
  let MAX_ROLLS_PER_PIECE = 8;
  let FIXED_STAT_UNTIL_WHEN = 3;
  let INITIAL_ROLL_INCREMENT = 5;
  if (gameId === "gi") {
    matchStat = "ER";
    TOTAL_ROLLS = 40;
    FIXED_STAT_UNTIL_WHEN = 2;
  } else if (gameId === "hsr") {
    matchStat = "SPD";
    matchStat2 = "EHR"
    FIXED_STAT_UNTIL_WHEN = 2;
  } else if (gameId === "ww") {
    matchStat = "ER";
    TOTAL_ROLLS = 25;
    MAX_ROLLS_PER_PIECE = 5;
    FIXED_STAT_UNTIL_WHEN = 0;
    INITIAL_ROLL_INCREMENT = 1;
  }
  const availableWeights = { ...weights };
  if (matchStat) {
    sim_substats[matchStat] = substats[matchStat] || 0;
    simMatchRolls += Math.ceil(sim_substats[matchStat] / STAT_INDEX[matchStat]?.valueSub);
    delete availableWeights[matchStat];
  }
  if (matchStat2) {
    sim_substats[matchStat2] = substats[matchStat2] || 0;
    simMatchRolls += Math.ceil(sim_substats[matchStat2] / STAT_INDEX[matchStat2]?.valueSub);
    delete availableWeights[matchStat2];
  }
  let rollsLeft = Math.max(TOTAL_ROLLS - simMatchRolls, 0);
  const rollCount = new Array(Object.entries(equipList).length).fill(0);
  while (rollsLeft > 0) {
    // get stat to roll
    const largestWeight = getLargestWeight(availableWeights);
    if (!largestWeight) break;

    // figure out which pieces are given rolls
    const usingPiece = new Array(Object.entries(equipList).length).fill(false);
    for (let i = 0; i < Object.entries(equipList).length; i++) {
      usingPiece[i] = rollCount[i] < MAX_ROLLS_PER_PIECE ? true : false;
      if (i < FIXED_STAT_UNTIL_WHEN) continue;
      if (largestWeight === equipList[i].key) {
        usingPiece[i] = false;
      }
    }

    // add rolls to timesToRoll and increment rollCount
    let timesToRoll = 0;
    for (let i = 0; i < Object.entries(equipList).length; i++) {
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
    sim_substats[largestWeight] = (sim_substats[largestWeight] || 0) + (timesToRoll * STAT_INDEX[largestWeight]?.valueSub);

    // remove stat from available weights
    delete availableWeights[largestWeight];
    rollsLeft -= timesToRoll;
  }

  return sim_substats;
};

const calculatePoints = (statsObj, weights, basestats, STAT_INDEX) => {
  let points = 0;
  Object.entries(statsObj).forEach(([key, value]) => {
    if (weights[key]) {
      const weight = weights[key];
      const normalize = STAT_INDEX[key]?.valueSub;
      points += (value / normalize) * weight;
    } else if (basestats[key] && weights[key.slice(1)]) {
      const valuePercent = (value / basestats[key]) * 100;
      const weight = weights[key.slice(1)];
      const normalize = STAT_INDEX[key.slice(1)]?.valueSub;
      points += (valuePercent / normalize) * weight;
    }
  });
  return points;
};

const rateEquips = (gameId, id, data) => {
  const { equipData, avatarData, weaponData } = getData[gameId];
  const { STAT_INDEX } = equipData;
  if (!data.equipList) return -1;
  for (const equip of data.equipList) {
    if (!equip.key) return -1;
  }

  if (!data.weaponId) return 0;

  // Combine stats
  const basestats = combine_basestats(avatarData[id].statBase, weaponData[data.weaponId].statBase);
  const substats = combine_substats(data.equipList);

  // Simulate perfect substats
  const sim_substats = simulate_substats(substats, avatarData[id].weights, data.equipList, STAT_INDEX, gameId);

  // Calculate points
  const points = calculatePoints(substats, avatarData[id].weights, basestats, STAT_INDEX);
  const sim_points = calculatePoints(sim_substats, avatarData[id].weights, basestats, STAT_INDEX);

  // Calculate score
  return (points / sim_points) * 100;
};

export default rateEquips;
