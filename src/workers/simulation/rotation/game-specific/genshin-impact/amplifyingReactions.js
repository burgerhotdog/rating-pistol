import { getAttr, toMergedObj, resolveBuffSpecs } from '@/utils';
import { getBuffMap } from '../../getStatMap';

function emBonus(statMap) {
  const emValue = getAttr('elementalMastery', statMap);
  return (2.78 * emValue) / (1400 + emValue);
}

function reactionBonus(reaction, statMap) {
  return getAttr(`${reaction}ReactionBonus%`, statMap);
}

function ampFormula(reaction, statMap) {
  return 1 + emBonus(statMap) + reactionBonus(reaction, statMap);
}

function getAmpMultiplier(ctx, reaction, ownerId, isForward) {
  const reactionMultiplier = isForward ? 2 : 1.5;
  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: ownerId });

  const statMapOwnerIdBuildMap = ctx.buildMaps[ownerId];

  if (!ctx.specId) {
    const statMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
    return reactionMultiplier * ampFormula(reaction, statMap);
  }

  const isSpecIdAction = ownerId === ctx.specId;
  const usedAttrs = new Set(['elementalMastery', `${reaction}ReactionBonus%`]);
  const usesSpecs = buffSpecs.some(({ specs }) =>
    Object.keys(specs).some((stat) => usedAttrs.has(stat))
  );

  if (!isSpecIdAction && !usesSpecs) {
    const statMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
    return reactionMultiplier * ampFormula(reaction, statMap);
  }

  // Action is from specId but has no variable buffs from specId
  if (!usesSpecs) {
    return (testBuildMap) => {
      const statMap = toMergedObj(testBuildMap, buffMap);
      return reactionMultiplier * ampFormula(reaction, statMap);
    };
  }

  const testBuffMap = getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true });

  // Action is not from specId but has variable buffs from specId
  if (!isSpecIdAction) {
    const partiallyBuffedMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);

    return (testBuildMap) => {
      const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
      const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
      const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);

      return reactionMultiplier * ampFormula(reaction, statMap);
    };
  }

  // Action is from specId and has variable buffs from specId
  return (testBuildMap) => {
    const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
    const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
    const statMap = toMergedObj(testBuildMap, buffMap, resolvedBuffs);

    return reactionMultiplier * ampFormula(reaction, statMap);
  };
}

export function reactMelt(ctx, ownerId, isForward) {
  ctx.runEffects('reaction', { reaction: 'melt', ownerId, elements: ['pyro', 'cryo'] });

  return getAmpMultiplier(ctx, 'melt', ownerId, isForward);
}

export function reactVaporize(ctx, ownerId, isForward) {
  ctx.runEffects('reaction', { reaction: 'vaporize', ownerId, elements: ['pyro', 'hydro'] });

  return getAmpMultiplier(ctx, 'vaporize', ownerId, isForward);
}
