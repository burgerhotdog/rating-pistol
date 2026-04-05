import { CHARACTERS, WEAPONS, SETS } from '@/data';
import { mergeStatMaps } from '@/utils';

export function collectTeamBuffs(gameId, team) {
  return team.reduce((acc, member) => {
    if (!member.characterId) return acc;

    const charBuffsTeam = CHARACTERS[gameId]?.[member.characterId]?.buffs?.team?.fixedStats ?? {};
    const charBuffsBoth = CHARACTERS[gameId]?.[member.characterId]?.buffs?.ally?.fixedStats ?? {};
    const weaponBuffsTeam = WEAPONS[gameId]?.[member.weaponId]?.buffs?.team?.fixedStats ?? {};
    const weaponBuffsBoth = WEAPONS[gameId]?.[member.weaponId]?.buffs?.ally?.fixedStats ?? {};
    const setBuffsTeam = SETS[gameId]?.[member.setId]?.buffs?.team?.fixedStats ?? {};
    const setBuffsBoth = SETS[gameId]?.[member.setId]?.buffs?.ally?.fixedStats ?? {};

    return mergeStatMaps(acc, charBuffsTeam, charBuffsBoth, weaponBuffsTeam, weaponBuffsBoth, setBuffsTeam, setBuffsBoth);
  }, {});
}
