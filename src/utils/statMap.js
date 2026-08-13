import {
  GI, HSR, WW, ZZZ,
  CHARACTER, WEAPON, SET,
} from '@/data';
import { toArray, toMergedObj, toEquipMap, resolveRankedValue } from '@/utils';

const DEFAULT = {
  [GI]: {
    'critRate%': 0.05,
    'critDmg%': 0.5,
    'energyRecharge%': 1,
  },
  [HSR]: {
    'critRate%': 0.05,
    'critDmg%': 0.5,
    'energyRegenerationRate%': 1,
  },
  [WW]: {
    'critRate%': 0.05,
    'critDmg%': 0.5,
    'energyRegen%': 1,
    'offTuneBuildupRate%': 1,
  },
  [ZZZ]: {
    'baseEnergyRegen': 1.2,
    'critRate%': 0.05,
    'critDmg%': 0.5,
  },
};

export function compileBaseMap(gameId, charId, weapId) {
  const gameStats = DEFAULT[gameId];
  const charStats = CHARACTER[gameId][charId].stats;
  const weapStats = WEAPON[gameId][weapId].stats;

  return toMergedObj(gameStats, charStats, weapStats);
}

export function compileMenuMap(gameId, charId, member) {
  const {
    rank: charRank = 0,
    weaponId,
    weaponRank = 1,
    setCounts = {},
  } = member;

  const baseMap = compileBaseMap(gameId, charId, weaponId);
  const equipMap = toEquipMap(member.build?.equipList ?? []);
  const effectMaps = [];

  const validEffect = (effect) => (
    effect.buff?.stats &&
    !effect.buff?.filter &&
    !(effect.enableIf?.rank > charRank) &&
    !effect.apply?.when &&
    toArray(effect.stores ?? charId)
      .some((store) => ['global', '$team', charId].includes(store))
  );

  const allEffects = [
    ...CHARACTER[gameId][charId].effects,
    ...WEAPON[gameId][weaponId].effects,
    ...Object.entries(setCounts)
      .flatMap(([setId, count]) =>
        SET[gameId][setId].effects
          .filter(({ enableIf: { bonus } }) => bonus <= count)),
  ];

  for (const effect of allEffects.filter(validEffect)) {
    const effectMap = {};

    for (const [stat, value] of Object.entries(effect.buff.stats)) {
      effectMap[stat] =
        typeof value === 'number'
          ? value
          : resolveRankedValue(value, weaponRank);
    }

    effectMaps.push(effectMap);
  }

  return toMergedObj(baseMap, equipMap, ...effectMaps);
}
