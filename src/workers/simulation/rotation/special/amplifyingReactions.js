import { getAttr, toMergedObj } from '@/utils';
import { getBuffMap } from '../getStatMap';

const resolveStatSpecs = (buffSpec, sourceStatMap) => {
  const resolved = {};

  for (const [statId, statSpec] of Object.entries(buffSpec)) {
    const {
      attr, offset = 0, step,
      value, maxValue = Infinity,
    } = statSpec;

    const attrValue = getAttr(attr, sourceStatMap);
    const mult = Math.max((attrValue - offset) / step, 0);
    resolved[statId] = Math.min(value * mult, maxValue);
  }

  return resolved;
};

const toResolvedSpecs = (buffSpecs, sourceMap) => {
  const buffMap = {};
  for (const { specs, buffMult } of buffSpecs) {
    const resolvedStatMap = resolveStatSpecs(specs, sourceMap);

    for (const stat in resolvedStatMap) {
      buffMap[stat] = (buffMap[stat] ?? 0) + resolvedStatMap[stat] * buffMult;
    }
  }
  return buffMap;
};

// Amplifying reactions (melt/vaporize) multiply the triggering hit's own damage
// instead of creating an independent damage instance, so this returns a
// multiplier (number, or a buildMap => number closure in spec mode) rather than
// pushing a snapshot. Aura consumption is handled by the caller in elementalGauge.js.
const AMP_EM_CONSTANT = 2.78;

const ampBonusStat = {
  melt: 'meltDmgBonus%',
  vaporize: 'vaporizeDmgBonus%',
};

function runAmpFormula(reaction, base, statMap) {
  const em = getAttr('elementalMastery', statMap);
  const reactionBonus = 1 + ((AMP_EM_CONSTANT * em) / (1400 + em)) + getAttr(ampBonusStat[reaction], statMap);
  return base * reactionBonus;
}

function getAmpMultiplier(ctx, reaction, ownerId, base) {
  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: ownerId });
  const isSpecIdAction = ownerId === ctx.specId;

  if (!ctx.specId) {
    const statMap = toMergedObj(ctx.buildMaps[ownerId], buffMap);
    return runAmpFormula(reaction, base, statMap);
  }

  const usedAttrs = new Set(['elementalMastery', ampBonusStat[reaction]]);
  const usesSpecs = buffSpecs.some(({ specs }) =>
    Object.keys(specs).some((stat) => usedAttrs.has(stat))
  );

  if (!isSpecIdAction && !usesSpecs) {
    const statMap = toMergedObj(ctx.buildMaps[ownerId], buffMap);
    return runAmpFormula(reaction, base, statMap);
  }

  // Action is from specId but has no variable buffs from specId
  if (!usesSpecs) {
    return (currBuildMap) => {
      const statMap = toMergedObj(currBuildMap, buffMap);
      return runAmpFormula(reaction, base, statMap);
    };
  }

  const testBuffMap = getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true });

  // Action is not from specId but has variable buffs from specId
  if (!isSpecIdAction) {
    const partiallyBuffedMap = toMergedObj(ctx.buildMaps[ownerId], buffMap);

    return (testBuildMap) => {
      const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
      const resolvedBuffs = toResolvedSpecs(buffSpecs, testBuffedMap);
      const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);

      return runAmpFormula(reaction, base, statMap);
    };
  }

  // Action is from specId and has variable buffs from specId
  return (testBuildMap) => {
    const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
    const resolvedBuffs = toResolvedSpecs(buffSpecs, testBuffedMap);
    const statMap = toMergedObj(testBuildMap, buffMap, resolvedBuffs);

    return runAmpFormula(reaction, base, statMap);
  };
}

export function reactMelt(ctx, ownerId, isForward) {
  ctx.runEffectsWhen('reaction', { reaction: { reaction: 'melt', elements: ['pyro', 'cryo'] } });
  return getAmpMultiplier(ctx, 'melt', ownerId, isForward ? 2 : 1.5);
}

export function reactVaporize(ctx, ownerId, isForward) {
  ctx.runEffectsWhen('reaction', { reaction: { reaction: 'vaporize', elements: ['pyro', 'hydro'] } });
  return getAmpMultiplier(ctx, 'vaporize', ownerId, isForward ? 2 : 1.5);
}
