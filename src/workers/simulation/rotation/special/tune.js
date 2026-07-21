import { getAttr } from '@/utils';
import { buildFootprint } from '../footprint';
import { getUsedBuffStates, resolveBuffMap } from '../getCurrent';

const tuneBreakAction = {
  key: 'other:tuneBreak',
  ownerId: 'other',
  type: 'damage',
  dmgType: 'tuneBreak',
  element: 'physical',
  attr: 'tuneAmp',
  compressed: { flat: 0, mvs: { tuneAmp: 16 }, hitCounts: 1 },
}

function recordTuneFootprints(ctx, tune) {
  const tuneBreaksPerLoop =
    ctx.offTuneBuildup[0] === 300
      ? 1
      : 1 / Math.ceil(300 / ctx.offTuneBuildup[1]);

  function buildTuneBreakFootprint(action, buildMap, fixedBuffMap) {
    const footprint = buildFootprint(ctx, action, buildMap, fixedBuffMap);
    if ('fixed' in footprint) {
      return { ...footprint, fixed: footprint.fixed * tuneBreaksPerLoop };
    } else {
      return { ...footprint, tuneBreaksPerLoop };
    }
  };

  // Tune break
  const buildMap = ctx.buildMaps[ctx.onFieldId];
  const usedBuffStates = getUsedBuffStates(ctx, ctx.onFieldId);
  const { fixedBuffMap } = resolveBuffMap(ctx, usedBuffStates);
  const breakFootprint = buildTuneBreakFootprint(tuneBreakAction, buildMap, fixedBuffMap);
  ctx.footprints.push(breakFootprint);

  // Early exit if not tune rupture or hack
  if (tune.shifting !== 'tuneRupture' && tune.shifting !== 'hack') return;
  
  const { memberEffects } = ctx.state;
  const tuneResponseStates = Object.values(memberEffects)
    .flatMap((stateMap) => Object.values(stateMap))
    .filter(({ effect }) =>
      effect.useWhen === 'tuneResponse' &&
      effect.useIfInterfered === tune.shifting);

  for (const effectState of tuneResponseStates) {
    const { effect } = effectState;

    const buildMap = ctx.buildMaps[effect.ownerId];
    const usedBuffStates = getUsedBuffStates(ctx, effect.ownerId);
    const { fixedBuffMap } = resolveBuffMap(ctx, usedBuffStates);
    const responseFootprint = buildTuneBreakFootprint(effect.useAction[0], buildMap, fixedBuffMap);
    ctx.footprints.push(responseFootprint);

    effectState.useCooldown = 8000;
  }
}

export function runTuneBreak(ctx) {
  const { tune } = ctx.state;

  if (!ctx.recordFootprint) { // Record offTune on first loop
    ctx.offTuneBuildup.push(tune.offTune);
  } else { // Record footprints on second loop
    recordTuneFootprints(ctx, tune);
  }

  // Early exit if tune break not available
  if (!tune.isMistune || !tune.shifting) return;

  tune.offTune = 0;
  tune.offTuneCooldown = 6000;
  delete tune.isMistune;

  tune.interfered = tune.shifting;
  switch (tune.interfered) {
    case 'tuneRupture':
      tune.interferedTimeRemaining = 8000;
      break;
    case 'tuneStrain':
      tune.interferedTimeRemaining = 30000;
      tune.interferedStacks = tune.strainAppliers.size;
      delete tune.strainAppliers;
      break;
    case 'hack':
      tune.interferedTimeRemaining = 8000;
      break;
  }
  delete tune.shifting;
  delete tune.shiftingTimeRemaining;
}

export function applyOffTuneBuildup(ctx, action, fixedBuffMap) {
  if (action.type !== 'damage') return;
  const { tune } = ctx.state;
  if (tune.isMistune || tune.offTuneCooldown) return;

  const hitCount = action.compressed.hitCount;
  const offTuneBuildupRate = (
    getAttr('offTuneBuildupRate%', ctx.buildMaps[action.ownerId]) +
    getAttr('offTuneBuildupRate%', fixedBuffMap)
  );

  tune.offTune += 10 * offTuneBuildupRate * hitCount;
  if (tune.offTune >= 300) {
    tune.offTune = 300;
    tune.isMistune = true;
  }
}

export function inflictTuneShifting(ctx, action) {
  if (!action.inflictShifting) return;
  const { tune } = ctx.state;

  tune.shifting = action.inflictShifting;
  tune.shiftingTimeRemaining = 25000;

  if (action.inflictShifting === 'tuneStrain') {
    tune.strainAppliers ??= new Set();
    tune.strainAppliers.add(action.ownerId);
  }
}

export function advanceTune(ctx, elapsed) {
  const { tune } = ctx.state;

  if (tune.offTuneCooldown) {
    tune.offTuneCooldown -= elapsed;
    if (tune.offTuneCooldown <= 0) {
      delete tune.offTuneCooldown;
    }
  }

  if (tune.shiftingTimeRemaining) {
    tune.shiftingTimeRemaining -= elapsed;
    if (tune.shiftingTimeRemaining <= 0) {
      delete tune.shifting;
      delete tune.shiftingTimeRemaining;
      delete tune.strainAppliers;
    }
  }

  if (tune.interferedTimeRemaining) {
    tune.interferedTimeRemaining -= elapsed;
    if (tune.interferedTimeRemaining <= 0) {
      delete tune.interfered;
      delete tune.interferedTimeRemaining;
      delete tune.interferedStacks;
    }
  }
}
