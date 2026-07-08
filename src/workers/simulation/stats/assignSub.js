import { GI, ZZZ } from '@/data';
import { weightedLottery } from '../utils';
import { HOYO_SUBSTAT_WEIGHTS } from './weights';
import { SUBSTAT_VALUES } from './values';

const WW_TABLE = {
  'atk': [30, 40, 50, 60],
  'def': [40, 50, 60, 70],
  'hp': [320, 360, 390, 430, 470, 510, 540, 580],
  'def%': [0.081, 0.09, 0.1, 0.109, 0.118, 0.128, 0.138, 0.147],
  'atk%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'hp%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'resonanceLiberationDmgBonus%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'heavyAttackDmgBonus%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'resonanceSkillDmgBonus%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'basicAttackDmgBonus%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'energyRegen%': [0.068, 0.076, 0.084, 0.092, 0.1, 0.108, 0.116, 0.124],
  'critRate%': [0.063, 0.069, 0.075, 0.081, 0.087, 0.093, 0.099, 0.105],
  'critDmg%': [0.126, 0.138, 0.15, 0.162, 0.174, 0.186, 0.198, 0.21],
};

const getWeightsList = (statId) => {
  switch (statId) {
    case 'critRate%':
    case 'critDmg%':
      return [70, 70, 70, 24, 24, 24, 9, 9];
    
    case 'atk':
      return [7, 54, 39, 3];

    case 'def':
      return [15, 46, 33, 9];
    
    default:
      return [7, 8, 21, 25, 18, 15, 6, 3];
  }
};

export function revealSubStatWuwa(subStatList) {
  const existingStatIds = subStatList.map((line) => line.subStatId);
  const statPool = Object.entries(WW_TABLE)
    .filter(([statId]) => !existingStatIds.includes(statId));

  const randomIndex = Math.floor(Math.random() * statPool.length);
  const [subStatId, valuesList] = statPool[randomIndex];

  const index = weightedLottery(getWeightsList(subStatId));

  subStatList.push({ subStatId, subStatValue: valuesList[index] });
}

const randomRoll = (gameId, statId) => {
  const numMults = gameId === GI ? 4 : 3;
  const maxValue = SUBSTAT_VALUES[gameId][statId];
  if (gameId === ZZZ) return maxValue;

  const mult = 1 - (Math.floor(Math.random() * numMults) / 10);
  return maxValue * mult;
};

export function revealSubStatsHoyo(subStatList, gameId, mainStatId) {
  const statPool = Object.entries(HOYO_SUBSTAT_WEIGHTS[gameId])
    .filter(([statId]) => statId !== mainStatId);

  for (let i = 0; i < 4; i++) {
    const winnerIndex = weightedLottery(statPool.map((keyValue) => keyValue[1]));
    const [subStatId] = statPool[winnerIndex];

    subStatList.push({ subStatId, subStatValue: randomRoll(gameId, subStatId) });
    statPool.splice(winnerIndex, 1);
  }
}

export function upgradeSubStats(subStatList, gameId) {
  const upgradeTimes = Math.random() < 0.2 ? 5 : 4;

  for (let i = 0; i < upgradeTimes; i++) {
    const upgradeIndex = Math.floor(Math.random() * 4);
    const prev = subStatList[upgradeIndex];

    subStatList[upgradeIndex] = {
      subStatId: prev.subStatId,
      subStatValue: prev.subStatValue + randomRoll(gameId, prev.subStatId),
    };
  }
}
