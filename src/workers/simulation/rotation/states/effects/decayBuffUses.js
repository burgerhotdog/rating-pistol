function decayState(state, buff) {
  const { store, effect } = state;

  if (buff.cooldown) {
    state.buffCooldown = buff.cooldown;
  }

  if (state.usesLeft) {
    state.usesLeft--;

    if (state.usesLeft <= 0) {
      delete store[effect.key];
    }
  }
}

function tryDecay(ctx, state, action, memberId) {
  const { effect } = state;
  if (!effect.buff) return;
  if (state.buffCooldown) return;

  const event = { action };

  for (const buff of effect.buff) {
    const { field, filter } = buff;

    if (field) {
      const effOwnerField = effect.ownerId === ctx.states.onFieldId ? 'onField' : 'offField';
      if (field !== effOwnerField) continue;
    }

    if (ctx.eventFilter(filter, effect.ownerId, event, memberId)) {
      decayState(state, buff);
      return true;
    }
  }
}

export function decayBuffUses(ctx, action, memberIds) {
  const { globalEffects, memberEffects } = ctx.states;
  const recipients = memberIds ?? [action.ownerId];

  for (const key in globalEffects) {
    for (const memberId of recipients) {
      if (tryDecay(ctx, globalEffects[key], action, memberId)) break;
    }
  }

  for (const memberId of recipients) {
    const store = memberEffects[memberId];
    if (!store) continue;

    for (const key in store) {
      tryDecay(ctx, store[key], action, memberId);
    }
  }
}
