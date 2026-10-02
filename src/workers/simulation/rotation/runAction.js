import { GI, WW } from '@/data';
import { clamp } from '@/utils';
import { advanceEffects } from './advanceEffects';
import {
  applyGauge,
  advanceAuras,
  advanceIcdStates,
  changeBondOfLife,
  grantBondOfLife,
} from './game-specific/genshin-impact';
import {
  consumeNegativeStatuses,
  inflictNegativeStatuses,
  advanceNegativeStatuses,
  replaceNegativeStatuses,
  runTuneBreak,
  applyOffTuneBuildup,
  inflictTuneShifting,
  advanceTune,
} from './game-specific/wuthering-waves';
import {
  canSnapshot,
  buildSnapshot,
} from './snapshot';
import { getEffectStates } from './getEffectStates';
import { getModifiedAction } from './getModifiedAction';

function advanceCooldowns(ctx, elapsed) {
  const { applyCooldowns } = ctx.states;

  for (const effectKey in applyCooldowns) {
    applyCooldowns[effectKey] -= elapsed;

    if (applyCooldowns[effectKey] <= 0) {
      delete applyCooldowns[effectKey];
    }
  }
}

function decayBuffStates(ctx, action) {
  for (const state of getEffectStates(ctx, { member: action.ownerId, type: 'buff' })) {
    const { store, effect, buffCooldown } = state;

    if (buffCooldown) continue;
    const spec = {
      action,
      fieldId: action.ownerId,
    };
    if (!ctx.eventFilter(effect.buff?.filter, effect, spec)) continue;

    if (effect.buff?.cooldown) {
      state.buffCooldown = effect.buff.cooldown;
    }

    if (state.usesLeft) {
      state.usesLeft--;
      if (!state.usesLeft) {
        delete store[effect.key];
      }
    }
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

    if (gameId === GI) {
      advanceAuras(ctx, elapsed);
      advanceIcdStates(ctx, elapsed);
    }

    if (gameId === WW) {
      advanceNegativeStatuses(ctx, elapsed);
      advanceTune(ctx, elapsed);
    }

    advanceEffects(ctx, elapsed);
    advanceCooldowns(ctx, elapsed);

    actionRuntime += elapsed;

    if (ctx.saveSnapshots) {
      ctx.states.runtime += elapsed;
    }

    if (ctx.states.shielded) {
      ctx.states.shielded -= elapsed;
      if (ctx.states.shielded <= 0) {
        ctx.states.shielded = null;
      }
    }
  };

  const runEffects = (when) => ctx.runEffects(when, modifiedAction);

  if (modifiedAction.key === 'system:tuneBreak') {
    runTuneBreak(ctx, modifiedAction);
    runEffects('tuneBreak');
    return;
  }

  // Action timeline
  runEffects('start');
  advanceTimeTo(hitOffsets[0]);

  let sharedSnapshot;
  if (canSnapshot(modifiedAction)) {
    if (ctx.saveSnapshots) {
      sharedSnapshot = buildSnapshot(ctx, modifiedAction, options);
    }

    if (gameId === WW && modifiedAction.damage) {
      applyOffTuneBuildup(ctx, modifiedAction);
    }

    decayBuffStates(ctx, modifiedAction);
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

  runEffects('inflict');

  for (const offset of hitOffsets) {
    advanceTimeTo(offset);
    runEffects('hit');

    if (modifiedAction.drain) {
      runDrain(ctx, modifiedAction);
    }

    let scaleMult = 1;
    if (gameId === GI) {
      scaleMult = applyGauge(ctx, modifiedAction);
    }

    if (modifiedAction.healing) {
      for (const target of modifiedAction.healing.targets) {
        let targetId = target;
        if (targetId === '$onField') {
          targetId = ctx.states.onFieldId;
        }

        changeBondOfLife(ctx, targetId, -1);
      }
    }

    if (sharedSnapshot) {
      ctx.snapshots.push({
        ...sharedSnapshot,
        runtime: sharedSnapshot.runtime + actionRuntime - hitOffsets[0],
        unresolved: {
          ...sharedSnapshot.unresolved,
          scale: scaleMult,
        },
      });
    }

    if (modifiedAction.shield) {
      const { duration = 0 } = modifiedAction.shield;
      const prev = ctx.states.shielded ?? 0;
      ctx.states.shielded = Math.max(duration, prev);
    }
  }

  advanceTimeTo(duration);
  runEffects('end');
}

function runDrain(ctx, modifiedAction) {
  const {
    targets = [modifiedAction.ownerId],
    value,
    minLimit = 0,
    maxLimit = 1,
  } = modifiedAction.drain;
  const { memberHealth } = ctx.states;

  for (const targetId of targets) {
    const prev = memberHealth[targetId];
    const next = clamp(prev - value, minLimit, maxLimit);

    if (next !== prev) {
      memberHealth[targetId] = next;
      ctx.runEffects('healthChange', modifiedAction);
    }
  }
}
