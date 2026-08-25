import { GI, HSR, WW, ZZZ } from '@/data';
import { buildEquipMap } from '@/utils';
import { getSkippableStats } from './getSkippableStats';
import { createEquipGenerator } from './generateEquip';

function createEquipEvaluator(cache, evaluateEquipMap) {
  function trySlots(slots, equip, prev) {
    const next = { ...prev };
    for (const equipIndex of slots) {
      const equipList = prev.equipList.with(equipIndex, equip);
      const { summary, totals, score } = evaluateEquipMap(buildEquipMap(equipList, true));

      if (score > next.score) {
        const dps = totals.damage / cache.rotationDuration * 1000;
        Object.assign(next, { equipList, summary, score, dps });
      }
    }
    return next;
  }

  return function evaluateEquip(equip, trial) {
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

export function createAdvanceTrial(cache, evaluateEquipMap) {
  const { gameId } = cache;
  const { score } = evaluateEquipMap();
  const skippable = getSkippableStats(gameId, score, evaluateEquipMap);
  const generateEquip = createEquipGenerator(gameId, skippable);
  const evaluateEquip = createEquipEvaluator(cache, evaluateEquipMap);

  const passes = {
    [GI]: [{ count: 66 }],
    [HSR]: [{ count: 84, type: 'relic' }],
    [ZZZ]: [{ count: 120 }],
    [WW]: [{ count: 20, cost: 4 }, { count: 60 }],
  }[gameId];

  return (trial) => {
    for (const pass of passes) {
      let spec;
      if (gameId === WW) {
        if ('cost' in pass) spec = pass.cost;
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
