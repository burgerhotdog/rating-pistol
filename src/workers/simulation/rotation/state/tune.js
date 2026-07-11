import { getAttr } from '@/utils';
import { getCurrentStatMap } from '../getCurrent';
import { applyEffect } from './effects';
import { buildTuneFootprints } from '../footprint';

export function applyTune(ctx, action) {
  const { tune } = ctx.state;

  if ('shiftTune' in action) {
    tune.shifting = action.shiftTune;
  }

  if (tune.misTuned || tune.offTuneCooldown > 0) {
    return;
  }

  const statMap = getCurrentStatMap(ctx, action.ownerId);
  tune.offTune += 10 * getAttr('offTuneBuildupRate%', statMap);

  if (tune.offTune >= 300) {
    tune.offTune = 300;
    tune.misTuned = true;
  }
}

export function advanceTune(tune, elapsed) {
  if (tune.offTuneCooldown > 0) {
    tune.offTuneCooldown -= elapsed;

    if (tune.offTuneCooldown <= 0) {
      delete tune.offTuneCooldown;
    }
  }

  if (tune.interferedDuration) {
    tune.interferedDuration -= elapsed;

    if (tune.interferedDuration <= 0) {
      delete tune.interfered;
      delete tune.interferedDuration;
    }
  }
}

export function runTuneBreak(ctx) {
  const { cooldowns, tune, debuffs } = ctx.state;

  // Record offTune
  ctx.tuneBuildup.push(tune.offTune);

  // Record on 2nd pass
  if (ctx.recordFootprint) {
    ctx.tuneFootprints = buildTuneFootprints(ctx);
  }

  if (tune.misTuned) {  
    if (tune.shifting) {
      tune.interfered = tune.shifting;
      tune.interferedDuration = 8000;
    }

    tune.misTuned = false;
    tune.offTune = 0;
    tune.offTuneCooldown = 4000;

    for (const effect of ctx.cache.special) {
      if (effect.applyOnSpecial !== 'tuneBreak') continue;
      if (cooldowns[effect.key]) continue;

      applyEffect(debuffs, effect);

      if ('applyCooldown' in effect) {
        cooldowns[effect.key] = effect.applyCooldown;
      }
    }
  }
}
