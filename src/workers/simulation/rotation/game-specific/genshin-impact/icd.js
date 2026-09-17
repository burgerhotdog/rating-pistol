function getIcdState(ctx, memberId, icdData) {
  const store = ctx.states.icd[memberId];
  const { tag, time } = icdData;

  return store[tag] ??= { tag, timeLeft: time };
}

export function tryApplyElement(ctx, memberId, icdData) {
  if (!icdData) return true;

  const state = getIcdState(ctx, memberId, icdData);

  if (!state.hitsLeft) {
    state.hitsLeft = (icdData.hits ?? Infinity) - 1;
    return true;
  }

  state.hitsLeft--;
  if (state.hitsLeft <= 0) {
    delete state.hitsLeft;
  }
}

export function advanceIcdStates(ctx, elapsed) {
  const { states } = ctx;

  for (const memberId in states.icd) {
    const store = states.icd[memberId];

    for (const state of Object.values(store)) {
      state.timeLeft -= elapsed;

      if (state.timeLeft <= 0) {
        delete store[state.tag];
      }
    }
  }
}
