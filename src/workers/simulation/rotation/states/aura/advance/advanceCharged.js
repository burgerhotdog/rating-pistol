import { buildTransformativeReactionSnapshot, buildElevationSnapshot } from '../../../snapshot';
import { consumeAura } from '../consumeAura';
import { decayElementalAura } from './decayElementalAura';

function tickCharged(ctx, chargedState) {
  const auraStore = ctx.states.aura;
  const isLunar = ctx.cache.lunarCharged;

  if (ctx.saveSnapshots) {
    if (isLunar) {
      ctx.snapshots.push(buildElevationSnapshot(ctx, 'lunarCharged'));
    } else {
      if (!ctx.states.globalCooldowns.electroCharged) {
        ctx.states.globalCooldowns.electroCharged = 500;

        ctx.snapshots.push(
          buildTransformativeReactionSnapshot(ctx, chargedState.ownerId, 'electroCharged', 'electro')
        );
      }
    }
  }

  chargedState.timer = isLunar ? 2000 : 1000;
  consumeAura(auraStore, 'electro', 0.4);
  consumeAura(auraStore, 'hydro', 0.4);

  ctx.runEffects('hit', {
    damage: {
      type: isLunar ? 'lunarCharged' : 'electroCharged',
      element: 'electro',
    },
  });
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
