import { tickElectroCharged } from './transformativeReactions';
import { buildStellarSwirlSnapshot } from './stellarReactions';
import { applyCryo } from './applyGauge';

function advanceElementAura(ctx, state, elapsed) {
  state.gauge -= elapsed / state.decayRate;

  const isDeleted = state.gauge <= 0;

  if (isDeleted) {
    delete ctx.states.aura[state.element];
  }

  return isDeleted;
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
        const level = state.vortexHits >= 2 ? 2 : 1;
        const snapshot = buildStellarSwirlSnapshot(ctx, 'cryo', level);
        ctx.snapshots.push(snapshot);
      }
      applyCryo(ctx, 1, state.ownerId);

      state.vortexTimer = null;
      state.vortexHits = null;
      state.ownerId = null;
    }
  }
}

export function advanceAuras(ctx, elapsed) {
  const shouldAdvanceElectroCharged = Boolean(ctx.states.aura.electroCharged);
  if (shouldAdvanceElectroCharged) {
    advanceElectroCharged(ctx, elapsed);
  }

  for (const state of Object.values(ctx.states.aura)) {
    if ( // Already handled
      shouldAdvanceElectroCharged && (
        state.reaction === 'electroCharged' ||
        state.element === 'electro' ||
        state.element === 'hydro'
      )
    ) continue;

    if (state.reaction) {
      if (state.reaction === 'stellarConduct') {
        advanceStellarConduct(ctx, state, elapsed);
        continue;
      }

      if (state.reaction === 'stellarSwirl') {
        advanceStellarSwirl(ctx, state, elapsed);
        continue;
      }

      state.timeLeft -= elapsed;
      if (state.timeLeft <= 0) {
        delete ctx.states.aura[state.reaction];
      }
    }

    if (state.element) {
      advanceElementAura(ctx, state, elapsed);
    }
  }
}
