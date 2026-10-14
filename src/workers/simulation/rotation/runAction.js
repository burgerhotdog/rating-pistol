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

function handleHealing(ctx, action, sharedSnapshot) {
  if (!action.healing) return;

  for (const target of action.healing.targets) {
    const targetId = getTargetId(ctx, target);

    const value = convertHealingToValue(ctx, sharedSnapshot, targetId);

    if (ctx.cache.gameId === GI) {
      changeBondOfLife(ctx, targetId, -value);
    }

    updateHealth(ctx, action, targetId, { value });

    ctx.runEffects('healed', { ownerId: targetId });
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
    ctx.runEffects('tuneBreak', modifiedAction);
    return;
  }

  // Action timeline
  ctx.runEffects('start', modifiedAction);
  advanceTimeTo(hitOffsets[0]);

  let verdantDewMultiplier = 1;
  if (gameId === GI && modifiedAction.verdantDew && ctx.cache.lunarBloom) {
    verdantDewMultiplier = consumeVerdantDew(ctx, modifiedAction.verdantDew);
  }

  let sharedSnapshot;
  if (canSnapshot(modifiedAction)) {
    if (ctx.saveSnapshots || modifiedAction.healing) {
      sharedSnapshot = buildSnapshot(ctx, modifiedAction, options);
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

  ctx.runEffects('inflict', modifiedAction);

  for (const offset of hitOffsets) {
    advanceTimeTo(offset);

    let rxnScaleMult = 1;
    let rxnScaleFlat = 0;
    if (gameId === GI) {
      const { scaleMult, scaleFlat } = applyGauge(ctx, modifiedAction) ?? {};
      rxnScaleMult = scaleMult;
      rxnScaleFlat = scaleFlat;
    }

    if (sharedSnapshot && ctx.saveSnapshots) {
      ctx.snapshots.push({
        ...sharedSnapshot,
        runtime: sharedSnapshot.runtime + actionRuntime - hitOffsets[0],
        unresolved: {
          ...sharedSnapshot.unresolved,
          scale: rxnScaleMult,
          scaleFlat: rxnScaleFlat,
          dew: verdantDewMultiplier,
        },
      });
    }

    handleHealth(ctx, modifiedAction);

    handleHealing(ctx, modifiedAction, sharedSnapshot);
    handleShield(ctx, modifiedAction);

    if (gameId === GI) {
      tryNightsoulBurst(ctx, modifiedAction);
    }

    ctx.runEffects('hit', modifiedAction);
  }

  advanceTimeTo(duration);
  ctx.runEffects('end', modifiedAction);
}
