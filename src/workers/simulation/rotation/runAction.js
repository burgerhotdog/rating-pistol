import { GI, WW } from '@/data';
import { clamp } from '@/utils';
import { applyGauge, consumeVerdantDew } from './reactions';
import {
  changeBondOfLife,
  grantBondOfLife,
} from './states/bond-of-life'
import {
  runTuneBreak,
  applyOffTuneBuildup,
  inflictTuneShifting,
} from './states/tune';
import {
  consumeNegativeStatuses,
  inflictNegativeStatuses,
  replaceNegativeStatuses,
} from './states/negative-statuses';
import { canSnapshot, buildSnapshot } from './snapshot';
import { getModifiedAction } from './getModifiedAction';
import { advanceStates } from './states';
import { runRestoreEnergy } from './restoreEnergy';
import { updateShielded } from './states/shielded';
import { decayBuffUses } from './states/effects/decayBuffUses';

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
    if (ctx.saveSnapshots) {
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
    ctx.runEffects('hit', modifiedAction);

    if (modifiedAction.drain) {
      runDrain(ctx, modifiedAction);
    }

    let rxnScaleMult = 1;
    let rxnScaleFlat = 0;
    if (gameId === GI) {
      const { scaleMult, scaleFlat } = applyGauge(ctx, modifiedAction) ?? {};
      rxnScaleMult = scaleMult;
      rxnScaleFlat = scaleFlat;
    }

    if (modifiedAction.healing) {
      for (const target of modifiedAction.healing.targets) {
        let targetId = target;
        if (targetId === '$onField') {
          targetId = ctx.states.onFieldId;
        }

        if (gameId === GI) {
          changeBondOfLife(ctx, targetId, -1);
        }
      }
    }

    if (sharedSnapshot) {
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

    updateShielded(ctx, modifiedAction);
  }

  advanceTimeTo(duration);
  ctx.runEffects('end', modifiedAction);
}

function runDrain(ctx, action) {
  const {
    targets = [action.ownerId],
    value,
    minLimit = 0,
    maxLimit = 1,
  } = action.drain;
  const { memberHealth } = ctx.states;

  for (const targetId of targets) {
    const prev = memberHealth[targetId];
    if (value > 0 && prev <= minLimit) continue;
    if (value < 0 && prev >= maxLimit) continue;

    const next = clamp(prev - value, minLimit, maxLimit);

    if (next !== prev) {
      memberHealth[targetId] = next;
      ctx.runEffects('healthChange', action);
    }
  }
}
