import { GI } from '@/data';
import { getAttr, formatStr, toMergedObj } from '@/utils';
import { getBuffMap } from '../getStatMap';
import { getResMult } from '../formula/enemyRes';

const resolveStatSpecs = (buffSpec, sourceStatMap) => {
  const resolved = {};

  for (const [statId, statSpec] of Object.entries(buffSpec)) {
    const {
      attr, offset = 0, step,
      value, maxValue = Infinity,
    } = statSpec;

    const attrValue = getAttr(attr, sourceStatMap);
    const mult = Math.max((attrValue - offset) / step, 0);
    resolved[statId] = Math.min(value * mult, maxValue);
  }

  return resolved;
};

const toResolvedSpecs = (buffSpecs, sourceMap) => {
  const buffMap = {};
  for (const { specs, buffMult } of buffSpecs) {
    const resolvedStatMap = resolveStatSpecs(specs, sourceMap);

    for (const stat in resolvedStatMap) {
      buffMap[stat] = (buffMap[stat] ?? 0) + resolvedStatMap[stat] * buffMult;
    }
  }
  return buffMap;
};

const LEVEL_MULTIPLIER = 1446.85;

const reactionMultiplier = {
  overloaded: 2.75,
  superconduct: 1.5,
  swirl: 0.6,
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
    key: `other:${reaction}`,
    name: formatStr(reaction),
    ownerId: 'other',
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
      const resolvedBuffs = toResolvedSpecs(buffSpecs, testBuffedMap);
      const statMap = toMergedObj(partiallyBuffedMap, resolvedBuffs);

      return runFormula(reaction, statMap);
    };

    return snapshot;
  }

  // Action is from specId and has variable buffs from specId
  snapshot.damage = (testBuildMap) => {
    const testBuffedMap = toMergedObj(testBuildMap, testBuffMap);
    const resolvedBuffs = toResolvedSpecs(buffSpecs, testBuffedMap);
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
