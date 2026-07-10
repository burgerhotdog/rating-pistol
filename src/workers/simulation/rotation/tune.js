import { getAttr } from '@/utils';
import { getCurrentStatMap, getCurrentEnemyMap } from './getCurrent';
import { isOnCooldown, setCooldown } from './cooldowns';
import { applyEffect } from './effects';

const LEVEL_MODIFIER = 716.22;
const ENEMY_TYPE_MODIFIER = 14;

const tuneBreakDamage = (ctx, enemyStatMap, statMap, tuneAmp = 16, element = 'physical') => {
  const { getDefMult, getResMult } = ctx.helpers;
  const baseDmg = LEVEL_MODIFIER * tuneAmp;
  const defMult = getDefMult(enemyStatMap, statMap);
  const resMult = getResMult(element, enemyStatMap, statMap);

  const tuneBreakBoostMult = 1 + (getAttr('tuneBreakBoost', statMap) / 100);

  const damageValue =
    baseDmg *
    defMult * ENEMY_TYPE_MODIFIER * resMult *
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
    fixed: tuneBreakDamage(ctx, enemyStatMap, currentStatMap),
  }];

  if (!shifting) {
    return footprints;
  }

  // Tune response
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
      fixed: tuneBreakDamage(ctx, enemyStatMap, responseStatMap, mv['tuneAmp'], element),
    });
  }

  return footprints;
}; 

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
  const onFieldIdStatMap = getCurrentStatMap(ctx, ctx.onFieldId);

  // Record offTune
  ctx.tuneBuildup.push(tune.offTune);

  // Record on 2nd pass
  if (ctx.recordFootprint) {
    const footprints = buildTuneBreakFootprints(ctx, onFieldIdStatMap, tune.shifting);
    ctx.tuneFootprints = footprints;
  }

  console.log(tune.offTune);

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
      if (isOnCooldown(cooldowns, 'apply', effect.key)) continue;

      applyEffect(debuffs, effect);

      if ('applyCooldown' in effect) {
        setCooldown(cooldowns, 'apply', effect.key, effect.applyCooldown);
      }
    }
  }
}
