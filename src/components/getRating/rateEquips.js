import { DATA } from "../importData";
import equipConfig from "./equipConfig";

const rateEquips = (gameId, id, data) => {
  const { AVATAR_DATA, STAT_INDEX, MAINSTAT_OPTIONS } = DATA[gameId];
  const config = equipConfig[gameId];

  // consolidate mainstats
  const mainstats = data.equipList
    .filter(({ key }) => key)
    .reduce((acc, { key }, index) => {
      const valueKeyWW =
        index === 0 ? "valueMain4" :
        index <= 2 ? "valueMain3" :
        "valueMain1";
  
      (acc[key] ??= 0);
      acc[key] += STAT_INDEX[key][gameId === "ww" ? valueKeyWW : "valueMain"];
  
      return acc;
    }, {});
  
  // consolidate substats
  const substats = data.equipList
    .flatMap(({ statMap }) => Object.values(statMap))
    .filter(({ key, value }) => key && value)
    .reduce((acc, { key, value }) => (
      (acc[key] ??= 0), acc[key] += Number(value), acc
    ), {});
  
  // calculate optimized mainstat spread
  // match er, ehr, spd
  const sim_mainstats = {};
  const mainFilled = new Array(config.numMain).fill(false);
  const availableMainWeights = Object.fromEntries(
    Object.entries(AVATAR_DATA[id].weights)
      .filter(([weight]) => gameId === "ww"
        ? (STAT_INDEX[weight].valueMain4 || STAT_INDEX[weight].valueMain3)
        : STAT_INDEX[weight].valueMain)
  );
  for (const matchStat of config.matchStatsMain) {
    delete availableMainWeights[matchStat];
  }
  for (const [index, { key }] of data.equipList.entries()) {
    if (config.matchStatsMain.includes(key)) {
      sim_mainstats[key] ??= 0;
      sim_mainstats[key] += gameId === "ww"
        ? STAT_INDEX[key][`valueMain${index < 1 ? 4 : index < 3 ? 3 : 1}`]
        : STAT_INDEX[key].valueMain;
      mainFilled[index] = true;
    } else {
      if (!Object.entries(availableMainWeights).length) continue;
      const options = MAINSTAT_OPTIONS[index];
      const bestStat = options.reduce((maxKey, key) => (
        availableMainWeights[key] > (availableMainWeights[maxKey] ?? 0)
          ? key
          : maxKey
      ), options[0]);
      sim_mainstats[bestStat] ??= 0;
      sim_mainstats[bestStat] += gameId === "ww"
        ? STAT_INDEX[bestStat][`valueMain${index < 1 ? 4 : index < 3 ? 3 : 1}`]
        : STAT_INDEX[bestStat].valueMain;
    }
  }

  // calculate optimized substat spread
  // match er, ehr, spd
  const sim_substats = {};
  let matchRolls = 0;
  const availableWeights = Object.fromEntries(
    Object.entries(AVATAR_DATA[id].weights)
      .filter(([weight]) => STAT_INDEX[weight].valueSub)
  );
  for (const matchStat of config.matchStatsSub) {
    delete availableWeights[matchStat];
    const matchValue = substats[matchStat];
    if (!matchValue) continue;
    sim_substats[matchStat] = matchValue;
    matchRolls += Math.ceil(matchValue / STAT_INDEX[matchStat].valueSub);
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

  // calculate mainstat points
  const [pointsM, sim_pointsM] = [mainstats, sim_mainstats].map(stats =>
    Object.entries(stats).reduce((total, [key, value]) => {
      const weight = AVATAR_DATA[id].weights[key];
      const normalize = gameId === "ww"
        ? ((STAT_INDEX[key].valueMain4
          ? STAT_INDEX[key].valueMain4
          : STAT_INDEX[key].valueMain3) / 10)
        : (STAT_INDEX[key].valueMain / 10);
      return weight
        ? total + (value / normalize) * weight
        : total;
    }, 0)
  );

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
  if (!(sim_pointsM + sim_points)) return 100;
  return (((pointsM + points) / (sim_pointsM + sim_points)) * 100) / 0.8;
};

export default rateEquips;
