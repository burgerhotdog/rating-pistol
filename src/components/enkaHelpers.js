import { AVATAR_DATA, WEAPON_DATA, STAT_DATA } from '@data';
import template from '@/template';
import ENKA_STAT_MAP from './ENKA_STAT_MAP.json';

// FETCH HELPERS
const BASE_URL = 'https://rating-pistol.vercel.app/api/proxy?suffix=';

const SUFFIX = {
  'genshin-impact': 'uid/',
  'honkai-star-rail': 'hsr/uid/',
  'zenless-zone-zero': 'zzz/uid/',
};

const ERROR_CODES = {
  400: 'Wrong UID format',
  404: 'Player does not exist',
  424: 'Game maintenance',
  429: 'Rate-limited',
  500: 'General server error',
  503: 'Server error',
};

// returns list if valid, otherwise returns error message string
export async function fetchEnka(gameId, uid) {
  try {
    // fetch response
    const response = await fetch(`${BASE_URL}${SUFFIX[gameId]}${uid}`);
    if (!response.ok) {
      return [response.status, ERROR_CODES[response.status]];
    }

    // pick out avatar list from response
    const rawEnka = await response.json();
    let avatarList;
    switch (gameId) {
      case 'genshin-impact':
        avatarList = rawEnka.avatarInfoList;
        break;
      case 'honkai-star-rail':
        avatarList = rawEnka.detailInfo?.avatarDetailList;
        break;
      case 'zenless-zone-zero':
        avatarList = rawEnka.PlayerInfo?.ShowcaseDetail?.AvatarList;
        avatarList = avatarList?.map(entry => ({
          ...entry,
          avatarId: entry.Id
        }));
        break;
    }

    // prune unrecognized avatars
    const validList = avatarList?.filter(({ avatarId }) => {
      AVATAR_DATA[gameId][avatarId];
    });

    // empty list case
    if (!validList?.length) {
      return [204, 'Profile showcase empty'];
    }

    return [200, validList];
  } catch (err) {
    return [500, ERROR_CODES['500']];
  }
};

// PARSE HELPERS
const PARSE_WEAPONID = {
  'genshin-impact': (enka) => {
    const weaponObj = enka.equipList[enka.equipList.length - 1];
    const weaponId = String(weaponObj.itemId);
    return WEAPON_DATA['genshin-impact'][weaponId] ? weaponId : null;
  },
  'honkai-star-rail': (enka) => {
    const weaponObj = enka.equipment;
    const weaponId = weaponObj?.tid;
    return WEAPON_DATA['honkai-star-rail'][weaponId] ? String(weaponId) : null;
  },
  'zenless-zone-zero': (enka) => {
    const weaponObj = enka.Weapon;
    const weaponId = weaponObj?.Id;
    return WEAPON_DATA['zenless-zone-zero'][weaponId] ? String(weaponId) : null;
  },
};

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

const PARSE_SET_ID = {
  'genshin-impact': (equip) => String(equip.flat.setId),
  'honkai-star-rail': (equip) => String(equip._flat.setId),
  'zenless-zone-zero': (equip) => String(equip.Equipment.Id).slice(0, 3),
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
    const key = ENKA_STAT_MAP['zenless-zone-zero'][sub.PropertyId];
    const value = sub.PropertyValue;
    const valueRatio = STAT_DATA['zenless-zone-zero'][key].showPercent ? 0.01 : 1;
    const roundAmount = valueRatio === 1 ? 1 : 10;
    const timesAppeared = sub.PropertyLevel;
    return Math.round(((value * valueRatio) * timesAppeared) * roundAmount) / roundAmount;
  },
};

export function parseEnkaObj(gameId, enkaObj) {
  const avatarId = String(enkaObj.avatarId);
  const avatarData = template(gameId);

  // weapon
  avatarData.weaponId = PARSE_WEAPONID[gameId](enkaObj);

  // equipList
  const equipList = PARSE_EQUIPLIST[gameId](enkaObj) ?? [];
  for (const equipObj of equipList) {
    // main stat
    const indexMain = PARSE_MAIN_INDEX[gameId](equipObj);
    const mainStat = PARSE_MAIN_STAT[gameId](equipObj);
    avatarData.equipList[indexMain].mainStatId = ENKA_STAT_MAP[gameId][mainStat];

    // sub stats
    const subStatList = PARSE_SUBLIST[gameId](equipObj);
    if (!subStatList) continue;
    for (const [indexSub, subObj] of subStatList.entries()) {
      // stat
      const subStat = PARSE_SUB_STAT[gameId](subObj);
      avatarData.equipList[indexMain].subStatList[indexSub].subStatId = ENKA_STAT_MAP[gameId][subStat];

      // value
      const subValue = PARSE_SUB_VALUE[gameId](subObj);
      avatarData.equipList[indexMain].subStatList[indexSub].value = Number(subValue);
    }
  }

  return [avatarId, avatarData];
};
