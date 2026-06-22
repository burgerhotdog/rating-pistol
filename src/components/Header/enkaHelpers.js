import { GI, HSR, ZZZ, CHARACTER, WEAPON } from '@/data';
import ENKA_LOOKUP from './enkaLookup';

const BASE_URL = 'https://rating-pistol.vercel.app/api/proxy?suffix=';

const SUFFIX = {
  [GI]: 'uid/',
  [HSR]: 'hsr/uid/',
  [ZZZ]: 'zzz/uid/',
};

const ERROR_CODES = {
  400: 'Wrong UID format',
  404: 'Player does not exist',
  424: 'Game maintenance',
  429: 'Rate-limited',
  500: 'General server error',
  503: 'Server error',
};

const parseAvatarList = {
  [GI]: data => data.avatarInfoList ?? [],
  [HSR]: data => data.detailInfo?.avatarDetailList ?? [],
  [ZZZ]: data => (data.PlayerInfo?.ShowcaseDetail?.AvatarList ?? []).map(entry => ({
    ...entry,
    avatarId: entry.Id,
  })),
};

export const fetchEnka = async (gameId, uid) => {
  try {
    const response = await fetch(`${BASE_URL}${SUFFIX[gameId]}${uid}`);

    if (!response.ok) {
      const { status } = response;
      return [status, ERROR_CODES[status]];
    }

    const rawData = await response.json();
    const avatarList = parseAvatarList[gameId](rawData)
      .filter(({ avatarId }) => avatarId in CHARACTER[gameId]);

    if (!avatarList.length) {
      return [204, 'Profile showcase empty'];
    }

    return [200, avatarList];
  } catch {
    return [500, ERROR_CODES['500']];
  }
};

const parseLevel = {
  [GI]: obj => Number(obj.propMap['4001'].val),
  [HSR]: obj => obj.level,
  [ZZZ]: obj => obj.Level,
};

const parseRank = {
  [GI]: obj => (obj.talentIdList ?? []).length,
  [HSR]: obj => obj.rank ?? 0,
  [ZZZ]: obj => obj.TalentLevel,
};

const parseChar = (gameId, charObj) => ({
  level: parseLevel[gameId](charObj),
  rank: parseRank[gameId](charObj),
});

const parseWeaponId = {
  [GI]: obj => obj.equipList.at(-1)?.itemId,
  [HSR]: obj => obj.equipment?.tid,
  [ZZZ]: obj => obj.Weapon?.Id,
};

const parseWeaponLevel = {
  [GI]: obj => obj.equipList.at(-1).weapon.level,
  [HSR]: obj => obj.equipment.level,
  [ZZZ]: obj => obj.Weapon.Level,
};

const parseWeaponRank = {
  [GI]: obj => Object.values(obj.equipList.at(-1).weapon.affixMap)[0] + 1,
  [HSR]: obj => obj.equipment.rank,
  [ZZZ]: obj => obj.Weapon.UpgradeLevel,
};

const parseWeapon = (gameId, charObj) => {
  const weaponId = parseWeaponId[gameId](charObj);
  if (!(weaponId in WEAPON[gameId])) return { weaponId: null, weaponLevel: null, weaponRank: null };

  return {
    weaponId: String(weaponId),
    weaponLevel: parseWeaponLevel[gameId](charObj),
    weaponRank: parseWeaponRank[gameId](charObj),
  }
};

const PARSE_EQUIPLIST = {
  [GI]: enka => enka.equipList.slice(0, -1),
  [HSR]: enka => enka.relicList,
  [ZZZ]: enka => enka.EquippedList,
};

const PARSE_MAIN_INDEX = {
  [GI]: equip => [
    'EQUIP_BRACER',
    'EQUIP_NECKLACE',
    'EQUIP_SHOES',
    'EQUIP_RING',
    'EQUIP_DRESS',
  ].indexOf(equip.flat.equipType),
  [HSR]: equip => equip.type - 1,
  [ZZZ]: equip => equip.Slot - 1,
};

const PARSE_MAIN_STAT = {
  [GI]: equip => equip.flat.reliquaryMainstat.mainPropId,
  [HSR]: equip => equip._flat.props[0].type,
  [ZZZ]: equip => equip.Equipment.MainPropertyList[0].PropertyId,
};

const PARSE_MAIN_VALUE = {
  [GI]: equip => {
    const key = equip.flat.reliquaryMainstat.mainPropId;
    const valueRatio = ENKA_LOOKUP[GI][key].endsWith('%') ? 0.01 : 1;
    return equip.flat.reliquaryMainstat.statValue * valueRatio;
  },
  [HSR]: equip => equip._flat.props[0].value,
  [ZZZ]: equip => {
    const key = ENKA_LOOKUP[ZZZ][equip.Equipment.MainPropertyList[0].PropertyId];
    const valueRatio = key.endsWith('%') ? 0.0001 : 1;
    return equip.Equipment.MainPropertyList[0].PropertyValue * 4 * valueRatio;
  },
};

const PARSE_SETID = {
  [GI]: equip => String(equip.flat.setId),
  [HSR]: equip => String(equip._flat.setID),
  [ZZZ]: equip => `${String(equip.Equipment.Id).slice(0, 3)}00`,
};

const PARSE_SUBLIST = {
  [GI]: equip => equip.flat.reliquarySubstats,
  [HSR]: equip => equip._flat.props.slice(1),
  [ZZZ]: equip => equip.Equipment.RandomPropertyList,
};

const PARSE_SUB_STAT = {
  [GI]: sub => sub.appendPropId,
  [HSR]: sub => sub.type,
  [ZZZ]: sub => sub.PropertyId,
};

const PARSE_SUB_VALUE = {
  [GI]: sub => {
    const key = sub.appendPropId;
    const valueRatio = ENKA_LOOKUP[GI][key].endsWith('%') ? 0.01 : 1;
    return sub.statValue * valueRatio;
  },
  [HSR]: sub => sub.value,
  [ZZZ]: sub => {
    const key = ENKA_LOOKUP[ZZZ][sub.PropertyId];
    const value = sub.PropertyValue;
    const valueRatio = key.endsWith('%') ? 0.0001 : 1;
    const timesAppeared = sub.PropertyLevel;
    return value * valueRatio * timesAppeared;
  },
};

const template = gameId => ({
  lastUpdated: null,
  weaponId: null,
  equipList: Array(gameId === GI ? 5 : 6).fill().map(() => ({
    setId: null,
    mainStatId: null,
    mainStatValue: null,
    subStatList: Array(4).fill().map(() => ({
      subStatId: null,
      subStatValue: null
    }))
  })),
});

export function parseEnkaObj(gameId, enkaObj) {
  const avatarId = String(enkaObj.avatarId);
  const avatarData = template(gameId);

  const { level, rank } = parseChar(gameId, enkaObj);
  avatarData.level = level;
  avatarData.rank = rank;

  const { weaponId, weaponLevel, weaponRank } = parseWeapon(gameId, enkaObj);
  avatarData.weaponId = weaponId;
  avatarData.weaponLevel = weaponLevel;
  avatarData.weaponRank = weaponRank;

  // equipList
  const equipList = PARSE_EQUIPLIST[gameId](enkaObj) ?? [];
  for (const equipObj of equipList) {
    const indexMain = PARSE_MAIN_INDEX[gameId](equipObj);

    // set id
    avatarData.equipList[indexMain].setId = PARSE_SETID[gameId](equipObj);

    // main stat
    const mainStat = PARSE_MAIN_STAT[gameId](equipObj);
    avatarData.equipList[indexMain].mainStatId = ENKA_LOOKUP[gameId][mainStat];

    // main value
    const mainValue = PARSE_MAIN_VALUE[gameId](equipObj);
    avatarData.equipList[indexMain].mainStatValue = Number(mainValue);

    // sub stats
    const subStatList = PARSE_SUBLIST[gameId](equipObj);
    if (!subStatList) continue;
    for (const [indexSub, subObj] of subStatList.entries()) {
      // stat
      const subStat = PARSE_SUB_STAT[gameId](subObj);
      avatarData.equipList[indexMain].subStatList[indexSub].subStatId = ENKA_LOOKUP[gameId][subStat];

      // value
      const subValue = PARSE_SUB_VALUE[gameId](subObj);
      avatarData.equipList[indexMain].subStatList[indexSub].subStatValue = Number(subValue);
    }
  }

  return [avatarId, avatarData];
}
