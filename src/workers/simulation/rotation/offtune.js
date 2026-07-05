import { getAttr } from '@/utils';
import { getCurrentStatMap, getCurrentEnemyStatMap } from './getCurrentStatMap';
import { isOnCooldown, setCooldown } from './cooldowns';
import { applyEffect } from './effect';

const levelModifier = 716.22;
const enemyTypeModifier = 14;

const tuneBreakDamage = (tuneAmp, enemyStatMap, statMap) => {
  const tuneBreakBoostMult = 1 + getAttr('tuneBreakBoost', statMap) / 100;
  return levelModifier * tuneAmp * 0.5 * enemyTypeModifier * 0.9 * tuneBreakBoostMult;
};

const buildTuneBreakFootprints = (ctx, currentStatMap, shifting) => {
  const enemyStatMap = getCurrentEnemyStatMap(ctx);

  const footprints = [{
    key: `other:tuneBreak`,
    ownerId: 'other',
    type: 'damage',
    dmgType: 'tuneBreak',
    fixed: tuneBreakDamage(16, enemyStatMap, currentStatMap),
  }];

  if (shifting) {
    for (const member of Object.values(ctx.cache.member)) {
      if (!('tuneResponse' in member)) continue;
      const { id, tuneResponse } = member;
      if (!('compressed' in tuneResponse)) continue;

      const { dmgType, compressed } = tuneResponse;
      if (dmgType !== shifting) continue;
      const { mv } = Object.values(compressed)[0];

      const responseStatMap = getCurrentStatMap(ctx, member.id);

      footprints.push({
        key: `${id}:tuneResponse`,
        ownerId: id,
        type: 'damage',
        dmgType,
        fixed: tuneBreakDamage(mv['tuneAmp'], enemyStatMap, responseStatMap),
      });
    }
  }

  return footprints;
}; 

export function applyTune(ctx, action) {
  const { offTuneState, onFieldId } = ctx;

  if ('shiftTune' in action) {
    offTuneState.shifting = action.shiftTune;
  }

  if ('cooldown' in offTuneState) return;

  const currStatMap = getCurrentStatMap(ctx, onFieldId);
  const buildupRateMult = getAttr('offTuneBuildupRate%', currStatMap);
  offTuneState.level += 10 * buildupRateMult;

  if (offTuneState.level >= 150) {
    offTuneState.cooldown = 4000;
    offTuneState.level = 0;
    
    if (ctx.recordFootprint) {
      const footprints = buildTuneBreakFootprints(ctx, currStatMap, offTuneState.shifting);
      ctx.footprints.push(...footprints);
    }

    if (offTuneState.shifting) {
      offTuneState.interfered = offTuneState.shifting;
      offTuneState.duration = 8000;
    }

    for (const effect of ctx.cache.special) {
      if (effect.applyOnSpecial !== 'tuneBreak') continue;
      if (isOnCooldown(ctx, 'apply', effect.key)) continue;

      applyEffect(ctx.enemyState.stat, effect);

      if (effect.applyCooldown) {
        setCooldown(ctx, 'apply', effect.key, effect.applyCooldown);
      }
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
