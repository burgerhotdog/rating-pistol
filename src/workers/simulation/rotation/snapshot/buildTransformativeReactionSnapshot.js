import { getBuffMap } from '../getStatMap';
import {
  transformativeReactionFormula,
  transformativeReactionUsedAttrs,
} from '../formula';
import { hasGameRule } from '../states';

export function buildTransformativeReactionSnapshot(ctx, ownerId, rxnKey, reactionElement) {
  const mockAction = { damage: { type: rxnKey, element: reactionElement } };

  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: ownerId, action: mockAction });

  const specSourceBuffMap = ctx.specId
    ? getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true }).buffMap
    : null;

  const foamHealing = rxnKey === 'oceanHuedClam'
    ? ctx.states.gameRule.oceanHuedClam?.value
    : null;

  let specialCritRate = 0;

  if (
    rxnKey === 'burning' ||
    rxnKey === 'bloom' ||
    rxnKey === 'hyperbloom' ||
    rxnKey === 'burgeon'
  ) {
    if (hasGameRule(ctx, 'nahidaC2')) {
      specialCritRate += 0.2;
    }
  }

  if (
    rxnKey === 'bloom' ||
    rxnKey === 'hyperbloom' ||
    rxnKey === 'burgeon'
  ) {
    if (hasGameRule(ctx, 'laumaA1')) {
      specialCritRate += 0.15;
    }
  }

  const specialCritMult = (specialCritRate * 2) + (1 - specialCritRate);

  return {
    key: `system:${rxnKey}`,
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
      formula: (statMap) => transformativeReactionFormula(statMap, rxnKey, reactionElement, specialCritMult, foamHealing),
      usedAttrs: transformativeReactionUsedAttrs(rxnKey, reactionElement),
    },
  };
}
