import { CHARACTERS } from '@/data';

export function getMember(gameId, characterId) {
  const data = CHARACTERS[gameId][characterId];
  if (!data) throw new Error(`Character "${characterId}" doesn't exist in game "${gameId}"`);

  return {
    memberId: characterId,
    weaponId: data.defaults?.weaponId ?? null,
    setCounts: data.defaults?.setCounts ?? {},
    rotation: data.defaults?.rotation ?? [],
  };
}
