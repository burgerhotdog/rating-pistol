import { getAttr, toMergedObj, resolveBuffSpecs } from '@/utils';
import { getBuffMap } from '../../getStatMap';

const LEVEL_MULT = 1446.85;
const RXN_MULT = 1.25;

function getEmBonus(statMap) {
  const emValue = getAttr('elementalMastery', statMap);
  return (5 * emValue) / (1200 + emValue);
}

function flatFormula(statMap) {
  return 1 + getEmBonus(statMap) + getAttr('spreadReactionBonus%', statMap);
}

function getFlat(ctx, ownerId, action) {
  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: ownerId, action });

  const statMapOwnerIdBuildMap = ctx.buildMaps[ownerId];

  if (!ctx.specId) {
    const statMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
    return LEVEL_MULT * RXN_MULT * flatFormula(statMap);
  }

  const isSpecIdAction = ownerId === ctx.specId;

  const usedAttrs = new Set([
    'elementalMastery',
    'spreadReactionBonus%',
  ]);

  const usesSpecs = buffSpecs.some(({ specs }) =>
    Object.keys(specs).some((stat) => usedAttrs.has(stat))
  );

  if (!isSpecIdAction && !usesSpecs) {
    const statMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
    return LEVEL_MULT * RXN_MULT * flatFormula(statMap);
  }

  // Action is from specId but has no variable buffs from specId
  if (!usesSpecs) {
    return (testBuildMap) => {
      const statMap = toMergedObj(testBuildMap, buffMap);
      return LEVEL_MULT * RXN_MULT * flatFormula(statMap);
    };
  }

  const testBuffMap = getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true }).buffMap;

  // Action is not from specId but has variable buffs from specId
  if (!isSpecIdAction) {
    const partiallyBuffedMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);

    return (testBuildMap) => {
      const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
      const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
      const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);

      return LEVEL_MULT * RXN_MULT * flatFormula(statMap);
    };
  }

  // Action is from specId and has variable buffs from specId
  return (testBuildMap) => {
    const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
    const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
    const statMap = toMergedObj(testBuildMap, buffMap, resolvedBuffs);

    return LEVEL_MULT * RXN_MULT * flatFormula(statMap);
  };
}

export function reactSpread(ctx, ownerId, action) {
  const flat = getFlat(ctx, ownerId, action);

  ctx.runEffects('reaction', {
    reaction: 'spread',
    elements: ['dendro'],
    ownerId,
  });

  return flat;
}