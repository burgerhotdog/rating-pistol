import { CHARACTERS, WEAPONS, SETS } from '@/data';

function mergeBuffMaps(...maps) {
  return maps.reduce((acc, map = {}) => {
    for (const [statId, value] of Object.entries(map)) {
      acc[statId] = (acc[statId] ?? 0) + value;
    }
    return acc;
  }, {});
}

export function collectTeamBuffs(gameId, team) {
  return team.reduce((acc, member) => {
    if (!member.characterId) return acc;

    const charBuffs = CHARACTERS[gameId]?.[member.characterId]?.teamBuffs ?? {};
    const weaponBuffs = WEAPONS[gameId]?.[member.weaponId]?.teamBuffs ?? {};
    const setBuffs = SETS[gameId]?.[member.setId]?.teamBuffs ?? {};

    return mergeBuffMaps(acc, charBuffs, weaponBuffs, setBuffs);
  }, {});
}
