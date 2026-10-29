import { toMergedObj, getAttr } from '@/utils';
import { convertSeedsOfDeceit, consumeSeedsOfDeceit } from '../reactions';
import { runApplyEffect } from './effects';
import { buildTransformativeReactionSnapshot } from '../snapshot';
import { getBuffMap } from '../getStatMap';
import { changeBondOfLife } from './bond-of-life';
import { updateHealth } from './healthPools';

export function hasGameRule(ctx, rule) {
  const { globalEffects } = ctx.states;

  for (const effectKey in globalEffects) {
    const { gameRule } = globalEffects[effectKey].effect;

    if (gameRule === rule) {
      return true;
    }
  }
}

export function runGameRule(ctx, rule, effect, spec) {
  if (rule === 'oceanHuedClam') {
    ctx.states.gameRule.oceanHuedClam = { ownerId: effect.ownerId, value: 0 };
  }

  if (rule === 'seaDyedFoam') {
    if (ctx.saveSnapshots) {
      const snapshot = buildTransformativeReactionSnapshot(ctx, effect.ownerId, 'oceanHuedClam', 'physical');
      ctx.snapshots.push(snapshot);
    }

    delete ctx.states.gameRule.oceanHuedClam;
  }

  if (rule === 'arlecchinoBalemoon') {
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
  }

  if (rule === 'xilonenFakeNightsoulBurst') {
    ctx.runEffects('nightsoulBurst');
  }

  if (rule === 'seedsOfDeceit1') {
    convertSeedsOfDeceit(ctx);
  }

  if (rule === 'seedsOfDeceit2') {
    const seedsConsumed = consumeSeedsOfDeceit(ctx);
    for (let i = 0; i < seedsConsumed; i++) {
      runApplyEffect(ctx, effect, spec);
    }
  }
}
