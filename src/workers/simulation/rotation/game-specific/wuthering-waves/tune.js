import { getAttr, toMergedObj } from '@/utils';
import { onApplyDoCommand } from '../../commands';
import { runApplyEffect } from '../../effects';
import { getBuffMap } from '../../getStatMap';
import { runTuneFormula } from '../../formula/tuneFormula';

const tuneBreakAction = {
  id: 'system:tuneBreak',
  ownerId: 'system',
  name: 'Tune Break',
  type: 'tuneBreak',
  damageType: 'tuneBreak',
  element: 'physical',
  attr: 'tuneAmp',
};

const calcTuneBreaksPerRotation = (ctx) => {
  const [offTuneAtFirstBreak, offTuneAfterFullRotation] = ctx.offTuneBuildup;
  if (offTuneAtFirstBreak === 300) {
    return 1;
  }

  return 1 / Math.ceil(300 / offTuneAfterFullRotation);
};

function recordTuneBreak(ctx) {
  const timesPerRotation = calcTuneBreaksPerRotation(ctx);

  const buildSnapshot = (action) => {
    const buffsOwner = action?.ownerId ?? ctx.states.onFieldId;
    const buildMap = ctx.buildMaps[buffsOwner];
    const { buffMap } = getBuffMap(ctx, { memberId: buffsOwner, action, ignoreSpecs: true });
    const statMap = toMergedObj(buildMap, buffMap);

    const tuneAmp = action?.damage?.compressed?.mvs?.tuneAmp ?? 16;
    const element = action?.damage?.element ?? 'physical';
    const damage = runTuneFormula(statMap, tuneAmp, element);

    return {
      ...(action ?? tuneBreakAction),
      ...(action && action.damage && { damageType: action.damage.type }),
      damage: damage * timesPerRotation,
      onFieldId: ctx.states.onFieldId,
      runtime: ctx.states.runtime,
    };
  };

  // Tune break
  ctx.snapshots.push(buildSnapshot());

  // Tune response
  const { shifting } = ctx.states.tune;
  if (shifting !== 'tuneRupture' && shifting !== 'hack') return;

  for (const responseOwnerId in ctx.cache.member) {
    const { [`${shifting}Response`]: tuneResponse } = ctx.cache.member[responseOwnerId];
    if (!tuneResponse) continue;

    const snapshot = buildSnapshot(tuneResponse);
    ctx.snapshots.push(snapshot);

    const { applyCooldowns } = ctx.states;
    for (const memberId in ctx.cache.member) {
      const mCache = ctx.cache.member[memberId];

      for (const effectKey in mCache.effects) {
        const effect = mCache.effects[effectKey];
        const { apply } = effect;

        if (
          apply?.when !== 'tuneResponse' ||
          !apply.by.includes(responseOwnerId) ||
          applyCooldowns[effectKey]
        ) continue;

        onApplyDoCommand(ctx, effect, responseOwnerId);
        runApplyEffect(ctx, effect, { applier: responseOwnerId });
      }
    }
  }
}

export function runTuneBreak(ctx) {
  const { tune } = ctx.states;

  // Record offTune on first loop
  // Record snapshots on second loop
  if (!ctx.saveSnapshots) ctx.offTuneBuildup.push(tune.offTune);
  else recordTuneBreak(ctx);

  // Early exit if not inflicting tune interfered
  if (!tune.isMistune || !tune.shifting) return;

  tune.offTune = 0;
  tune.offTuneCooldown = 6000;
  delete tune.isMistune;

  tune.interfered = tune.shifting;
  switch (tune.shifting) {
    case 'tuneRupture':
    case 'hack':
      tune.interferedTimeLeft = 8000;
      break;
    case 'tuneStrain':
      tune.interferedTimeLeft = 30000;
      tune.interferedStacks = tune.strainAppliers.size;
      delete tune.strainAppliers;
      break;
  }
  if (ctx.cache.member['1510']) tune.interferedStacks += 2;
  if (ctx.cache.member['1413']) tune.interferedStacks += 1;
  delete tune.shifting;
  delete tune.shiftingTimeLeft;
}

export function applyOffTuneBuildup(ctx, action) {
  const { tune } = ctx.states;
  if (
    !action.damage ||
    tune.isMistune ||
    tune.offTuneCooldown
  ) return;

  const buildMap = ctx.buildMaps[action.ownerId];
  const { buffMap } = getBuffMap(ctx, { memberId: action.ownerId, action, ignoreSpecs: true });
  const statMap = toMergedObj(buildMap, buffMap);
  const offTuneBuildupRate = getAttr('offTuneBuildupRate%', statMap);

  const hitCount = action.damage.compressed.hitCount;

  tune.offTune += 10 * offTuneBuildupRate * hitCount;
  if (tune.offTune < 300) return;
  tune.offTune = 300;
  tune.isMistune = true;
}

export function inflictTuneShifting(ctx, action) {
  if (!action.inflict?.shifting) return;
  const { tune } = ctx.states;

  tune.shifting = action.inflict.shifting;
  tune.shiftingTimeLeft = 25000;

  if (action.inflict.shifting === 'tuneStrain') {
    tune.strainAppliers ??= new Set();
    tune.strainAppliers.add(action.ownerId);
  }
}

export function advanceTune(ctx, elapsed) {
  const { tune } = ctx.states;

  if (tune.offTuneCooldown) {
    tune.offTuneCooldown -= elapsed;
    if (tune.offTuneCooldown <= 0)
      delete tune.offTuneCooldown;
  }

  if (tune.shiftingTimeLeft) {
    tune.shiftingTimeLeft -= elapsed;
    if (tune.shiftingTimeLeft <= 0) {
      delete tune.shifting;
      delete tune.shiftingTimeLeft;
      delete tune.strainAppliers;
    }
  }

  if (tune.interferedTimeLeft) {
    tune.interferedTimeLeft -= elapsed;
    if (tune.interferedTimeLeft <= 0) {
      delete tune.interfered;
      delete tune.interferedTimeLeft;
      delete tune.interferedStacks;
    }
  }
}
