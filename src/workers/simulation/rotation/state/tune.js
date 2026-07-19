import { getAttr } from '@/utils';
import { applyEffect } from './effects';
import { buildTuneFootprint } from '../footprint';

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

export function advanceTune(tune, elapsed) {
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

export function runTuneBreak(ctx) {
  const { cooldowns, tune } = ctx.state;
  recordTuneData(ctx, tune);
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

  for (const effect of ctx.cache.effects.tuneBreak) {
    if (cooldowns[effect.key]) continue;
    applyEffect(ctx, effect);
  }
}

function recordTuneData(ctx, tune) {
  const { offTune, shifting } = tune;

  // Record offTune on first loop
  if (!ctx.recordFootprint) {
    ctx.offTuneBuildup.push(offTune);
    return;
  }

  const tuneBreaksPerLoop =
    ctx.offTuneBuildup[0] === 300
      ? 1
      : 1 / Math.ceil(300 / ctx.offTuneBuildup[1]);

  // Tune break
  const breakFootprint = buildTuneFootprint(ctx, 'tuneBreak', ctx.onFieldId);
  ctx.footprints.push({
    ...breakFootprint,
    fixed: breakFootprint.fixed * tuneBreaksPerLoop,
  });

  // Tune responses (Tune Rupture & Hack)
  if (shifting === 'tuneRupture' || shifting === 'hack') {
    for (const [memberId, memberCache] of Object.entries(ctx.cache.member)) {
      const response = memberCache[`${shifting}Response`];
      if (!response) continue;

      const responseFootprint = buildTuneFootprint(ctx, 'tuneResponse', memberId, response);
      ctx.footprints.push({
        ...responseFootprint,
        fixed: responseFootprint.fixed * tuneBreaksPerLoop,
      });
    };
  }
}
