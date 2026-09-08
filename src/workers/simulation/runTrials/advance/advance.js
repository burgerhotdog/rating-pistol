import { MISC } from '@/data';
import { buildEquipMap } from '@/utils';
import { getSkippableStats } from './getSkippableStats';
import { createEquipGenerator } from './generateEquip';

function createEquipEvaluator(evaluateEquipMap, id) {
  function trySlots(slots, equip, prev) {
    const next = { ...prev };

    for (const equipIndex of slots) {
      const equipList = prev.equipList.with(equipIndex, equip);
      const { snapshots, totals, score, actualRotationTime } = evaluateEquipMap(buildEquipMap(equipList, true));

      if (score > next.score) {
        const dps = totals.damage / actualRotationTime * 1000;
        Object.assign(next, { equipList, snapshots, score, dps });
      }
    }

    return next;
  }

  return (equip, trial) => {
    if ('index' in equip) {
      return trySlots([equip.index], equip, trial);
    }

    if (id === 1409) {
      switch (equip.cost) {
        case 4:
          return trySlots([0, 1], equip, trial);
        case 3:
          return trial;
        case 1:
          return trySlots([2, 3, 4], equip, trial);
      }
    }

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

export function createAdvanceTrial(cache, evaluateEquipMap, currId) {
  const { gameId } = cache;
  const { score } = evaluateEquipMap();
  const skippable = getSkippableStats(gameId, score, evaluateEquipMap);
  const generateEquip = createEquipGenerator(skippable);
  const evaluateEquip = createEquipEvaluator(evaluateEquipMap, currId);

  const { staminaPerDay, domains } = MISC[gameId];
  const runsPerDay = staminaPerDay / domains.equip.stamina;
  const equipsPerDay = Math.round(runsPerDay * domains.equip.reward.equip);

  return (trial) => {
    for (let i = 0; i < equipsPerDay; i++) {
      const equip = generateEquip(gameId);
      if (!equip) continue;

      Object.assign(trial, evaluateEquip(equip, trial));
    }
  };
}
