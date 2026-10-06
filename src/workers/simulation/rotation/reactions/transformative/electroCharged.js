import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura } from '../../states';

export function reactElectroCharged(ctx, applier) {
  const state = ctx.states.aura.electroCharged ??= {
    reaction: 'electroCharged',
    timeLeft: 0,
  };

  state.applier = applier;

  ctx.runEffects('reaction', {
    reaction: 'electroCharged',
    elements: ['electro', 'hydro'],
    ownerId: applier,
  });
}

export function tickElectroCharged(ctx, applier, offset = 0) {
  const { aura } = ctx.states;

  if (!aura.electro || !aura.hydro) {
    delete aura.electroCharged;
    return true;
  }

  if (ctx.saveSnapshots) {
    const snapshot = buildTransformativeReactionSnapshot(ctx, applier, 'electroCharged', 'electro');
    ctx.snapshots.push({ ...snapshot, runtime: snapshot.runtime + offset });
  }

  consumeAura(ctx, 'electro', 0.4);
  consumeAura(ctx, 'hydro', 0.4);

  if (!aura.electro || !aura.hydro) {
    delete aura.electroCharged;
    return true;
  }

  aura.electroCharged.timeLeft = 1000;
  return false;
}
