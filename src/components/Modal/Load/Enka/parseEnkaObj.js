import template from '@/template';
import { WEAPON_DATA, STAT_DATA } from '@data';
import STAT_MAP from './STAT_MAP.json';

const PARSE_EQUIPLIST = {
  gi: (enka) => enka.equipList.slice(0, -1),
  hsr: (enka) => enka.relicList,
  zzz: (enka) => enka.EquippedList,
};

const GI_EQUIP_TYPE = [
  'EQUIP_BRACER',
  'EQUIP_NECKLACE',
  'EQUIP_SHOES',
  'EQUIP_RING',
  'EQUIP_DRESS',
];

const PARSE_MAIN_INDEX = {
  gi: (equip) => GI_EQUIP_TYPE.indexOf(equip.flat.equipType),
  hsr: (equip) => equip.type - 1,
  zzz: (equip) => equip.Slot - 1,
};

const PARSE_MAIN_STAT = {
  gi: (equip) => equip.flat.reliquaryMainstat.mainPropId,
  hsr: (equip) => equip._flat.props[0].type,
  zzz: (equip) => equip.Equipment.MainPropertyList[0].PropertyId,
};

const PARSE_SUBLIST = {
  gi: (equip) => equip.flat.reliquarySubstats,
  hsr: (equip) => equip._flat.props.slice(1),
  zzz: (equip) => equip.Equipment.RandomPropertyList,
};

const PARSE_SUB_STAT = {
  gi: (sub) => sub.appendPropId,
  hsr: (sub) => sub.type,
  zzz: (sub) => sub.PropertyId,
};

const PARSE_SUB_VALUE = {
  gi: (sub) => sub.statValue,
  hsr: (sub) => {
    const valueRatio = sub.type.slice(-5) === 'Delta' ? 1 : 100;
    const roundAmount = valueRatio === 1 ? 1 : 10;
    return Math.round((sub.value * valueRatio) * roundAmount) / roundAmount;
  },
  zzz: (sub) => {
    const key = STAT_MAP.zzz[sub.PropertyId];
    const value = sub.PropertyValue;
    const valueRatio = STAT_DATA.zzz[key].showPercent ? 0.01 : 1;
    const roundAmount = valueRatio === 1 ? 1 : 10;
    const timesAppeared = sub.PropertyLevel;
    return Math.round(((value * valueRatio) * timesAppeared) * roundAmount) / roundAmount;
  },
};

export default (gameId, enkaObj) => {
  const id = Number(enkaObj.avatarId);
  const data = template(gameId);

  // weapon
  if (gameId === 'gi') {
    // get id
    const weaponObj = enkaObj.equipList[enkaObj.equipList.length - 1];
    const weaponId = Number(weaponObj.itemId);
    // validate
    if (WEAPON_DATA.gi[weaponId])
      data.weaponId = weaponId;
  } else {
    // get id
    const weaponObj = gameId === 'hsr' ? enkaObj.equipment : enkaObj.Weapon;
    const weaponId = gameId === 'hsr' ? weaponObj?.tid : weaponObj?.Id;
    // validate
    if (WEAPON_DATA[gameId][weaponId])
      data.weaponId = Number(weaponId);
  }

  // equipList
  const equipList = PARSE_EQUIPLIST[gameId](enkaObj);
  for (const equipObj of equipList) {
    // mainstat
    const i = PARSE_MAIN_INDEX[gameId](equipObj);
    const main_stat = PARSE_MAIN_STAT[gameId](equipObj);
    data.equipList[i].stat = STAT_MAP[gameId][main_stat];

    // substats
    const subList = PARSE_SUBLIST[gameId](equipObj);
    if (!subList) continue;
    for (const [j, subObj] of subList.entries()) {
      // stat
      const sub_stat = PARSE_SUB_STAT[gameId](subObj);
      data.equipList[i].statList[j].stat = STAT_MAP[gameId][sub_stat];

      // value
      const sub_value = PARSE_SUB_VALUE[gameId](subObj);
      data.equipList[i].statList[j].value = Number(sub_value);
    }
  }

  return [id, data];
};
