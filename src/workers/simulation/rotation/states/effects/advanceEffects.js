import { runCommands } from './commands';
import { runUseEffect } from './runUseEffect';

const intervalCache = new WeakMap();

function hasIntervalUse(effect) {
  let result = intervalCache.get(effect);

  if (result === undefined) {
    result = Boolean(effect.use?.some((use) => use.when === 'interval'));
    intervalCache.set(effect, result);
  }

  return result;
}

function forEachState(ctx, callback) {
  const { globalEffects, memberEffects } = ctx.states;

  const visitStore = (store, storeOwnerId) => {
    for (const [effectKey, state] of Object.entries(store)) {
      if (store[effectKey] !== state) continue;
      callback(state, storeOwnerId);
    }
  };

  visitStore(globalEffects);

  for (const memberId in memberEffects) {
    visitStore(memberEffects[memberId], Number(memberId));
  }
}

function expireEffectState(ctx, state, storeOwnerId) {
  const { store, effect } = state;
  const { expire } = effect;

  delete store[effect.key];

  if (!expire) return;

  const filterSpec = { fieldId: storeOwnerId ?? effect.ownerId };
  if (ctx.eventFilter(expire.filter, effect, filterSpec)) {
    runCommands(ctx, effect, expire.commands);
  };
}

function isExpired(state) {
  const { effect } = state;

  return Boolean(
    (effect.independentStacks && !state.independentStacks.length) ||
    (effect.decay ? state.stacks <= 0 : state.timeLeft <= 0) ||
    ('removeTimer' in state && state.removeTimer <= 0)
  );
}

function getStateBoundary(state) {
  const { effect } = state;
  let boundary = Infinity;

  if (hasIntervalUse(effect) && state.useCooldown > 0) {
    boundary = state.useCooldown;
  }

  if (effect.independentStacks) {
    const lastTime = state.independentStacks.at(-1);
    if (lastTime > 0) boundary = Math.min(boundary, lastTime);
  }

  if (state.timeLeft > 0) {
    const expireTime = effect.decay
      ? state.timeLeft + (Math.max(state.stacks, 1) - 1) * effect.decayDuration
      : state.timeLeft;
    boundary = Math.min(boundary, expireTime);
  }

  if (state.removeTimer > 0) {
    boundary = Math.min(boundary, state.removeTimer);
  }

  return boundary;
}

function advanceStateTimers(state, step) {
  const { effect } = state;
  let expiring = false;

  if (effect.independentStacks) {
    const { independentStacks } = state;

    for (let i = 0; i < independentStacks.length; i++) {
      independentStacks[i] = Math.max(independentStacks[i] - step, 0);
    }

    while (independentStacks[0] === 0) {
      state.stacks--;
      independentStacks.shift();
    }

    if (!independentStacks.length) expiring = true;
  }

  if (state.timeLeft > 0) {
    state.timeLeft -= step;

    if (!effect.decay) {
      if (state.timeLeft <= 0) expiring = true;
    } else {
      while (state.timeLeft <= 0) {
        state.timeLeft += effect.decayDuration;
        state.stacks--;

        if (state.stacks <= 0) {
          expiring = true;
          break;
        }
      }
    }
  }

  if ('removeTimer' in state) {
    state.removeTimer -= step;
    if (state.removeTimer <= 0) expiring = true;
  }

  if ('useCooldown' in state) {
    state.useCooldown -= step;
    if (state.useCooldown <= 0) {
      delete state.useCooldown;
    }
  }

  if ('buffCooldown' in state) {
    state.buffCooldown -= step;
    if (state.buffCooldown <= 0) {
      delete state.buffCooldown;
    }
  }

  if ('rampingTimer' in state) {
    const { rampingInterval, maxStacks } = effect;
    state.rampingTimer -= step;

    while (state.rampingTimer <= 0) {
      if (state.stacks >= maxStacks) {
        delete state.rampingTimer;
        break;
      }

      state.stacks++;
      state.rampingTimer += rampingInterval;
    }
  }

  if (expiring) {
    state.expiring = true;
  }
}

function fireIntervalUses(ctx, state, storeOwnerId) {
  const { effect } = state;
  if (!hasIntervalUse(effect) || state.useCooldown) return;

  const filterSpec = { fieldId: storeOwnerId ?? effect.ownerId };

  for (const [index, use] of effect.use.entries()) {
    if (use.when !== 'interval') continue;
    if (!ctx.eventFilter(use.filter, effect, filterSpec)) continue;

    const spec = {};
    if (effect.snapshotBuffs) {
      spec.snapshotBuffs = state.snapshotBuffs[index];
    }

    const removed = runUseEffect(ctx, state, use, spec);

    if (use.commands) {
      runCommands(ctx, effect, use.commands);
    }

    if (removed) break;
  }
}

function fireExpiry(ctx, state, storeOwnerId) {
  if (!state.expiring) return;

  // An earlier use or command may have refreshed the state
  if (!isExpired(state)) {
    delete state.expiring;
    return;
  }

  expireEffectState(ctx, state, storeOwnerId);
}

export function getEffectBoundary(ctx) {
  let boundary = Infinity;

  forEachState(ctx, (state) => {
    boundary = Math.min(boundary, getStateBoundary(state));
  });

  return boundary;
}

export function advanceEffectTimers(ctx, step) {
  forEachState(ctx, (state) => advanceStateTimers(state, step));
}

export function fireEffectUses(ctx) {
  forEachState(ctx, (state, storeOwnerId) => fireIntervalUses(ctx, state, storeOwnerId));
}

export function fireEffectExpiries(ctx) {
  forEachState(ctx, (state, storeOwnerId) => fireExpiry(ctx, state, storeOwnerId));
}
