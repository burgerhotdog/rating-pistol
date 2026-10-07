import {
  applyPyro,
  applyCryo,
  tickElectroCharged,
  tickLunarCharged,
} from '../../reactions';
import {
  buildTransformativeReactionSnapshot,
  buildElevationSnapshot,
} from '../../snapshot';
import { tryIcd } from '../icd';

function decayElementAura(ctx, state, elapsed) {
  state.gauge -= elapsed / state.decayRate;

  const isDepleted = state.gauge <= 0;
  if (isDepleted) {
    delete ctx.states.aura[state.element];
  }

  return isDepleted;
}

function decayDendroBurning(ctx, state, elapsed) {
  const specialDecayRate = Math.max(0.0004, 2 / state.decayRate);
  state.gauge -= elapsed * specialDecayRate;

  const isDepleted = state.gauge <= 0;
  if (isDepleted) {
    delete ctx.states.aura[state.element];
  }

  return isDepleted;
}

function decayReactionAura(ctx, state, elapsed) {
  state.gauge -= elapsed / state.decayRate;

  const isDepleted = state.gauge <= 0;
  if (isDepleted) {
    delete ctx.states.aura[state.reaction];
  }

  return isDepleted;
}

function advanceCharged(ctx, elapsed) {
  const { aura } = ctx.states;
  const rxnKey = ctx.cache.lunarCharged ? 'lunarCharged' : 'electroCharged';
  let charged = aura[rxnKey];
  let electro = aura.electro;
  let hydro = aura.hydro;

  let remaining = elapsed;

  const tick = () => {
    const stateDeleted = ctx.cache.lunarCharged
      ? tickLunarCharged(ctx, elapsed - remaining)
      : tickElectroCharged(ctx, charged.applier, elapsed - remaining);

    if (stateDeleted) {
      charged = null;
      electro = aura.electro;
      hydro = aura.hydro;
    }
  };

  if (charged.timeLeft === 0) {
    tick();
  }

  while (remaining > 0) {
    const interval = charged
      ? Math.min(remaining, charged.timeLeft)
      : remaining;

    remaining -= interval;

    if (charged) {
      charged.timeLeft -= interval;
    }

    if (electro) {
      const stateDeleted = decayElementAura(ctx, electro, interval);
      if (stateDeleted) {
        electro = null;

        if (charged) {
          delete aura[rxnKey];
          charged = null;
        }
      }
    }

    if (hydro) {
      const stateDeleted = decayElementAura(ctx, hydro, interval);
      if (stateDeleted) {
        hydro = null;

        if (charged) {
          delete aura[rxnKey];
          charged = null;
        }
      }
    }

    if (charged && charged.timeLeft === 0) {
      tick();
    }
  }
}

function advanceStellarConduct(ctx, state, elapsed) {
  let remaining = elapsed;

  while (remaining > 0) {
    const interval = Math.min(remaining, state.timer, state.timeLeft);
    remaining -= interval;
    state.timer -= interval;
    state.timeLeft -= interval;

    if (state.timeLeft <= 0) {
      delete ctx.states.aura.stellarConduct;
      return;
    }

    if (state.timer <= 0) {
      const prevHits = state.prevHits = Math.min(state.hits, 12);
      state.hits = 0;
      state.timer = 4000;
      state.multiplier = prevHits
        ? 1.4 + prevHits * 0.05
        : 1;
      state.bonus = prevHits
        ? 0.28 + prevHits * 0.01
        : 0.2;
    }
  }
}

function advanceStellarSwirl(ctx, state, elapsed) {
  let remaining = elapsed;

  while (remaining > 0) {
    const interval = Math.min(remaining, state.timeLeft, state.vortexTimer ?? Infinity);
    remaining -= interval;
    state.timeLeft -= interval;
    if (state.vortexTimer) {
      state.vortexTimer -= interval;
    }

    if (state.timeLeft <= 0) {
      delete ctx.states.aura.stellarSwirl;
      return;
    }

    if (state.vortexTimer <= 0) {
      if (ctx.saveSnapshots) {
        const snapshot = buildElevationSnapshot(ctx, 'stellarSwirl', {
          multiplier: state.vortexHits >= 2 ? 3 : 2,
          element: 'cryo',
        });

        ctx.snapshots.push(snapshot);
      }

      applyCryo(ctx, 1, state.ownerId);

      state.vortexTimer = null;
      state.vortexHits = null;
      state.ownerId = null;
    }
  }
}

function advanceBloom(ctx, state, elapsed) {
  for (const core of state.cores) {
    core.timeLeft -= elapsed;
  }

  while (state.cores[0]?.timeLeft <= 0) {
    const core = state.cores.shift();

    if (ctx.saveSnapshots) {
      const offset = elapsed + core.timeLeft;
      const snapshot = buildTransformativeReactionSnapshot(ctx, core.ownerId, 'bloom', 'dendro');
      ctx.snapshots.push({ ...snapshot, runtime: snapshot.runtime + offset });
    }

    ctx.runEffects('dendroCore');
  }
}

function advanceBurning(ctx, elapsed) {
  const store = ctx.states.aura;
  const state = store.burning;
  let remaining = elapsed;

  while (remaining > 0) {
    const decrease = Math.min(state.timer, remaining);
    state.timer -= decrease;
    remaining -= decrease;

    if (store.pyro) {
      decayElementAura(ctx, store.pyro, decrease);
    }
    const isDendroDepleted = decayDendroBurning(ctx, store.dendro, decrease);

    if (isDendroDepleted) {
      delete store.burning;
      break;
    }

    if (state.timer === 0) {
      if (ctx.saveSnapshots) {
        const snapshot = buildTransformativeReactionSnapshot(ctx, state.ownerId, 'burning', 'pyro');
        ctx.snapshots.push({ ...snapshot, runtime: snapshot.runtime + elapsed - remaining});
      }

      state.timer = 250;

      if (tryIcd(ctx, 'system', { tag: 'burning', time: 2000 })) {
        applyPyro(ctx, 1, state.ownerId);
      }
    }
  }

  if (remaining > 0) {
    if (store.pyro) {
      decayElementAura(ctx, store.pyro, remaining);
    }
    if (store.dendro) {
      decayElementAura(ctx, store.dendro, remaining);
    }
  }
}

const isHandledByCharged = (state) =>
  state.reaction === 'electroCharged' ||
  state.reaction === 'lunarCharged' ||
  state.element === 'electro' ||
  state.element === 'hydro';

const isHandledByBurning = (state) =>
  state.reaction === 'burning' ||
  state.element === 'pyro' ||
  state.element === 'dendro';

export function advanceAuras(ctx, elapsed) {
  const store = ctx.states.aura;
  const hasCharged = Boolean(store.electroCharged || store.lunarCharged);
  const hasBurning = Boolean(store.burning);

  if (hasCharged) {
    advanceCharged(ctx, elapsed);
  }

  if (hasBurning) {
    advanceBurning(ctx, elapsed);
  }

  for (const state of Object.values(store)) {
    if (hasCharged && isHandledByCharged(state)) {
      continue;
    }

    if (hasBurning && isHandledByBurning(state)) {
      continue;
    }

    if (state.element) {
      decayElementAura(ctx, state, elapsed);
      continue;
    }

    if (state.reaction === 'quicken') {
      decayReactionAura(ctx, state, elapsed);
      continue;
    }

    if (state.reaction === 'stellarConduct') {
      advanceStellarConduct(ctx, state, elapsed);
      continue;
    }

    if (state.reaction === 'stellarSwirl') {
      advanceStellarSwirl(ctx, state, elapsed);
      continue;
    }

    if (state.reaction === 'bloom') {
      advanceBloom(ctx, state, elapsed);
      continue;
    }

    if (!('timeLeft' in state)) continue;

    const remaining = state.timeLeft -= elapsed;

    if (remaining <= 0) {
      delete store[state.reaction];
    }
  }
}
