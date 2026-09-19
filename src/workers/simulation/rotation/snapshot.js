import { toMergedObj, resolveBuffSpecs } from '@/utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';
import { getUsedAttrs } from './formula/solver';

export const buildSnapshot = (ctx, action, options = {}) => {
  const { gameId } = ctx.cache;
  const { runtimeOffset = 0 } = options;

  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: action.ownerId, action });

  const memo = {};

  const snapshot = {
    key: action.key,
    name: action.name,
    ownerId: action.ownerId,
    category: action.category,
    type: action.type,
    onFieldId: ctx.states.onFieldId,
    runtime: ctx.states.runtime + runtimeOffset,
    damageType: action.damage?.type,
    unresolved: {
      memo,
      action,
      buffMap,
      buffSpecs,
      formula: (statMap, part) => runFormula(gameId, part, action, statMap),
      splitScale: 1 / (action.hitOffsets?.length ?? 1),
      parts: [
        ...(action.damage ? ['damage'] : []),
        ...(action.healing ? ['healing'] : []),
        ...(action.shield ? ['shield'] : []),
      ],
    },
  };

  return snapshot;
}

export const resolveSnapshot = (ctx, snapshot) => {
  const { gameId } = ctx.cache;
  const { unresolved } = snapshot;
  if (!unresolved) return;

  const { memo, ownerId, action, buffMap, buffSpecs, formula, splitScale } = unresolved;
  const scale = unresolved.scale ?? 1;

  const statMapOwnerId = action?.ownerId ?? ownerId;
  const statMapOwnerIdBuildMap = ctx.buildMaps[statMapOwnerId];

  const isSpecIdAction = statMapOwnerId === ctx.specId;
  let testBuffMap;

  for (const part of unresolved.parts) {
    // Can be resolved now
    // Not in spec mode
    if (!ctx.specId) {
      const statMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
      const formulaOutput = memo[part] ??= formula(statMap, part);
      snapshot[part] = applyScale(formulaOutput, scale) * splitScale;
      continue;
    }

    const usedAttrs = action
      ? getUsedAttrs(gameId, action, part)
      : new Set([
        'elementalMastery',
        `${snapshot.damageType}ReactionBonus%`,
        `${unresolved.reactionElement}ResReduction%`,
      ]);

    const usesSpecs = buffSpecs.some(({ specs }) =>
      Object.keys(specs).some((stat) => usedAttrs.has(stat))
    );

    // Can be resolved now
    // Action is not from specId and uses no variable buffs from specId
    if (!isSpecIdAction && !usesSpecs) {
      const statMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
      const formulaOutput = memo[part] ??= formula(statMap, part);
      snapshot[part] = applyScale(formulaOutput, scale) * splitScale;
      continue;
    }

    // Action is from specId but has no variable buffs from specId
    if (!usesSpecs) {
      snapshot[part] = (currBuildMap) => {
        const cached = memo[part];

        if (!cached || cached.buildMap !== currBuildMap) {
          memo[part] = {
            buildMap: currBuildMap,
            value: formula(toMergedObj(currBuildMap, buffMap), part) * splitScale,
          };
        }

        const value = memo[part].value;

        if (typeof scale !== 'function') {
          return value * scale;
        }

        return value * scale(currBuildMap);
      };
      continue;
    }

    testBuffMap ??= getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true });

    // Action is not from specId but has variable buffs from specId
    if (!isSpecIdAction) {
      const partiallyBuffedMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
      snapshot[part] = (testBuildMap) => {
        const cached = memo[part];

        if (!cached || cached.buildMap !== testBuildMap) {
          const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
          const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
          const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);

          memo[part] = {
            buildMap: testBuildMap,
            value: formula(statMap, part) * splitScale,
          };
        }

        const value = memo[part].value;

        if (typeof scale !== 'function') {
          return value * scale;
        }

        return value * scale(testBuildMap);
      };
      continue;
    }

    // Action is from specId and has variable buffs from specId
    snapshot[part] = (testBuildMap) => {
      const cached = memo[part];

      if (!cached || cached.buildMap !== testBuildMap) {
        const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
        const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
        const statMap = toMergedObj(testBuildMap, buffMap, resolvedBuffs);

        memo[part] = {
          buildMap: testBuildMap,
          value: formula(statMap, part) * splitScale,
        };
      }

      const value = memo[part].value;

      if (typeof scale !== 'function') {
        return value * scale;
      }

      return value * scale(testBuildMap);
    };
  }
};

function applyScale(value, scale) {
  if (typeof scale !== 'function') {
    return value * scale;
  }

  return (buildMap) => value * scale(buildMap);
}
