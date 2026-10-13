import { clamp } from '@/utils';

function getLowest(healthStore) {
  let lowest;

  for (const id in healthStore) {
    if (healthStore[id] >= healthStore[lowest]) continue;
    lowest = id;
  }

  return Number(lowest);
}

export function getTargetId(ctx, target) {
  if (target === '$onField') {
    return ctx.states.onFieldId;
  }

  if (target === '$lowest') {
    return getLowest(ctx.states.memberHealth);
  }

  return target;
}

export function updateHealth(ctx, action, ownerId, spec) {
  const healthStore = ctx.states.memberHealth;
  const { value, min = 0, max = 1 } = spec;

  const prev = healthStore[ownerId];

  if (value > 0 && prev >= max) return;
  if (value < 0 && prev <= min) return;

  const next = clamp(prev + value, min, max);
  if (next === prev) return;

  healthStore[ownerId] = next;
  ctx.runEffects('healthUpdate', { ...action, ownerId });
}
