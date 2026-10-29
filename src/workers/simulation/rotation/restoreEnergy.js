import { getBuffMap } from './getStatMap';

export function runRestoreEnergy(ctx, action) {
  if (!action.restoreEnergy) return;

  const { targets, flat = 0, erScaled = 0, critScaled } = action.restoreEnergy;

  // Crit scaled energy depends on the tested build, so it is resolved later in the duration getters
  const critScaledEntry = critScaled && {
    ownerId: action.ownerId,
    flat,
    erScaled,
    buffMap: getBuffMap(ctx, { memberId: action.ownerId, action, ignoreSpecs: true }).buffMap,
  };

  const addTo = (memberBonusEnergy) => {
    if (critScaledEntry) {
      memberBonusEnergy.critScaled.push(critScaledEntry);
      return;
    }

    memberBonusEnergy.flat += flat;
    memberBonusEnergy.erScaled += erScaled;
  };

  for (const target of targets) {
    const targetId = target === '$onField'
      ? ctx.states.onFieldId
      : target

    addTo(ctx.bonusEnergy[targetId]);
  }
}
