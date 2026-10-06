import { buildElevationSnapshot } from '../../snapshot';

export function reactLunarCrystallize(ctx, ownerId) {
  const state = ctx.states.aura.lunarCrystallize ??= {
    reaction: 'lunarCrystallize',
    timesLeft: 3,
  };

  ctx.runEffects('reaction', {
    reaction: 'lunarCrystallize',
    elements: ['geo', 'hydro'],
    ownerId,
  });

  state.timesLeft--;

  if (state.timesLeft === 0) {
    const snapshot = buildElevationSnapshot(ctx, 'lunarCrystallize');

    ctx.snapshots.push(snapshot);
    ctx.snapshots.push(snapshot);
    ctx.snapshots.push(snapshot);

    state.timesLeft = 3;
  }
}
