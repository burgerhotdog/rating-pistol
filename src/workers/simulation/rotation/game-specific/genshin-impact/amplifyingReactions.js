import { getAttr, toMergedObj, resolveBuffSpecs } from '@/utils';
import { getBuffMap } from '../../getStatMap';

const AMP_EM_CONSTANT = 2.78;

function runAmpFormula(reaction, base, statMap) {
  const em = getAttr('elementalMastery', statMap);
  const reactionBonus = 1 + ((AMP_EM_CONSTANT * em) / (1400 + em)) + getAttr(`${reaction}ReactionBonus%`, statMap);
  return base * reactionBonus;
}

function getAmpMultiplier(ctx, reaction, ownerId, base) {
  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: ownerId });
  const isSpecIdAction = ownerId === ctx.specId;

  if (!ctx.specId) {
    const statMap = toMergedObj(ctx.buildMaps[ownerId], buffMap);
    return runAmpFormula(reaction, base, statMap);
  }

  const usedAttrs = new Set(['elementalMastery', `${reaction}ReactionBonus%`]);
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
      const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
      const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);

      return runAmpFormula(reaction, base, statMap);
    };
  }

  // Action is from specId and has variable buffs from specId
  return (testBuildMap) => {
    const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
    const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
    const statMap = toMergedObj(testBuildMap, buffMap, resolvedBuffs);

    return runAmpFormula(reaction, base, statMap);
  };
}

export function reactMelt(ctx, ownerId, isForward) {
  ctx.runEffectsWhen('reaction', { reaction: 'melt', elements: ['pyro', 'cryo'] });
  return getAmpMultiplier(ctx, 'melt', ownerId, isForward ? 2 : 1.5);
}

export function reactVaporize(ctx, ownerId, isForward) {
  ctx.runEffectsWhen('reaction', { reaction: 'vaporize', elements: ['pyro', 'hydro'] });
  return getAmpMultiplier(ctx, 'vaporize', ownerId, isForward ? 2 : 1.5);
}
