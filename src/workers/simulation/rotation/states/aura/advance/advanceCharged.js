import { buildTransformativeReactionSnapshot, buildElevationSnapshot } from '../../../snapshot';
import { decayBuffUses } from '../../effects';
import { consumeAura } from '../consumeAura';
import { decayElementalAura } from './decayElementalAura';

const electroChargedAction = {
  damage: {
    type: 'electroCharged',
    element: 'electro',
  },
};

const lunarChargedAction = {
  damage: {
    type: 'lunarCharged',
    element: 'electro',
  },
};

function tickCharged(ctx, chargedState) {
  const auraStore = ctx.states.aura;
  const isLunar = ctx.cache.lunarCharged;

  let wasHit;

  if (isLunar) {
    wasHit = true;

    if (ctx.saveSnapshots) {
      const snapshot = buildElevationSnapshot(ctx, 'lunarCharged');
      ctx.snapshots.push(snapshot);
    }

    decayBuffUses(ctx, lunarChargedAction, ctx.cache.memberIds);
  } else {
    if (!ctx.states.globalCooldowns.electroCharged) {
      ctx.states.globalCooldowns.electroCharged = 500;
      wasHit = true;

      if (ctx.saveSnapshots) {
        const snapshot = buildTransformativeReactionSnapshot(ctx, chargedState.ownerId, 'electroCharged', 'electro')
        ctx.snapshots.push(snapshot);
      }

      decayBuffUses(ctx, electroChargedAction, [chargedState.ownerId]);
    }
  }

  chargedState.timer = isLunar ? 2000 : 1000;
  if (wasHit) {
    consumeAura(auraStore, 'electro', 0.4);
    consumeAura(auraStore, 'hydro', 0.4);

    if (isLunar) {
      ctx.runEffects('hit', { action: lunarChargedAction });
    }
  }
}

const getChargedKey = (ctx) => ctx.cache.lunarCharged ? 'lunarCharged' : 'electroCharged';

export function advanceChargedTimers(ctx, step) {
  const auraStore = ctx.states.aura;
  const chargedState = auraStore[getChargedKey(ctx)];

  if (chargedState) {
    chargedState.timer -= step;
  }

  decayElementalAura(auraStore, 'electro', step);
  decayElementalAura(auraStore, 'hydro', step);
}

export function fireCharged(ctx) {
  const chargedState = ctx.states.aura[getChargedKey(ctx)];

  if (chargedState?.timer <= 0) {
    tickCharged(ctx, chargedState);
  }
}
