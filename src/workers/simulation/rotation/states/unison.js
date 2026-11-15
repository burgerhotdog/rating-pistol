import { CHARACTER, WW } from '@/data';

function hasUnisonResponse(member) {
  return Object.hasOwn(CHARACTER[WW][member] ?? {}, 'unisonResponse');
}

export function updateUnison(ctx, action) {
  if (!Object.hasOwn(action, 'unison')) return;
  const unisonStore = ctx.states.unison;
  const unisonState = unisonStore[action.ownerId];

  const prev = unisonState.timeLeft;
  const next = action.unison;
  if (prev === next) return;

  unisonState.timeLeft = next;

  ctx.runEffects('unisonUpdate', { action });
}

export function applyUnisonBoon(ctx, key) {
  const store = ctx.states.unison;

  for (const member in store) {
    if (!hasUnisonResponse(member)) continue;

    const state = store[member];
    state.boon[key] = 30000;
  }
}

export function handleUnisonResponse(ctx, prevId, nextId) {
  const prevIdUnisonState = ctx.states.unison[prevId];
  if (prevIdUnisonState.timeLeft === 0) return;

  prevIdUnisonState.timeLeft = 0;

  if (hasUnisonResponse(nextId)) {
    applyUnisonBoon(ctx, nextId);
    ctx.runEffects('unisonResponse', { ownerId: nextId });
  }
}

export function advanceUnison(ctx, elapsed) {
  if (!elapsed) return;

  const store = ctx.states.unison;

  for (const member in store) {
    const state = store[member];

    if (state.timeLeft > 0) {
      state.timeLeft = Math.max(state.timeLeft - elapsed, 0);

      if (state.timeLeft === 0) {
        ctx.runEffects('unisonUpdate', { ownerId: Number(member) });
      }
    }

    for (const key in state.boon) {
      state.boon[key] = Math.max(state.boon[key] - elapsed, 0);

      if (state.boon[key] === 0) {
        delete state.boon[key];
      }
    }
  }
}
