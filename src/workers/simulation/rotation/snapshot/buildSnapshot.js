import { toMergedObj } from '@/utils';
import { runFormula } from '../formula';
import { getBuffMap } from '../getStatMap';

export const canSnapshot = (action = {}) =>
  action.damage?.compressed ||
  action.healing?.compressed ||
  action.shield?.compressed;

export const buildSnapshot = (ctx, action, options = {}) => {
  const { gameId } = ctx.cache;
  const { runtimeOffset = 0, snapshotBuffs } = options;
  const snapshotOwnerId = action.ownerId;

  let { buffMap, buffSpecs } = snapshotBuffs ?? getBuffMap(ctx, {
    memberId: snapshotOwnerId,
    action,
  });

  if (snapshotBuffs) {
    const live = getBuffMap(ctx, {
      memberId: snapshotOwnerId,
      action,
      snapshot: 'live',
    });
    buffMap = toMergedObj(buffMap, live.buffMap);
    buffSpecs = [...buffSpecs, ...live.buffSpecs];
  }

  const specSourceBuffMap = ctx.specId
    ? getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true }).buffMap
    : null;

  const { multiplier } = ctx.states.aura?.stellarConduct ?? {};

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
      memo: {},
      action,
      buffMap,
      buffSpecs,
      specSourceBuffMap,
      splitScale: 1 / (action.hitOffsets?.length ?? 1),
      formula: (statMap, part) => runFormula(gameId, part, action, statMap, multiplier),
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
