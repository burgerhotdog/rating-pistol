import { toMergedObj, resolveBuffSpecs } from '@/utils';

const ELEVATIONS = [0.6, 0.3, 0.05, 0.05];

function applyScale(value, scale) {
  if (typeof scale !== 'function') {
    return value * scale;
  }
  return (buildMap) => value * scale(buildMap);
}

export function resolveElevationSnapshot(ctx, snapshot) {
  const { memberIds } = ctx.cache;
  const {
    memo,
    allMemberBuffs,
    formula,
    splitScale = 1,
    scale = 1,
    usedAttrs,
  } = snapshot.unresolved;

  const calculate = (testBuildMap) => {
    const testBuffMap = ctx.specId
      ? toMergedObj(testBuildMap, allMemberBuffs[ctx.specId].sourceBuffMap)
      : null;

    const memberDamageValues = memberIds.map((memberId) => {
      const isSpecMember = memberId === ctx.specId;
      const buildMap = isSpecMember ? testBuildMap : ctx.buildMaps[memberId];
      const { buffMap, buffSpecs } = allMemberBuffs[memberId];

      const usesSpecs = ctx.specId && buffSpecs.some(({ specs }) =>
        Object.keys(specs).some((stat) => usedAttrs.has(stat))
      );

      if (!usesSpecs) {
        const statMap = toMergedObj(buildMap, buffMap);
        return formula(statMap);
      }

      const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffMap);
      const statMap = toMergedObj(buildMap, buffMap, resolvedBuffs);
      return formula(statMap);
    });

    return splitScale * memberDamageValues
      .sort((a, b) => b - a)
      .reduce((acc, value, index) => acc + value * ELEVATIONS[index], 0);
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
