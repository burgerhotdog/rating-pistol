import { STATS } from '@/data';
import { computeDamage, computeTotalStat, compileStatMap } from "@/utils";
import { weightedLottery } from './helpers/weightedLottery';
import { matchPenalty } from './helpers/matchPenalty';

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

function assignSubStats() {
  const optionsMap = STATS["wuthering-waves"].SUB_STAT_TYPES;
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

function assignMainStat(slotIndex) {
  const optionsMap = STATS["wuthering-waves"].MAIN_STAT_TYPES[slotIndex];
  const weightsList = Object.values(optionsMap).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(optionsMap)[weightedLottery(weightsList)]
  const mainStatValue =  optionsMap[mainStatId].VALUE;
  return { mainStatId, mainStatValue };
}

export function advanceTrialWuwa(trial, setIdList, matchTargets, characterId, criteria, team) {
  const totalStaminaPerWeek = DAILY_STAMINA * 7 + WEEKLY_STAMINA;
  const totalDropsPerWeek = Math.floor((totalStaminaPerWeek / COST_PER_RUN) * DROPS_PER_RUN);

  let latestBuild = trial.build;
  let latestPenalty = trial.penalty;
  let latestDamage = trial.scores.at(-1);

  // Generate new artifacts and compare with latest build
  for (let i = 0; i < totalDropsPerWeek; i++) {
    // Randomly assign set and slot index
    const coinFlip = Math.random() < 0.5 ? true : false;
    const slotIndex = Math.floor(Math.random() * 5);

    // Skip off-set artifacts
    if (!coinFlip) continue;

    // Randomly assign main stat (according to weighted rules)
    const { mainStatId, mainStatValue } = assignMainStat(slotIndex);

    // Skip dead main stats
    const deadStats = criteria.deadStats?.[slotIndex] ?? [];
    if (deadStats.includes(mainStatId)) continue;

    // Randomly assign and upgrade sub stats
    const subStatList = assignSubStats();

    // SetId comes from original build
    const setId = setIdList[slotIndex];

    // Construct newEquipObj and newEquipList
    const newEquipObj = { setId, mainStatId, mainStatValue, subStatList };
    const newEquipList = latestBuild.equipList.with(slotIndex, newEquipObj);
    const newBuild = { ...latestBuild, equipList: newEquipList };

    // Compute new match penalty and damage with new build
    const newPenalty = (criteria.match ?? []).reduce((stat, index) => {
      const currentValue = computeTotalStat(stat, compileStatMap("wuthering-waves", characterId, newBuild, team, "menu"));
      const targetValue = matchTargets[index];
      return acc * matchPenalty(currentValue, targetValue);
    }, 1);
    const newDamage = computeDamage("wuthering-waves", characterId, newBuild, criteria, team);

    // Compare new damage with current and replace if better
    if (newDamage * newPenalty > latestDamage * latestPenalty) {
      latestBuild = newBuild;
      latestPenalty = newPenalty;
      latestDamage = newDamage;
    }
  }

  trial.build = latestBuild;
  trial.penalty = latestPenalty;
  trial.scores.push(latestDamage);
}
