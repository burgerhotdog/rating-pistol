import { toMergedObj, getAttr } from '@/utils';
import { getBuffMap } from '../getStatMap';
import { buildTransformativeReactionSnapshot } from '../snapshot';
import { runApplyEffect, changeBondOfLife, updateHealth } from '../states';

const ruleHandlers = {
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

    const overflow = changeBondOfLife(ctx, 10000096, -healRatio);
    if (overflow) {
      updateHealth(ctx, { ownerId: 10000096 }, 10000096, { value: overflow });
    }

    ctx.runEffects('healed', { ownerId: 10000096 });
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
