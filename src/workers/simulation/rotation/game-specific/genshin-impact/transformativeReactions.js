import { GI } from '@/data';
import { getAttr, formatStr } from '@/utils';
import { getBuffMap } from '../../getStatMap';
import { getResMult } from '../../formula/enemyRes';
import { consumeAura } from './aura';

const LEVEL_MULTIPLIER = 1446.85;

const REACTION_DEFS = {
  overloaded: {
    reaction: 'overloaded',
    elements: ['pyro', 'electro'],
    multiplier: 2.75,
  },
  superconduct: {
    reaction: 'superconduct',
    elements: ['cryo', 'electro'],
    multiplier: 1.5,
  },
  swirl: {
    reaction: 'swirl',
    elements: ['anemo'],
    multiplier: 0.6,
  },
  crystallize: {
    reaction: 'crystallize',
    elements: ['geo'],
  },
  frozen: {
    reaction: 'frozen',
    elements: ['cryo', 'hydro'],
  },
  electroCharged: {
    reaction: 'electroCharged',
    elements: ['electro', 'hydro'],
    multiplier: 2,
  },
};

function runFormula(reaction, statMap, reactionElement) {
  const em = getAttr('elementalMastery', statMap);
  const reactionBonus = 1 + ((16 * em) / (2000 + em)) + getAttr(`${reaction}ReactionBonus%`, statMap);
  const resMult = getResMult(GI, reactionElement, statMap);
  return LEVEL_MULTIPLIER * REACTION_DEFS[reaction].multiplier * reactionBonus * resMult;
}

function buildSnapshot(ctx, reaction, ownerId, reactionElement) {
  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: ownerId });

  const memo = {};

  const snapshot = {
    key: `system:${reaction}`,
    name: formatStr(reaction),
    ownerId: 'system',
    type: 'transformativeReaction',
    damageType: reaction,
    onFieldId: ctx.states.onFieldId,
    runtime: ctx.states.runtime,
    unresolved: {
      memo,
      ownerId,
      buffMap,
      buffSpecs,
      formula: (statMap) => runFormula(reaction, statMap, reactionElement),
      scale: 1,
      parts: ['damage'],
      reactionElement,
    },
  };

  return snapshot;
}

export function reactOverloaded(ctx, ownerId) {
  if (ctx.saveSnapshots) {
    const snapshot = buildSnapshot(ctx, 'overloaded', ownerId, 'pyro');
    ctx.snapshots.push(snapshot);
  }

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.overloaded,
    ownerId,
  });
}

export function reactSuperconduct(ctx, ownerId) {
  if (ctx.saveSnapshots) {
    const snapshot = buildSnapshot(ctx, 'superconduct', ownerId, 'cryo');
    ctx.snapshots.push(snapshot);
  }

  const state = ctx.states.aura.superconduct ??= {
    reaction: 'superconduct',
  };
  state.timeLeft = 12000;

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.superconduct,
    ownerId,
  });
}

export function reactSwirl(ctx, ownerId, auraElement) {
  if (ctx.saveSnapshots) {
    const snapshot = buildSnapshot(ctx, 'swirl', ownerId, auraElement);
    ctx.snapshots.push(snapshot);
  }

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.swirl,
    ownerId,
    elements: ['anemo', auraElement],
  });
}

export function reactCrystallize(ctx, ownerId, auraElement) {
  ctx.runEffects('reaction', {
    ...REACTION_DEFS.crystallize,
    ownerId,
    elements: ['geo', auraElement],
  });
}

export function reactFrozen(ctx, ownerId, originGauge, gauge) {
  const frozenAuraGauge = 2 * Math.min(originGauge, gauge);
  const freezeDuration = (2 * Math.sqrt(5 * frozenAuraGauge + 4) - 4) * 1000;

  ctx.states.aura.frozen = {
    reaction: 'frozen',
    timeLeft: freezeDuration,
  };

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.frozen,
    ownerId,
  });
}

export function reactElectroCharged(ctx, applier) {
  const state = ctx.states.aura.electroCharged ??= {
    reaction: 'electroCharged',
    timeLeft: 0,
  };
  state.applier = applier;

  ctx.runEffects('reaction', {
    ...REACTION_DEFS.electroCharged,
    ownerId: applier,
  });
}

export function tickElectroCharged(ctx, applier, offset = 0) {
  const { aura } = ctx.states;

  if (!aura.electro || !aura.hydro) {
    delete aura.electroCharged;
    return true;
  }

  if (ctx.saveSnapshots) {
    const snapshot = buildSnapshot(ctx, 'electroCharged', applier, 'electro');
    ctx.snapshots.push({ ...snapshot, runtime: snapshot.runtime + offset });
  }

  consumeAura(ctx, aura.electro, 0.5);
  consumeAura(ctx, aura.hydro, 0.5);

  if (!aura.electro || !aura.hydro) {
    delete aura.electroCharged;
    return true;
  }

  aura.electroCharged.timeLeft = 500;
  return false;
}
