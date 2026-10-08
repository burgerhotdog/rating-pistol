import { consumeAura } from '../consumeAura';

// Returns whether the aura is absent after decay
export function decayElementalAura(auraStore, element, elapsed) {
  const state = auraStore[element];
  if (!state) return true;

  consumeAura(auraStore, element, elapsed * state.decayRate);
  return !auraStore[element];
}
