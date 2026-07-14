import { getAttr } from '@/utils';

export function applyTune(ctx, action, statMap) {
  const { tune } = ctx.state;

  if ('shiftTune' in action) {
    tune.shifting = action.shiftTune;
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
