import { GI } from '@/data';
import { getAttr, formatStr, toMergedObj, resolveBuffSpecs } from '@/utils';
import { getBuffMap } from '../../getStatMap';
import { getResMult } from '../../formula/enemyRes';
import { consumeAura } from './aura';

const LEVEL_MULTIPLIER = 1446.85;

const reactionMultiplier = {
  overloaded: 2.75,
  superconduct: 1.5,
  swirl: 0.6,
  electroCharged: 2,
};

function runFormula(reaction, statMap, reactionElement) {
  const em = getAttr('elementalMastery', statMap);
  const reactionBonus = 1 + ((16 * em) / (2000 + em)) + getAttr(`${reaction}ReactionBonus%`, statMap);
  const resMult = getResMult(GI, reactionElement, statMap);
  return LEVEL_MULTIPLIER * reactionMultiplier[reaction] * reactionBonus * resMult;
}

function buildSnapshot(ctx, reaction, ownerId, reactionElement) {
  const { buffMap, buffSpecs } = getBuffMap(ctx, { memberId: ownerId });
  const isSpecIdAction = ownerId === ctx.specId;

  const snapshot = {
    key: `system:${reaction}`,
    name: formatStr(reaction),
    ownerId: 'system',
    type: 'transformativeReaction',
    runtime: ctx.states.runtime,
    damageType: reaction,
  };

  if (!ctx.specId) {
    const statMap = toMergedObj(ctx.buildMaps[ownerId], buffMap);
    snapshot.damage = runFormula(reaction, statMap, reactionElement);
    return snapshot;
  }

  const usedAttrs = new Set([
    'elementalMastery',
    `${reaction}ReactionBonus%`,
    `${reactionElement}ResReduction`,
  ]);
  const usesSpecs = buffSpecs.some(({ specs }) =>
    Object.keys(specs).some((stat) => usedAttrs.has(stat))
  );

  if (!isSpecIdAction && !usesSpecs) {
    const statMap = toMergedObj(ctx.buildMaps[ownerId], buffMap);
    snapshot.damage = runFormula(reaction, statMap);
    return snapshot;
  }

  // Action is from specId but has no variable buffs from specId
  if (!usesSpecs) {
    snapshot.damage = (currBuildMap) => {
      const statMap = toMergedObj(currBuildMap, buffMap);
      return runFormula(reaction, statMap);
    };

    return snapshot;
  }

  const testBuffMap = getBuffMap(ctx, { memberId: ctx.specId, ignoreSpecs: true });

  // Action is not from specId but has variable buffs from specId
  if (!isSpecIdAction) {
    const partiallyBuffedMap = toMergedObj(ctx.buildMaps[ownerId], buffMap);

    snapshot.damage = (testBuildMap) => {
      const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
      const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
      const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);

      return runFormula(reaction, statMap);
    };

    return snapshot;
  }

  // Action is from specId and has variable buffs from specId
  snapshot.damage = (testBuildMap) => {
    const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
    const resolvedBuffs = resolveBuffSpecs(buffSpecs, testBuffedMap);
    const statMap = toMergedObj(testBuildMap, buffMap, resolvedBuffs);

    return runFormula(reaction, statMap);
  };

  return snapshot;
}

export function reactOverloaded(ctx, ownerId) {
  if (ctx.saveSnapshots) {
    const snapshot = buildSnapshot(ctx, 'overloaded', ownerId, 'pyro');
    ctx.snapshots.push(snapshot);
  }

  ctx.runEffectsWhen('reaction', { reaction: { reaction: 'overloaded', elements: ['pyro', 'electro'] } });
}

export function reactSuperconduct(ctx, ownerId) {
  if (ctx.saveSnapshots) {
    const snapshot = buildSnapshot(ctx, 'superconduct', ownerId, 'cryo');
    ctx.snapshots.push(snapshot);
  }

  ctx.states.aura.superconduct = { reaction: 'superconduct', timer: 12000 };

  ctx.runEffectsWhen('reaction', { reaction: { reaction: 'superconduct', elements: ['cryo', 'electro'] } });
}

export function reactSwirl(ctx, ownerId, auraElement) {
  if (ctx.saveSnapshots) {
    const snapshot = buildSnapshot(ctx, 'swirl', ownerId, auraElement);
    ctx.snapshots.push(snapshot);
  }

  ctx.runEffectsWhen('reaction', { reaction: { reaction: 'swirl', elements: ['anemo', auraElement] } });
}

export function reactCrystallize(ctx, ownerId, auraElement) {
  ctx.runEffectsWhen('reaction', { reaction: { reaction: 'crystallize', elements: ['geo', auraElement] } });
}

export function reactFrozen(ctx, originGauge, gauge) {
  const frozenAuraGauge = 2 * Math.min(originGauge, gauge);
  const freezeDuration = (2 * Math.sqrt(5 * frozenAuraGauge + 4) - 4) * 1000;

  ctx.states.aura.frozen = { reaction: 'frozen', timer: freezeDuration };

  ctx.runEffectsWhen('reaction', { reaction: { reaction: 'frozen', elements: ['hydro', 'cryo'] } });
}

export function reactElectroCharged(ctx, applier) {
  const state = ctx.states.aura.electroCharged ??= { reaction: 'electroCharged', timer: 0 };
  state.applier = applier;

  ctx.runEffectsWhen('reaction', { reaction: { reaction: 'electroCharged', elements: ['hydro', 'electro'] } });
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

  aura.electroCharged.timer = 500;
  return false;
}
