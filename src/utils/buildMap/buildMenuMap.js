import { CHARACTER, WEAPON, SET, ECHO } from '@/data';
import { toMergedObj } from '../merge';
import { isEnabledChar, isEnabledWeap, isEnabledSet, isEnabledEcho } from '../isEnabledEffect';
import { resolveRankedValue } from '../resolve';
import { toArray } from '../toArray';
import { buildBaseMap } from './buildBaseMap';
import { buildEquipMap } from './buildEquipMap';

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
