import { buildTransformativeReactionSnapshot } from '../../../snapshot';

export function advanceBloomTimers(bloomState, step) {
  for (const core of bloomState.cores) {
    core.timeLeft -= step;
  }
}

export function fireBloomCores(ctx) {
  const bloomState = ctx.states.aura.bloom;
  if (!bloomState) return;

  while (bloomState.cores[0]?.timeLeft <= 0) {
    const core = bloomState.cores.shift();

    if (ctx.states.globalCooldowns.bloom?.length !== 2) {
      (ctx.states.globalCooldowns.bloom ??= []).push(500);

      if (ctx.saveSnapshots) {
        ctx.snapshots.push(
          buildTransformativeReactionSnapshot(ctx, core.ownerId, 'bloom', 'dendro')
        );
      }

      ctx.runEffects('hit', {
        damage: {
          type: 'bloom',
          element: 'dendro',
        },
      });
    }
  }
}
