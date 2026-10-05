import { consumeAura } from '../states/aura';
import { buildElevationSnapshot } from '../snapshot';

const REACTION_DEFS = {
  lunarCrystallize: {
    reaction: 'lunarCrystallize',
    elements: ['geo'],
  },
  lunarCharged: {
    reaction: 'lunarCharged',
    elements: ['electro', 'hydro'],
  },
};

export function reactLunarCrystallize(ctx, ownerId, auraElement) {
  ctx.runEffects('reaction', {
    ...REACTION_DEFS.lunarCrystallize,
    ownerId,
    elements: ['geo', auraElement],
  });
}

export function reactLunarCharged(ctx, applier) {
  ctx.states.aura.lunarCharged ??= {
    reaction: 'lunarCharged',
    timeLeft: 0,
  };

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.lunarCharged,
    ownerId: applier,
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

  consumeAura(ctx, aura.electro, 0.4);
  consumeAura(ctx, aura.hydro, 0.4);

  if (!aura.electro || !aura.hydro) {
    delete aura.lunarCharged;
    return true;
  }

  aura.lunarCharged.timeLeft = 2000;
  return false;
}
