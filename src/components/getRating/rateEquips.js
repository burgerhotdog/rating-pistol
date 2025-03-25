import getData from "../getData";
import equipConfig from "./equipConfig";

const rateEquips = (gameId, id, data) => {
  const { AVATAR_DATA, STAT_INDEX } = getData[gameId];
  const config = equipConfig[gameId];

  // consolidate mainstats
  const mainstats = data.equipList
    .filter(({ key }) => key)
    .reduce((acc, { key }) => (
      (acc[key] ??= 0), acc[key] += STAT_INDEX[key].valueMain, acc
    ), {});
  
  // consolidate substats
  const substats = data.equipList
    .flatMap(({ statMap }) => Object.values(statMap))
    .filter(({ key, value }) => key && value)
    .reduce((acc, { key, value }) => (
      (acc[key] ??= 0), acc[key] += Number(value), acc
    ), {});

  // calculate optimized substat spread
  // match er, ehr, spd
  const sim_substats = {};
  let matchRolls = 0;
  const availableWeights = { ...AVATAR_DATA[id].weights };
  for (const matchStat of config.matchStats) {
    const matchValue = substats[matchStat];
    if (!matchValue) continue;
    sim_substats[matchStat] = matchValue;
    matchRolls += Math.ceil(matchValue / STAT_INDEX[matchStat].valueSub);
    delete availableWeights[matchStat];
  }

  // distribute rolls
  const rollCounts = new Array(config.numMain).fill(0);
  let rollsLeft = Math.max(config.totalRolls - matchRolls, 0);
  while (rollsLeft) {
    if (!Object.keys(availableWeights).length) break;

    // identify remaining stat with highest weight
    const bestStat = Object.entries(availableWeights)
      .reduce((maxKey, [key, value]) => (
        value > availableWeights[maxKey] ? key : maxKey
      ), Object.keys(availableWeights)[0]);

    // figure out which pieces can receive rolls
    const beingRolled = data.equipList.map(({ key }, index) =>
      rollCounts[index] < config.rollsPerPiece &&
      (gameId === "ww" || key !== bestStat)
    );

    // calculate total roll count and increment individual rollCounts
    const totalIncrement = beingRolled.reduce((acc, isRolled, index) => {
      if (!isRolled) return acc;
      const increment = !rollCounts[index] ? config.firstIncrement : 1;
      rollCounts[index] += increment;
      return acc + increment;
    }, 0);
    const actualIncrement = Math.min(totalIncrement, rollsLeft);

    // add rolls to sim_substats
    sim_substats[bestStat] ??= 0;
    sim_substats[bestStat] += actualIncrement * STAT_INDEX[bestStat].valueSub;

    // remove stat from available weights
    delete availableWeights[bestStat];
    rollsLeft -= actualIncrement;
  }

  // calculate substat points
  const [points, sim_points] = [substats, sim_substats].map(stats =>
    Object.entries(stats).reduce((total, [key, value]) => {
      const weight = AVATAR_DATA[id].weights[key];
      return weight
        ? total + (value / STAT_INDEX[key].valueSub) * weight
        : total;
    }, 0)
  );

  // calculate score
  if (!sim_points) return 100;
  return ((points / sim_points) * 100) / 0.75;
};

export default rateEquips;
