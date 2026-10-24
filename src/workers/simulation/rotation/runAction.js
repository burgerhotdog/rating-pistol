import { GI, WW } from '@/data';
import { applyGauge, consumeVerdantDew } from './reactions';
import {
  advanceStates,
  decayBuffUses,
  updateHealth,
  updateShielded,
  changeBondOfLife,
  getTargetId,
  grantBondOfLife,
  tryNightsoulBurst,
  updateNightsoulPoints,
  consumeNegativeStatuses,
  inflictNegativeStatuses,
  replaceNegativeStatuses,
  runTuneBreak,
  applyOffTuneBuildup,
  inflictTuneShifting,
  convertHealingToValue,
} from './states'
import { canSnapshot, buildSnapshot } from './snapshot';
import { getModifiedAction } from './getModifiedAction';
import { runRestoreEnergy } from './restoreEnergy';

function handleHealing(ctx, action, healingSnapshot) {
  if (!action.healing) return;

  const foamState = ctx.states.gameRule.oceanHuedClam;
  const isFoamOwner = foamState?.ownerId === action.ownerId;

  for (const target of action.healing.targets) {
    const targetId = getTargetId(ctx, target);

    const { healing, value } = convertHealingToValue(ctx, healingSnapshot, targetId);

    if (isFoamOwner && healing > 0) {
      foamState.value = Math.min(foamState.value + healing, 30000);
    }

    if (ctx.cache.gameId === GI) {
      changeBondOfLife(ctx, targetId, -value);
    }

    updateHealth(ctx, action, targetId, { value });

    ctx.runEffects('healed', { ...action, ownerId: targetId });
  }
}

function handleShield(ctx, action) {
  if (!action.shield) return;

  updateShielded(ctx, action.shield);
}

function handleHealth(ctx, action) {
  if (!action.health) return;

  for (const target of action.health.targets) {
    const targetId = getTargetId(ctx, target);
    updateHealth(ctx, action, targetId, action.health);
  }
}

export function runAction(ctx, action, options = {}) {
  const { noDuration } = options;
  const { gameId } = ctx.cache;
  const modifiedAction = getModifiedAction(ctx, action);
  const runEffectsWhen = (when) => ctx.runEffects(when, modifiedAction);
  const { duration = 0, hitOffsets = [0] } = modifiedAction;
  let actionRuntime = 0;

  function advanceTimeTo(timestamp) {
    if (noDuration) return;

    const elapsed = timestamp - actionRuntime;
    if (elapsed <= 0) return;

    advanceStates(ctx, elapsed);
    actionRuntime += elapsed;
  };

  if (modifiedAction.key === 'system:tuneBreak') {
    runTuneBreak(ctx, modifiedAction);
    runEffectsWhen('tuneBreak');
    return;
  }

  // Action timeline
  runEffectsWhen('start');
  advanceTimeTo(hitOffsets[0]);

  runEffectsWhen('use');

  let verdantDewMultiplier = 1;
  if (gameId === GI && modifiedAction.verdantDew && ctx.cache.lunarBloom) {
    verdantDewMultiplier = consumeVerdantDew(ctx, modifiedAction.verdantDew);
  }

  let damageSnapshot;
  let healingSnapshot;
  let shieldSnapshot;
  if (canSnapshot(modifiedAction)) {
    if (modifiedAction.damage && ctx.saveSnapshots) {
      damageSnapshot = buildSnapshot(ctx, modifiedAction, 'damage', options);
    }

    // Built even when snapshots aren't saved; the live heal is converted from it below
    if (modifiedAction.healing) {
      healingSnapshot = buildSnapshot(ctx, modifiedAction, 'healing', options);
    }

    if (modifiedAction.shield && ctx.saveSnapshots) {
      shieldSnapshot = buildSnapshot(ctx, modifiedAction, 'shield', options);
    }

    if (gameId === WW && modifiedAction.damage) {
      applyOffTuneBuildup(ctx, modifiedAction);
    }

    decayBuffUses(ctx, modifiedAction);
  }

  if (ctx.saveSnapshots) {
    runRestoreEnergy(ctx, modifiedAction);
  }

  if (gameId === GI) {
    grantBondOfLife(ctx, modifiedAction);
    updateNightsoulPoints(ctx, modifiedAction);
  }

  if (gameId === WW) {
    consumeNegativeStatuses(ctx, modifiedAction);
    inflictNegativeStatuses(ctx, modifiedAction);
    replaceNegativeStatuses(ctx, modifiedAction);
    inflictTuneShifting(ctx, modifiedAction);
  }

  runEffectsWhen('inflict');

  for (const [i, offset] of hitOffsets.entries()) {
    advanceTimeTo(offset);

    let rxnScaleMult = 1;
    let rxnScaleFlat = 0;
    if (gameId === GI) {
      const { scaleMult, scaleFlat } = applyGauge(ctx, modifiedAction) ?? {};
      rxnScaleMult = scaleMult;
      rxnScaleFlat = scaleFlat;
    }

    if (damageSnapshot && ctx.saveSnapshots) {
      ctx.snapshots.push({
        ...damageSnapshot,
        runtime: damageSnapshot.runtime + actionRuntime - hitOffsets[0],
        unresolved: {
          ...damageSnapshot.unresolved,
          scale: rxnScaleMult,
          scaleFlat: rxnScaleFlat,
          dew: verdantDewMultiplier,
        },
      });
    }

    // Healing/shield are a single occurrence regardless of hit count, so only
    // handle them once, on the first hit, instead of once per hit
    if (i === 0) {
      handleHealth(ctx, modifiedAction);
      handleHealing(ctx, modifiedAction, healingSnapshot);
      handleShield(ctx, modifiedAction);

      if (ctx.saveSnapshots) {
        if (healingSnapshot) ctx.snapshots.push(healingSnapshot);
        if (shieldSnapshot) ctx.snapshots.push(shieldSnapshot);
      }
    }

    if (gameId === GI) {
      tryNightsoulBurst(ctx, modifiedAction);
    }

    runEffectsWhen('hit');
  }

  advanceTimeTo(duration);
  runEffectsWhen('end');
}
