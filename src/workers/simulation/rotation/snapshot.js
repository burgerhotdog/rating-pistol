import { toMergedObj } from '@/utils';
import { resolveStatSpecs, mergeStatMap } from '../utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';
import { getUsedAttrs } from './formula/solver';

const snapshotParts = ['damage', 'healing', 'shield'];

const toResolvedSpecs = (buffSpecs, sourceMap) => {
  const buffMap = {};
  for (const { specs, buffMult } of buffSpecs) {
    const resolvedStatMap = resolveStatSpecs(specs, sourceMap);
    mergeStatMap(buffMap, resolvedStatMap, buffMult);
  }
  return buffMap;
};

export const buildSnapshot = (ctx, action, options = {}) => {
  const { cache: { gameId }, states } = ctx;
  const { runtimeOffset = 0 } = options;

  const snapshot = {
    id: action.id,
    name: action.name,
    ownerId: action.ownerId,
    category: action.category,
    type: action.type,
    field: states.getField(action.ownerId),
    runtime: states.runtime + runtimeOffset,
    ...(action.damage &&
      { damageType: action.damage.type }),
    ...(action.hitOffsets &&
      { hitOffsets: action.hitOffsets }),
  };

  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: action.ownerId, action });
  const isSpecIdAction = action.ownerId === ctx.specId;
  let currBuffMap;

  for (const part of snapshotParts) {
    if (!action[part]) continue;

    const usedAttrs = getUsedAttrs(gameId, action, part);
    const usesSpecs = buffSpecs.some(({ specs }) =>
      Object.keys(specs).some((statId) => usedAttrs.has(statId))
    );

    // Can be resolved now
    // Action is not from specId and uses no variable buffs from specId
    if (!ctx.specId || (!isSpecIdAction && !usesSpecs)) {
      const statMap = toMergedObj(ctx.buildMaps[action.ownerId], buffMap);
      snapshot[part] = runFormula(gameId, part, action, statMap);
      continue;
    }

    // Action is from specId but has no variable buffs from specId
    if (!usesSpecs) {
      snapshot[part] = (currBuildMap) => {
        const statMap = toMergedObj(currBuildMap, buffMap);
        return runFormula(gameId, part, action, statMap);
      };
      continue;
    }

    currBuffMap ??= getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true });

    // Action is not from specId but has variable buffs from specId
    if (!isSpecIdAction) {
      const partiallyBuffedMap = toMergedObj(ctx.buildMaps[action.ownerId], buffMap);
      snapshot[part] = (currBuildMap) => {
        const currBuffedMap = toMergedObj(currBuildMap, currBuffMap);
        const resolvedBuffs = toResolvedSpecs(buffSpecs, currBuffedMap);
        const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);
        return runFormula(gameId, part, action, statMap);
      };
      continue;
    }

    // Action is from specId and has variable buffs from specId
    snapshot[part] = (currBuildMap) => {
      const currBuffedMap = toMergedObj(currBuildMap, currBuffMap);
      const resolvedBuffs = toResolvedSpecs(buffSpecs, currBuffedMap);
      const statMap = toMergedObj(currBuildMap, buffMap, resolvedBuffs);
      return runFormula(gameId, part, action, statMap);
    };
  }

  return snapshot;
};
