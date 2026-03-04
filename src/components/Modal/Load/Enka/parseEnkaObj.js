import template from '@/template';
import { WEAPON_DATA, STAT_DATA } from '@data';
import STAT_MAP from './STAT_MAP.json';

const PARSE_EQUIPLIST = {
  'genshin-impact': (enka) => enka.equipList.slice(0, -1),
  'honkai-star-rail': (enka) => enka.relicList,
  'zenless-zone-zero': (enka) => enka.EquippedList,
};

const GI_EQUIP_TYPE = [
  'EQUIP_BRACER',
  'EQUIP_NECKLACE',
  'EQUIP_SHOES',
  'EQUIP_RING',
  'EQUIP_DRESS',
];

const PARSE_MAIN_INDEX = {
  'genshin-impact': (equip) => GI_EQUIP_TYPE.indexOf(equip.flat.equipType),
  'honkai-star-rail': (equip) => equip.type - 1,
  'zenless-zone-zero': (equip) => equip.Slot - 1,
};

const PARSE_MAIN_STAT = {
  'genshin-impact': (equip) => equip.flat.reliquaryMainstat.mainPropId,
  'honkai-star-rail': (equip) => equip._flat.props[0].type,
  'zenless-zone-zero': (equip) => equip.Equipment.MainPropertyList[0].PropertyId,
};

const PARSE_SUBLIST = {
  'genshin-impact': (equip) => equip.flat.reliquarySubstats,
  'honkai-star-rail': (equip) => equip._flat.props.slice(1),
  'zenless-zone-zero': (equip) => equip.Equipment.RandomPropertyList,
};

const PARSE_SUB_STAT = {
  'genshin-impact': (sub) => sub.appendPropId,
  'honkai-star-rail': (sub) => sub.type,
  'zenless-zone-zero': (sub) => sub.PropertyId,
};

const PARSE_SUB_VALUE = {
  'genshin-impact': (sub) => sub.statValue,
  'honkai-star-rail': (sub) => {
    const valueRatio = sub.type.slice(-5) === 'Delta' ? 1 : 100;
    const roundAmount = valueRatio === 1 ? 1 : 10;
    return Math.round((sub.value * valueRatio) * roundAmount) / roundAmount;
  },
  'zenless-zone-zero': (sub) => {
    const key = STAT_MAP['zenless-zone-zero'][sub.PropertyId];
    const value = sub.PropertyValue;
    const valueRatio = STAT_DATA['zenless-zone-zero'][key].showPercent ? 0.01 : 1;
    const roundAmount = valueRatio === 1 ? 1 : 10;
    const timesAppeared = sub.PropertyLevel;
    return Math.round(((value * valueRatio) * timesAppeared) * roundAmount) / roundAmount;
  },
};

export default (gameId, enkaObj) => {
  const id = Number(enkaObj.avatarId);
  const data = template(gameId);

  // weapon
  if (gameId === 'genshin-impact') {
    // get id
    const weaponObj = enkaObj.equipList[enkaObj.equipList.length - 1];
    const weaponId = Number(weaponObj.itemId);
    // validate
    if (WEAPON_DATA['genshin-impact'][weaponId])
      data.weaponId = weaponId;
  } else {
    // get id
    const weaponObj = gameId === 'honkai-star-rail' ? enkaObj.equipment : enkaObj.Weapon;
    const weaponId = gameId === 'honkai-star-rail' ? weaponObj?.tid : weaponObj?.Id;
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
    data.equipList[i].mainStatId = STAT_MAP[gameId][main_stat];

    // substats
    const subList = PARSE_SUBLIST[gameId](equipObj);
    if (!subList) continue;
    for (const [j, subObj] of subList.entries()) {
      // stat
      const sub_stat = PARSE_SUB_STAT[gameId](subObj);
      data.equipList[i].subStatList[j].subStatId = STAT_MAP[gameId][sub_stat];

      // value
      const sub_value = PARSE_SUB_VALUE[gameId](subObj);
      data.equipList[i].subStatList[j].value = Number(sub_value);
    }
  }

  return [id, data];
};
