function replaceValues(prev, next) {
  if (
    prev &&
    typeof prev === 'object' &&
    !Array.isArray(prev) &&
    next &&
    typeof next === 'object' &&
    !Array.isArray(next)
  ) {
    const merged = { ...prev };

    for (const key in next) {
      merged[key] = replaceValues(merged[key], next[key]);
    }

    return merged;
  }

  return next;
}

export function getModifiedAction(ctx, action) {
  let modifiedAction = { ...action };
  const filterSpec = { action, fieldId: action.ownerId };

  function tryModify(effect) {
    const { modify } = effect;
    if (!modify) return;

    const { type, spec } = modify;
    if (type !== 'action') return;
    if (!ctx.eventFilter(modify.filter, effect, filterSpec)) return;

    modifiedAction = replaceValues(modifiedAction, spec);
  }

  const { ownerId } = action;
  const store = ctx.states.memberEffects[ownerId];
  for (const effectKey in store) {
    const { effect } = store[effectKey];
    tryModify(effect);
  }

  return modifiedAction;
}
