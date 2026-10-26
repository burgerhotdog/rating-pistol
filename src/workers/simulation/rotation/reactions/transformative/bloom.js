import { buildTransformativeReactionSnapshot } from '../../snapshot';
import { consumeAura, hasGameRule } from '../../states';

export function reactBloom(ctx, applier, auraElement, gaugeUnits) {
  const auraStore = ctx.states.aura;
  const bloomState = auraStore.bloom ??= {
    reaction: 'bloom',
    cores: [],
    seedsOfDeceit: 0,
  };

  if (hasGameRule(ctx, 'seedsOfDeceit')) {
    bloomState.seedsOfDeceit++;
  } else {
    bloomState.cores.push({
      timeLeft: 6000,
      ownerId: applier,
    });
  }


  if (bloomState.cores.length > 5) {
    const oldestCore = bloomState.cores.shift();

    if (ctx.states.globalCooldowns.bloom?.length !== 2) {
      (ctx.states.globalCooldowns.bloom ??= []).push(500);

      if (ctx.saveSnapshots) {
        const snapshot = buildTransformativeReactionSnapshot(ctx, oldestCore.ownerId, 'bloom', 'dendro');
        ctx.snapshots.push(snapshot);
      }

      ctx.runEffects('hit', {
        damage: {
          type: 'bloom',
          element: 'dendro',
        },
      });
    }
  }

  const unitsModifier = auraElement === 'hydro' ? 2 : 0.5;

  const excess = consumeAura(auraStore, auraElement, gaugeUnits * unitsModifier) / unitsModifier;

  ctx.runEffects('reaction', {
    reaction: 'bloom',
    elements: ['dendro', 'hydro'],
    ownerId: applier,
  });

  return excess;
}

export function convertSeedsOfDeceit(ctx) {
  const state = ctx.states.aura.bloom;
  if (!state) return;

  const numCores = state.cores.length;
  state.cores = [];

  state.seedsOfDeceit += numCores;
}

export function consumeSeedsOfDeceit(ctx) {
  const state = ctx.states.aura.bloom;
  if (!state) return 0;

  const consumedSeeds = Math.min(state.seedsOfDeceit, 3);

  state.seedsOfDeceit -= consumedSeeds;
  return consumedSeeds;
}
