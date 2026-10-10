import { buildTransformativeReactionSnapshot } from '../../../snapshot';

export function advanceBloom(ctx, bloomState, elapsed) {
  for (const core of bloomState.cores) {
    core.timeLeft -= elapsed;
  }

  while (bloomState.cores[0]?.timeLeft <= 0) {
    const core = bloomState.cores.shift();

    if (ctx.states.globalCooldowns.bloom?.length !== 2) {
      (ctx.states.globalCooldowns.bloom ??= []).push(500);

      if (ctx.saveSnapshots) {
        const snapshot = buildTransformativeReactionSnapshot(ctx, core.ownerId, 'bloom', 'dendro');
        const runtime = snapshot.runtime + elapsed + core.timeLeft;

        ctx.snapshots.push({ ...snapshot, runtime });
      }
    }

    ctx.runEffects('dendroCore');
  }
}
