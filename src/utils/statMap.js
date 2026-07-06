import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON, SET } from '@/data';
import { toArray, mergeObj, mergeObjs, mergeEquipList, resolveRankedValue } from '@/utils';

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
  const charStats = mergeObj(baseStats, ascensionStats);

  const { stats: weaponStats } = WEAPON[gameId][weapId];

  return mergeObjs(DEFAULT[gameId], charStats, weaponStats);
};

export const compileMenuMap = (gameId, charId, member) => {
  const { rank = 0, weaponId, weaponRank = 1, setCounts = {}, build = {}} = member;

  const baseMap = compileBaseMap(gameId, charId, weaponId);

  const statMap = mergeObj(baseMap, mergeEquipList(build.equipList ?? []));

  const allEffects = [
    ...toArray(CHARACTER[gameId][charId].effects),
    ...toArray(WEAPON[gameId][weaponId].effects),
  ];

  for (const [setId, count] of Object.entries(setCounts)) {
    const { tieredEffects = {} } = SET[gameId][setId];

    for (const [tier, effects] of Object.entries(tieredEffects)) {
      if (Number(tier) > count) continue;
      allEffects.push(...toArray(effects));
    }
  }

  const filtered = allEffects.filter((effect) => {
    if ('applyWhen' in effect) return false;
    if (effect.applyTo && effect.applyTo !== 'team') return false;
    if ('rank' in effect && effect.rank > rank) return false; 

    for (const key in effect) {
      if (key.startsWith('useOn')) return false;
    }

    return ('statMap' in effect || 'rankedStatMap' in effect);
  });

  const toMerge = [];

  for (const effect of filtered) {
    if ('statMap' in effect) {
      toMerge.push(effect.statMap);
    } else if ('rankedStatMap' in effect) {
      const resolved = {};
      for (const statId in effect.rankedStatMap) {
        resolved[statId] = resolveRankedValue(effect.rankedStatMap[statId], weaponRank);
      }
      toMerge.push(resolved);
    }
  }

  return mergeObjs(statMap, ...toMerge);
};
