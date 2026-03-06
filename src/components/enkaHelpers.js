import { AVATAR_DATA } from '@data';

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
export const fetchEnka = async (gameId, uid) => {
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
        avatarList?.forEach(entry => entry.avatarId = entry.Id);
        break;
    }

    // prune unrecognized avatars
    const validList = avatarList?.filter(({ avatarId }) => {
      return AVATAR_DATA[gameId][avatarId];
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
