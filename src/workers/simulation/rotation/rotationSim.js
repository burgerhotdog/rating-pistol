import { MISC } from '@/data';
import { compileStatMap } from '@/utils';
import { matchIfInflict, matchUseOn, matchRemoveOn, matchUseIf, matchRemoveIf, matchApplyIf } from '../match';
import { buildFootprint, evaluateFootprint } from './footprint';

const MAX_PROC_DEPTH = 4;

function removeEffects(ctx, action) {
  const { effectTrackers } = ctx;

  for (const trackerMap of [
    effectTrackers.active,
    effectTrackers.inactive,
    ...Object.values(effectTrackers.byMember),
  ]) {
    for (const effectKey in trackerMap) {
      const { effect } = trackerMap[effectKey];
      if (effect.owner !== action.ownerId) continue;

      if (matchRemoveOn(action, effect) || matchRemoveIf(action, effect, ctx)) {
        delete trackerMap[effectKey];
      }
    }
  }
}

function applyEffect(trackerMap, effect, applyTimes) {
  const { intervalCooldown, intervalOffset } = effect;
  const currentStacks = trackerMap[effect.key]?.stacks ?? 0;

  trackerMap[effect.key] = {
    stacks: Math.min(currentStacks + applyTimes, effect.maxStacks),
    timeRemaining: effect.duration,
    usesRemaining: effect.maxUses,
    ...(intervalCooldown ? { procTimer: trackerMap[effect.key]?.procTimer ?? intervalOffset } : {}),
    effect,
  };
}

function applyStatus(statusTracker, status, stacks) {
  const tracker = statusTracker[status.id];

  if (!tracker) {
    statusTracker[status.id] = {
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
  const { gameId, cache, effectTrackers, statusTracker, cooldownTrackers } = ctx;
  const triggeredEffects = new Set(cache.link[action.ownerId].active[action.key]?.[trigger] ?? []);
  const inflictedStatuses = {};

  if (triggeredEffects.size === 0) return;

  for (const effect of triggeredEffects) {
    if (effect.applyIfInflict) continue;
    if (cooldownTrackers.apply[effect.key]) continue;
    if (!matchApplyIf(action, effect, ctx)) continue;

    for (const target of effect.applyTo) {
      if (target === 'active' || target === 'inactive') {
        applyEffect(effectTrackers[target], effect, applyTimes);
      } else if (target === 'enemy') {
        if (effect.statMap) {
          applyEffect(effectTrackers.enemy, effect, applyTimes);
        }

        if (effect.statusMap) {
          for (const statusId in effect.statusMap) {
            const status = MISC[gameId].STATUSES[statusId];
            const stacks = effect.statusMap[statusId] * applyTimes;

            applyStatus(statusTracker, status, stacks)

            inflictedStatuses[statusId] ??= 0;
            inflictedStatuses[statusId] += stacks;
          }
        }
      } else {
        applyEffect(effectTrackers.byMember[target], effect, applyTimes);
      }
    }

    if (effect.applyCooldown) {
      cooldownTrackers.apply[effect.key] = effect.applyCooldown;
    }
  }

  for (const effect of triggeredEffects) {
    if (!effect.applyIfInflict) continue;
    if (cooldownTrackers.apply[effect.key]) continue;
    if (!matchIfInflict(effect.applyIfInflict, inflictedStatuses)) continue;

    for (const target of effect.applyTo) {
      if (target === 'active' || target === 'inactive') {
        applyEffect(effectTrackers[target], effect, applyTimes);
      } else if (target === 'enemy' && effect.statMap) {
        applyEffect(effectTrackers.enemy, effect, applyTimes);
      } else {
        applyEffect(effectTrackers.byMember[target], effect, applyTimes);
      }
    }

    if (effect.applyCooldown) {
      cooldownTrackers.apply[effect.key] = effect.applyCooldown;
    }
  }
}

// Advances (and expires) all active effects by the action's timing window.
// `offset` is used to check expiry (effects expiring before the action mid-point
// are gone), while `duration` is the full advance applied to survivors.
function advanceEffects(effectTrackers, offset, duration) {
  function advanceMap(trackerMap) {
    for (const [id, tracker] of Object.entries(trackerMap)) {
      if (tracker.timeRemaining - offset <= 0) {
        delete trackerMap[id];
      } else {
        tracker.timeRemaining -= duration;
      }
    }
  }
  const { byMember, active, inactive, enemy } = effectTrackers;
  advanceMap(active);
  advanceMap(inactive);
  advanceMap(enemy);
  for (const member in byMember) {
    advanceMap(byMember[member]);
  };
}

// Decrements all active proc/apply cooldowns by `delta` ms and removes expired ones.
function tickCooldownMap(cooldownTrackers, delta) {
  for (const type in cooldownTrackers) {
    const cooldownMap = cooldownTrackers[type];

    for (const effectKey in cooldownMap) {
      const nextValue = cooldownMap[effectKey] - delta;

      if (nextValue <= 0) {
        delete cooldownMap[effectKey];
      } else {
        cooldownMap[effectKey] = nextValue;
      }
    }
  }
}

function tickEnemyStatuses(gameId, statusTracker, elapsed) {
  const statuses = MISC[gameId].STATUSES ?? {};

  for (const statusId in statusTracker) {
    const tracker = statusTracker[statusId];
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
            delete statusTracker[statusId];
            break;
          }
        } else {
          delete statusTracker[statusId];
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
function decayProcCounts(ctx, compiledStatMap, action) {
  for (const trackerMap of [
    ctx.effectTrackers.active,
    ctx.effectTrackers.inactive,
    ctx.effectTrackers.enemy,
    ...Object.values(ctx.effectTrackers.byMember),
  ]) {
    for (const [id, tracker] of Object.entries(trackerMap)) {
      if (tracker.usesRemaining === Infinity) continue;

      const { effect } = tracker;
      if (effect.followUpAction || effect.intervalAction) continue;
      if (!matchUseOn(action, effect) || !matchUseIf(action, effect, ctx)) continue;

      tracker.usesRemaining -= 1;
      if (tracker.usesRemaining <= 0) {
        delete trackerMap[id];
      }
    }
  }
}

// Fires action-triggered followUp procs from all active tracker maps.
// These are one-shot or limited-use procs that fire when a matching action occurs,
// as opposed to interval procs which fire on a timer.
function processFollowUpProcs(action, ctx, depth) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { cache, effectTrackers, cooldownTrackers, activeId } = ctx;
  const { byMember, active, inactive } = effectTrackers;

  function processTrackerMap(trackerMap) {
    for (const tracker of Object.values(trackerMap)) {
      const { stacks, effect } = tracker;
      if (!effect.followUpAction || cooldownTrackers.followUp[effect.key]) continue;
      if (!matchUseOn(action, effect) || !matchUseIf(action, effect, ctx)) continue;

      const procActions = [];
      for (const action of effect.followUpAction) {
        if (typeof action === 'string') {
          const procAction = cache.action[effect.owner][action];
          procActions.push(procAction);
        } else {
          procActions.push(action);
        }
      }

      // Set cooldown BEFORE recursing so re-entrant calls to processFollowUpProcs
      // (from within the proc action itself) see it as blocked and skip.
      if (effect.followUpCooldown) {
        cooldownTrackers.followUp[effect.key] = effect.followUpCooldown;
      }

      tracker.usesRemaining--;
      if (tracker.usesRemaining <= 0) {
        delete trackerMap[effect.key];
      }

      for (const action of procActions) {
        processAction(action, ctx, depth + 1, stacks * effect.times, effect.times);
      }
    }
  }

  processTrackerMap(byMember[action.ownerId]);
  processTrackerMap(activeId === action.ownerId ? active : inactive);
}

// Fires timer-based (interval) procs. Called once per rotation action with
// the action's duration as `elapsed`. Effects fire repeatedly while their timer is <= 0,
// re-arming after each fire by adding intervalCooldown back to the timer.
function processIntervalProcs(ctx, elapsed, depth) {
  if (depth >= MAX_PROC_DEPTH) return;
  const { cache, effectTrackers } = ctx;

  for (const memberId in effectTrackers.byMember) {
    const trackerMap = effectTrackers.byMember[memberId];

    for (const effectKey in trackerMap) {
      const tracker = trackerMap[effectKey];
      const { effect } = tracker;
      if (!effect.intervalAction) continue;

      tracker.procTimer -= elapsed;
      while (tracker.procTimer <= 0) {
        const procActions = [];
        for (const action of effect.intervalAction) {
          if (typeof action === 'string') {
            const procAction = cache.action[effect.owner][action];
            procActions.push(procAction);
          } else {
            procActions.push(action);
          }
        }

        for (const action of procActions) {
          processAction(action, ctx, depth + 1, tracker.stacks * effect.times, effect.times);
        }

        tracker.usesRemaining--;
        if (tracker.usesRemaining <= 0) {
          delete trackerMap[effect.key];
          break;
        }

        tracker.procTimer += effect.intervalCooldown;
      }
    }
  }
}

function processTopLevelAction(action, ctx) {
  const { gameId, compiledStatMap, effectTrackers, statusTracker, cooldownTrackers, characterId } = ctx;
  const { duration, offset } = action;
  const remaining = duration - offset;

  // ── Cast (t = 0) ───────────────────────────────────────────────────
  removeEffects(ctx, action);
  applyEffects(ctx, action, 'cast');

  // ── Pre-hit window (t = 0 → offset) ───────────────────────────
  advanceEffects(effectTrackers, offset, offset);
  tickEnemyStatuses(gameId, statusTracker, offset);
  processIntervalProcs(ctx, offset, 0);
  tickCooldownMap(cooldownTrackers, offset);

  // ── Contact (t = offset) ───────────────────────────────────────────
  if (ctx.recordFootprint) {
    ctx.footprints.push(buildFootprint(ctx, {
      action,
      effectTrackers,
      activeId: ctx.activeId,
      compiledStatMap,
      characterId,
      repeatCount: 1,
    }));
  }
  applyEffects(ctx, action, 'hit');

  // ── Post-hit window (t = offset → end) ─────────────────────────
  // Contact effects are now in the tracker, so this one call handles them too
  advanceEffects(effectTrackers, 0, remaining);
  tickEnemyStatuses(gameId, statusTracker, remaining);
  processIntervalProcs(ctx, remaining, 0);
  tickCooldownMap(cooldownTrackers, remaining);

  // ── Follow-ups + cleanup ───────────────────────────────────────────
  processFollowUpProcs(action, ctx, 0);
  decayProcCounts(ctx, compiledStatMap, action);
}

function processProcAction(action, ctx, depth, repeatCount, applyTimes) {
  if (depth >= MAX_PROC_DEPTH) return;
  applyEffects(ctx, action, 'cast', applyTimes);

  if (ctx.recordFootprint) {
    ctx.footprints.push(buildFootprint(ctx, { ...ctx, action, repeatCount }));
  }

  applyEffects(ctx, action, 'hit', applyTimes);
  processFollowUpProcs(action, ctx, depth);
}

function processAction(action, ctx, depth, repeatCount = 1, applyTimes = 1) {
  if (depth >= MAX_PROC_DEPTH) return;
  if (depth === 0) processTopLevelAction(action, ctx);
  else processProcAction(action, ctx, depth, repeatCount, applyTimes);
}

export const compileRotation = (gameId, rawTeam, characterId, cache) => {
  const team = rawTeam.filter(m => m.memberId);

  const compiledStatMap = {};
  for (const member of team) {
    compiledStatMap[member.memberId] = compileStatMap(gameId, member.memberId, member.build ?? {});
  }

  const effectTrackers = {
    byMember: Object.fromEntries(team.map(m => [m.memberId, {}])),
    active: {},
    inactive: {},
    enemy: {},
  };
  const statusTracker = {};
  const cooldownTrackers = {
    apply: {},
    followUp: {},
  };

  // Shared context object threaded through all processAction calls. activeId is
  // mutated per rotation action to track which member is the current rotation actor.
  const ctx = {
    gameId,
    cache,
    compiledStatMap,
    effectTrackers,
    statusTracker,
    cooldownTrackers,
    characterId,
    activeId: null,
    recordFootprint: false,
    footprints: [],
  };

  // ── Priming pass ──────────────────────────────────────────────────────────
  // Replay the full rotation without recording footprints to warm up the effect
  // trackers into a steady-state snapshot (effects that will actually be active).
  for (const { memberId, rotation } of team.toReversed()) {
    ctx.activeId = memberId;
    for (const actionKey of rotation) {
      const action = cache.action[memberId][actionKey];
      processAction(action, ctx, 0);
    }
  }

  // ── Damage pass: record footprints ────────────────────────────────────────
  // Replay the rotation a second time, this time capturing a footprint at each
  // damage evaluation point. The footprints are later re-evaluated cheaply by
  // evaluateRotationSummary with different character builds.

  ctx.recordFootprint = true;

  for (const { memberId, rotation } of team.toReversed()) {
    ctx.activeId = memberId;
    for (const actionKey of rotation) {
      const action = cache.action[memberId][actionKey];
      processAction(action, ctx, 0);
    }
  }

  return { gameId, characterId, footprints: ctx.footprints };
};

export const evaluateRotation = (compiledRotation, newCharCompiledStatMap) => {
  const { gameId, characterId, footprints } = compiledRotation;
  const summary = {};

  for (const footprint of footprints) {
    const result = evaluateFootprint(footprint, gameId, characterId, newCharCompiledStatMap);
    if (!summary[result.key]) {
      summary[result.key] = result;
    } else {
      const existing = summary[result.key];
      existing[result.type] += result[result.type];
    }
  }

  return summary;
};
