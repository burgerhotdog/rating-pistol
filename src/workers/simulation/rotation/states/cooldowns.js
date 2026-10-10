export function applyCooldown(ctx, effectKey, duration) {
  const store = ctx.states.applyCooldowns;
  store[effectKey] = duration;
}

function handleArrayCooldown(store, key, elapsed) {
  const arr = store[key];

  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.max(arr[i] - elapsed, 0);
  }

  while (arr[0] === 0) {
    arr.shift();
  }

  if (!arr.length) {
    delete store[key];
  }
}

function advanceCooldownStore(store, elapsed) {
  for (const key in store) {
    if (Array.isArray(store[key])) {
      handleArrayCooldown(store, key, elapsed);
      continue;
    }

    const remaining = store[key] -= elapsed;

    if (remaining <= 0) {
      delete store[key];
    }
  }
}

export function advanceCooldowns(ctx, elapsed) {
  const { globalCooldowns, applyCooldowns } = ctx.states;

  advanceCooldownStore(globalCooldowns, elapsed);
  advanceCooldownStore(applyCooldowns, elapsed);
}
