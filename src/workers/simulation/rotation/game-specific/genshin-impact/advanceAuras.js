import { tickElectroCharged } from './transformativeReactions';

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

  if (electroCharged.timer === 0) {
    tick();
  }

  while (remaining > 0) {
    const interval = electroCharged
      ? Math.min(remaining, electroCharged.timer)
      : remaining;

    remaining -= interval;

    if (electroCharged) {
      electroCharged.timer -= interval;
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

    if (electroCharged && electroCharged.timer === 0) {
      tick();
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
      state.timer -= elapsed;
      if (state.timer <= 0) {
        delete ctx.states.aura[state.reaction];
      }
    }

    if (state.element) {
      advanceElementAura(ctx, state, elapsed);
    }
  }
}
