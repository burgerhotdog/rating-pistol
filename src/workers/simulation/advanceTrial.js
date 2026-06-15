import { sumRotationDmg, mergeObj, mergeEquipList } from '@/utils';
import { weightedLottery } from './helpers';
import { evaluateRotation } from './rotation/compile';
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

function assignSubStats(misc) {
  const optionsMap = misc.SUB_STAT_TYPES;
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

function assignMainStat(costIndex, misc) {
  const optionsMap = misc.MAIN_STAT_TYPES[costIndex];
  const weightsList = Object.values(optionsMap).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(optionsMap)[weightedLottery(weightsList)];
  const mainStatValue = optionsMap[mainStatId].VALUE;
  return { mainStatId, mainStatValue };
}

export function advanceTrial(preferredMainStats, trial, matchMap, characterId, compiledRotation, cache) {
  const totalStaminaPerWeek = DAILY_STAMINA * 7 + WEEKLY_STAMINA;
  const totalDropsPerWeek = Math.floor((totalStaminaPerWeek / COST_PER_RUN) * DROPS_PER_RUN);

  // Cartethyia sometimes prefers a 44111 build
  const isCartethyia = characterId == "1409";

  let latestEquipList = trial.equipList;
  let latestPenalty = trial.penalty;
  let latestDamage = trial.scores.at(-1);

  // Generate 20 4-costs per week
  for (let i = 0; i < 20; i++) {
    // Some 4-costs belong to 2 sets while some only have 1 set so we'll take the average
    const coinFlip = Math.random() < 0.75 ? true : false;
    if (!coinFlip) continue;

    // Randomly assign main stat (according to weighted rules)
    // Skip non preferred main stats
    const { mainStatId, mainStatValue } = assignMainStat(4, cache.data.misc);
    if (!preferredMainStats[4].includes(mainStatId)) continue;
    
    // Assign main stat flat values
    // Assign sub stats
    const mainFlatMap = cache.data.misc.MAIN_STAT_FLATS[4];
    const [mainStatFlatId, { VALUE: mainStatFlatValue }] = Object.entries(mainFlatMap)[0];
    const subStatList = assignSubStats(cache.data.misc);

    const newEquipObj = { mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList };
    const newEquipList = latestEquipList.with(0, newEquipObj);

    // Compute new match penalty and damage with new build
    const combinedStatMap = mergeObj(cache.baseMap[characterId], mergeEquipList(newEquipList))
    const newPenalty = getPenalty(combinedStatMap, matchMap);
    const newSummary = evaluateRotation(compiledRotation, cache, combinedStatMap);

    // Compare with latest and replace if needed
    if (sumRotationDmg(newSummary) * newPenalty > sumRotationDmg(latestDamage) * latestPenalty) {
      latestEquipList = newEquipList;
      latestPenalty = newPenalty;
      latestDamage = newSummary;
    }
  }

  // Generate 15 3-costs per week
  for (let i = 0; i < 15; i++) {
    // 3-costs can belong to 1-3 sets but on average 2
    const coinFlip = Math.random() < 0.5 ? true : false;
    if (!coinFlip) continue;

    // Randomly assign main stat (according to weighted rules)
    // Skip non preferred main stats
    const { mainStatId, mainStatValue } = assignMainStat(3, cache.data.misc);
    if (!preferredMainStats[3].includes(mainStatId)) continue;
    
    // Assign main stat flat values
    // Assign sub stats
    const mainFlatMap = cache.data.misc.MAIN_STAT_FLATS[3];
    const [mainStatFlatId, { VALUE: mainStatFlatValue }] = Object.entries(mainFlatMap)[0];
    const subStatList = assignSubStats(cache.data.misc);

    // Construct newEquipObj
    const newEquipObj = { mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList };

    // Create a buffer
    let bufferEquipList = latestEquipList;
    let bufferPenalty = latestPenalty;
    let bufferDamage = latestDamage;

    for (let slotIndex = 1; slotIndex < 3; slotIndex++) {
      // Construct newBuild
      const equip = { ...newEquipObj };
      const newEquipList = latestEquipList.with(slotIndex, equip);

      // Compute new match penalty and damage with new build
      const combinedStatMap = mergeObj(cache.baseMap[characterId], mergeEquipList(newEquipList))
      const newPenalty = getPenalty(combinedStatMap, matchMap);
      const newDamage = evaluateRotation(compiledRotation, cache, combinedStatMap);

      // Compare new damage with buffer and replace if better
      if (sumRotationDmg(newDamage) * newPenalty > sumRotationDmg(bufferDamage) * bufferPenalty) {
        bufferEquipList = newEquipList;
        bufferPenalty = newPenalty;
        bufferDamage = newDamage;
      }
    }

    // buffer will already be latest if neither result was better
    latestEquipList = bufferEquipList;
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
    const { mainStatId, mainStatValue } = assignMainStat(costIndex, cache.data.misc);
    if (!preferredMainStats[costIndex].includes(mainStatId)) continue;

    // Assign main stat flat values
    // Randomly assign and upgrade sub stats
    const mainFlatMap = cache.data.misc.MAIN_STAT_FLATS[costIndex];
    const [mainStatFlatId, { VALUE: mainStatFlatValue }] = Object.entries(mainFlatMap)[0];
    const subStatList = assignSubStats(cache.data.misc);

    // Construct newEquipObj
    const newEquipObj = { mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList };

    // Decide which slots to test and create a buffer
    const startingSlot = costIndex === 1 ? 3 : 1;
    let bufferEquipList = latestEquipList;
    let bufferPenalty = latestPenalty;
    let bufferDamage = latestDamage;
    for (let slotIndex = startingSlot; slotIndex < (startingSlot + 2); slotIndex++) {
      // Construct newBuild
      const equip = { ...newEquipObj };
      const newEquipList = latestEquipList.with(slotIndex, equip);

      // Compute new match penalty and damage with new build
      const combinedStatMap = mergeObj(cache.baseMap[characterId], mergeEquipList(newEquipList))
      const newPenalty = getPenalty(combinedStatMap, matchMap);
      const newDamage = evaluateRotation(compiledRotation, cache, combinedStatMap);

      // Compare new damage with buffer and replace if better
      if (sumRotationDmg(newDamage) * newPenalty > sumRotationDmg(bufferDamage) * bufferPenalty) {
        bufferEquipList = newEquipList;
        bufferPenalty = newPenalty;
        bufferDamage = newDamage;
      }
    }

    // buffer will already be latest if neither result was better
    latestEquipList = bufferEquipList;
    latestPenalty = bufferPenalty;
    latestDamage = bufferDamage;
  }

  trial.equipList = latestEquipList;
  trial.penalty = latestPenalty;
  trial.scores.push(latestDamage);
}
