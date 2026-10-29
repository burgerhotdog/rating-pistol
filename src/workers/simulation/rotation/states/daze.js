import { getAttr, toMergedObj } from '@/utils';
import { getBuffMap } from '../getStatMap';

const DAZE_GAUGE = 6000;
const STUN_DURATION = 12000;
const STUN_MULTIPLIER = 0.5;

export function handleDaze(ctx, action, dazeSnapshot) {
  if (!action.daze || ctx.states.daze.stunned) return;

  const prev = ctx.states.daze.gauge;
  const actionDaze = 0;

  const next = prev + actionDaze;

  if (next < DAZE_GAUGE) {
    ctx.states.daze.gauge = next;
    return;
  }

  ctx.states.daze.gauge = 0;
  ctx.states.daze.stunned = true;
  ctx.states.daze.stunnedTimeLeft = STUN_DURATION;
}

export function advanceDaze(ctx, elapsed) {
  if (!ctx.states.daze.stunned) return;

  const dazeState = ctx.states.daze;

  dazeState.stunnedTimeLeft = Math.max(dazeState.stunnedTimeLeft - elapsed, 0);

  if (dazeState.stunnedTimeLeft <= 0) {
    dazeState.stunned = false;
  }
}

export function calcStunMult(ctx, action) {
  if (!ctx.states.daze.stunned) return 1;

  const { buffMap } = getBuffMap(ctx, { memberId: action.ownerId, resolveNow: true });
  const statMap = toMergedObj(ctx.buildMaps[action.ownerId], buffMap);

  return 1 + STUN_MULTIPLIER + getAttr('stunMultiplier%', statMap);
}
