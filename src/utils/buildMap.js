import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON, SET, ECHO } from '@/data';
import { toMergedObj } from './merge';
import { isEnabledChar, isEnabledWeap, isEnabledSet, isEnabledEcho } from './isEnabledEffect';
import { resolveRankedValue } from './resolve';
import { toArray } from './toArray';

const GAME_STATS = {
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

export function buildBaseMap(gameId, charId, weapId) {
  const gameStats = GAME_STATS[gameId];
  const charStats = CHARACTER[gameId][charId]?.stats ?? {};
  const weapStats = WEAPON[gameId][weapId]?.stats ?? {};

  return toMergedObj(gameStats, charStats, weapStats);
}

export function buildEquipMap(equipList = [], isTrialBuild = false) {
  const equipMap = {};

  function addToEquipMap(stat, value) {
    const normalized = !isTrialBuild && stat.endsWith('%')
      ? value / 10000
      : value;
    equipMap[stat] = (equipMap[stat] ?? 0) + normalized;
  }

  for (const equip of equipList) {
    if (!equip) continue;

    if ('mainstatId' in equip && equip.mainstatValue) {
      addToEquipMap(equip.mainstatId, equip.mainstatValue);
    }

    if ('mainstatSubId' in equip && equip.mainstatSubValue) {
      addToEquipMap(equip.mainstatSubId, equip.mainstatSubValue);
    }

    if ('substats' in equip) {
      for (const line of equip.substats) {
        if (!line) continue;

        if ('id' in line && line.value) {
          addToEquipMap(line.id, line.value);
        }
      }
    }
  }

  return equipMap;
}

export function buildMenuMap(gameId, charId, team) {
  const member = team.find((member) => member?.id === charId);

  const baseMap = buildBaseMap(gameId, charId, member.weaponId);
  const equipMap = buildEquipMap(member.build?.equipList ?? []);

  // Static buffs from effects
  const effectMaps = [];
  const isStaticBuff = (effect) => (
    effect.buff?.stats &&
    !effect.buff?.filter &&
    !effect.apply
  );
  const appliesToCharId = (effect) =>
    !effect.stores ||
    toArray(effect.stores).some((store) => ['global', '$team', charId].includes(store));
  
  const character = CHARACTER[gameId][charId];
  if (character.effects) {
    const memberIds = team.filter((member) => member?.id).map((member) => member.id);
    for (const effect of character.effects) {
      if (
        !isEnabledChar(effect, member, gameId, memberIds) ||
        !isStaticBuff(effect) ||
        !appliesToCharId(effect)
      ) continue;
      effectMaps.push(effect.buff.stats);
    }
  }

  const weapon = WEAPON[gameId][member.weaponId] ?? {};
  if (weapon.effects) {
    for (const effect of weapon.effects) {
      if (
        !isEnabledWeap(effect, character, weapon) ||
        !isStaticBuff(effect) ||
        !appliesToCharId(effect)
      ) continue;
      const resolvedMap = {};
      for (const [stat, value] of Object.entries(effect.buff.stats)) {
        resolvedMap[stat] = resolveRankedValue(value, member.weaponRank);
      }
      effectMaps.push(resolvedMap);
    }
  }

  const allSetEffects =
    Object.entries(member.setCounts)
      .flatMap(([setId, pcCount]) =>
        SET[gameId][setId].effects.filter((effect) =>
          isEnabledSet(effect, pcCount, character)
        )
      );
  for (const effect of allSetEffects) {
    if (
      !isStaticBuff(effect) ||
      !appliesToCharId(effect)
    ) continue;
    effectMaps.push(effect.buff.stats);
  }

  const echo = ECHO[member.mainEcho] ?? {};
  if (echo.effects) {
    for (const effect of echo.effects) {
      if (
        !isEnabledEcho(effect, character) ||
        !isStaticBuff(effect) ||
        !appliesToCharId(effect)
      ) continue;
      effectMaps.push(effect.buff.stats);
    }
  }

  return toMergedObj(baseMap, equipMap, ...effectMaps);
}
