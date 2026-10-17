
import { createRunEquipMapFactory } from './runEquipMap';
import { buildSkippable } from './skippable';
import { getCeil } from './getCeil';

function getDiff(prev, next) {
  if (prev === 0) return 0;
  return next / prev * 100 - 100;
}

function getRates({ totals, time }) {
  return {
    damage: totals.damage / time * 1000,
    healing: totals.healing / time * 1000,
    shield: totals.shield / time * 1000,
  };
}

function getWeight(dpsRates, outputRates, reference, parts) {
  const dpsLoss = Math.max(
    0,
    dpsRates.damage - outputRates.damage,
  ) / reference.damage;

  const outputGain = parts.reduce((sum, part) =>
    sum + Math.max(
      0,
      outputRates[part] - dpsRates[part],
    ) / reference[part]
  , 0);

  if (outputGain <= 0) return 0;

  const maxLoss = dpsRates.damage * 0.1 / reference.damage;

  if (maxLoss <= 0) return 0;

  const effectiveLoss = dpsLoss / (1 + dpsLoss / maxLoss);

  return effectiveLoss / outputGain;
}

export function calibrate(cache, equipMaps, specId) {
  const { gameId } = cache;

  const createRunEquipMap = createRunEquipMapFactory(
    cache,
    equipMaps,
    specId,
  );

  const optimize = (calibration) => {
    const runEquipMap = createRunEquipMap(calibration);
    const skippable = buildSkippable(gameId, runEquipMap);

    return getCeil(gameId, runEquipMap, specId, skippable);
  };

  // Baseline
  const runEquipMap = createRunEquipMap();
  const base = runEquipMap();
  const baseRates = getRates(base);

  // DPS ceiling
  const dpsCeiling = optimize({ damage: 1 });
  const dpsRates = getRates(dpsCeiling);

  const dpsCeilDamageDiff = getDiff(
    base.totals.damage,
    dpsCeiling.totals.damage,
  );

  const dpsCeilHealingDiff = getDiff(
    base.totals.healing,
    dpsCeiling.totals.healing,
  );

  const dpsCeilShieldDiff = getDiff(
    base.totals.shield,
    dpsCeiling.totals.shield,
  );

  console.log(
    'Total gains over baseline for DPS Ceiling Build:\n\n' +
    `${dpsCeilDamageDiff.toFixed()}% Damage\n` +
    `${dpsCeilHealingDiff.toFixed()}% Healing\n` +
    `${dpsCeilShieldDiff.toFixed()}% Shield`
  );

  const isHealingVariable =
    dpsCeiling.totals.healing !== base.totals.healing;

  const isShieldVariable =
    dpsCeiling.totals.shield !== base.totals.shield;

  if (!isHealingVariable && !isShieldVariable) {
    return {
      calibration: { damage: 1 },
      scoreCeiling: dpsCeiling.score,
      dpsCeiling: dpsCeiling.dps,
    };
  }

  // Fixed baseline reference
  const reference = {
    damage: baseRates.damage || 1,
    healing: baseRates.healing || 1,
    shield: baseRates.shield || 1,
  };

  // Select relevant sustain objectives
  const parts = [
    ...(isHealingVariable ? ['healing'] : []),
    ...(isShieldVariable ? ['shield'] : []),
  ];

  // Healing only, shielding only, or combined sustain ceiling
  const sustainCalibration = {
    damage: 0.1,
    ...Object.fromEntries(parts.map((part) => [part, 1])),
    reference,
  };

  const sustainCeiling = optimize(sustainCalibration);
  const sustainRates = getRates(sustainCeiling);

  // Share the DPS opportunity cost across all active sustain objectives
  const sustainWeight = getWeight(
    dpsRates,
    sustainRates,
    reference,
    parts,
  );

  const calibration = {
    damage: 1,
    ...(sustainWeight > 0
      ? Object.fromEntries(parts.map((part) => [part, sustainWeight]))
      : {}),
    reference,
  };

  // Final multi-objective optimization
  const hybridCeiling = optimize(calibration);
  const hybridRates = getRates(hybridCeiling);

  console.log(
    'Calibration Results:\n\n' +
    `Active Sustain: ${parts.join(', ')}\n` +
    `Sustain Weight: ${sustainWeight.toFixed(3)}\n\n` +
    `Sustain Ceiling DPS: ${getDiff(dpsRates.damage, sustainRates.damage).toFixed(1)}%\n` +
    `Sustain Ceiling HPS: ${getDiff(dpsRates.healing, sustainRates.healing).toFixed(1)}%\n` +
    `Sustain Ceiling SPS: ${getDiff(dpsRates.shield, sustainRates.shield).toFixed(1)}%\n\n` +
    `Final DPS: ${getDiff(dpsRates.damage, hybridRates.damage).toFixed(1)}%\n` +
    `Final HPS: ${getDiff(dpsRates.healing, hybridRates.healing).toFixed(1)}%\n` +
    `Final SPS: ${getDiff(dpsRates.shield, hybridRates.shield).toFixed(1)}%`
  );

  return {
    calibration,
    scoreCeiling: hybridCeiling.score,
    dpsCeiling: dpsCeiling.dps,
  };
}
