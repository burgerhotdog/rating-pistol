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
    const isC2 = hasGameRule(ctx, 'trackFanfareC2');
    const c2Mult = isC2 ? 3.5 : 1;
    const stacks = Math.round(Math.abs(diff) * 100 * c2Mult);

    if (!isC2) {
      runCommands(ctx, { ownerId: 10000089 }, [{
        type: 'apply',
        key: '10000089.10000089:effect15',
        spec: { stacks },
      }], action.ownerId);
      return;
    }

    const currentStacks = ctx.states.memberEffects['10000089']['10000089.10000089:effect15']?.stacks ?? 0;
    const roomLeft = 400 - currentStacks;
    const toFanfare = Math.min(stacks, roomLeft);
    const toOverflow = stacks - toFanfare;

    if (toFanfare > 0) {
      runCommands(ctx, { ownerId: 10000089 }, [{
        type: 'apply',
        key: '10000089.10000089:effect15',
        spec: { stacks: toFanfare },
      }], action.ownerId);
    }

    if (toOverflow > 0) {
      runCommands(ctx, { ownerId: 10000089 }, [{
        type: 'apply',
        key: '10000089.10000089:effect21',
        spec: { stacks: toOverflow },
      }], action.ownerId);
    }
  }
}

export function convertHealingToValue(ctx, healingSnapshot, targetId) {
  const { action, buffMap, formula } = healingSnapshot.unresolved;

  const statMapOwnerId = action.ownerId;
  const statMapOwnerIdBuildMap = ctx.buildMaps[statMapOwnerId];

  const healingStatMap = toMergedObj(statMapOwnerIdBuildMap, buffMap);
  const healingValue = formula(healingStatMap);

  const { buffMap: targetBuffMap } = getBuffMap(ctx, { memberId: targetId, resolveNow: true });
  const targetStatMap = toMergedObj(ctx.buildMaps[targetId], targetBuffMap);
  const maxHp = getAttr('hp', targetStatMap);
  const healingReceivedMultiplier = 1 + getAttr('healingReceived%', targetStatMap);

  const ratio = (healingValue * healingReceivedMultiplier) / maxHp;

  return ratio;
}
