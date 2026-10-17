import { createRunEquipMapFactory } from './runEquipMap';
import { buildSkippable } from './skippable';
import { getCeil } from './getCeil';

function getDiff(damageVersion, healingVersion) {
  if (damageVersion === 0 && healingVersion === 0) return 0;
  return healingVersion / damageVersion * 100 - 100;
}

export function calibrate(cache, equipMaps, specId) {
  const { gameId } = cache;

  const createRunEquipMap = createRunEquipMapFactory(cache, equipMaps, specId);

  const runEquipMapDamageFocus = createRunEquipMap();
  const skippableDamageFocus = buildSkippable(gameId, runEquipMapDamageFocus);
  const {
    totals: damageOptimizedTotals,
    score: damageOptimizedScoreCeiling,
    dps: dpsCeiling,
  } = getCeil(gameId, runEquipMapDamageFocus, specId, skippableDamageFocus);

  const runEquipMapHealingFocus = createRunEquipMap({ healing: 1 });
  const skippableHealingFocus = buildSkippable(gameId, runEquipMapHealingFocus);
  const {
    totals: healingOptimizedTotals,
    score: healingOptimizedScoreCeiling,
  } = getCeil(gameId, runEquipMapHealingFocus, specId, skippableHealingFocus);

  const damageDiff = getDiff(damageOptimizedTotals.damage, healingOptimizedTotals.damage);
  const healingDiff = getDiff(damageOptimizedTotals.healing, healingOptimizedTotals.healing);

  console.log('Switching from Damage focus to Healing focus tradeoffs:');
  console.log(`${damageDiff.toFixed(1)}% Team Damage`);
  console.log(`+${healingDiff.toFixed(1)}% Team Healing`);

  if (
    Math.abs(damageDiff) > 10
  ) { // Focus damage only
    console.log('Final Decision: Damage focus');
    return {
      calibration: { damage: 1 },
      scoreCeiling: damageOptimizedScoreCeiling,
      dpsCeiling,
    };
  }

  if (
    Math.abs(damageDiff) < 10 &&
    Math.abs(damageDiff) < healingDiff / cache.teamSize
  ) { // Focus healing only
    console.log('Final Decision: Healing focus');
    return {
      calibration: { healing: 1 },
      scoreCeiling: healingOptimizedScoreCeiling,
      dpsCeiling,
    };
  }

  // Hybrid
  console.log('Final Decision: Hybrid focus');

  const runEquipMapHybridFocus = createRunEquipMap({ damage: 0.5, healing: 0.5 });
  const skippableHybridFocus = buildSkippable(gameId, runEquipMapHybridFocus);
  const {
    score: hybridOptimizedScoreCeiling,
  } = getCeil(gameId, runEquipMapHybridFocus, specId, skippableHybridFocus);

  return {
    calibration: { damage: 0.5, healing: 0.5 },
    scoreCeiling: hybridOptimizedScoreCeiling,
    dpsCeiling,
  };
}
