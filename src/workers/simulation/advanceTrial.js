import { GI, HSR, WW, ZZZ } from '@/data';
import { mergeObj, mergeEquipList } from '@/utils';
import { assignMainStat } from './assignMainStat';
import { revealSubStatWuwa, revealSubStatsHoyo, upgradeSubStats } from './assignSubStat';
import { getWeightedScore } from './utils';

const createEquipGenerator = (gameId, goodStats) => {
  const isGoodMain = (equip) => {
    const key = gameId === WW ? equip.cost : equip.index;
    return goodStats.main[key].includes(equip.mainStatId);
  };

  const hasGoodSubs = (subStatList, numGood) => {
    let count = 0;

    for (const { subStatId } of subStatList) {
      if (goodStats.sub.includes(subStatId)) count++;
    }

    return count >= numGood;
  };

  // Return early on certain conditions
  return (spec) => {
    if (Math.random() < 0.5) return; // Wrong set

    const equip = assignMainStat(gameId, spec);
    if (!isGoodMain(equip)) return; // Bad main stat

    const subStatList = [];
    if (gameId === WW) {
      revealSubStatWuwa(subStatList);
      if (!hasGoodSubs(subStatList, 1)) return; // Sub 1 is bad

      revealSubStatWuwa(subStatList);
      revealSubStatWuwa(subStatList);
      if (!hasGoodSubs(subStatList, 2)) return; // Sub 2 and 3 are both bad

      revealSubStatWuwa(subStatList);
      revealSubStatWuwa(subStatList);
    } else {
      revealSubStatsHoyo(subStatList, gameId, equip.mainStatId);
      if (!hasGoodSubs(subStatList, 2)) return; // Bad starting 4 stats

      upgradeSubStats(subStatList, gameId);
    }

    return { ...equip, subStatList };
  };
};

const createEquipEvaluator = (baseMap, runRotation, getPenalty, currId) => (equip, latest) => {
  const buffer = { ...latest };

  const trySlot = (index) => {
    const newEquipList = latest.equipList.with(index, equip);
    const combinedStatMap = mergeObj(baseMap, mergeEquipList(newEquipList));
    const newSummary = runRotation(combinedStatMap);
    const newPenalty = getPenalty(combinedStatMap);
    const newScore = getWeightedScore(newSummary, currId, newPenalty);

    if (newScore > buffer.score) {
      Object.assign(buffer, {
        equipList: newEquipList,
        summary: newSummary,
        score: newScore,
      });
    }
  };

  if ('cost' in equip) {
    if (equip.cost === 4) {
      trySlot(0);
    } else if (equip.cost === 3) {
      trySlot(1);
      trySlot(2);
    } else {
      trySlot(3);
      trySlot(4);
    }
  } else {
    trySlot(equip.index);
  }

  return buffer;
};

export const createTrialAdvancer = (cache, currId, goodStats, runRotation, getPenalty) => {
  const { gameId } = cache;
  const { baseMap } = cache.member[currId];

  const generateEquip = createEquipGenerator(gameId, goodStats);
  const evaluateEquip = createEquipEvaluator(baseMap, runRotation, getPenalty, currId);

  const passes = {
    [GI]: [{ count: 66,  slotCount: 5 }],
    [HSR]: [{ count: 84,  slotCount: 6, type: 'relic' }],
    [ZZZ]: [{ count: 120, slotCount: 6 }],
    [WW]: [{ count: 20, cost: 4 }, { count: 15, cost: 3 }, { count: 60 }],
  };

  return (trial) => {
    for (const pass of passes[gameId]) {

      const spec = {};
      if (gameId === WW) {
        if ('cost' in pass) {
          spec.cost = pass.cost;
        }
      } else if (gameId === HSR) {
        spec.type = pass.type;
      }

      for (let i = 0; i < pass.count; i++) {
        const equip = generateEquip(spec);
        if (!equip) continue;

        Object.assign(trial, evaluateEquip(equip, trial));
      }
    }
  };
};
