import { GI } from '@/data';
import { getEnergyLevel, toMergedObj } from '@/utils';
import { runRotation } from '../rotation';
import { getRequiredErMap, createEquipDurationGetter } from '../duration';
import { createRunEquipMap } from './runEquipMap';
import { getCeil } from './getCeil';

function getRates({ totals, time }) {
  return {
    damage: totals.damage / time * 1000,
    healing: totals.healing / time * 1000,
    shield: totals.shield / time * 1000,
  };
}

function getPreMergedMap(cache, specId) {
  const { baseMap, staticMap } = cache.member[specId];
  const statMap = toMergedObj(baseMap, staticMap);
  if (cache.gameId !== GI) return statMap;
  return toMergedObj(statMap, cache.teamResonance.stats);
}

function getSustainWeight(baseRates, dpsCeilResults, sustainCeilResults, sustainParts) {
  const dpsCeilRates = getRates(dpsCeilResults);
  const sustainCeilRates = getRates(sustainCeilResults);

  const pivotLoss = 0.05;
  const maxDpsLoss = 0.1;
  const minDamageWeight = 0.001;

  const sustainGain = sustainParts.reduce((acc, part) => {
    const baseline = baseRates[part] || 1;
    return acc + Math.max(0, sustainCeilRates[part] - dpsCeilRates[part]) / baseline;
  }, 0);

  if (sustainGain <= 0) return { damageWeight: 1, sustainWeight: 0, breakEven: 0 };

  const damageBaseline = baseRates.damage || 1;
  const dpsCeilDamageScore = dpsCeilRates.damage / damageBaseline;
  const damageLoss = Math.max(0, dpsCeilRates.damage - sustainCeilRates.damage) / damageBaseline;
  const damageLossPercent = dpsCeilDamageScore > 0
    ? damageLoss / dpsCeilDamageScore
    : 0;
  const breakEven = damageLoss / sustainGain;

  let damageWeight = 1;
  let sustainWeight = breakEven;

  if (damageLossPercent <= pivotLoss) {
    const progress = damageLossPercent / pivotLoss;
    damageWeight = minDamageWeight + (1 - minDamageWeight) * progress;
    sustainWeight = 1 + (breakEven - 1) * progress;
  } else if (damageLossPercent < maxDpsLoss) {
    const progress = (damageLossPercent - pivotLoss) / (maxDpsLoss - pivotLoss);
    sustainWeight = breakEven * (1 - progress);
  } else {
    sustainWeight = 0;
  }

  return {
    damageWeight,
    sustainWeight,
    breakEven,
  };
}

export function calibrate(cache, equipMaps, specId) {
  const { gameId } = cache;

  const preMergedMap = getPreMergedMap(cache, specId);

  const { snapshots: resolveSnapshots, bonusEnergy } = runRotation(cache, equipMaps, specId, true);
  const durationGetter = createEquipDurationGetter(cache, equipMaps, specId, bonusEnergy);
  const runEquipMap = createRunEquipMap(preMergedMap, resolveSnapshots, durationGetter, { damage: 1 });

  const baseResults = runEquipMap();
  const baseRates = getRates(baseResults);

  const requiredErMap = getRequiredErMap(cache, equipMaps);
  const requiredEr = requiredErMap[specId] ?? 0;
  const preMergedEr = getEnergyLevel(gameId, preMergedMap);
  const requiredEquipEr = Math.max(requiredEr - preMergedEr, 0);

  const optimize = (calibration) => {
    const runEquipMap = createRunEquipMap(preMergedMap, resolveSnapshots, durationGetter, calibration);
    return getCeil(gameId, runEquipMap, specId, requiredEquipEr);
  };

  const dpsCeilResults = optimize({ damage: 1, healing: 0.001, shield: 0.001 });

  const sustainParts = [
    ...(dpsCeilResults.totals.healing !== baseResults.totals.healing ? ['healing'] : []),
    ...(dpsCeilResults.totals.shield !== baseResults.totals.shield ? ['shield'] : []),
  ];

  // Early exit for characters that don't provide sustain
  if (sustainParts.length === 0) {
    return {
      calibration: { damage: 1 },
      dpsCeiling: dpsCeilResults.dps,
      scoreCeiling: dpsCeilResults.score,
    };
  }

  const sustainCeilResults = optimize({ reference: baseRates, damage: 0.001, ...Object.fromEntries(sustainParts.map((part) => [part, 1])) });

  const { damageWeight, sustainWeight, breakEven } = getSustainWeight(baseRates, dpsCeilResults, sustainCeilResults, sustainParts);

  const calibration = { reference: baseRates, damage: damageWeight, ...Object.fromEntries(sustainParts.map((part) => [part, sustainWeight])) };
  const hybridCeilResults = optimize(calibration);

  printLogs(dpsCeilResults, sustainCeilResults, hybridCeilResults, sustainParts, damageWeight, sustainWeight, breakEven);

  return {
    calibration,
    dpsCeiling: dpsCeilResults.dps,
    scoreCeiling: hybridCeilResults.score,
  };
}

function fmtPct(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function getDiff(prev, next) {
  if (prev === 0) return 0;
  return next / prev * 100 - 100;
}

function printLogs(dpsCeilResults, sustainCeilResults, hybridCeilResults, sustainParts, damageWeight, sustainWeight, breakEven) {
  const dpsCeilRates = getRates(dpsCeilResults);
  const sustainCeilRates = getRates(sustainCeilResults);
  const hybridRates = getRates(hybridCeilResults);

  const row = (rates) => ({
    DPS: fmtPct(getDiff(dpsCeilRates.damage, rates.damage)),
    HPS: fmtPct(getDiff(dpsCeilRates.healing, rates.healing)),
    SPS: fmtPct(getDiff(dpsCeilRates.shield, rates.shield)),
  });

  console.log(
    `Calibration (${sustainParts.join(', ')})\n` +
    `Break-even: ${breakEven.toFixed(3)}\n` +
    `Damage weight: ${damageWeight.toFixed(3)}\n` +
    `Sustain weight: ${sustainWeight.toFixed(3)}`
  );

  console.table({
    'Sustain ceiling (vs DPS ceiling)': row(sustainCeilRates),
    'Hybrid result (vs DPS ceiling)': row(hybridRates),
  });
}
