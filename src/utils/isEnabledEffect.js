import { toArray } from './toArray';

export const isEnabledChar = (effect, member) => {
  if ('rank' in effect) {
    if (effect.rank > member.rank) return false;
  }

  if ('mode' in effect) {
    if (effect.mode !== member.mode) return false;
  }

  return true;
};

export const isEnabledWeap = (effect, charData, weapData) => {
  if (weapData.type !== charData.type) return false;

  const { enable } = effect;
  if (!enable) return true;

  if ('id' in enable) {
    const allowed = toArray(enable.id);
    if (!allowed.includes(charData.id)) return false;
  }

  return true;
};

export const isEnabledSet = (effect, pcCount, charData) => {
  if (effect.bonus > pcCount) return false;

  const { enable } = effect;
  if (!enable) return true;

  if ('type' in enable) {
    const allowed = toArray(enable.type);
    if (!allowed.includes(charData.type)) return false;
  }

  if ('element' in enable) {
    const allowed = toArray(enable.element);
    if (!allowed.includes(charData.element)) return false;
  }

  if ('tagged' in enable) {
    const allowed = toArray(enable.tagged);
    const charTagged = toArray(charData.tagged);
    if (!allowed.some((tag) => charTagged.includes(tag))) return false;
  }

  return true;
};

export const isEnabledEcho = (effect, charData) => {
  const { enable } = effect;
  if (!enable) return true;

  if ('id' in enable) {
    const allowed = toArray(enable.id);
    if (!allowed.includes(charData.id)) return false;
  }

  return true;
};
