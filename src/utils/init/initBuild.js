import { MISC } from '@/data';

const initSubstat = () => ({
  id: null,
  value: null,
});

const initEquip = (size) => ({
  setId: null,
  mainstatId: null,
  mainstatValue: null,
  substats: Array.from(
    { length: size },
    initSubstat,
  ),
});

export function initBuild(gameId) {
  const { maxEquips, maxSubstats } = MISC[gameId];

  return {
    id: null,
    level: null,
    rank: null,
    weaponId: null,
    weaponLevel: null,
    weaponRank: null,
    equipList: Array.from(
      { length: maxEquips },
      () => initEquip(maxSubstats),
    ),
  };
}
