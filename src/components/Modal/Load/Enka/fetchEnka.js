import { AVATAR_DATA } from '@data';

const BASE_URL = 'https://rating-pistol.vercel.app/api/proxy?suffix=';
const SUFFIX = { gi: 'uid/', hsr: 'hsr/uid/', zzz: 'zzz/uid/' };
const ERROR_CODES = {
  400: 'Wrong UID format',
  404: 'Player does not exist',
  424: 'Game maintenance',
  429: 'Rate-limited',
  500: 'General server error',
  503: 'Server error',
};

// returns list if valid, otherwise returns error message string
export default async (gameId, uid) => {
  try {
    // fetch response
    const response = await fetch(`${BASE_URL}${SUFFIX[gameId]}${uid}`);
    if (!response.ok)
      return ERROR_CODES[response.status];

    // pick out avatar list from response
    const rawEnka = await response.json();
    let avatarList;
    switch (gameId) {
      case 'gi':
        avatarList = rawEnka.avatarInfoList;
        break;
      case 'hsr':
        avatarList = rawEnka.detailInfo?.avatarDetailList;
        break;
      case 'zzz':
        avatarList = rawEnka.PlayerInfo?.ShowcaseDetail?.AvatarList;
        avatarList?.forEach(entry => entry.avatarId = entry.Id);
        break;
    }

    // remove unrecognized avatars
    const validList = avatarList?.filter(({ avatarId }) => {
      return AVATAR_DATA[gameId][avatarId];
    });

    // return list if not empty
    return (validList?.length)
      ? validList
      : 'Profile showcase empty';
  } catch (err) {
    return ERROR_CODES['500'];
  }
};
