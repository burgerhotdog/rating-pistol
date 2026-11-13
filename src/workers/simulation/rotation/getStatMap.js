import { GI, WW } from '@/data';
import { getAttr, toMergedObj, resolveSpecs } from '@/utils';
import { getEffectStates } from './getEffectStates';
import { getBuffRuleMult } from './rules';

export const getBuffMap = (ctx, options = {}) => {
  // snapshot: 'frozen' skips buffs flagged `snapshot: false`; 'live' includes only those
  const { memberId, action = {}, ignoreSpecs, resolveNow, snapshot } = options;
  const { gameId } = ctx.cache;
  const buildMap = ctx.buildMaps[memberId] ?? {};
  const buffMap = {};
  const buffSpecs = [];

  function addToBuffSpecs(buff, buffMult) {
    const { specs = {} } = buff;

    buffSpecs.push({ specs, buffMult });
  };

  function getSpecsSourceMap(memberId) {
    const buildMap = ctx.buildMaps[memberId];
    const { buffMap } = getBuffMap(ctx, { memberId, ignoreSpecs: true });
    return toMergedObj(buildMap, buffMap);
  }

  for (const { effect, stacks, buffCooldown, store } of getEffectStates(ctx, { member: memberId, type: 'buff' })) {
    if (buffCooldown) continue;

    // Global effects (enemy debuffs) are never snapshotted
    const isGlobal = store === ctx.states.globalEffects;

    // Only the first buff whose filter passes is used
    const buff = effect.buff.find((candidate) => {
      const isLiveOnly = candidate.snapshot === false || isGlobal;
      if (snapshot === 'frozen' && isLiveOnly) return false;
      if (snapshot === 'live' && !isLiveOnly) return false;

      if (candidate.field) {
        const ownerField = effect.ownerId === ctx.states.onFieldId ? 'onField' : 'offField';
        if (candidate.field !== ownerField) return false;
      }

      return ctx.eventFilter(candidate.filter, effect.ownerId, { action }, memberId);
    });
    if (!buff) continue;

    const buffMult = stacks * (effect.chance ?? 1) * (getBuffRuleMult(ctx, buff.rule) ?? 1);

    if (buff.stats) {
      for (const stat in buff.stats) {
        buffMap[stat] = (buffMap[stat] ?? 0) + buff.stats[stat] * buffMult;
      }
    }

    if (buff.specs && !ignoreSpecs) {
      // Specs normally scale off the effect owner's stat map, but specsSource: '$storeOwner'
      // flags buffs (e.g. Pact of Neonlight Leap) that should scale off the recipient instead
      const specsOwnerId = buff.specsSource === '$storeOwner' ? memberId : effect.ownerId;

      if (specsOwnerId === ctx.specId && !resolveNow) {
        addToBuffSpecs(buff, buffMult);
        continue;
      }

      const resolvedStatMap = resolveSpecs(buff.specs, getSpecsSourceMap(specsOwnerId));

      for (const stat in resolvedStatMap) {
        buffMap[stat] = (buffMap[stat] ?? 0) + resolvedStatMap[stat] * buffMult;
      }
    }
  }

  if (snapshot === 'live') {
    return { buffMap, buffSpecs };
  }

  if (gameId === GI) {
    const { superconduct, stellarConduct, stellarSwirl } = ctx.states.aura;
    if (superconduct || stellarConduct) {
      buffMap['physicalResReduction%'] = (buffMap['physicalResReduction%'] ?? 0) + 0.4;
    }

    if (stellarConduct) {
      const { bonus } = stellarConduct;
      buffMap['cryoDmgBonus%'] = (buffMap['cryoDmgBonus%'] ?? 0) + bonus;
      buffMap['electroDmgBonus%'] = (buffMap['electroDmgBonus%'] ?? 0) + bonus;
    }

    if (stellarSwirl?.wanderingVortex) {
      buffMap['anemoResReduction%'] = (buffMap['anemoResReduction%'] ?? 0) + 0.35;
    }
  }

  if (gameId === WW) {
    const { havocBane } = ctx.states.negativeStatuses;
    if (havocBane) {
      const { stacks } = havocBane;
      buffMap['defReduction%'] = (buffMap['defReduction%'] ?? 0) + 0.02 * stacks;
    }

    const tuneStrainStacks = ctx.states.tune.interferedStacks;
    if (tuneStrainStacks) {
      const tuneBreakBoost = getAttr('tuneBreakBoost', toMergedObj(buildMap, buffMap));

      buffMap['vuln%'] = (buffMap['vuln%'] ?? 0) + tuneStrainStacks * tuneBreakBoost * 0.0012;
    }
  }

  return { buffMap, buffSpecs };
};
