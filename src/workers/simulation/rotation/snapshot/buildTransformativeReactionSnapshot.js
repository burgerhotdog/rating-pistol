import { formatStr } from '@/utils';
import { getBuffMap } from '../getStatMap';
import {
  transformativeReactionFormula,
  transformativeReactionUsedAttrs,
} from '../formula';

export function buildTransformativeReactionSnapshot(ctx, ownerId, rxnKey, reactionElement) {
  const mockAction = { damage: { type: rxnKey, element: reactionElement } };

  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: ownerId, action: mockAction });

  const specSourceBuffMap = ctx.specId
    ? getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true }).buffMap
    : null;

  const foamHealing = rxnKey === 'seaDyedFoam'
    ? ctx.states.gameRule.oceanHuedClam?.value
    : null;

  return {
    key: `system:${rxnKey}`,
    name: formatStr(rxnKey),
    ownerId: 'system',
    type: 'transformativeReaction',
    damageType: rxnKey,
    onFieldId: ctx.states.onFieldId,
    runtime: ctx.states.runtime,
    unresolved: {
      memo: new Map(),
      ownerId,
      buffMap,
      buffSpecs,
      specSourceBuffMap,
      scale: 1,
      part: 'damage',
      reactionElement,
      formula: (statMap) => transformativeReactionFormula(statMap, rxnKey, reactionElement, foamHealing),
      usedAttrs: transformativeReactionUsedAttrs(rxnKey, reactionElement),
    },
  };
}
