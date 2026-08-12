import { CHARACTER, WEAPON, SET, ECHO } from '@/data';
import { toArray, toMergedObj } from '@/utils';
import { createIsEnabled } from './isEnabled';
import { toNormalizedAction } from './actions';
import { resolveRankedValue } from './resolveRanked';

function resolveApplyBy(effect, memberIds) {
  const { applyBy, ownerId } = effect;
  switch (applyBy) {
    case undefined:
      effect.applyBy = [ownerId];
      break;
    case '$team':
      effect.applyBy = memberIds;
      break;
    case '$ally':
      effect.applyBy = memberIds.filter((id) => id !== ownerId);
      break;
    case '$first':
      effect.applyBy = [memberIds[0]];
      break;
    case '$next':
      effect.applyBy = [memberIds.at(memberIds.indexOf(ownerId) - 1)];
      break;
    default:
      effect.applyBy = [applyBy];
  }
};

function resolveApplyTo(effect, memberIds) {
  const { applyTo, ownerId } = effect;
  switch (applyTo) {
    case undefined:
      effect.applyTo = [ownerId];
      break;
    case '$team':
      effect.applyTo = memberIds;
      break;
    case '$ally':
      effect.applyTo = memberIds.filter((id) => id !== ownerId);
      break;
    case '$first':
      effect.applyTo = [memberIds[0]];
      break;
    case '$next':
      effect.applyTo = [memberIds.at(memberIds.indexOf(ownerId) - 1)];
      break;
    default:
      effect.applyTo = [applyTo];
  }
};

function resolveRankMods(effect, memberRank) {
  const { rankMods } = effect;

  for (const [rank, modSpec] of Object.entries(rankMods)) {
    if (Number(rank) > memberRank) continue;

    for (const [field, add] of Object.entries(modSpec)) {
      if (!(field in effect)) { // no previous existing field
        effect[field] = add;
        continue;
      }

      const prev = effect[field];
      if (typeof prev === 'object' && !Array.isArray(prev)) { // merge objects
        effect[field] = toMergedObj(prev, add);
      } else if (typeof add === 'number') { // combine numbers
        effect[field] += add;
      } else { // merge string arrays
        effect[field] = [
          ...toArray(effect[field]),
          ...toArray(add),
        ];
      }
    }
  }
}

export const toNormalizedEffect = (rawEffect, spec) => {
  const {
    gameId, ownerId, sourceId, effectIndex,
    memberRank, weaponRank, memberIds, memberActions,
  } = spec;

  const resolveStatValue = (value) =>
    typeof value === 'number'
      ? value
      : resolveRankedValue(value, weaponRank);

  const effect = {
    ...rawEffect,
    ownerId,
    sourceId,
    id: `${ownerId}.${sourceId}:effect${effectIndex}`,
    index: effectIndex,
  };

  resolveApplyBy(effect, memberIds);
  resolveApplyTo(effect, memberIds);

  // Resolve ranked buffMaps
  if (effect.buffMap) {
    effect.buffMap = { ...effect.buffMap };

    for (const [statId, value] of Object.entries(effect.buffMap)) {
      effect.buffMap[statId] = resolveStatValue(value);
    }
  }

  // Resolve ranked buffSpec
  if (effect.buffSpec) {
    effect.buffSpec = { ...effect.buffSpec };

    for (const [statId, spec] of Object.entries(effect.buffSpec)) {
      const resolvedSpec = { ...spec };
      effect.buffSpec[statId] = resolvedSpec;

      for (const [field, value] of Object.entries(resolvedSpec)) {
        if (typeof value === 'string') continue;
        resolvedSpec[field] = resolveStatValue(value);
      }
    }
  }

  if ('useAction' in effect) {
    const effectActions = toArray(effect.useAction);

    effect.useAction = [];
    for (const [index, rawlinkedAction] of effectActions.entries()) {
      if (typeof rawlinkedAction === 'string') { // ref
        effect.useAction.push(memberActions[rawlinkedAction]);
      } else { // inline action object
        effect.useAction.push(toNormalizedAction(rawlinkedAction, {
          gameId,
          ownerId,
          category: `${sourceId}:effect${effectIndex}`,
          actionIndex: index,
          teamSize: memberIds.length,
          weaponRank,
        }));
      }
    }

    if (effect.use?.when === 'interval') {
      effect.useCooldown ??= 1000;
    }
  }

  if (effect.rankMods) {
    resolveRankMods(effect, memberRank);
  }

  return effect;
};

export const normalizeEffects = (gameId, member, spec) => {
  const { memberIds, teamActions } = spec;
  const {
    id: memberId, rank: memberRank,
    weaponId, weaponRank,
    setCounts, mainEcho,
  } = member;

  const ctx = {
    member,
    character: CHARACTER[gameId][memberId],
    weapon: WEAPON[gameId][weaponId],
    echo: ECHO[mainEcho],
  };

  const isEnabled = createIsEnabled(ctx);

  const toNormalize = [
    {
      sourceType: 'character',
      id: memberId,
      rawEffects: ctx.character.effects,
    },
    {
      sourceType: 'weapon',
      id: weaponId,
      rawEffects: ctx.weapon.effects,
    },
    ...Object.keys(setCounts).map((setId) => ({
      sourceType: 'set',
      id: setId,
      rawEffects: SET[gameId][setId].effects,
    })),
  ];

  if (ECHO[mainEcho]?.effects) {
    toNormalize.push({
      sourceType: 'echo',
      id: mainEcho,
      rawEffects: ECHO[mainEcho].effects,
    });
  }

  const normalized = {};

  for (const { sourceType, id, rawEffects } of toNormalize) {
    if (
      sourceType === 'weapon' &&
      ctx.character.type !== ctx.weapon.type
    ) continue;

    for (const [index, rawEffect] of rawEffects.entries()) {
      if (!isEnabled(rawEffect, id)) continue;

      const effect = toNormalizedEffect(rawEffect, {
        gameId,
        ownerId: memberId,
        sourceId: id,
        effectIndex: index,
        memberRank,
        weaponRank,
        memberIds,
        memberActions: teamActions[memberId],
      });

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
  }

  return normalized;
};
