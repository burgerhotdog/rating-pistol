import { MISC } from '@/data';
import { computeDamage, computeTotalStat, compileStatMap } from "@/utils";
import { weightedLottery } from './helpers/weightedLottery';
import { matchPenalty } from './helpers/matchPenalty';

const STAMINA_DATA = {
  "genshin-impact": {
    DAILY_STAMINA: 180,
    WEEKLY_STAMINA: 60,
    COST_PER_RUN: 20,
    DROPS_PER_RUN: 1.065,
  },
  "honkai-star-rail": {
    DAILY_STAMINA: 240,
    WEEKLY_STAMINA: 160,
    COST_PER_RUN: 40,
    DROPS_PER_RUN: 2.1,
  },
  "zenless-zone-zero": {
    DAILY_STAMINA: 320,
    WEEKLY_STAMINA: 180,
    COST_PER_RUN: 60,
    DROPS_PER_RUN: 3.25,
  },
};

function randomRoll(gameId, statId) {
  const { VALUE } = MISC[gameId].SUB_STAT_TYPES[statId];

  if (gameId === "genshin-impact") {
    const options = [1, 0.9, 0.8, 0.7];
    return options[Math.floor(Math.random() * 4)] * VALUE;
  }

  if (gameId === "honkai-star-rail") {
    const options = [1, 0.9, 0.8];
    return options[Math.floor(Math.random() * 3)] * VALUE;
  }

  if (gameId === "zenless-zone-zero") return VALUE;
}

function assignSubStats(gameId, mainStatId) {
  const optionsMap = MISC[gameId].SUB_STAT_TYPES;
  const statPool = Object.entries(optionsMap)
    .filter(([id]) => id !== mainStatId)
    .map(([id, { WEIGHT }]) => [id, WEIGHT]);

  const subStatList = [];
  for (let i = 0; i < 4; i++) {
    const winnerIndex = weightedLottery(statPool.map(item => item[1]));
    const [subStatId] = statPool[winnerIndex];
    subStatList.push({ subStatId, subStatValue: randomRoll(gameId, subStatId) });
    statPool.splice(winnerIndex, 1);
  }
  
  // 1 in 5 artifacts gets an extra roll (4 line start pieces)
  const upgradeCount = Math.random() < 0.2 ? 5 : 4;
  for (let i = 0; i < upgradeCount; i++) {
    // Random line upgrade
    const lineIndex = Math.floor(Math.random() * 4);
    const { subStatId } = subStatList[lineIndex];
    subStatList[lineIndex].subStatValue += randomRoll(gameId, subStatId);
  }

  return subStatList;
}

function assignMainStat(gameId, slotIndex) {
  const optionsMap = MISC[gameId].MAIN_STAT_TYPES[slotIndex];
  const weightsList = Object.values(optionsMap).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(optionsMap)[weightedLottery(weightsList)]
  const mainStatValue =  optionsMap[mainStatId].VALUE;
  return { mainStatId, mainStatValue };
}

export function advanceTrial(preferredMainStats, trial, setIdList, matchTargets, gameId, characterId, calcs, team) {
  const { DAILY_STAMINA, WEEKLY_STAMINA, COST_PER_RUN, DROPS_PER_RUN } = STAMINA_DATA[gameId];
  const totalStaminaPerWeek = DAILY_STAMINA * 7 + WEEKLY_STAMINA;
  const totalDropsPerWeek = Math.floor((totalStaminaPerWeek / COST_PER_RUN) * DROPS_PER_RUN);

  let latestBuild = trial.build;
  let latestPenalty = trial.penalty;
  let latestDamage = trial.scores.at(-1);

  // Generate new artifacts and compare with latest build
  for (let i = 0; i < totalDropsPerWeek; i++) {
    // Randomly assign set and slot index
    const coinFlip = Math.random() < 0.5 ? true : false;
    const slotIndex = Math.floor(Math.random() * (gameId === "genshin-impact" ? 5 : 6));

    // Skip off-set artifacts unless it is a genshin goblet
    const isGenshinGoblet = gameId === "genshin-impact" && slotIndex === 3;
    if (!coinFlip && !isGenshinGoblet) continue;

    // Randomly assign main stat (according to weighted rules)
    const { mainStatId, mainStatValue } = assignMainStat(gameId, slotIndex);

    // Skip non preferred main stats
    if (!preferredMainStats[slotIndex].includes(mainStatId)) continue;

    // Randomly assign and upgrade sub stats
    const subStatList = assignSubStats(gameId, mainStatId);

    // SetId comes from original build
    const setId = setIdList[slotIndex];

    // Construct newEquipObj and newEquipList
    const newEquipObj = { setId, mainStatId, mainStatValue, subStatList };
    const newEquipList = latestBuild.equipList.with(slotIndex, newEquipObj);
    const newBuild = { ...latestBuild, equipList: newEquipList };

    // Compute new match penalty and damage with new build
    const newPenalty = (calcs.match ?? []).reduce((acc, stat, index) => {
      const currentValue = computeTotalStat(stat, compileStatMap(gameId, characterId, newBuild, team, "menu"));
      const targetValue = matchTargets[index];
      return acc * matchPenalty(currentValue, targetValue);
    }, 1);
    const newDamage = computeDamage(gameId, characterId, newBuild, calcs, team);

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
