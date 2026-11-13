import { buildElevationSnapshot } from '../../snapshot';
import { consumeAura, decayBuffUses } from '../../states';

const lunarCrystallizeReaction = {
  reaction: 'lunarCrystallize',
  elements: ['geo', 'hydro'],
};

const lunarCrystallizeAction = {
  damage: {
    type: 'lunarCrystallize',
    element: 'geo',
  },
};

export function reactLunarCrystallize(ctx, ownerId, gaugeUnits) {
  const state = ctx.states.aura.lunarCrystallize ??= {
    reaction: 'lunarCrystallize',
    timesLeft: 3,
  };
  const units = gaugeUnits / 2;

  const excess = consumeAura(ctx.states.aura, 'hydro', units);
  state.timesLeft--;
  ctx.runEffects('reaction', { ownerId, reaction: lunarCrystallizeReaction });

  if (state.timesLeft === 0) {
    state.timesLeft = 3;

    for (let i = 0; i < 3; i++) {
      if (ctx.saveSnapshots) {
        const snapshot = buildElevationSnapshot(ctx, 'lunarCrystallize');
        ctx.snapshots.push(snapshot);
      }

      decayBuffUses(ctx, lunarCrystallizeAction, ctx.cache.memberIds);
      ctx.runEffects('hit', { action: lunarCrystallizeAction });
    }
  }

  return excess * 2;
}
