import { GI, HSR, WW, ZZZ } from '@/data';
import { MISC } from '@/data';
import { mergeObj, mergeEquipList, sumRotationDmg } from '@/utils';
import { weightedLottery } from './helpers';
import { evaluateRotation } from './rotation';
import { getPenalty } from './penalty';

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

const randomRollWW = (statId) => {
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

function assignSubStats(options, lineCount, randomRoll, doUpgrade = false) {
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
}

function assignMainStat(options) {
  const weightsList = Object.values(options).map(({ WEIGHT }) => WEIGHT);
  const mainStatId = Object.keys(options)[weightedLottery(weightsList)];
  const mainStatValue = options[mainStatId].VALUE;

  return { mainStatId, mainStatValue };
}

const generateEquip = (ctx, slot) => {
  if (Math.random() < 0.5) return;

  const { cache, preferredMainStats } = ctx;
  const { gameId } = cache;

  const mainOptions = MISC[gameId].MAIN_STAT_TYPES[slot];
  const { mainStatId, mainStatValue } = assignMainStat(mainOptions);
  if (!preferredMainStats[slot].includes(mainStatId)) return;

  const subOptions = MISC[gameId].SUB_STAT_TYPES;
  const filtered = Object.entries(subOptions).filter(([statId]) => statId !== mainStatId);

  const randomRoll = {
    [GI]: statId => {
      const { VALUE } = subOptions[statId];
      return VALUE * (1 - (Math.floor(Math.random() * 4) / 10));
    },
    [HSR]: statId => {
      const { VALUE } = subOptions[statId];
      return VALUE * (1 - (Math.floor(Math.random() * 3) / 10));
    },
    [ZZZ]: statId => subOptions[statId].VALUE,
  };

  const subStatList = assignSubStats(filtered, 4, randomRoll[ctx.cache.gameId], true);

  return {
    mainStatId,
    mainStatValue,
    subStatList,
  };
};

const generateEquipWW = (ctx, cost) => {
  const wrongSetChance = cost === 4 ? 0.25 : 0.5
  if (Math.random() < wrongSetChance) return;

  const { cache, preferredMainStats } = ctx;
  const { gameId } = cache;

  // Randomly assign main stat (according to weighted rules)
  // Skip non preferred main stats
  const options = MISC[gameId].MAIN_STAT_TYPES[cost];
  const { mainStatId, mainStatValue } = assignMainStat(options);
  if (!preferredMainStats[cost].includes(mainStatId)) return;

  // Assign main stat flat values
  // Assign sub stats
  const mainFlatMap = MISC[gameId].MAIN_STAT_FLATS[cost];
  const [mainStatFlatId, { VALUE: mainStatFlatValue }] = Object.entries(mainFlatMap)[0];
  const subOptions = MISC[gameId].SUB_STAT_TYPES;
  const filtered = Object.entries(subOptions);
  const subStatList = assignSubStats(filtered, 5, randomRollWW);

  return {
    mainStatId,
    mainStatValue,
    mainStatFlatId,
    mainStatFlatValue,
    subStatList,
  };
};

const evaluateEquip = (ctx, spec, equip, latest) => {
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

  if ('cost' in spec) {
    if (spec.cost === 4) {
      compareAndReplace(0);
    } else if (spec.cost === 3) {
      compareAndReplace(1);
      compareAndReplace(2);
    } else {
      compareAndReplace(3);
      compareAndReplace(4);
    }
  } else {
    compareAndReplace(spec.slot);
  }

  return buffer;
};

const trialConfig = {
  [GI]: {
    weeklyRoutine: function (ctx, next) {
      for (let i = 0; i < 66; i++) {
        const slot = Math.floor(Math.random() * 5);
        const newEquipObj = generateEquip(ctx, slot);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, { slot }, newEquipObj, next));
      }
    },
  },
  [HSR]: {
    weeklyRoutine: function (ctx, next) {
      for (let i = 0; i < 84; i++) {
        const slot = Math.floor(Math.random() * 6);
        const newEquipObj = generateEquip(ctx, slot);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, { slot }, newEquipObj, next));
      }
    },
  },
  [WW]: {
    weeklyRoutine: function (ctx, next) {
      for (let i = 0; i < 20; i++) {
        const newEquipObj = generateEquipWW(ctx, 4);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, { cost: 4 }, newEquipObj, next));
      }

      for (let i = 0; i < 75; i++) {
        const newEquipObj = generateEquipWW(ctx, 3);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, { cost: 3 }, newEquipObj, next));
      }

      for (let i = 0; i < 60; i++) {
        const newEquipObj = generateEquipWW(ctx, 1);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, { cost: 1 }, newEquipObj, next));
      }
    },
  },
  [ZZZ]: {
    weeklyRoutine: function (ctx, next) {
      for (let i = 0; i < 120; i++) {
        const slot = Math.floor(Math.random() * 6);
        const newEquipObj = generateEquip(ctx, slot);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, { slot }, newEquipObj, next));
      }
    },
  },
};

export function advanceTrial(ctx, trial) {
  const { cache } = ctx;
  const { weeklyRoutine } = trialConfig[cache.gameId];

  const next = {
    equipList: trial.equipList,
    summary: trial.weeklySummary.at(-1),
    penalty: trial.penalty,
    score: sumRotationDmg(trial.weeklySummary.at(-1)) * trial.penalty,
  };

  weeklyRoutine(ctx, next);

  trial.equipList = next.equipList;
  trial.penalty = next.penalty;
  trial.weeklySummary.push(next.summary);
}
