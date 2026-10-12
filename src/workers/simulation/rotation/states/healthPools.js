import { clamp } from '@/utils';

function getLowest(healthPools) {
  let lowest;

  for (const id in healthPools) {
    if (healthPools[id] >= healthPools[lowest]) continue;
    lowest = id;
  }

  return Number(lowest);
}

function getTargetId(ctx, target) {
  if (target === '$onField') {
    return ctx.states.onFieldId;
  }

  if (target === '$lowest') {
    return getLowest(ctx.states.memberHealth);
  }

  return target;
}

export function updateHealthPools(ctx, action) {
  const {
    targets = [action.ownerId],
    value,
    minLimit = 0,
    maxLimit = 1,
  } = action.drain;
  const { memberHealth } = ctx.states;

  for (const target of targets) {
    const targetId = getTargetId(ctx, target);

    const prev = memberHealth[targetId];
    if (value > 0 && prev <= minLimit) continue;
    if (value < 0 && prev >= maxLimit) continue;

    const next = clamp(prev - value, minLimit, maxLimit);

    if (next !== prev) {
      memberHealth[targetId] = next;
      ctx.runEffects('healthUpdate', { ownerId: targetId });
    }
  }
}
