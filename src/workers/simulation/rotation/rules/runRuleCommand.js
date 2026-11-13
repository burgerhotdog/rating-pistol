import { toMergedObj, getAttr } from '@/utils';
import { getBuffMap } from '../getStatMap';
import { buildTransformativeReactionSnapshot } from '../snapshot';
import { decayBuffUses, runApplyEffect, updateBondOfLife, updateHealth } from '../states';

const ruleHandlers = {
  kavehFireCores(ctx) {
    const bloomState = ctx.states.aura.bloom;
    if (!bloomState) return;

    while (bloomState.cores.length > 0) {
      const core = bloomState.cores.shift();

      if (ctx.states.globalCooldowns.bloom?.length !== 2) {
        (ctx.states.globalCooldowns.bloom ??= []).push(500);

        if (ctx.saveSnapshots) {
          ctx.snapshots.push(
            buildTransformativeReactionSnapshot(ctx, core.ownerId, 'bloom', 'dendro')
          );
        }

        decayBuffUses(ctx, {
          damage: {
            type: 'bloom',
            element: 'dendro',
          },
        }, [core.ownerId]);

        ctx.runEffects('hit', { action: {
          damage: {
            type: 'bloom',
            element: 'dendro',
          },
        }});
      }
    }
  },

  oceanHuedClam(ctx, effect) {
    ctx.states.rules['oceanHuedClam'] = {
      ownerId: effect.ownerId,
      value: 0,
    };
  },

  seaDyedFoam(ctx, effect) {
    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, effect.ownerId, 'oceanHuedClam', 'physical');
      ctx.snapshots.push(snapshot);
    }
    decayBuffUses(ctx, {
      damage: {
        element: 'physical',
      },
    }, [effect.ownerId]);
    delete ctx.states.rules.oceanHuedClam;
  },

  arlecchinoBalemoon(ctx) {
    const { buffMap } = getBuffMap(ctx, { memberId: 10000096, resolveNow: true });
    const statMap = toMergedObj(ctx.buildMaps['10000096'], buffMap);
    const bolValue = ctx.states.bondOfLife['10000096'];
    const hpValue = getAttr('hp', statMap);
    const atkValue = getAttr('atk', statMap);
    const healValue = bolValue * hpValue * 1.5 + atkValue * 1.5;
    const healRatio = healValue / hpValue;

    const overflow = updateBondOfLife(ctx, { ownerId: 10000096, bondOfLife: -healRatio });
    if (overflow) {
      updateHealth(ctx, { ownerId: 10000096 }, 10000096, { value: overflow });
    }

    ctx.runEffects('healed', { ownerId: 10000096 });
  },

  clorindeHealBol104(ctx) {
    const { buffMap } = getBuffMap(ctx, { memberId: 10000098, resolveNow: true });
    const statMap = toMergedObj(ctx.buildMaps[10000098], buffMap);

    const healRatio = 1.04 * (1 + getAttr('healingBonus%', statMap) + getAttr('healingReceived%', statMap));

    const overflow = updateBondOfLife(ctx, { ownerId: 10000098, bondOfLife: -healRatio });
    if (overflow) {
      updateHealth(ctx, { ownerId: 10000098 }, 10000098, { value: overflow });
    }

    ctx.runEffects('healed', { ownerId: 10000098 });
  },

  clorindeHealBol110(ctx) {
    const { buffMap } = getBuffMap(ctx, { memberId: 10000098, resolveNow: true });
    const statMap = toMergedObj(ctx.buildMaps[10000098], buffMap);

    const healRatio = 1.1 * (1 + getAttr('healingBonus%', statMap) + getAttr('healingReceived%', statMap));

    const overflow = updateBondOfLife(ctx, { ownerId: 10000098, bondOfLife: -healRatio });
    if (overflow) {
      updateHealth(ctx, { ownerId: 10000098 }, 10000098, { value: overflow });
    }

    ctx.runEffects('healed', { ownerId: 10000098 });
  },

  xilonenFakeNightsoulBurst(ctx) {
    ctx.runEffects('nightsoulBurst');
  },

  seedsOfDeceit1(ctx) {
    const bloomState = ctx.states.aura.bloom;
    if (!bloomState) return;

    const numCores = bloomState.cores.length;

    bloomState.cores = [];
    bloomState.seedsOfDeceit += numCores;
  },

  seedsOfDeceit2(ctx, effect, spec) {
    const bloomState = ctx.states.aura.bloom;
    if (!bloomState) return;

    const consumed = Math.min(bloomState.seedsOfDeceit, 3);
    if (consumed <= 0) return;

    bloomState.seedsOfDeceit -= consumed;

    for (let i = 0; i < consumed; i++) {
      runApplyEffect(ctx, effect, spec);
    }
  },
};

export function runRuleCommand(ctx, rule, effect, spec) {
  const handler = ruleHandlers[rule];

  if (handler) {
    handler(ctx, effect, spec);
  }
}
