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

const weakInfusions = new Set([
  10000016, // Diluc
  10000032, // Bennett
  10000036, // Chongyun
  10000042, // Keqing
  10000047, // Kazuha
  10000002, // Ayaka
  10000068, // Dori
  10000072, // Candace
  10000083, // Lynette
  10000094, // Chiori
]);

const refreshingInfusions = new Set([
  10000016, // Diluc
  10000032, // Bennett
  10000036, // Chongyun
  10000072, // Candace
]);

function resolveInfusionPriority(modifiedAction, weaponInfusions) {
  let strongest;

  for (const effect of weaponInfusions) {
    if (!weakInfusions.has(effect.ownerId)) {
      strongest = effect;
      break;
    }

    if (!strongest) {
      strongest = effect;
      continue;
    }

    if (
      refreshingInfusions.has(effect.ownerId) &&
      !refreshingInfusions.has(strongest.ownerId)
    ) {
      strongest = effect;
      continue;
    }

    if (
      !refreshingInfusions.has(effect.ownerId) &&
      refreshingInfusions.has(strongest.ownerId)
    ) {
      continue;
    }

    const strongestElement = strongest.modify.spec.damage.element;
    const effectElement = effect.modify.spec.damage.element;

    if (
      strongestElement === 'cryo' && effectElement === 'pyro' ||
      strongestElement === 'pyro' && effectElement === 'hydro' ||
      strongestElement === 'hydro' && effectElement === 'cryo'
    ) {
      strongest = effect;
    }
  }

  modifiedAction.damage.element = strongest.modify.spec.damage.element;
}

export function getModifiedAction(ctx, action) {
  let modifiedAction = { ...action };
  const filterSpec = { action, fieldId: action.ownerId };

  const weaponInfusions = [];

  function tryModify(effect) {
    const { modify } = effect;
    if (!modify) return;

    const { type, spec } = modify;
    if (type !== 'action') return;
    if (!ctx.eventFilter(modify.filter, effect, filterSpec)) return;

    if (spec.damage?.element) {
      weaponInfusions.push(effect);
    }

    modifiedAction = replaceValues(modifiedAction, spec);
  }

  const { ownerId } = action;
  const store = ctx.states.memberEffects[ownerId];
  for (const effectKey in store) {
    const { effect } = store[effectKey];
    tryModify(effect);
  }

  if (weaponInfusions.length > 1) {
    resolveInfusionPriority(modifiedAction, weaponInfusions);
  }

  return modifiedAction;
}
