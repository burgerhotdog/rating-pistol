import { CHARACTERS } from '@/data';

export function getEffectMetaMeta(gameId, effectKey) {
  const dashIndex = effectKey.indexOf('-');

  const ownerId = effectKey.slice(0, dashIndex);
  const effectIndex = effectKey.slice(dashIndex + 1);

  return { ownerId, ...CHARACTERS[gameId][ownerId].effects[effectIndex] };
}
