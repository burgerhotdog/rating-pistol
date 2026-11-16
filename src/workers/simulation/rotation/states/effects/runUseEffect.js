export function runUseEffect(ctx, state, use = {}, spec = {}) {
  const { store, effect, stacks } = state;

  if (use.action) {
    const times = Math.round(stacks);
    state.isRunning = true;

    for (const [index, action] of use.action.entries()) {
      if (effect.absorbElement && !state.absorbElement) continue;

      const modifiedAction = effect.absorbElement
        ? { ...action, damage: { ...action.damage, element: state.absorbElement } }
        : action;

      if (modifiedAction.healing) {
        modifiedAction.healing = {
          ...modifiedAction.healing,
          targets: modifiedAction.healing.targets.map((target) => {
            if (target === '$storeOwner') {
              return state.ownerId;
            } else {
              return target;
            }
          }),
        };
      }

      const runOptions = {
        noDuration: true,
        ...(effect.snapshotBuffs && {
          snapshotBuffs: spec.snapshotBuffs[index],
        }),
      };

      for (let i = 0; i < times; i++) {
        ctx.runAction(modifiedAction, runOptions);
      }
    }

    delete state.isRunning;
  }

  if (use.cooldown) {
    state.useCooldown = use.cooldown;
  }

  if (state.usesLeft) {
    state.usesLeft--;

    if (state.usesLeft <= 0) {
      delete store[effect.key];
      return true;
    }
  }
}
