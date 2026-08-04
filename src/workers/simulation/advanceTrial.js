import { GI, HSR, WW, ZZZ } from '@/data';
import { toEquipMap } from '@/utils';
import { getSkippableStats } from './getSkippableStats';
import { createAssignMain } from './stats/assignMain';
import { revealSubStatWuwa, revealSubStatsHoyo, upgradeSubStats } from './stats/assignSub';

function createEquipGenerator(gameId, skippable) {
  const isGoodMain = (equip) => {
    const key = gameId === WW ? equip.cost : equip.index;
    return !skippable.mainstats[key].has(equip.mainStatId);
  };

  const hasGoodSubs = (subStatList, numGood) => {
    let count = 0;

    for (const { subStatId } of subStatList) {
      if (!skippable.substats.has(subStatId)) count++;
    }

    return count >= numGood;
  };

  const assignMain = createAssignMain(gameId);

  // Return early on certain conditions
  return (spec) => {
    if (Math.random() < 0.5) return; // Wrong set

    const equip = assignMain(spec);
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
}

function createEquipEvaluator(cache, evaluateEquipMap) {
  function trySlots(slots, equip, prev) {
    const next = { ...prev };
    for (const equipIndex of slots) {
      const equipList = prev.equipList.with(equipIndex, equip);
      const { summary, totals, score } = evaluateEquipMap(toEquipMap(equipList));

      if (score > next.score) {
        const dps = cache.getDps(totals.damage);
        Object.assign(next, { equipList, summary, score, dps });
      }
    }
    return next;
  }

  return (equip, trial) => {
    if ('index' in equip)
      return trySlots([equip.index], equip, trial);

    switch (equip.cost) {
      case 4:
        return trySlots([0], equip, trial);
      case 3:
        return trySlots([1, 2], equip, trial);
      case 1:
        return trySlots([3, 4], equip, trial);
    }
  };
}

export function createTrialAdvancer(cache, score, evaluateEquipMap) {
  const { gameId } = cache;

  const skippable = getSkippableStats(gameId, score, evaluateEquipMap);

  const generateEquip = createEquipGenerator(gameId, skippable);
  const evaluateEquip = createEquipEvaluator(cache, evaluateEquipMap);

  const passes = {
    [GI]: [{ count: 66,  slotCount: 5 }],
    [HSR]: [{ count: 84,  slotCount: 6, type: 'relic' }],
    [ZZZ]: [{ count: 120, slotCount: 6 }],
    [WW]: [{ count: 20, cost: 4 }, { count: 60 }],
  }[gameId];

  return (trial) => {
    for (const pass of passes) {
      let spec;
      if (gameId === WW) {
        if ('cost' in pass) {
          spec = pass.cost;
        }
      } else if (gameId === HSR) {
        spec = pass.type;
      }

      for (let i = 0; i < pass.count; i++) {
        const equip = generateEquip(spec);
        if (!equip) continue;

        Object.assign(trial, evaluateEquip(equip, trial));
      }
    }
  };
}
