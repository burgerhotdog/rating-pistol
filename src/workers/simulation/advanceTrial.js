import { GI, HSR, WW, ZZZ } from '@/data';
import { MISC } from '@/data';
import { mergeObj, mergeEquipList, getTotals } from '@/utils';
import { weightedLottery } from './helpers';

const WW_ATKDEF = {
  'atk': [30, 40, 50, 60],
  'def': [40, 50, 60, 70],
};

const WW_CRIT = {
  'critRate%': [0.063, 0.069, 0.075, 0.081, 0.087, 0.093, 0.099, 0.105],
  'critDmg%': [0.126, 0.138, 0.15, 0.162, 0.174, 0.186, 0.198, 0.21],
};

const WW_OTHER = {
  'hp': [320, 360, 390, 430, 470, 510, 540, 580],
  'hp%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'atk%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'def%': [0.081, 0.09, 0.1, 0.109, 0.118, 0.128, 0.138, 0.147],
  'energyRegen%': [0.068, 0.076, 0.084, 0.092, 0.1, 0.108, 0.116, 0.124],
  'basicAttackDmgBonus%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'heavyAttackDmgBonus%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'resonanceSkillDmgBonus%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  'resonanceLiberationDmgBonus%': [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
};

const randomRollWW = statId => {
  if (statId === 'atk' || statId === 'def') {
    const winnerIndex = weightedLottery([4, 19, 14, 1]);
    return WW_ATKDEF[statId][winnerIndex];
  }

  if (statId === 'critRate%' || statId === 'critDmg%') {
    const winnerIndex = weightedLottery([6, 6, 6, 2, 2, 2, 1, 1]);
    return WW_CRIT[statId][winnerIndex];
  }

  const winnerIndex = weightedLottery([2, 2, 7, 8, 6, 5, 2, 1]);
  return WW_OTHER[statId][winnerIndex];
};

const assignSubStats = (options, lineCount, randomRoll, doUpgrade = false) => {
  const statPool = options.map(([id, { WEIGHT }]) => [id, WEIGHT]);

  const subStatList = [];
  for (let i = 0; i < lineCount; i++) {
    const winnerIndex = weightedLottery(statPool.map(item => item[1]));
    const [subStatId] = statPool[winnerIndex];

    subStatList.push({ subStatId, subStatValue: randomRoll(subStatId) });
    statPool.splice(winnerIndex, 1);
  }

  if (doUpgrade) {
    const upgradeTimes = Math.random() < 0.2 ? 5 : 4;

    for (let i = 0; i < upgradeTimes; i++) {
      const upgradeIndex = Math.floor(Math.random() * 4);
      const prev = subStatList[upgradeIndex];

      subStatList[upgradeIndex] = {
        subStatId: prev.subStatId,
        subStatValue: prev.subStatValue + randomRoll(prev.subStatId),
      };
    }
  }

  return subStatList;
};

const assignMainStat = options => {
  const weightsList = Object.values(options).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(options)[weightedLottery(weightsList)];
  const mainStatValue = options[mainStatId].VALUE;

  return { mainStatId, mainStatValue };
};

const buildBasicResult = (mainStatId, mainStatValue, subStatList) => ({
  mainStatId,
  mainStatValue,
  subStatList,
});

const equipConfig = {
  [GI]: {
    makeRandomRoll: sub => id => sub[id].VALUE * (1 - Math.floor(Math.random() * 4) / 10),
    buildResult: buildBasicResult,
  },
  [HSR]: {
    makeRandomRoll: sub => id => sub[id].VALUE * (1 - Math.floor(Math.random() * 3) / 10),
    buildResult: buildBasicResult,
  },
  [ZZZ]: {
    makeRandomRoll: sub => id => sub[id].VALUE,
    buildResult: buildBasicResult,
  },
  [WW]: {
    makeRandomRoll: () => randomRollWW,
    buildResult: (mainStatId, mainStatValue, subStatList, cost) => {
      const FLATS = {
        4: ["atk", 150],
        3: ["atk", 100],
        1: ["hp", 2280],
      };

      const [mainStatFlatId, mainStatFlatValue] = FLATS[cost];
      return {
        mainStatId,
        mainStatValue,
        subStatList,
        cost,
        mainStatFlatId,
        mainStatFlatValue,
      };
    },
  },
};

const createEquipGenerator = (gameId, preferredMainStats) => {
  const subOptions = MISC[gameId].SUB_STAT_TYPES;
  const subEntries = Object.entries(subOptions);
  const subStatCount = gameId === WW ? 5 : 4;
  const doUpgrade = gameId === WW ? false : true;

  const { makeRandomRoll, buildResult } = equipConfig[gameId];
  const randomRoll = makeRandomRoll(subOptions);

  return key => {
    if (Math.random() < 0.5) return;

    const { mainStatId, mainStatValue } = assignMainStat(MISC[gameId].MAIN_STAT_TYPES[key]);
    if (!preferredMainStats[key].includes(mainStatId)) return;

    const pool = gameId === WW ? subEntries : subEntries.filter(([id]) => id !== mainStatId);

    const subStatList = assignSubStats(pool, subStatCount, randomRoll, doUpgrade);

    return buildResult(mainStatId, mainStatValue, subStatList, key);
  };
};

const createEquipEvaluator = (baseMap, simulateRotation, getPenalty) => (spec, equip, latest) => {
  const buffer = { ...latest };

  const trySlot = slot => {
    const newEquipList = latest.equipList.with(slot, equip);
    const combinedStatMap = mergeObj(baseMap, mergeEquipList(newEquipList));
    const newSummary = simulateRotation(combinedStatMap);
    const newTotals = getTotals(newSummary);
    const newPenalty = getPenalty(combinedStatMap);
    const newScore = (newTotals.damage + newTotals.healing + newTotals.shield) * newPenalty;

    if (newScore > buffer.score) {
      Object.assign(buffer, {
        equipList: newEquipList,
        summary: newSummary,
        totals: newTotals,
        penalty: newPenalty,
        score: newScore,
      });
    }
  };

  if ('cost' in spec) {
    if (spec.cost === 4) {
      trySlot(0);
    } else if (spec.cost === 3) {
      trySlot(1);
      trySlot(2);
    } else {
      trySlot(3);
      trySlot(4);
    }
  } else {
    trySlot(spec.slot);
  }

  return buffer;
};

export const createTrialAdvancer = (cache, currId, preferredMainStats, simulateRotation, getPenalty) => {
  const { gameId } = cache;
  const { baseMap } = cache.member[currId];

  const generateEquip = createEquipGenerator(gameId, preferredMainStats);
  const evaluateEquip = createEquipEvaluator(baseMap, simulateRotation, getPenalty);

  const passes = {
    [GI]: [{ count: 66,  slotCount: 5 }],
    [HSR]: [{ count: 84,  slotCount: 6 }],
    [ZZZ]: [{ count: 120, slotCount: 6 }],
    [WW]: [{ count: 20, cost: 4 }, { count: 75, cost: 3 }, { count: 60, cost: 1 }],
  };

  return trial => {
    for (const pass of passes[gameId]) {
      const fixed = 'cost' in pass;

      for (let i = 0; i < pass.count; i++) {
        const key = fixed ? pass.cost : Math.floor(Math.random() * pass.slotCount);
        const equip = generateEquip(key);
        if (!equip) continue;

        const spec = fixed ? { cost: key } : { slot: key };
        Object.assign(trial, evaluateEquip(spec, equip, trial));
      }
    }
  };
};
