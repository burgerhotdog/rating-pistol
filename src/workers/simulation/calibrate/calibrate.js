
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

  const createRunEquipMap = createRunEquipMapFactory(cache, equipMaps, specId);

  const optimize = (calibration) => {
    const runEquipMap = createRunEquipMap(calibration);
    const skippable = buildSkippable(gameId, runEquipMap);

    return getCeil(gameId, runEquipMap, specId, skippable);
  };

  const runEquipMap = createRunEquipMap();
  const baseResults = runEquipMap();
  const baseTotals = baseResults.totals;
  const baseRates = getRates(baseResults);

  const dpsCeilResults = optimize({ damage: 1 });
  const dpsCeilTotals = dpsCeilResults.totals;
  const dpsCeilRates = getRates(dpsCeilResults);

  const reference = {
    damage: baseRates.damage || 1,
    healing: baseRates.healing || 1,
    shield: baseRates.shield || 1,
  };

  const parts = [
    ...(dpsCeilTotals.healing !== baseTotals.healing ? ['healing'] : []),
    ...(dpsCeilTotals.shield !== baseTotals.shield ? ['shield'] : []),
  ];

  if (parts.length === 0) {
    return {
      calibration: { damage: 1 },
      scoreCeiling: dpsCeilResults.score,
      dpsCeiling: dpsCeilResults.dps,
    };
  }

  const sustainCalibration = {
    damage: 0.1,
    ...Object.fromEntries(parts.map((part) => [part, 1])),
    reference,
  };

  const sustainCeiling = optimize(sustainCalibration);
  const sustainRates = getRates(sustainCeiling);

  const sustainWeight = getWeight(dpsCeilRates, sustainRates, reference, parts);

  const calibration = {
    damage: 1,
    ...(sustainWeight > 0
      ? Object.fromEntries(parts.map((part) => [part, sustainWeight]))
      : {}),
    reference,
  };

  const { score: hybridCeilScore } = optimize(calibration);

  console.log(
    'Calibration Results:\n\n' +
    `Active Sustain: ${parts.join(', ')}\n` +
    `Sustain Weight: ${sustainWeight.toFixed(3)}\n\n` +
    `Sustain Ceiling DPS: ${getDiff(dpsCeilRates.damage, sustainRates.damage).toFixed(1)}%\n` +
    `Sustain Ceiling HPS: ${getDiff(dpsCeilRates.healing, sustainRates.healing).toFixed(1)}%\n` +
    `Sustain Ceiling SPS: ${getDiff(dpsCeilRates.shield, sustainRates.shield).toFixed(1)}%\n\n`
  );

  return {
    calibration,
    scoreCeiling: hybridCeilScore,
    dpsCeiling: dpsCeilResults.dps,
  };
}
