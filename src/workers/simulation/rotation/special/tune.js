import { getAttr, toMergedObj } from '@/utils';
import { getDefMult } from '../formula/enemyDef';
import { getResMult } from '../formula/enemyRes';
import { getBuffMap } from '../getStatMap';
import { getEffectStates } from '../getEffectStates';

const LEVEL_MODIFIER = 716.22;
const ENEMY_TYPE_MODIFIER = 14;

const tuneBreakAction = {
  id: 'other:tuneBreak',
  ownerId: 'other',
  damageType: 'tuneBreak',
  element: 'physical',
  attr: 'tuneAmp',
};

export const runTuneFormula = (gameId, statMap, tuneAmp, element) => {
  const defMult = getDefMult(gameId, statMap);
  const resMult = getResMult(gameId, element, statMap);
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
    const buffsOwner = action?.ownerId ?? ctx.states.onFieldId;
    const buildMap = ctx.buildMaps[buffsOwner];
    const { buffMap } = getBuffMap(ctx, { memberId: buffsOwner, action, ignoreSpecs: true });
    const statMap = toMergedObj(buildMap, buffMap);

    const tuneAmp = action?.damage?.compressed?.mvs?.tuneAmp ?? 16;
    const element = action?.damage?.element ?? 'physical';
    const damage = runTuneFormula(ctx.cache.gameId, statMap, tuneAmp, element);

    return {
      ...(action ?? tuneBreakAction),
      ...(action && 'damage' in action &&
        { damageType: action.damage.type }),
      ...(action &&
        { field: ctx.states.getField(action.ownerId) }),
      damage: damage * timesPerRotation,
      runtime: ctx.states.runtime,
    };
  };

  // Tune break
  ctx.snapshots.push(buildSnapshot());

  // Tune response
  const { shifting } = ctx.states.tune;
  if (shifting !== 'tuneRupture' && shifting !== 'hack') return;
  for (const state of getEffectStates(ctx, { member: 'all', type: 'action' })) {
    const { effect: { use = {} } } = state;
    if (
      use.when !== 'tuneResponse' ||
      use.filter?.states?.tune?.interfered !== shifting
    ) continue;

    ctx.snapshots.push(buildSnapshot(use.action[0]));
    state.useCooldown = 8000;
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
    if (tune.offTuneCooldown <= 0) delete tune.offTuneCooldown;
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
