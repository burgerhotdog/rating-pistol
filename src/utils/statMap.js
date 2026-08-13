import {
  GI, HSR, WW, ZZZ,
  CHARACTER, WEAPON, SET,
} from '@/data';
import { toArray, toMergedObj, toEquipMap, resolveRankedValue } from '@/utils';

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
    "energyRegen%": 1,
    "offTuneBuildupRate%": 1,
  },
  [ZZZ]: {
    "baseEnergyRegen": 1.2,
    "critRate%": 0.05,
    "critDmg%": 0.5,
  },
};

export function compileBaseMap(gameId, charId, weapId) {
  const { stats: charStats } = CHARACTER[gameId][charId];
  const { stats: weapStats } = WEAPON[gameId][weapId];

  return toMergedObj(DEFAULT[gameId], charStats, weapStats);
}

export function compileMenuMap(gameId, charId, member) {
  const { rank: memberRank = 0, weaponId, weaponRank = 1, setCounts = {}, build = {}} = member;

  const baseMap = compileBaseMap(gameId, charId, weaponId);

  const statMap = toMergedObj(baseMap, toEquipMap(build.equipList ?? []));

  const allEffects = [
    ...CHARACTER[gameId][charId].effects,
    ...WEAPON[gameId][weaponId].effects,
    ...Object.entries(setCounts)
      .flatMap(([setId, count]) =>
        (SET[gameId][setId].effects ?? [])
          .filter((effect) =>
            effect.enableIf?.bonus <= count)),
  ];

  const validStores = (stores) =>
    stores == undefined
      ? true
      : toArray(stores).some((useBy) =>
        useBy === 'global' || useBy === '$team' || useBy === charId);

  const filtered = allEffects.filter((effect) => {
    if (
      effect.enableIf?.rank > memberRank ||
      effect.apply?.when ||
      !validStores(effect.stores) ||
      effect.buff?.filter
    ) return false;

    return effect.buff?.buffMap;
  });

  const toMerge = [];
  for (const { buff: { buffMap } } of filtered) {
    if (buffMap) {
      const resolved = {};
      for (const [stat, value] of Object.entries(buffMap)) {
        resolved[stat] = typeof value === 'number'
          ? value
          : resolveRankedValue(value, weaponRank);
      }
      toMerge.push(resolved);
    }
  }

  return toMergedObj(statMap, ...toMerge);
}
