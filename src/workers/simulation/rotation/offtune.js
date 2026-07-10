import { getAttr } from '@/utils';
import { getCurrentStatMap, getCurrentEnemyMap } from './getCurrent';
import { isOnCooldown, setCooldown } from './cooldowns';
import { applyEffect } from './effects';

const levelModifier = 716.22;
const enemyTypeModifier = 14;

const tuneBreakDamage = (ctx, tuneAmpMv, enemyStatMap, statMap, element = 'physical') => {
  const { getDefMult, getResMult } = ctx.helpers;
  const baseDmg = levelModifier * tuneAmpMv;
  const defMult = getDefMult(enemyStatMap, statMap);
  const resMult = getResMult(element, enemyStatMap, statMap);

  const tuneBreakBoostMult = 1 + (getAttr('tuneBreakBoost', statMap) / 100);

  const damageValue =
    baseDmg *
    defMult * enemyTypeModifier * resMult *
    tuneBreakBoostMult;

  return damageValue;
};

const buildTuneBreakFootprints = (ctx, currentStatMap, shifting) => {
  const enemyStatMap = getCurrentEnemyMap(ctx);

  const footprints = [{
    key: `other:tuneBreak`,
    ownerId: 'other',
    type: 'damage',
    dmgType: 'tuneBreak',
    fixed: tuneBreakDamage(ctx, 16, enemyStatMap, currentStatMap),
  }];

  if (shifting) {
    for (const member of Object.values(ctx.cache.member)) {
      if (!('tuneResponse' in member)) continue;
      const { dmgType, element, compressed } = member.tuneResponse;

      if (dmgType !== shifting) continue;
      const { mv } = Object.values(compressed)[0];

      const responseStatMap = getCurrentStatMap(ctx, member.id);

      footprints.push({
        key: `${member.id}:tuneResponse`,
        ownerId: member.id,
        type: 'damage',
        dmgType,
        fixed: tuneBreakDamage(ctx, mv['tuneAmp'], enemyStatMap, responseStatMap, element),
      });
    }
  }

  return footprints;
}; 

export function applyTune(ctx, action) {
  const { state, onFieldId } = ctx;
  const { offTune } = state;

  if ('shiftTune' in action) {
    offTune.shifting = action.shiftTune;
  }

  if ('cooldown' in offTune) return;

  const currStatMap = getCurrentStatMap(ctx, onFieldId);
  const buildupRateMult = getAttr('offTuneBuildupRate%', currStatMap);
  offTune.level += 10 * buildupRateMult;

  if (offTune.level >= 150) {
    offTune.cooldown = 4000;
    offTune.level = 0;
    
    if (ctx.recordFootprint) {
      const footprints = buildTuneBreakFootprints(ctx, currStatMap, offTune.shifting);
      ctx.footprints.push(...footprints);
    }

    if (offTune.shifting) {
      offTune.interfered = offTune.shifting;
      offTune.duration = 8000;
    }

    for (const effect of ctx.cache.special) {
      if (effect.applyOnSpecial !== 'tuneBreak') continue;
      if (isOnCooldown(state.cooldowns, 'apply', effect.key)) continue;

      applyEffect(ctx.state.debuffs, effect);

      if (effect.applyCooldown) {
        setCooldown(state.cooldowns, 'apply', effect.key, effect.applyCooldown);
      }
    }
  }
}

export function advanceTune(ctx, elapsed) {
  const { state } = ctx;
  const { offTune } = state;

  if (offTune.cooldown) {
    offTune.cooldown -= elapsed;

    if (offTune.cooldown <= 0) {
      delete offTune.cooldown;
    }
  }

  if (offTune.duration) {
    offTune.duration -= elapsed;

    if (offTune.duration <= 0) {
      delete offTune.interfered;
      delete offTune.duration;
    }
  }
}
