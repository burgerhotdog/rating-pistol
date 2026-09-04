import { MISC } from '@/data';

const initEquip = (size) => ({
  setId: null,
  mainstatId: null,
  mainstatValue: null,
  substats: Array.from({ length: size }, () => ({
    id: null,
    value: null,
  })),
});

export function initBuild(gameId) {
  const { maxEquips, maxSubstats, skillIds } = MISC[gameId];

  return {
    id: null,
    level: null,
    rank: null,
    weaponId: null,
    weaponLevel: null,
    weaponRank: null,
    equipList: Array.from({ length: maxEquips }, () => initEquip(maxSubstats)),
    skillLevels: Object.fromEntries(skillIds.map((skillId) => [skillId, 1])),
  };
}
