import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON, SET, ECHO, } from '@/data';
import { buildEquipMap } from './buildMap';
import { isEnabledChar, isEnabledWeap, isEnabledSet, isEnabledEcho } from './isEnabledEffect';
import { toMergedObj } from './merge';
import { resolveRankedValue } from './resolveRanked';
import { toArray } from './toArray';

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

export function compileMenuMap(gameId, charId, member, team) {
  const baseMap = compileBaseMap(gameId, charId, member.weaponId);
  const equipMap = buildEquipMap(member.build?.equipList ?? []);
  const effectMaps = [];

  const isStaticBuff = (effect) => (
    effect.buff?.stats &&
    !effect.buff?.filter &&
    !effect.apply &&
    toArray(effect.stores ?? charId)
      .some((store) => ['global', '$team', charId].includes(store))
  );

  const memberIds = team.filter((member) => member.id).map((member) => member.id);

  const charData = CHARACTER[gameId][charId];
  const weapData = WEAPON[gameId][member.weaponId];

  const allEffects = [
    ...charData.effects.filter((effect) => isEnabledChar(effect, member, gameId, memberIds)),
    ...weapData.effects.filter((effect) => isEnabledWeap(effect, charData, weapData)),
    ...Object.entries(member.setCounts)
      .flatMap(([setId, pcCount]) =>
        SET[gameId][setId].effects.filter((effect) => isEnabledSet(effect, pcCount, charData))
      ),
  ];

  const echoData = ECHO[member.mainEcho];
  if (echoData?.effects) {
    const filtered = echoData.effects.filter((effect) => isEnabledEcho(effect, charData));
    allEffects.push(...filtered);
  }

  for (const effect of allEffects.filter(isStaticBuff)) {
    const effectMap = {};

    for (const [stat, value] of Object.entries(effect.buff.stats)) {
      effectMap[stat] =
        typeof value === 'number'
          ? value
          : resolveRankedValue(value, member.weaponRank);
    }

    effectMaps.push(effectMap);
  }

  return toMergedObj(baseMap, equipMap, ...effectMaps);
}
