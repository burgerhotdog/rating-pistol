export function runRemoveEffect(state, remove = {}) {
  const { store, effect } = state;

  if (remove.offset) {
    state.removeTimer ??= remove.offset;
    return false;
  }

  state.stacks -= remove.stacks ?? state.stacks;

  if (state.stacks <= 0) {
    delete store[effect.key];
    return true;
  }
}
