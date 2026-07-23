import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON, SET } from '@/data';
import { toArray, toMergedObj, mergeEquipList, resolveRankedValue } from '@/utils';

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
    "critDmg%": 0.5
  },
};

export const compileBaseMap = (gameId, charId, weapId) => {
  const { baseStats, ascensionStats } = CHARACTER[gameId][charId];
  const charStats = toMergedObj(baseStats, ascensionStats);

  const { stats: weaponStats } = WEAPON[gameId][weapId];

  return toMergedObj(DEFAULT[gameId], charStats, weaponStats);
};

export const compileMenuMap = (gameId, charId, member) => {
  const { rank: memberRank = 0, weaponId, weaponRank = 1, setCounts = {}, build = {}} = member;

  const baseMap = compileBaseMap(gameId, charId, weaponId);

  const statMap = toMergedObj(baseMap, mergeEquipList(build.equipList ?? []));

  const allEffects = [
    ...toArray(CHARACTER[gameId][charId].effects),
    ...toArray(WEAPON[gameId][weaponId].effects),
    ...Object.entries(setCounts)
      .flatMap(([setId, count]) =>
        Object.entries(SET[gameId][setId].bonusEffects ?? {})
          .filter(([tier]) => Number(tier) <= count)
          .flatMap(([, effects]) => toArray(effects))),
  ];

  const filtered = allEffects.filter((effect) => {
    if (
      effect.rank > memberRank ||
      effect.applyWhen ||
      (effect.applyTo && effect.applyTo !== 'team') ||
      Object.keys(effect).some((key) => key.startsWith('useOn'))
    ) return false;

    return effect.statMap;
  });

  const toMerge = [];
  for (const { statMap } of filtered) {
    if (statMap) {
      const resolved = {};
      for (const [statId, value] of Object.entries(statMap)) {
        resolved[statId] = typeof value === 'number'
          ? value
          : resolveRankedValue(value, weaponRank);
      }
      toMerge.push(resolved);
    }
  }

  return toMergedObj(statMap, ...toMerge);
};
