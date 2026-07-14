import { getAttr } from '@/utils';
import { applyEffect } from './effects';
import { buildTuneFootprint } from '../footprint';

export function applyTune(ctx, action, statMap) {
  const { tune } = ctx.state;

  if ('shiftTune' in action) {
    tune.shifting = action.shiftTune;
    tune.shiftingTimeRemaining = 25000;

    if (action.shiftTune === 'tuneStrain') {
      tune.shiftingStacks ??= 0;

      console.log(ctx.cache.tuneStrainMaxStacks);
      if (tune.shiftingStacks < ctx.cache.tuneStrainMaxStacks) {
        tune.shiftingStacks++;
      }
    }
  }

  if (tune.misTuned || tune.offTuneCooldown > 0) return;

  tune.offTune += 10 * getAttr('offTuneBuildupRate%', statMap);

  if (tune.offTune >= 300) {
    tune.offTune = 300;
    tune.misTuned = true;
  }
}

export function advanceTune(tune, elapsed) {
  if (tune.shiftingTimeRemaining) {
    tune.shiftingTimeRemaining -= elapsed;

    if (tune.shiftingTimeRemaining <= 0) {
      delete tune.shiftingTimeRemaining;
      delete tune.shifting;
    }
  }

  if (tune.offTuneCooldown) {
    tune.offTuneCooldown -= elapsed;

    if (tune.offTuneCooldown <= 0) {
      delete tune.offTuneCooldown;
    }
  }

  if (tune.interferedTimeRemaining) {
    tune.interferedTimeRemaining -= elapsed;

    if (tune.interferedTimeRemaining <= 0) {
      delete tune.interferedTimeRemaining;
      delete tune.interfered;
    }
  }
}

export function runTuneBreak(ctx) {
  const { cooldowns, tune, debuffs } = ctx.state;
  recordTuneData(ctx, tune);

  if (!tune.misTuned) return;

  if (tune.shifting) {
    tune.interfered = tune.shifting;
    delete tune.shifting;

    tune.interferedTimeRemaining =
      tune.interfered === 'tuneStrain'
        ? 30000
        : 8000;
    delete tune.shiftingTimeRemaining;

    if (tune.shiftingStacks) {
      tune.interferedStacks = tune.shiftingStacks;
      delete tune.shiftingStacks;
    }
  }

  tune.misTuned = false;
  tune.offTune = 0;
  tune.offTuneCooldown = 4000;

  for (const effect of ctx.cache.special) {
    if (
      effect.applyOnSpecial !== 'tuneBreak' ||
      cooldowns[effect.key]
    ) continue;

    applyEffect(debuffs, effect);

    if ('applyCooldown' in effect) {
      cooldowns[effect.key] = effect.applyCooldown;
    }
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
