import { inflictStatus } from './inflictNegativeStatuses';

export function replaceNegativeStatuses(ctx, action) {
  const store = ctx.states.negativeStatuses;
  const toReplace = action.replace?.status ?? {};

  for (const [fromId, toId] of Object.entries(toReplace)) {
    const fromState = store[fromId];
    if (!fromState) continue;

    const fromStacks = fromState.stacks;
    delete store[fromId];

    inflictStatus(ctx, toId, fromStacks);
  }
}
