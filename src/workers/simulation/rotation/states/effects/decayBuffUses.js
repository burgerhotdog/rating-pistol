import { runCommands } from './commands';

function decayBuffState(ctx, action, state) {
  const { effect, buffCooldown } = state;
  if (buffCooldown) return;
  if (!effect.buff) return;
  const spec = { action, fieldId: action.ownerId };
  const buff = effect.buff.find((candidate) => ctx.eventFilter(candidate.filter, effect, spec));
  if (!buff) return;

  if (buff.cooldown) {
    state.buffCooldown = buff.cooldown;
  }

  const commands = buff.commands;

  if (state.usesLeft) {
    state.usesLeft--;

    if (!state.usesLeft) {
      delete state.store[effect.key];
    }
  }

  if (commands) {
    runCommands(ctx, effect, commands, effect.ownerId);
  }
}

export function decayBuffUses(ctx, action) {
  const { globalEffects, memberEffects } = ctx.states;

  for (const effectKey in globalEffects) {
    const state = globalEffects[effectKey];
    decayBuffState(ctx, action, state);
  }

  const memberStore = memberEffects[action.ownerId];

  for (const effectKey in memberStore) {
    const state = memberStore[effectKey];
    decayBuffState(ctx, action, state);
  }
}
