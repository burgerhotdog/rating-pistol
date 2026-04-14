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

function assignMainStat(costIndex) {
  const optionsMap = STATS["wuthering-waves"].MAIN_STAT_TYPES[costIndex];
  const weightsList = Object.values(optionsMap).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(optionsMap)[weightedLottery(weightsList)];
  const mainStatValue = optionsMap[mainStatId].VALUE;
  return { mainStatId, mainStatValue };
}

export function advanceTrialWuwa(preferredMainStats, trial, setIdList, matchTargets, characterId, calcs, team) {
  const totalStaminaPerWeek = DAILY_STAMINA * 7 + WEEKLY_STAMINA;
  const totalDropsPerWeek = Math.floor((totalStaminaPerWeek / COST_PER_RUN) * DROPS_PER_RUN);

  // Cartethyia sometimes prefers a 44111 build
  const isCartethyia = characterId == "1409";

  let latestBuild = trial.build;
  let latestPenalty = trial.penalty;
  let latestDamage = trial.scores.at(-1);

  // Generate 20 4-costs per week
  for (let i = 0; i < 20; i++) {
    // Some 4-costs belong to 2 sets while some only have 1 set so we'll take the average
    const coinFlip = Math.random() < 0.75 ? true : false;
    if (!coinFlip) continue;

    // Randomly assign main stat (according to weighted rules)
    // Skip non preferred main stats
    const { mainStatId, mainStatValue } = assignMainStat(4);
    if (!preferredMainStats[4].includes(mainStatId)) continue;
    
    // Assign main stat flat values
    // Assign sub stats
    const mainFlatMap = STATS["wuthering-waves"].MAIN_STAT_FLATS[4];
    const [mainStatFlatId, { VALUE: mainStatFlatValue }] = Object.entries(mainFlatMap)[0];
    const subStatList = assignSubStats();

    const setId = setIdList[0];
    const newEquipObj = { setId, mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList };
    const newEquipList = latestBuild.equipList.with(0, newEquipObj);
    const newBuild = { ...latestBuild, equipList: newEquipList };

    // Compute new match penalty and damage with new build
    const newPenalty = (calcs.match ?? []).reduce((acc, stat, index) => {
      const currentValue = computeTotalStat(stat, compileStatMap("wuthering-waves", characterId, newBuild, team, "menu"));
      const targetValue = matchTargets[index];
      return acc * matchPenalty(currentValue, targetValue);
    }, 1);
    const newDamage = computeDamage("wuthering-waves", characterId, newBuild, calcs, team);

    // Compare with latest and replace if needed
    if (newDamage * newPenalty > latestDamage * latestPenalty) {
      latestBuild = newBuild;
      latestPenalty = newPenalty;
      latestDamage = newDamage;
    }
  }

  // Generate 15 3-costs per week
  for (let i = 0; i < 20; i++) {
    // 3-costs can belong to 1-3 sets but on average 2
    const coinFlip = Math.random() < 0.5 ? true : false;
    if (!coinFlip) continue;

    // Randomly assign main stat (according to weighted rules)
    // Skip non preferred main stats
    const { mainStatId, mainStatValue } = assignMainStat(3);
    if (!preferredMainStats[3].includes(mainStatId)) continue;
    
    // Assign main stat flat values
    // Assign sub stats
    const mainFlatMap = STATS["wuthering-waves"].MAIN_STAT_FLATS[3];
    const [mainStatFlatId, { VALUE: mainStatFlatValue }] = Object.entries(mainFlatMap)[0];
    const subStatList = assignSubStats();

    // Construct newEquipObj (without setId)
    const newEquipObj = { mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList };

    // Create a buffer
    let bufferBuild = latestBuild;
    let bufferPenalty = latestPenalty;
    let bufferDamage = latestDamage;

    for (let slotIndex = 1; slotIndex < 3; slotIndex++) {
      // Add in setId and construct newBuild
      newEquipObj.setId = setIdList[slotIndex];
      const newEquipList = latestBuild.equipList.with(slotIndex, newEquipObj);
      const newBuild = { ...latestBuild, equipList: newEquipList };

      // Compute new match penalty and damage with new build
      const newPenalty = (calcs.match ?? []).reduce((acc, stat, index) => {
        const currentValue = computeTotalStat(stat, compileStatMap("wuthering-waves", characterId, newBuild, team, "menu"));
        const targetValue = matchTargets[index];
        return acc * matchPenalty(currentValue, targetValue);
      }, 1);
      const newDamage = computeDamage("wuthering-waves", characterId, newBuild, calcs, team);

      // Compare new damage with buffer and replace if better
      if (newDamage * newPenalty > bufferDamage * bufferPenalty) {
        bufferBuild = newBuild;
        bufferPenalty = newPenalty;
        bufferDamage = newDamage;
      }
    }

    // buffer will already be latest if neither result was better
    latestBuild = bufferBuild;
    latestPenalty = bufferPenalty;
    latestDamage = bufferDamage;
  }

  // Generate 1 and 3 costs from tacet fields
  for (let i = 0; i < totalDropsPerWeek; i++) {
    // Randomly assign set and skip off-set artifacts
    const coinFlip = Math.random() < 0.5 ? true : false;
    if (!coinFlip) continue;

    // Randomly assign cost
    const costIndex = Math.random() < 0.5 ? 1 : 3;

    // Randomly assign main stat (according to weighted rules)
    // Skip non preferred main stats
    const { mainStatId, mainStatValue } = assignMainStat(costIndex);
    if (!preferredMainStats[costIndex].includes(mainStatId)) continue;

    // Assign main stat flat values
    // Randomly assign and upgrade sub stats
    const mainFlatMap = STATS["wuthering-waves"].MAIN_STAT_FLATS[costIndex];
    const [mainStatFlatId, { VALUE: mainStatFlatValue }] = Object.entries(mainFlatMap)[0];
    const subStatList = assignSubStats();

    // Construct newEquipObj (without setId)
    const newEquipObj = { mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList };

    // Decide which slots to test and create a buffer
    const startingSlot = costIndex === 1 ? 3 : 1;
    let bufferBuild = latestBuild;
    let bufferPenalty = latestPenalty;
    let bufferDamage = latestDamage;
    for (let slotIndex = startingSlot; slotIndex < (startingSlot + 2); slotIndex++) {
      // Add in setId and construct newBuild
      newEquipObj.setId = setIdList[slotIndex];
      const newEquipList = latestBuild.equipList.with(slotIndex, newEquipObj);
      const newBuild = { ...latestBuild, equipList: newEquipList };

      // Compute new match penalty and damage with new build
      const newPenalty = (calcs.match ?? []).reduce((acc, stat, index) => {
        const currentValue = computeTotalStat(stat, compileStatMap("wuthering-waves", characterId, newBuild, team, "menu"));
        const targetValue = matchTargets[index];
        return acc * matchPenalty(currentValue, targetValue);
      }, 1);
      const newDamage = computeDamage("wuthering-waves", characterId, newBuild, calcs, team);

      // Compare new damage with buffer and replace if better
      if (newDamage * newPenalty > bufferDamage * bufferPenalty) {
        bufferBuild = newBuild;
        bufferPenalty = newPenalty;
        bufferDamage = newDamage;
      }
    }

    // buffer will already be latest if neither result was better
    latestBuild = bufferBuild;
    latestPenalty = bufferPenalty;
    latestDamage = bufferDamage;
  }

  trial.build = latestBuild;
  trial.penalty = latestPenalty;
  trial.scores.push(latestDamage);
}
