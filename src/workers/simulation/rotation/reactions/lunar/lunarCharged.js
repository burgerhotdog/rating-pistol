import { buildElevationSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactLunarCharged(ctx, ownerId) {
  ctx.states.aura.lunarCharged ??= {
    reaction: 'lunarCharged',
    timeLeft: 0,
  };

  ctx.runEffects('reaction', {
    reaction: 'lunarCharged',
    elements: ['electro', 'hydro'],
    ownerId,
  });
}

export function tickLunarCharged(ctx, offset = 0) {
  const { aura } = ctx.states;

  if (!aura.electro || !aura.hydro) {
    delete aura.lunarCharged;
    return true;
  }

  if (ctx.saveSnapshots) {
    const snapshot = buildElevationSnapshot(ctx, 'lunarCharged');
    ctx.snapshots.push({ ...snapshot, runtime: snapshot.runtime + offset });
  }

  consumeAura(ctx.states.aura, 'electro', 0.4);
  consumeAura(ctx.states.aura, 'hydro', 0.4);

  if (!aura.electro || !aura.hydro) {
    delete aura.lunarCharged;
    return true;
  }

  aura.lunarCharged.timeLeft = 2000;
  return false;
}
