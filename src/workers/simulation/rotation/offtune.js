import { getAttr } from '@/utils';
import { getCurrentStatMap, getCurrentEnemyStatMap } from './getCurrentStatMap';

const levelModifier = 716.22;
const enemyTypeModifier = 14;

const tuneBreakDamage = (tuneAmp, enemyStatMap, statMap) => {
  const tuneBreakBoostMult = 1 + getAttr('tuneBreakBoost%', statMap);
  return levelModifier * tuneAmp * 0.5 * enemyTypeModifier * 0.9 * tuneBreakBoostMult;
};

const buildTuneBreakFootprints = (ctx, memberId, shifting) => {
  const enemyStatMap = getCurrentEnemyStatMap(ctx);
  const currentStatMap = getCurrentStatMap(ctx, memberId);

  const footprints = [{
    key: `other:tuneBreak`,
    ownerId: 'other',
    type: 'damage',
    dmgType: 'tuneBreak',
    fixed: tuneBreakDamage(16, enemyStatMap, currentStatMap),
  }];

  if (shifting === 'tuneRupture') {
    for (const member of Object.values(ctx.cache.member)) {
      if (!('tuneResponse' in member)) continue;
      const { id, tuneResponse } = member;
      if (!('compressed' in tuneResponse)) continue;

      const { dmgType, compressed } = tuneResponse;
      const { mv } = Object.values(compressed)[0];

      footprints.push({
        key: `${id}:tuneResponse`,
        ownerId: id,
        type: 'damage',
        dmgType,
        fixed: tuneBreakDamage(mv['tuneAmp'], enemyStatMap, currentStatMap),
      });
    }
  }

  return footprints;
}; 

export function applyTune(ctx, action) {
  const { offTuneState } = ctx;
  if (offTuneState.cooldown) return;

  if ('shiftTune' in action) {
    offTuneState.shifting = action.shiftTune;
  }

  const currStatMap = getCurrentStatMap(ctx, action.ownerId);
  const buildupRateMult = 1 + getAttr('offtuneBuildupRate%', currStatMap);

  offTuneState.level += 10 * buildupRateMult;

  if (offTuneState.level >= 150) {
    offTuneState.cooldown = 4000;
    offTuneState.level = 0;
    
    if (ctx.recordFootprint) {
      const footprints = buildTuneBreakFootprints(ctx, action.ownerId, offTuneState.shifting);
      ctx.footprints.push(...footprints);
    }

    if (offTuneState.shifting) {
      offTuneState.interfered = offTuneState.shifting;
      offTuneState.duration = 8000;
    }            
  }
}

export function advanceTune(ctx, elapsed) {
  const { offTuneState } = ctx;

  if (offTuneState.cooldown) {
    offTuneState.cooldown -= elapsed;

    if (offTuneState.cooldown <= 0) {
      delete offTuneState.cooldown;
    }
  }

  if (offTuneState.duration) {
    offTuneState.duration -= elapsed;

    if (offTuneState.duration <= 0) {
      delete offTuneState.interfered;
      delete offTuneState.duration;
    }
  }
}
