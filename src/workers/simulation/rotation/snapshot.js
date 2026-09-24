import { toMergedObj, resolveBuffSpecs } from '@/utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';
import { getUsedAttrs } from './formula/solver';
import { checkInfusion } from './game-specific/genshin-impact';

export const canSnapshot = (action = {}) =>
  action.damage?.compressed ||
  action.healing?.compressed ||
  action.shield?.compressed;

export const buildSnapshot = (ctx, action, options = {}) => {
  const { gameId } = ctx.cache;
  const { runtimeOffset = 0, snapshotBuffs } = options;
  const infusedElement = checkInfusion(ctx, action);
  const snapshotOwnerId = action.ownerId;

  let snapshotAction = action;
  if (action?.damage && infusedElement) {
    snapshotAction = {
      ...action,
      damage: {
        ...action.damage,
        element: infusedElement,
      },
    };
  }

  const { buffMap, buffSpecs } = snapshotBuffs ?? getBuffMap(ctx, { memberId: snapshotOwnerId, action: snapshotAction });

  const memo = {};

  const isStellarConduct = snapshotAction?.damage?.type === 'stellarConduct';
  const isStellarSwirl = snapshotAction?.damage?.type === 'stellarSwirl';
  const { multiplier } = ctx.states.aura.stellarConduct ?? {};

  const formula = (statMap, part) => isStellarConduct || isStellarSwirl
    ? runFormula(gameId, part, snapshotAction, statMap, multiplier)
    : runFormula(gameId, part, snapshotAction, statMap);

  const snapshot = {
    key: snapshotAction.key,
    name: snapshotAction.name,
    ownerId: snapshotAction.ownerId,
    category: snapshotAction.category,
    type: snapshotAction.type,
    onFieldId: ctx.states.onFieldId,
    runtime: ctx.states.runtime + runtimeOffset,
    damageType: snapshotAction.damage?.type,
    unresolved: {
      memo,
      action: snapshotAction,
      buffMap,
      buffSpecs,
      splitScale: 1 / (action.hitOffsets?.length ?? 1),
      formula,
      parts: [
        ...(snapshotAction.damage ? ['damage'] : []),
        ...(snapshotAction.healing ? ['healing'] : []),
        ...(snapshotAction.shield ? ['shield'] : []),
      ],
    },
  };

  if (action.healing) {
    snapshot.unresolved.splitScale *= action.healing.targets.length;
  }

  return snapshot;
}

export const resolveSnapshot = (ctx, snapshot) => {
  const { gameId } = ctx.cache;
  const { unresolved } = snapshot;
  if (!unresolved) return;

  const { memo, ownerId, action, buffMap, buffSpecs, formula, splitScale = 1 } = unresolved;
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
      const value = memo[part] ??= formula(statMap, part);
      snapshot[part] = applyScale(value * splitScale, scale);
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
      const value = memo[part] ??= formula(statMap, part);
      snapshot[part] = applyScale(value * splitScale, scale);
      continue;
    }

    // Action is from specId but has no variable buffs from specId
    if (!usesSpecs) {
      snapshot[part] = (testBuildMap) => {
        if (memo[part]?.buildMap !== testBuildMap) {
          const statMap = toMergedObj(testBuildMap, buffMap);
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

    testBuffMap ??= getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true }).buffMap;

    // Action is not from specId but has variable buffs from specId
    if (!isSpecIdAction) {
      const partiallyBuffedMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
      snapshot[part] = (testBuildMap) => {
        if (memo[part]?.buildMap !== testBuildMap) {
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
      if (memo[part]?.buildMap !== testBuildMap) {
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
