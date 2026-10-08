import { buildTransformativeReactionSnapshot, buildElevationSnapshot } from '../../../snapshot';
import { consumeAura } from '../consumeAura';
import { decayElementalAura } from './decayElementalAura';

function tickCharged(ctx, chargedState, offset = 0) {
  const auraStore = ctx.states.aura;
  const isLunar = ctx.cache.lunarCharged;

  if (ctx.saveSnapshots) {
    const snapshot = isLunar
      ? buildElevationSnapshot(ctx, 'lunarCharged')
      : buildTransformativeReactionSnapshot(ctx, chargedState.ownerId, 'electroCharged', 'electro');
    const runtime = snapshot.runtime + offset;

    ctx.snapshots.push({ ...snapshot, runtime });
  }

  chargedState.timer = isLunar ? 2000 : 1000;
  consumeAura(auraStore, 'electro', 0.4);
  consumeAura(auraStore, 'hydro', 0.4);
}

export function advanceCharged(ctx, elapsed) {
  const auraStore = ctx.states.aura;
  const rxnKey = ctx.cache.lunarCharged ? 'lunarCharged' : 'electroCharged';
  let remaining = elapsed;

  while (auraStore[rxnKey] && remaining > 0) {
    const decrease = Math.min(auraStore[rxnKey].timer, remaining);

    auraStore[rxnKey].timer -= decrease;
    remaining -= decrease;
    decayElementalAura(auraStore, 'electro', decrease);
    decayElementalAura(auraStore, 'hydro', decrease);

    if (auraStore[rxnKey]?.timer === 0) {
      tickCharged(ctx, auraStore[rxnKey], elapsed - remaining);
    }
  }

  if (remaining > 0) {
    decayElementalAura(auraStore, 'electro', remaining);
    decayElementalAura(auraStore, 'hydro', remaining);
  }
}
