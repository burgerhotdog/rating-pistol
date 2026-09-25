import { toMergedObj, resolveBuffSpecs } from '@/utils';
import { runFormula } from './formula';
import { getBuffMap } from './getStatMap';
import { getUsedAttrs } from './formula/solver';

export const canSnapshot = (action = {}) =>
  action.damage?.compressed ||
  action.healing?.compressed ||
  action.shield?.compressed;

export const buildSnapshot = (ctx, action, options = {}) => {
  const { gameId } = ctx.cache;
  const { runtimeOffset = 0, snapshotBuffs } = options;
  const snapshotOwnerId = action.ownerId;

  const { buffMap, buffSpecs } = snapshotBuffs ?? getBuffMap(ctx, {
    memberId: snapshotOwnerId,
    action,
  });

  const memo = {};

  const isStellarConduct = action?.damage?.type === 'stellarConduct';
  const isStellarSwirl = action?.damage?.type === 'stellarSwirl';
  const { multiplier } = ctx.states.aura.stellarConduct ?? {};

  const formula = (statMap, part) => isStellarConduct || isStellarSwirl
    ? runFormula(gameId, part, action, statMap, multiplier)
    : runFormula(gameId, part, action, statMap);

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
      action: action,
      buffMap,
      buffSpecs,
      splitScale: 1 / (action.hitOffsets?.length ?? 1),
      formula,
      parts: [
        ...(action.damage ? ['damage'] : []),
        ...(action.healing ? ['healing'] : []),
        ...(action.shield ? ['shield'] : []),
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

  if (unresolved.elevation) {
    resolveElevationSnapshot(ctx, snapshot);
    return;
  }

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

const ELEVATION_MULTIPLIERS = [0.6, 0.3, 0.05, 0.05];

function resolveElevationSnapshot(ctx, snapshot) {
  const { memberIds } = ctx.cache;
  const {
    memo,
    allMemberBuffs,
    formula,
    splitScale = 1,
    reactionElement,
  } = snapshot.unresolved;

  const usedAttrs = new Set([
    'elementalMastery',
    `${snapshot.damageType}ReactionBonus%`,
    `${reactionElement}ResReduction%`,
  ]);
  if (snapshot.damageType === 'stellarSwirl') {
    usedAttrs.add('stellarGlimmerReactionBonus%');
    usedAttrs.add('stellarSwirlBaseDmg%');
    usedAttrs.add('stellarGlimmerBaseDmg%');
    usedAttrs.add('stellarGlimmerFlat');
  }

  const scale = snapshot.unresolved.scale ?? 1;

  let testBuffMap;

  if (ctx.specId) {
    testBuffMap = getBuffMap(ctx, {
      memberId: ctx.specId,
      ignoreSpecs: true,
    }).buffMap;
  }

  const calculate = (testBuildMap) => {
    const testBuffedMap = ctx.specId
      ? toMergedObj(testBuildMap, testBuffMap)
      : null;

    const values = memberIds.map((memberId) => {
      const isSpecMember = memberId === ctx.specId;
      const buildMap = isSpecMember ? testBuildMap : ctx.buildMaps[memberId];
      const { buffMap, buffSpecs } = allMemberBuffs[memberId];

      const usesSpecs = ctx.specId && buffSpecs.some(({ specs }) =>
        Object.keys(specs).some((stat) => usedAttrs.has(stat))
      );

      if (!usesSpecs) {
        // no dependency on spec's stats — buffMap is already correct, don't touch it
        return formula(toMergedObj(buildMap, buffMap));
      }

      const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
      const baseMap = isSpecMember
        ? buildMap
        : toMergedObj(buildMap, buffMap); // keep this member's own real stats as the base
      return formula(toMergedObj(baseMap, buffMap, resolvedBuffs));
    });

    values.sort((a, b) => b - a);

    return values.reduce(
      (sum, value, index) =>
        sum + value * ELEVATION_MULTIPLIERS[index],
      0,
    ) * splitScale;
  };

  if (!ctx.specId) {
    const value = memo.damage ??= calculate();
    snapshot.damage = applyScale(value, scale);
    return;
  }

  snapshot.damage = (testBuildMap) => {
    if (memo.damage?.buildMap !== testBuildMap) {
      memo.damage = {
        buildMap: testBuildMap,
        value: calculate(testBuildMap),
      };
    }

    const value = memo.damage.value;

    return typeof scale === 'function'
      ? value * scale(testBuildMap)
      : value * scale;
  };
}
