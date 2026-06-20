import { MISC } from '@/data';
import { mergeObj, mergeEquipList, sumRotationDmg } from '@/utils';
import { weightedLottery } from './helpers';
import { evaluateRotation } from './rotation';
import { getPenalty } from './penalty';

const DAILY_STAMINA = 240;
const WEEKLY_STAMINA = 120;
const COST_PER_RUN = 60;
const DROPS_PER_RUN = 4.33;

const WW_ATKDEF = {
  FLAT_ATK: [30, 40, 50, 60],
  FLAT_DEF: [40, 50, 60, 70],
};

const WW_CRIT = {
  PERCENT_CR: [0.063, 0.069, 0.075, 0.081, 0.087, 0.093, 0.099, 0.105],
  PERCENT_CD: [0.126, 0.138, 0.15, 0.162, 0.174, 0.186, 0.198, 0.21],
};

const WW_OTHER = {
  FLAT_HP: [320, 360, 390, 430, 470, 510, 540, 580],
  PERCENT_HP: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  PERCENT_ATK: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  PERCENT_DEF: [0.081, 0.09, 0.1, 0.109, 0.118, 0.128, 0.138, 0.147],
  PERCENT_ER: [0.068, 0.076, 0.084, 0.092, 0.1, 0.108, 0.116, 0.124],
  PERCENT_BA: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  PERCENT_HA: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  PERCENT_RS: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  PERCENT_RL: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
};

const randomRoll = (statId) => {
  if (statId === 'FLAT_ATK' || statId === 'FLAT_DEF') {
    const winnerIndex = weightedLottery([4, 19, 14, 1]);
    return WW_ATKDEF[statId][winnerIndex];
  }
  if (statId === 'PERCENT_CR' || statId === 'PERCENT_CD') {
    const winnerIndex = weightedLottery([6, 6, 6, 2, 2, 2, 1, 1]);
    return WW_CRIT[statId][winnerIndex];
  }
  const winnerIndex = weightedLottery([2, 2, 7, 8, 6, 5, 2, 1]);
  return WW_OTHER[statId][winnerIndex];
};

function assignSubStats(gameId) {
  const optionsMap = MISC[gameId].SUB_STAT_TYPES;
  const statPool = Object.entries(optionsMap)
    .map(([id, { WEIGHT }]) => [id, WEIGHT]);

  const subStatList = [];
  for (let i = 0; i < 5; i++) {
    const winnerIndex = weightedLottery(statPool.map(item => item[1]));
    const [subStatId] = statPool[winnerIndex];
    subStatList.push({ subStatId, subStatValue: randomRoll(subStatId) });
    statPool.splice(winnerIndex, 1);
  }

  return subStatList;
}

function assignMainStat(gameId, costIndex) {
  const optionsMap = MISC[gameId].MAIN_STAT_TYPES[costIndex];
  const weightsList = Object.values(optionsMap).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(optionsMap)[weightedLottery(weightsList)];
  const mainStatValue = optionsMap[mainStatId].VALUE;
  return { mainStatId, mainStatValue };
}

const generateEquip = (ctx, cost) => {
  const wrongSetChance = cost === 4 ? 0.25 : 0.5
  if (Math.random() < wrongSetChance) return;

  const { cache, preferredMainStats } = ctx;
  const { gameId } = cache;

  // Randomly assign main stat (according to weighted rules)
  // Skip non preferred main stats
  const { mainStatId, mainStatValue } = assignMainStat(gameId, cost);
  if (!preferredMainStats[cost].includes(mainStatId)) return;

  // Assign main stat flat values
  // Assign sub stats
  const mainFlatMap = MISC[gameId].MAIN_STAT_FLATS[cost];
  const [mainStatFlatId, { VALUE: mainStatFlatValue }] = Object.entries(mainFlatMap)[0];
  const subStatList = assignSubStats(gameId);

  return {
    mainStatId,
    mainStatValue,
    mainStatFlatId,
    mainStatFlatValue,
    subStatList,
  };
};

const evaluateEquip = (ctx, cost, equip, latest) => {
  const { cache, currId, matchMap, compiledRotation } = ctx;
  const { baseMap } = cache.member[currId];

  const buffer = { ...latest };

  function compareAndReplace(slot) {
    const newEquipList = latest.equipList.with(slot, equip);
    const combinedStatMap = mergeObj(baseMap, mergeEquipList(newEquipList));
    const newSummary = evaluateRotation(compiledRotation, combinedStatMap);
    const newPenalty = getPenalty(combinedStatMap, matchMap);
    const newScore = sumRotationDmg(newSummary) * newPenalty;

    // Compare with buffer and replace if needed
    if (newScore > buffer.score) {
      buffer.equipList = newEquipList;
      buffer.summary = newSummary;
      buffer.penalty = newPenalty;
      buffer.score = newScore;
    }
  }

  if (cost === 4) {
    compareAndReplace(0);
  } else if (cost === 3) {
    compareAndReplace(1);
    compareAndReplace(2);
  } else {
    compareAndReplace(3);
    compareAndReplace(4);
  }

  return buffer;
};

export function advanceTrial(ctx, trial) {
  const totalStaminaPerWeek = DAILY_STAMINA * 7 + WEEKLY_STAMINA;
  const totalDropsPerWeek = Math.floor((totalStaminaPerWeek / COST_PER_RUN) * DROPS_PER_RUN);

  const latest = {
    equipList: trial.equipList,
    summary: trial.scores.at(-1),
    penalty: trial.penalty,
    score: sumRotationDmg(trial.scores.at(-1)) * trial.penalty,
  };

  // Generate 20 4-costs per week
  for (let i = 0; i < 20; i++) {
    const newEquipObj = generateEquip(ctx, 4);
    if (!newEquipObj) continue;

    Object.assign(latest, evaluateEquip(ctx, 4, newEquipObj, latest));
  }

  // Generate 15 3-costs per week
  for (let i = 0; i < 15; i++) {
    const newEquipObj = generateEquip(ctx, 3);
    if (!newEquipObj) continue;

    Object.assign(latest, evaluateEquip(ctx, 3, newEquipObj, latest));
  }

  // Generate 1 and 3 costs from tacet fields
  for (let i = 0; i < totalDropsPerWeek; i++) {
    const cost = Math.random() < 0.5 ? 1 : 3;

    const newEquipObj = generateEquip(ctx, cost);
    if (!newEquipObj) continue;

    Object.assign(latest, evaluateEquip(ctx, cost, newEquipObj, latest));
  }

  trial.equipList = latest.equipList;
  trial.penalty = latest.penalty;
  trial.scores.push(latest.summary);
}
