import { WW, CHARACTER, WEAPON, SET, ECHO } from '@/data';
import {
  isEnabledChar,
  isEnabledWeap,
  isEnabledSet,
  isEnabledEcho,
  toArray,
} from '@/utils';
import { normAction } from './actions';
import { resolveRankedValue } from './resolveRanked';

function normScope(ownerId, memberIds, rawScope) {
  switch (rawScope) {
    case undefined: return [ownerId];
    case '$team': return memberIds;
    case '$ally': return memberIds.filter((id) => id !== ownerId);
    case '$first': return [memberIds[0]];
    case '$next': return [memberIds.at(memberIds.indexOf(ownerId) - 1)];
    default: return toArray(rawScope);
  }
}

function mergeValues(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return [a, b];
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return [
      ...toArray(a),
      ...toArray(b),
    ];
  }

  if (
    a && typeof a === 'object' &&
    b && typeof b === 'object'
  ) {
    const merged = { ...a };

    for (const [key, value] of Object.entries(b)) {
      merged[key] =
        key in merged
          ? mergeValues(merged[key], value)
          : value;
    }

    return merged;
  }

  return b;
}

function resolveRankMods(effect, memberRank) {
  const { rankMods } = effect;

  for (const { rank, ...modSpec } of rankMods) {
    if (rank > memberRank) continue;

    for (const [field, add] of Object.entries(modSpec)) {
      effect[field] =
        field in effect
          ? mergeValues(effect[field], add)
          : add;
    }
  }
}

export const normEffect = (ctx, rawEffect) => {
  const { ownerId, sourceId, index } = ctx;
  const effect = {
    ...rawEffect,
    ownerId, sourceId, index,
    category: `${sourceId}:effect${index}`,
    id: `${ownerId}.${sourceId}:effect${index}`,
  };

  // Scope
  effect.stores = normScope(ownerId, ctx.memberIds, rawEffect.stores);
  if (effect.apply) {
    const resolved = { ...effect.apply };
    resolved.by = normScope(ownerId, ctx.memberIds, resolved.by);
    effect.apply = resolved;
  }

  // Resolve ranked buff stats/specs
  if (ctx.sourceType === 'weapon' && effect.buff) {
    const resolvedBuff = { ...effect.buff };

    // Stats
    if (effect.buff.stats) {
      const resolvedStats = {};
      for (const [stat, value] of Object.entries(effect.buff.stats)) {
        resolvedStats[stat] = resolveRankedValue(value, ctx.weaponRank);
      }
      resolvedBuff.stats = resolvedStats;
    }

    // Specs
    if (effect.buff.specs) {
      const resolvedSpecs = {};
      for (const [stat, spec] of Object.entries(effect.buff.specs)) {
        const resolvedSpec = { ...spec };
        for (const [field, value] of Object.entries(spec)) {
          if (typeof value === 'string') continue;
          resolvedSpec[field] = resolveRankedValue(value, ctx.weaponRank);
        }
        resolvedSpecs[stat] = resolvedSpec;
      }
      resolvedBuff.specs = resolvedSpecs;
    }
    effect.buff = resolvedBuff;
  }

  if (effect.use?.action) {
    effect.use = { ...effect.use };
    const useActions = toArray(effect.use.action);

    effect.use.action = [];
    for (const [index, rawUseAction] of useActions.entries()) {
      if (typeof rawUseAction === 'string') {
        const ref = rawUseAction;
        const action = ctx.actionDefs[ref];
        effect.use.action.push(action);
        continue;
      }

      // Inline action
      const inlineSpec = {
        ownerId,
        category: effect.category,
        index,
        teamSize: ctx.memberIds.length,
        weaponRank: ctx.weaponRank,
        mode: ctx.memberMode,
      };

      const action = normAction(ctx.gameId, rawUseAction, inlineSpec);
      effect.use.action.push(action);
    }
  }

  if (effect.rankMods) {
    resolveRankMods(effect, ctx.memberRank);
  }

  return effect;
};

export const normalizeEffects = (gameId, member, spec) => {
  const normalized = {};

  const sharedNormCtx = {
    gameId,
    ownerId: member.id,
    memberRank: member.rank,
    weaponRank: member.weaponRank,
    memberMode: member.mode,
    memberIds: spec.memberIds,
    actionDefs: spec.actionDefs,
  };

  // Character effects
  const charData = CHARACTER[gameId][member.id];
  const charEffects = charData.effects ?? [];
  for (const [index, rawEffect] of charEffects.entries()) {
    if (!isEnabledChar(rawEffect, member)) continue;

    const sourceId = member.id;
    const sourceType = 'character';
    const normCtx = { ...sharedNormCtx, sourceId, sourceType, index };
    const effect = normEffect(normCtx, rawEffect);
    normalized[effect.id] = effect;
  }

  // Weapon effects
  const weapData = WEAPON[gameId][member.weaponId];
  const weapEffects = weapData.effects ?? [];
  for (const [index, rawEffect] of weapEffects.entries()) {
    if (!isEnabledWeap(rawEffect, charData, weapData)) continue;

    const sourceId = member.weaponId;
    const sourceType = 'weapon';
    const normCtx = { ...sharedNormCtx, sourceId, sourceType, index };
    const effect = normEffect(normCtx, rawEffect);
    normalized[effect.id] = effect;
  }

  // Set effects
  for (const [setId, pcCount] of Object.entries(member.setCounts)) {
    const setEffects = SET[gameId][setId]?.effects ?? [];
    for (const [index, rawEffect] of setEffects.entries()) {
      if (!isEnabledSet(rawEffect, pcCount, charData)) continue;

      const sourceId = setId;
      const sourceType = 'set';
      const normCtx = { ...sharedNormCtx, sourceId, sourceType, index };
      const effect = normEffect(normCtx, rawEffect);
      normalized[effect.id] = effect;
    }
  }

  // Echo effects
  if (gameId === WW) {
    const echoEffects = ECHO[member.mainEcho]?.effects ?? [];
    for (const [index, rawEffect] of echoEffects.entries()) {
      if (!isEnabledEcho(rawEffect, charData)) continue;

      const sourceId = member.mainEcho;
      const sourceType = 'echo';
      const normCtx = { ...sharedNormCtx, sourceId, sourceType, index };
      const effect = normEffect(normCtx, rawEffect);
      normalized[effect.id] = effect;
    }
  }

  // Resolve tokens
  const resolveEffectId = (key, sourceId) =>
    key.includes(':')
      ? key
      : Object.values(normalized)
        .filter((effect) => effect.sourceId === sourceId)
        .find((effect) => effect.key === key).id;

  function walkBooleanTree(node, onLeaf) {
    if (node == null || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('and' in node) {
      node.and.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('or' in node) {
      node.or.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }
    if ('not' in node) {
      walkBooleanTree(node.not, onLeaf);
      return;
    }
    onLeaf(node);
  }

  function traverseFilter(node, sourceId) {
    walkBooleanTree(node, (leaf) => {
      if ('has' in leaf) return; // generic has (e.g. action.has) - not an effect reference

      const [key, value] = Object.entries(leaf)[0];
      if (key === 'effectStacks') {
        resolveEffectStacksKeys(value, sourceId);
        return;
      }
      traverseFilter(value, sourceId);
    });
  }

  function resolveEffectStacksKeys(value, sourceId) {
    walkBooleanTree(value, (leaf) => {
      if ('has' in leaf) {
        if (Array.isArray(leaf.has)) {
          leaf.has = leaf.has.map((key) => resolveEffectId(key, sourceId));
        } else if (leaf.has !== '*') {
          leaf.has = resolveEffectId(leaf.has, sourceId);
        }
        return;
      }

      // remaining keys are effect ids being compared (stacks thresholds etc.)
      for (const key of Object.keys(leaf)) {
        const comparison = leaf[key];
        delete leaf[key];
        leaf[resolveEffectId(key, sourceId)] = comparison;
      }
    });
  }

  for (const effect of Object.values(normalized)) {
    const { sourceId } = effect;

    for (const field in effect) {
      if (/^on[A-Z]\w*Do[A-Z]\w*$/.test(field)) {
        const resolved = {};
        for (const [key, stacks] of Object.entries(effect[field])) {
          const id = resolveEffectId(key, sourceId);
          resolved[id] = stacks;
        }
        effect[field] = resolved;
      }
    }

    if (effect.apply?.filter) {
      traverseFilter(effect.apply.filter, sourceId);
    }

    if (effect.remove?.filter) {
      traverseFilter(effect.remove.filter, sourceId);
    }

    if (effect.use?.filter) {
      traverseFilter(effect.use.filter, sourceId);
    }

    if (effect.buff?.filter) {
      traverseFilter(effect.buff.filter, sourceId);
    }
  }

  return normalized;
};
