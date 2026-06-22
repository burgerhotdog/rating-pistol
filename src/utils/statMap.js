import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON } from '@/data';
import { mergeObj, mergeObjs, mergeEquipList } from '@/utils';

const DEFAULT = {
  [GI]: {
    "critRate%": 0.05,
    "critDmg%": 0.5,
    "energyRecharge%": 1,
  },
  [HSR]: {
    "critRate%": 0.05,
    "critDmg%": 0.5,
    "energyRegenerationRate%": 1,
  },
  [WW]: {
    "critRate%": 0.05,
    "critDmg%": 0.5,
    "energyRegen%": 1
  },
  [ZZZ]: {
    "baseEnergyRegen": 1.2,
    "critRate%": 0.05,
    "critDmg%": 0.5
  },
};

export const compileBaseMap = (gameId, charId, weapId) => {
  const { baseStats, ascensionStats } = CHARACTER[gameId][charId];
  const charStats = mergeObj(baseStats, ascensionStats);

  const { stats: weaponStats } = WEAPON[gameId][weapId];

  return mergeObjs(DEFAULT[gameId], charStats, weaponStats);
};

export const compileStatMap = (gameId, charId, build) => {
  const { weaponId, equipList = [] } = build;

  const baseMap = compileBaseMap(gameId, charId, weaponId);

  return mergeObj(baseMap, mergeEquipList(equipList));
};
