import { getAttr, toMergedObj } from '@/utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';
import { getUsedAttrs } from './formula/solver';

const snapshotParts = ['damage', 'healing', 'shield'];

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

export const buildSnapshot = (ctx, action, options = {}) => {
  const { runtimeOffset = 0 } = options;
  const gameId = ctx.cache.gameId;

  const snapshot = {
    key: action.key,
    name: action.name,
    ownerId: action.ownerId,
    category: action.category,
    type: action.type,
    field: ctx.states.getField(action.ownerId),
    runtime: ctx.states.runtime + runtimeOffset,
    ...(action.damage && { damageType: action.damage.type }),
    ...(action.hitOffsets && { hitOffsets: action.hitOffsets }),
  };

  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: action.ownerId, action });
  const isSpecIdAction = action.ownerId === ctx.specId;
  let testBuffMap;

  for (const part of snapshotParts) {
    if (!action[part]) continue;

    // Can be resolved now
    // Not in spec mode
    if (!ctx.specId) {
      const statMap = toMergedObj(ctx.buildMaps[action.ownerId], buffMap);
      snapshot[part] = runFormula(gameId, part, action, statMap);
      continue;
    }

    const usedAttrs = getUsedAttrs(gameId, action, part);
    const usesSpecs = buffSpecs.some(({ specs }) =>
      Object.keys(specs).some((statId) => usedAttrs.has(statId))
    );

    // Can be resolved now
    // Action is not from specId and uses no variable buffs from specId
    if (!isSpecIdAction && !usesSpecs) {
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

    testBuffMap ??= getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true });

    // Action is not from specId but has variable buffs from specId
    if (!isSpecIdAction) {
      const partiallyBuffedMap = toMergedObj(ctx.buildMaps[action.ownerId], buffMap);
      snapshot[part] = (testBuildMap) => {
        const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
        const resolvedBuffs = toResolvedSpecs(buffSpecs, testBuffedMap);
        const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);
        return runFormula(gameId, part, action, statMap);
      };
      continue;
    }

    // Action is from specId and has variable buffs from specId
    snapshot[part] = (testBuildMap) => {
      const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
      const resolvedBuffs = toResolvedSpecs(buffSpecs, testBuffedMap);
      const statMap = toMergedObj(testBuildMap, buffMap, resolvedBuffs);
      return runFormula(gameId, part, action, statMap);
    };
  }

  return snapshot;
};
