import { createRunEquipMapFactory } from './runEquipMap';
import { buildSkippable } from './skippable';
import { getCeil } from './getCeil';

function getDiff(prev, next) {
  if (prev === 0 && next === 0) return 0;
  return next / prev * 100 - 100;
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

  const { totals: baseTotals } = runEquipMapDamageFocus();

  const isDamageSignificant = getDiff(baseTotals.damage, damageOptimizedTotals.damage) > 10;
  const isHealingSignificant = getDiff(baseTotals.healing, damageOptimizedTotals.healing) > 10;
  const isShieldSignificant = getDiff(baseTotals.shield, damageOptimizedTotals.shield) > 10;

  console.log(
    getDiff(baseTotals.damage, damageOptimizedTotals.damage),
    getDiff(baseTotals.healing, damageOptimizedTotals.healing),
    getDiff(baseTotals.shield, damageOptimizedTotals.shield),
  );

  if (
    isDamageSignificant ||
    (!isHealingSignificant && !isShieldSignificant)
  ) {
    return {
      calibration: { damage: 1 },
      scoreCeiling: damageOptimizedScoreCeiling,
      dpsCeiling,
    };
  }

  if (isHealingSignificant) {
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

    if (Math.abs(damageDiff) > 10) {
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
    ) {
      console.log('Final Decision: Healing focus');
      return {
        calibration: { healing: 1 },
        scoreCeiling: healingOptimizedScoreCeiling,
        dpsCeiling,
      };
    }

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

  if (isShieldSignificant) {
    const runEquipMapShieldFocus = createRunEquipMap({ shield: 1 });
    const skippableShieldFocus = buildSkippable(gameId, runEquipMapShieldFocus);
    const {
      totals: shieldOptimizedTotals,
      score: shieldOptimizedScoreCeiling,
    } = getCeil(gameId, runEquipMapShieldFocus, specId, skippableShieldFocus);

    const damageDiff = getDiff(damageOptimizedTotals.damage, shieldOptimizedTotals.damage);
    const shieldDiff = getDiff(damageOptimizedTotals.shield, shieldOptimizedTotals.shield);

    console.log('Switching from Damage focus to Shield focus tradeoffs:');
    console.log(`${damageDiff.toFixed(1)}% Team Damage`);
    console.log(`+${shieldDiff.toFixed(1)}% Team Shield`);

    if (Math.abs(damageDiff) > 10) {
      console.log('Final Decision: Damage focus');
      return {
        calibration: { damage: 1 },
        scoreCeiling: damageOptimizedScoreCeiling,
        dpsCeiling,
      };
    }

    if (
      Math.abs(damageDiff) < 10 &&
      Math.abs(damageDiff) < shieldDiff / cache.teamSize
    ) {
      console.log('Final Decision: Shield focus');
      return {
        calibration: { shield: 1 },
        scoreCeiling: shieldOptimizedScoreCeiling,
        dpsCeiling,
      };
    }

    console.log('Final Decision: Hybrid focus');

    const runEquipMapHybridFocus = createRunEquipMap({ damage: 0.5, shield: 0.5 });
    const skippableHybridFocus = buildSkippable(gameId, runEquipMapHybridFocus);
    const {
      score: hybridOptimizedScoreCeiling,
    } = getCeil(gameId, runEquipMapHybridFocus, specId, skippableHybridFocus);

    return {
      calibration: { damage: 0.5, shield: 0.5 },
      scoreCeiling: hybridOptimizedScoreCeiling,
      dpsCeiling,
    };
  }
}
