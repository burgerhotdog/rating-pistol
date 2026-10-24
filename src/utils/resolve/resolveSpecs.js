
import { getAttr } from '../getAttr';

function getRoyalCritBonus(baseCritRate, stackBonus) {
  const base = Math.max(0, Math.min(1, baseCritRate));

  let chance = 1;
  let expectedHits = 0;

  for (let stacks = 0; stacks < 5; stacks++) {
    expectedHits += chance;

    const critRate = Math.min(1, base + stacks * stackBonus);
    chance *= 1 - critRate;
  }

  const maxCritRate = Math.min(1, base + 5 * stackBonus);

  if (maxCritRate === 0) return 0;

  expectedHits += chance / maxCritRate;

  return Math.max(0, 1 / expectedHits - base);
}

export const resolveSpecs = (specs, sourceMap) => {
  const resolved = {};

  for (const stat in specs) {
    const {
      attr,
      formula,
      step,
      value,
      offset = 0,
      maxValue = Infinity,
    } = specs[stat];

    const attrValue = getAttr(attr, sourceMap);

    if (formula === 'royalCrit') {
      resolved[stat] = getRoyalCritBonus(attrValue, value);
      continue;
    }

    if (attrValue <= offset) continue;

    const statValue = (attrValue - offset) / step * value;
    resolved[stat] = Math.min(statValue, maxValue);
  }

  return resolved;
};

export const resolveBuffSpecs = (buffSpecs, sourceMap) => {
  const resolved = {};

  for (const { specs, buffMult } of buffSpecs) {
    const statMap = resolveSpecs(specs, sourceMap);

    for (const stat in statMap) {
      resolved[stat] = (resolved[stat] ?? 0) + statMap[stat] * buffMult;
    }
  }

  return resolved;
};
