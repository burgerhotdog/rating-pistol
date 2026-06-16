import { matchIfInflict, matchUseOn, matchRemoveOn, matchUseIf, matchRemoveIf, matchApplyIf } from '../match';
import { buildFootprint, evaluateFootprint } from './footprint';
import { isOnCooldown, setCooldown, advanceCooldowns, resetCooldowns } from './cooldowns';

const MAX_PROC_DEPTH = 5;

function removeEffects(ctx, action) {
  const { memberState, fieldState } = ctx;

  for (const stateMap of [
    ...Object.values(memberState),
    fieldState.active,
    fieldState.inactive,
  ]) {
    for (const effectKey in stateMap) {
      const { effect } = stateMap[effectKey];
      if (effect.ownerId !== action.ownerId) continue;

      if (matchRemoveOn(action, effect) || matchRemoveIf(action, effect, ctx)) {
        delete stateMap[effectKey];
      }
    }
  }
}

function applyEffect(stateMap, effect, applyTimes) {
  const { intervalCooldown, intervalOffset } = effect;
  const currentStacks = stateMap[effect.key]?.stacks ?? 0;

  stateMap[effect.key] = {
    stacks: Math.min(currentStacks + applyTimes, effect.maxStacks),
    timeRemaining: effect.duration,
    usesRemaining: effect.maxUses,
    ...(intervalCooldown ? { procTimer: stateMap[effect.key]?.procTimer ?? intervalOffset } : {}),
    effect,
  };
}

function applyStatus(stateMap, status, stacks) {
  const tracker = stateMap[status.id];

  if (!tracker) {
    stateMap[status.id] = {
      stacks: Math.min(stacks, status.maxStacks),
      tickTimer: status.tickInterval,
      duration: status.duration,
    };
  } else {
    tracker.stacks = Math.min(tracker.stacks + stacks, status.maxStacks);
    tracker.duration = status.duration;
  }
}

function applyEffects(ctx, action, trigger, applyTimes = 1) {
  const { cache, memberState, fieldState, enemyState } = ctx;
  if (!cache.effect[action.key]) return;

  const triggered = cache.effect[action.key].filter(e => e.applyWhen === trigger);
  const inflictedStatuses = {};

  for (const effect of triggered) {
    if ('applyIfInflict' in effect) continue;
    if (isOnCooldown('apply', effect.key)) continue;
    if (!matchApplyIf(action, effect, ctx)) continue;

    for (const target of effect.applyTo) {
      if (target in cache.member) {
        applyEffect(memberState[target], effect, applyTimes);
      } else if (target === 'active' || target === 'inactive') {
        applyEffect(fieldState[target], effect, applyTimes);
      } else {
        if ('statMap' in effect) {
          applyEffect(enemyState.stat, effect, applyTimes);
        }

        if ('statusMap' in effect) {
          for (const statusId in effect.statusMap) {
            const status = cache.data.misc.STATUSES[statusId];
            const stacks = effect.statusMap[statusId] * applyTimes;

            applyStatus(enemyState.status, status, stacks)

            inflictedStatuses[statusId] ??= 0;
            inflictedStatuses[statusId] += stacks;
          }
        }
      }
    }

    if (effect.applyCooldown) {
      setCooldown('apply', effect.key, effect.applyCooldown);
    }
  }

  for (const effect of triggered) {
    if (!('applyIfInflict' in effect)) continue;
    if (isOnCooldown('apply', effect.key)) continue;
    if (!matchIfInflict(effect.applyIfInflict, inflictedStatuses)) continue;

    for (const target of effect.applyTo) {
      if (target === 'active' || target === 'inactive') {
        applyEffect(fieldState[target], effect, applyTimes);
      } else if (target === 'enemy' && 'statMap' in effect) {
        applyEffect(enemyState.stat, effect, applyTimes);
      } else {
        applyEffect(memberState[target], effect, applyTimes);
      }
    }

    if ('applyCooldown' in effect) {
      setCooldown('apply', effect.key, effect.applyCooldown);
    }
  }
}

// Advances (and expires) all active effects by the action's timing window.
// `offset` is used to check expiry (effects expiring before the action mid-point
// are gone), while `duration` is the full advance applied to survivors.
function advanceEffects(ctx, elapsed) {
  const { memberState, fieldState, enemyState } = ctx;

  for (const state of [
    ...Object.values(memberState),
    fieldState.active,
    fieldState.inactive,
    enemyState.stat,
  ]) {
    for (const effectKey in state) {
      const remaining = state[effectKey].timeRemaining - elapsed;

      if (remaining > 0) {
        state[effectKey].timeRemaining = remaining;
      } else {
        delete state[effectKey];
      }
    }
  }
}

function tickEnemyStatuses(ctx, stateMap, elapsed) {
  const statuses = ctx.cache.data.misc.STATUSES ?? {};

  for (const statusId in stateMap) {
    const tracker = stateMap[statusId];
    const status = statuses[statusId];
    let timer = elapsed;

    while (timer > 0) {
      const decrease = Math.min(tracker.duration, tracker.tickTimer, timer);

      tracker.duration -= decrease;
      tracker.tickTimer -= decrease;
      timer -= decrease;

      if (tracker.duration <= 0) {
        if (status.reapply) {
          tracker.duration = status.duration;
          tracker.stacks--;
          if (tracker.stacks <= 0) {
            delete stateMap[statusId];
            break;
          }
        } else {
          delete stateMap[statusId];
          break;
        }
      }

      if (tracker.tickTimer <= 0) {
        // damage footprint function goes here
        tracker.tickTimer = status.tickInterval;
      }
    }
  }
}

// Decrements `usesRemaining` for all effects that triggered and removes effects that have exhausted their remaining uses.
function decayProcCounts(ctx, action) {
  for (const stateMap of [
    ...Object.values(ctx.memberState),
    ...Object.values(ctx.fieldState),
    ctx.enemyState.stat,
  ]) {
    for (const effectKey in stateMap) {
      const state = stateMap[effectKey];

      if (state.usesRemaining === Infinity) continue;
      if (state.effect.followUpAction || state.effect.intervalAction) continue;
      if (!matchUseOn(action, state.effect) || !matchUseIf(action, state.effect, ctx)) continue;

      state.usesRemaining -= 1;

      if (state.usesRemaining <= 0) {
        delete stateMap[effectKey];
      }
    }
  }
}

function processFollowUpProcs(action, ctx, depth) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { memberState, fieldState, activeId } = ctx;
  const actionOwnerState = activeId === action.ownerId ? 'active' : 'inactive';

  for (const state of [
    memberState[action.ownerId],
    fieldState[actionOwnerState],
  ]) {
    for (const [effectKey, tracker] of Object.entries(state)) {
      const { effect } = tracker;
      if (!('followUpAction' in effect) || isOnCooldown('use', effectKey)) continue;
      if (!matchUseOn(action, effect) || !matchUseIf(action, effect, ctx)) continue;

      if (effect.useCooldown) {
        setCooldown('use', effectKey, effect.useCooldown);
      }

      tracker.usesRemaining--;
      if (tracker.usesRemaining <= 0) {
        delete state[effectKey];
      }

      for (const action of effect.followUpAction) {
        processAction(action, ctx, depth + 1, tracker.stacks * effect.times, effect.times);
      }
    }
  }
}

function processIntervalProcs(ctx, elapsed, depth) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { memberState } = ctx;

  for (const memberId in memberState) {
    const stateMap = memberState[memberId];

    for (const [effectKey, tracker] of Object.entries(stateMap)) {
      const { effect } = tracker;
      if (!('intervalAction' in effect)) continue;

      tracker.procTimer -= elapsed;
      while (tracker.procTimer <= 0) {
        tracker.usesRemaining--;

        if (tracker.usesRemaining <= 0) {
          delete stateMap[effectKey];
        }

        for (const action of effect.intervalAction) {
          processAction(action, ctx, depth + 1, tracker.stacks * effect.times, effect.times);
        }

        tracker.procTimer += effect.intervalCooldown;
      }
    }
  }
}

function processTopLevelAction(action, ctx) {
  const { enemyState } = ctx;
  const { duration, offset } = action;
  const remaining = duration - offset;

  // ── Cast (t = 0) ───────────────────────────────────────────────────
  removeEffects(ctx, action);
  applyEffects(ctx, action, 'cast');

  // ── Pre-hit window (t = 0 → offset) ───────────────────────────
  advanceEffects(ctx, offset);
  tickEnemyStatuses(ctx, enemyState.status, offset);
  processIntervalProcs(ctx, offset, 0);
  advanceCooldowns(offset);

  // ── Contact (t = offset) ───────────────────────────────────────────
  if (ctx.recordFootprint) {
    const footprint = buildFootprint(ctx, action);
    ctx.footprints.push(footprint);
  }

  applyEffects(ctx, action, 'hit');

  // ── Post-hit window (t = offset → end) ─────────────────────────
  // Contact effects are now in the tracker, so this one call handles them too
  advanceEffects(ctx, remaining);
  tickEnemyStatuses(ctx, enemyState.status, remaining);
  processIntervalProcs(ctx, remaining, 0);
  advanceCooldowns(remaining);

  // ── Follow-ups + cleanup ───────────────────────────────────────────
  processFollowUpProcs(action, ctx, 0);
  decayProcCounts(ctx, action);
}

function processProcAction(action, ctx, depth, repeatCount, applyTimes) {
  applyEffects(ctx, action, 'cast', applyTimes);

  if (ctx.recordFootprint) {
    const footprint = buildFootprint(ctx, action, repeatCount);
    ctx.footprints.push(footprint);
  }

  applyEffects(ctx, action, 'hit', applyTimes);
  processFollowUpProcs(action, ctx, depth);
}

function processAction(action, ctx, depth, repeatCount = 1, applyTimes = 1) {
  if (depth >= MAX_PROC_DEPTH) {
    console.log("MAX_PROC_DEPTH hit");
    return;
  }

  if (depth === 0) {
    processTopLevelAction(action, ctx);
  } else {
    processProcAction(action, ctx, depth, repeatCount, applyTimes);
  }
}

export const compileRotation = (team, characterId, cache) => {
  const equipMapByMember = {};
  const memberState = {};

  for (const member of team) {
    equipMapByMember[member.id] = member.equipMap;
    memberState[member.id] = {};
  }

  const ctx = {
    cache,
    characterId,
    activeId: null,
    equipMapByMember,
    memberState,
    fieldState: { active: {}, inactive: {} },
    enemyState: { stat: {}, status: {} },
    recordFootprint: false,
    footprints: [],
  };

  resetCooldowns();

  for (const member of team.toReversed()) {
    ctx.activeId = member.id;

    for (const actionShort of member.rotation) {
      const action = cache.action[member.id][actionShort];
      processAction(action, ctx, 0);
    }
  }

  ctx.recordFootprint = true;

  for (const member of team.toReversed()) {
    ctx.activeId = member.id;

    for (const actionShort of member.rotation) {
      const action = cache.action[member.id][actionShort];
      processAction(action, ctx, 0);
    }
  }

  resetCooldowns();

  return { characterId, footprints: ctx.footprints };
};

export const evaluateRotation = (compiledRotation, cache, newCharCompiledStatMap) => {
  const { characterId, footprints } = compiledRotation;
  const summary = {};

  for (const footprint of footprints) {
    const result = evaluateFootprint(footprint, cache, characterId, newCharCompiledStatMap);

    if (result.key in summary) {
      const existing = summary[result.key];
      existing[result.type] += result[result.type];
    } else {
      summary[result.key] = result;
    }
  }

  return summary;
};
