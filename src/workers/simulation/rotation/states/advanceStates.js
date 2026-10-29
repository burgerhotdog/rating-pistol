import { GI, WW, ZZZ } from '@/data';
import { advanceIcds } from './icd';
import { getAuraBoundary, advanceAuraTimers, fireAuraTicks } from './aura';
import {
  getNegativeStatusBoundary,
  advanceNegativeStatusTimers,
  fireNegativeStatusTicks,
} from './negative-statuses';
import { getTuneBoundary, advanceTuneTimers } from './tune';
import {
  getEffectBoundary,
  advanceEffectTimers,
  fireEffectUses,
  fireEffectExpiries,
} from './effects';
import { advanceCooldowns } from './cooldowns';
import { advanceShielded } from './shielded';
import { advanceDaze } from './daze';

const getBoundary = (ctx) => {
  const { gameId } = ctx.cache;
  let boundary = getEffectBoundary(ctx);

  if (gameId === GI) {
    boundary = Math.min(boundary, getAuraBoundary(ctx));
  }

  if (gameId === WW) {
    boundary = Math.min(
      boundary,
      getNegativeStatusBoundary(ctx),
      getTuneBoundary(ctx),
    );
  }

  return boundary;
};

// Advances every timer by the same step so anything firing at the end of
// the step observes a consistent state
const advanceTimers = (ctx, step) => {
  const { gameId } = ctx.cache;

  if (gameId === GI) {
    advanceAuraTimers(ctx, step);
    advanceIcds(ctx, step);
  }

  if (gameId === WW) {
    advanceNegativeStatusTimers(ctx, step);
    advanceTuneTimers(ctx, step);
  }

  if (gameId === ZZZ) {
    advanceDaze(ctx, step);
  }

  advanceEffectTimers(ctx, step);
  advanceCooldowns(ctx, step);
  advanceShielded(ctx, step);
};

const fireDue = (ctx) => {
  const { gameId } = ctx.cache;

  if (gameId === WW) fireNegativeStatusTicks(ctx);
  if (gameId === GI) fireAuraTicks(ctx);

  fireEffectUses(ctx);
  fireEffectExpiries(ctx);
};

export const advanceStates = (ctx, elapsed) => {
  if (!elapsed) return;
  const { states, saveSnapshots } = ctx;

  // Interval effects that are already off cooldown fire before time passes
  fireDue(ctx);

  let remaining = elapsed;

  while (remaining > 0) {
    const step = Math.min(remaining, getBoundary(ctx));

    advanceTimers(ctx, step);
    remaining -= step;

    if (saveSnapshots) {
      states.runtime += step;
    }

    fireDue(ctx);
  }
};
