import { toMergedObj } from '@/utils';
import { runCommands } from '../effects/commands';
import { runApplyEffect } from '../effects';
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

        runApplyEffect(ctx, effect, apply, { applier: responseOwnerId });

        if (apply.commands) {
          runCommands(ctx, effect, apply.commands);
        }
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
