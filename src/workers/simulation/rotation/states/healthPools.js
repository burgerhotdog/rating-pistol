import { clamp, toMergedObj, getAttr } from '@/utils';
import { hasGameRule } from './gameRules';
import { runCommands } from './effects';
import { getBuffMap } from '../getStatMap';

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
  const diff = next - prev;
  if (diff === 0) return;

  healthStore[ownerId] = next;
  ctx.runEffects('healthUpdate', { ...action, ownerId });

  if (hasGameRule(ctx, 'trackFanfare')) {
    const stacks = Math.round(Math.abs(diff) * 100);

    runCommands(ctx, { ownerId: 10000089 }, [{
      type: 'apply',
      key: '10000089.10000089:effect15',
      spec: { stacks },
    }], );
  }
}

export function convertHealingToValue(ctx, sharedSnapshot, targetId) {
  const { action, buffMap, formula } = sharedSnapshot.unresolved;

  const statMapOwnerId = action.ownerId;
  const statMapOwnerIdBuildMap = ctx.buildMaps[statMapOwnerId];

  const healingStatMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
  const healingValue = formula(healingStatMap, 'healing');

  const { buffMap: targetBuffMap } =  getBuffMap(ctx, { memberId: targetId, resolveNow: true });
  const targetStatMap = toMergedObj(ctx.buildMaps[targetId], targetBuffMap);
  const maxHp = getAttr('hp', targetStatMap);

  const ratio = healingValue / maxHp;

  return ratio;
}
