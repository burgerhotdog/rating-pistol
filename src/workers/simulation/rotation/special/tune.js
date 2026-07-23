import { getAttr, toMergedObj } from '@/utils';
import { getDebuffMap, getBuffMap } from '../getStatMap';
import { getEffectStates } from '../getEffectStates';

const LEVEL_MODIFIER = 716.22;
const ENEMY_TYPE_MODIFIER = 14;

const tuneBreakAction = {
  key: 'other:tuneBreak',
  ownerId: 'other',
  type: 'damage',
  dmgType: 'tuneBreak',
  element: 'physical',
  attr: 'tuneAmp',
};

export const runTuneFormula = (helpers, statMap, tuneAmp, element) => {
  const { getDefMult, getResMult } = helpers;

  const defMult = getDefMult(statMap);
  const resMult = getResMult(element, statMap);
  const tuneBreakBoostMult = 1 + (getAttr('tuneBreakBoost', statMap) / 100);
  const vulnMult = 1 + getAttr('vuln%', statMap);

  return LEVEL_MODIFIER * tuneAmp *
    ENEMY_TYPE_MODIFIER *
    defMult * resMult *
    tuneBreakBoostMult *
    vulnMult;
};

const calcTuneBreaksPerRotation = (ctx) => {
  const [offTuneAtFirstBreak, offTuneAfterFullRotation] = ctx.offTuneBuildup;
  if (offTuneAtFirstBreak === 300) return 1;
  return 1 / Math.ceil(300 / offTuneAfterFullRotation);
};

function recordTuneBreak(ctx) {
  const timesPerRotation = calcTuneBreaksPerRotation(ctx);

  const buildSnapshot = (action) => {
    const { debuffMap } = getDebuffMap(ctx, { action });
    const buffsOwner = action?.ownerId ?? ctx.onFieldId;
    const buildMap = ctx.buildMaps[buffsOwner];
    const { buffMap } = getBuffMap(ctx, buffsOwner, { action, ignoreVariable: true });
    const statMap = toMergedObj(debuffMap, buildMap, buffMap);

    const tuneAmp = action?.compressed?.mvs?.tuneAmp ?? 16;
    const element = action?.element ?? 'physical';
    const damage = runTuneFormula(ctx.helpers, statMap, tuneAmp, element);

    return {
      ...(action ?? tuneBreakAction),
      value: damage * timesPerRotation,
      runtime: ctx.state.runtime,
    };
  };

  // Tune break
  ctx.snapshots.push(buildSnapshot());

  // Tune response
  const { shifting } = ctx.state.tune;
  if (shifting !== 'tuneRupture' && shifting !== 'hack') return;
  for (const effectState of getEffectStates(ctx, {
    member: 'all',
    type: 'action',
  })) {
    const { effect } = effectState;
    if (
      effect.useWhen !== 'tuneResponse' ||
      effect.useIfInterfered !== shifting
    ) continue;

    ctx.snapshots.push(buildSnapshot(effect.useAction[0]));
    effectState.useCooldown = 8000;
  }
}

export function runTuneBreak(ctx) {
  const { tune } = ctx.state;

  if (!ctx.saveSnapshots) { // Record offTune on first loop
    ctx.offTuneBuildup.push(tune.offTune);
  } else { // Record snapshots on second loop
    recordTuneBreak(ctx);
  }

  // Early exit if not inflicting tune interfered
  if (!tune.isMistune || !tune.shifting) return;

  tune.offTune = 0;
  tune.offTuneCooldown = 6000;
  delete tune.isMistune;

  tune.interfered = tune.shifting;
  switch (tune.shifting) {
    case 'tuneRupture':
      tune.interferedTimeLeft = 8000;
      break;
    case 'tuneStrain':
      tune.interferedTimeLeft = 30000;
      tune.interferedStacks = tune.strainAppliers.size;
      delete tune.strainAppliers;
      break;
    case 'hack':
      tune.interferedTimeLeft = 8000;
      break;
  }
  delete tune.shifting;
  delete tune.shiftingTimeLeft;
}

export function applyOffTuneBuildup(ctx, action) {
  const { tune } = ctx.state;
  if (
    action.type !== 'damage' ||
    tune.isMistune ||
    tune.offTuneCooldown
  ) return;

  const { debuffMap } = getDebuffMap(ctx, { action });
  const buildMap = ctx.buildMaps[action.ownerId];
  const { buffMap } = getBuffMap(ctx, action.ownerId, { action, ignoreVariable: true });
  const statMap = toMergedObj(debuffMap, buildMap, buffMap);
  const offTuneBuildupRate = getAttr('offTuneBuildupRate%', statMap);

  const hitCount = action.compressed.hitCount;

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
  tune.shiftingTimeLeft = 25000;

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
