import { GI, HSR, ZZZ, WEAPON } from '@/data';
import { initBuild } from '@/utils';
import ENKA_LOOKUP from './enkaLookup';

const PARSERS = {
  [GI]: {
    level: (iter) => Number(iter.propMap['4001'].val),
    rank: (iter) => (iter.talentIdList ?? []).length,
    weaponId: (iter) => Number(iter.equipList.at(-1)?.itemId),
    weaponLevel: (iter) => Number(iter.equipList.at(-1).weapon.level),
    weaponRank: (iter) => Number(Object.values(iter.equipList.at(-1).weapon.affixMap)[0]) + 1,
    iterEquips: (iter) => iter.equipList.slice(0, -1) ?? [],
    equipIndex: (equipIter) => ['EQUIP_BRACER', 'EQUIP_NECKLACE', 'EQUIP_SHOES', 'EQUIP_RING', 'EQUIP_DRESS'].indexOf(equipIter.flat.equipType),
    setId: (equipIter) => Number(equipIter.flat.setId),
    mainstatId: (equipIter) => {
      const { mainPropId } = equipIter.flat.reliquaryMainstat;
      return ENKA_LOOKUP[GI][mainPropId];
    },
    mainstatValue: (equipIter) => {
      const { mainPropId, statValue } = equipIter.flat.reliquaryMainstat;
      const isPercent = ENKA_LOOKUP[GI][mainPropId].endsWith('%');
      return isPercent ? statValue * 100 : statValue;
    },
    iterSubs: (equipIter) => equipIter.flat.reliquarySubstats ?? [],
    substatId: (subIter) => {
      const { appendPropId } = subIter;
      return ENKA_LOOKUP[GI][appendPropId];
    },
    substatValue: (subIter) => {
      const { appendPropId, statValue } = subIter;
      const isPercent = ENKA_LOOKUP[GI][appendPropId].endsWith('%');
      return isPercent ? statValue * 100 : statValue;
    },
  },
  [HSR]: {
    level: (iter) => Number(iter.level),
    rank: (iter) => Number(iter.rank ?? 0),
    weaponId: (iter) => Number(iter.equipment?.tid),
    weaponLevel: (iter) => Number(iter.equipment.level),
    weaponRank: (iter) => Number(iter.equipment.rank),
    iterEquips: (iter) => iter.relicList ?? [],
    equipIndex: (equipIter) => Number(equipIter.type) - 1,
    setId: (equipIter) => Number(equipIter._flat.setID),
    mainstatId: (equipIter) => {
      const { type } = equipIter._flat.props[0];
      return ENKA_LOOKUP[HSR][type];
    },
    mainstatValue: (equipIter) => {
      const { type, value } = equipIter._flat.props[0];
      const isPercent = ENKA_LOOKUP[HSR][type].endsWith('%');
      return isPercent ? value * 10000 : value;
    },
    iterSubs: (equipIter) => equipIter._flat.props.slice(1) ?? [],
    substatId: (subIter) => {
      const { type } = subIter;
      return ENKA_LOOKUP[HSR][type];
    },
    substatValue: (subIter) => {
      const { type, value } = subIter;
      const isPercent = ENKA_LOOKUP[HSR][type].endsWith('%');
      return isPercent ? value * 10000 : value;
    },
  },
  [ZZZ]: {
    level: (iter) => Number(iter.Level),
    rank: (iter) => Number(iter.TalentLevel),
    weaponId: (iter) => Number(iter.Weapon?.Id),
    weaponLevel: (iter) => Number(iter.Weapon.Level),
    weaponRank: (iter) => Number(iter.Weapon.UpgradeLevel),
    iterEquips: (iter) => iter.EquippedList ?? [],
    equipIndex: (equipIter) => Number(equipIter.Slot) - 1,
    setId: (equipIter) => Number(`${String(equipIter.Equipment.Id).slice(0, 3)}00`),
    mainstatId: (equipIter) => {
      const { PropertyId } = equipIter.Equipment.MainPropertyList[0];
      return ENKA_LOOKUP[ZZZ][PropertyId];
    },
    mainstatValue: (equipIter) => {
      const { PropertyValue } = equipIter.Equipment.MainPropertyList[0];
      return PropertyValue * 4;
    },
    iterSubs: (equipIter) => equipIter.Equipment.RandomPropertyList ?? [],
    substatId: (subIter) => {
      const { PropertyId } = subIter;
      return ENKA_LOOKUP[ZZZ][PropertyId];
    },
    substatValue: (subIter) => {
      const { PropertyValue, PropertyLevel } = subIter;
      return PropertyValue * PropertyLevel;
    },
  },
};

export function parseEnka(gameId, enkaObj) {
  const parsers = PARSERS[gameId];
  const id = Number(enkaObj.avatarId);
  const build = initBuild(gameId);

  build.id = id;
  build.level = parsers.level(enkaObj);
  build.rank = parsers.rank(enkaObj);

  const weaponId = parsers.weaponId(enkaObj);
  if (weaponId in WEAPON[gameId]) {
    build.weaponId = weaponId;
    build.weaponLevel = parsers.weaponLevel(enkaObj);
    build.weaponRank = parsers.weaponRank(enkaObj);
  }

  for (const equipIter of parsers.iterEquips(enkaObj)) {
    const equipIndex = parsers.equipIndex(equipIter);
    const equip = build.equipList[equipIndex];
    equip.setId = parsers.setId(equipIter);
    equip.mainstatId = parsers.mainstatId(equipIter);
    equip.mainstatValue = parsers.mainstatValue(equipIter);

    for (const [subIndex, subIter] of parsers.iterSubs(equipIter).entries()) {
      const substat = equip.substats[subIndex];
      substat.id = parsers.substatId(subIter);
      substat.value = parsers.substatValue(subIter);
    }
  }

  return [id, build];
}
