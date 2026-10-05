import { applyCryo, tickElectroCharged } from '../../gauge';
import { buildElevationSnapshot } from '../../snapshot';

function advanceElementAura(ctx, state, elapsed) {
  state.gauge -= elapsed / state.decayRate;

  const isDepleted = state.gauge <= 0;
  if (isDepleted) delete ctx.states.aura[state.element];

  return isDepleted;
}

function advanceElectroCharged(ctx, elapsed) {
  const { aura } = ctx.states;
  let electroCharged = aura.electroCharged;
  let electro = aura.electro;
  let hydro = aura.hydro;

  let remaining = elapsed;

  const tick = () => {
    const stateDeleted = tickElectroCharged(ctx, electroCharged.applier, elapsed - remaining);

    if (stateDeleted) {
      electroCharged = null;
      electro = aura.electro;
      hydro = aura.hydro;
    }
  };

  if (electroCharged.timeLeft === 0) {
    tick();
  }

  while (remaining > 0) {
    const interval = electroCharged
      ? Math.min(remaining, electroCharged.timeLeft)
      : remaining;

    remaining -= interval;

    if (electroCharged) {
      electroCharged.timeLeft -= interval;
    }

    if (electro) {
      const stateDeleted = advanceElementAura(ctx, electro, interval);
      if (stateDeleted) {
        electro = null;

        if (electroCharged) {
          delete aura.electroCharged;
          electroCharged = null;
        }
      }
    }

    if (hydro) {
      const stateDeleted = advanceElementAura(ctx, hydro, interval);
      if (stateDeleted) {
        hydro = null;

        if (electroCharged) {
          delete aura.electroCharged;
          electroCharged = null;
        }
      }
    }

    if (electroCharged && electroCharged.timeLeft === 0) {
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

const isHandledByElectroCharged = (state) =>
  state.reaction === 'electroCharged' ||
  state.element === 'electro' ||
  state.element === 'hydro';

export function advanceAuras(ctx, elapsed) {
  const store = ctx.states.aura;
  const hasElectroCharged = Boolean(store.electroCharged);

  if (hasElectroCharged) {
    advanceElectroCharged(ctx, elapsed);
  }

  for (const state of Object.values(store)) {
    if (hasElectroCharged && isHandledByElectroCharged(state)) {
      continue;
    }
    
    if (state.element) {
      advanceElementAura(ctx, state, elapsed);
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

    const remaining = state.timeLeft -= elapsed;

    if (remaining <= 0) {
      delete store[state.reaction];
    }
  }
}
