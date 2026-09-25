import { GI } from '@/data';
import { getAttr } from '@/utils';
import { getBuffMap } from '../../getStatMap';
import { getResMult } from '../../formula/enemyRes';
import { getCritMult } from '../../formula/getCritMult';
import { applyCryo } from './applyGauge';

const LEVEL_MULTIPLIER = 1446.85;

const REACTION_DEFS = {
  stellarConduct: {
    reaction: 'stellarConduct',
    elements: ['cryo', 'electro'],
  },
  stellarSwirl: {
    reaction: 'stellarSwirl',
    elements: ['cryo', 'anemo'],
  },
};

function getEmMult(em) {
  return (6 * em) / (2000 + em);
}

function runFormula(statMap, reactionElement, multiplier) {
  const em = getAttr('elementalMastery', statMap);

  const baseValue = (
    multiplier *
    LEVEL_MULTIPLIER *
    (1 + getAttr('stellarSwirlBaseDmg%', statMap) + getAttr('stellarGlimmerBaseDmg%', statMap)) *
    (1 + getEmMult(em) + getAttr('stellarSwirlReactionBonus%', statMap) + getAttr('stellarGlimmerReactionBonus%', statMap)) +
    getAttr('stellarGlimmerFlat', statMap)
  );

  return baseValue *
    getCritMult(statMap) *
    getResMult(GI, reactionElement, statMap);
}

export function buildStellarSwirlSnapshot(ctx, reactionElement, level) {
  const multiplier = reactionElement === 'anemo'
    ? 0.75
    : level === 2
      ? 3
      : 2;

  const allMemberBuffs = {};
  for (const memberId of ctx.cache.memberIds) {
    allMemberBuffs[memberId] = getBuffMap(ctx, { memberId });
  }

  const memo = {};

  const snapshot = {
    key: `system:stellarSwirl`,
    name: 'Stellar Swirl',
    ownerId: 'system',
    type: 'stellarReaction',
    damageType: 'stellarSwirl',
    onFieldId: ctx.states.onFieldId,
    runtime: ctx.states.runtime,
    unresolved: {
      elevation: true,
      memo,
      allMemberBuffs,
      formula: (statMap) => runFormula(statMap, reactionElement, multiplier),
      scale: 1,
      parts: ['damage'],
      reactionElement,
    },
  };

  return snapshot;
}

export function reactStellarConduct(ctx, ownerId) {
  const state = ctx.states.aura.stellarConduct ??= {
    reaction: 'stellarConduct',
    prevHits: 0,
    multiplier: 1,
    bonus: 0.2,
    hits: 0,
    timer: 4000,
  };

  state.timeLeft = 7000;

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.stellarConduct,
    ownerId,
  });
}

export function reactStellarSwirl(ctx, ownerId) {
  const state = ctx.states.aura.stellarSwirl ??= {
    reaction: 'stellarSwirl',
  };

  state.timeLeft = 8000;

  if (state.vortexTimer) {
    state.vortexHits++;
    state.ownerId = ownerId;
  } else {
    if (ctx.saveSnapshots) {
      const snapshot = buildStellarSwirlSnapshot(ctx, 'anemo');
      ctx.snapshots.push(snapshot);
    }

    state.vortexTimer = 3000;
    state.vortexHits = 0;
    state.ownerId = ownerId;
  }

  if (state.vortexHits === 5) {
    if (ctx.saveSnapshots) {
      const snapshot = buildStellarSwirlSnapshot(ctx, 'cryo', 2);
      ctx.snapshots.push(snapshot);
    }
    applyCryo(ctx, 1, ownerId);

    state.vortexTimer = null;
    state.vortexHits = null;
    state.ownerId = null;
  }

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.stellarSwirl,
    ownerId,
  });
}
