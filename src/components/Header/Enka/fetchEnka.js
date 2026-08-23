import { GI, HSR, ZZZ, CHARACTER } from '@/data';

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
  [GI]: (data) => data.avatarInfoList ?? [],
  [HSR]: (data) => data.detailInfo?.avatarDetailList ?? [],
  [ZZZ]: (data) => (data.PlayerInfo?.ShowcaseDetail?.AvatarList ?? []).map((entry) => ({
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
