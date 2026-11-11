import { buildElevationSnapshot } from '../../snapshot';

const lunarCrystallizeReaction = {
  reaction: 'lunarCrystallize',
  elements: ['geo', 'hydro'],
};

export function reactLunarCrystallize(ctx, ownerId) {
  const state = ctx.states.aura.lunarCrystallize ??= {
    reaction: 'lunarCrystallize',
    timesLeft: 3,
  };

  state.timesLeft--;

  ctx.runEffects('reaction', { ownerId, reaction: lunarCrystallizeReaction });

  if (state.timesLeft === 0) {
    if (ctx.saveSnapshots) {
      const snapshot = buildElevationSnapshot(ctx, 'lunarCrystallize');

      ctx.snapshots.push(snapshot);
      ctx.snapshots.push(snapshot);
      ctx.snapshots.push(snapshot);
    }

    state.timesLeft = 3;
  }
}
