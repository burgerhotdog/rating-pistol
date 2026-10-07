function advanceState(state, elapsed) {
  state.timeLeft = Math.max(state.timeLeft - elapsed, 0);

  if (state.timeLeft === 0) {
    state.hitsLeft = 0;
  }
}

function advanceStore(store, elapsed) {
  for (const icdTag in store) {
    const state = store[icdTag];

    if (state.timeLeft > 0) {
      advanceState(state, elapsed);
    }
  }
}

export function advanceIcds(ctx, elapsed) {
  const { icd: stores } = ctx.states;

  for (const memberId in stores) {
    advanceStore(stores[memberId], elapsed);
  }
}

export function getIcdState(ctx, memberId, icdTag) {
  const store = ctx.states.icd[memberId] ??= {};

  return store[icdTag] ??= {
    timeLeft: 0,
    hitsLeft: 0,
  };
}

export function tryIcd(ctx, memberId, icdData) {
  if (!icdData) return true;
  const { tag, time, hits = Infinity } = icdData;
  const state = getIcdState(ctx, memberId, tag);

  if (state.hitsLeft > 0) {
    state.hitsLeft--;
    return false;
  }

  state.hitsLeft = hits - 1;
  if (state.timeLeft === 0) {
    state.timeLeft = time;
  }

  return true;
}
