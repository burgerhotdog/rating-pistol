import { MISC } from '@/data';
import { buildEquipMap } from '@/utils';
import { getSkippableStats } from './getSkippableStats';
import { createEquipGenerator } from './generateEquip';

function createEquipEvaluator(cache, evaluateEquipMap) {
  function trySlots(slots, equip, prev) {
    const next = { ...prev };
    for (const equipIndex of slots) {
      const equipList = prev.equipList.with(equipIndex, equip);
      const { snapshots, totals, score, penalty } = evaluateEquipMap(buildEquipMap(equipList, true));

      if (score > next.score) {
        const concertoExtraTime = cache.member[cache.charId].concertoPenalty
          ? ((100 / 92) * cache.member[cache.charId].duration - cache.member[cache.charId].duration)
          : 0;
        const dps = totals.damage / (cache.rotationDuration + concertoExtraTime) * 1000 * penalty;
        Object.assign(next, { equipList, snapshots, score, dps });
      }
    }
    return next;
  }

  return (equip, trial) => {
    if ('index' in equip) {
      return trySlots([equip.index], equip, trial);
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

export function createAdvanceTrial(cache, evaluateEquipMap) {
  const { gameId } = cache;
  const { score } = evaluateEquipMap();
  const skippable = getSkippableStats(gameId, score, evaluateEquipMap);
  const generateEquip = createEquipGenerator(skippable);
  const evaluateEquip = createEquipEvaluator(cache, evaluateEquipMap);

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
