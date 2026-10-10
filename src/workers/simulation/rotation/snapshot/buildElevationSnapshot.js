import { getBuffMap } from '../getStatMap';
import { elevationReactionFormula, elevationReactionUsedAttrs } from '../formula';

function handleLunarCharged(snapshot) {
  snapshot.key = 'system:lunarCharged';
  snapshot.name = 'Lunar Charged';
  snapshot.type = 'lunarReaction';
  snapshot.damageType = 'lunarCharged';

  snapshot.unresolved.formula =
    (statMap) => elevationReactionFormula(statMap, 'lunarCharged', 3, 'electro');

  snapshot.unresolved.usedAttrs =
    elevationReactionUsedAttrs('lunarCharged', 'electro');
}

function handleLunarCrystallize(snapshot) {
  snapshot.key = 'system:lunarCrystallize';
  snapshot.name = 'Lunar Crystallize';
  snapshot.type = 'lunarReaction';
  snapshot.damageType = 'lunarCrystallize';

  snapshot.unresolved.formula =
    (statMap) => elevationReactionFormula(statMap, 'lunarCrystallize', 1.6, 'geo');

  snapshot.unresolved.usedAttrs =
    elevationReactionUsedAttrs('lunarCrystallize', 'geo');
}

function handleStellarSwirl(snapshot, spec) {
  const { multiplier, element } = spec;

  snapshot.key = 'system:stellarSwirl';
  snapshot.name = 'Stellar Swirl';
  snapshot.type = 'stellarReaction';
  snapshot.damageType = 'stellarSwirl';

  snapshot.unresolved.formula =
    (statMap) => elevationReactionFormula(statMap, 'stellarSwirl', multiplier, element);

  snapshot.unresolved.usedAttrs =
    elevationReactionUsedAttrs('stellarSwirl', element);
}

export function buildElevationSnapshot(ctx, rxnKey, spec = {}) {
  const rxnElem = rxnKey === 'lunarCharged'
    ? 'electro'
    : rxnKey === 'lunarCrystallize'
      ? 'geo'
      : spec.element;

  const allMemberBuffs = {};

  for (const memberId of ctx.cache.memberIds) {
    const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId, action: { damage: { type: rxnKey, element: rxnElem } } });
    const { buffMap: sourceBuffMap } = getBuffMap(ctx, { memberId, ignoreSpecs: true });

    allMemberBuffs[memberId] = { buffMap, buffSpecs, sourceBuffMap };
  }

  const snapshot = {
    ownerId: 'system',
    onFieldId: ctx.states.onFieldId,
    runtime: ctx.states.runtime,
    unresolved: {
      elevation: true,
      memo: {},
      allMemberBuffs,
      scale: 1,
      parts: ['damage'],
    },
  };

  switch (rxnKey) {
    case 'lunarCharged':
      handleLunarCharged(snapshot);
      break;

    case 'lunarCrystallize':
      handleLunarCrystallize(snapshot);
      break;

    case 'stellarSwirl':
      handleStellarSwirl(snapshot, spec);
      break;
  }

  return snapshot;
}
