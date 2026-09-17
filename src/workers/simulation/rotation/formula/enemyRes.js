import { GI, HSR, WW, ZZZ } from '@/data';
import { getAttr } from '@/utils';

const BASE_RES = { [GI]: 0.1, [HSR]: 0, [WW]: 0.1, [ZZZ]: -0.2 };

export const getResMult = (gameId, element, statMap) => {
  const keyword = gameId === HSR ? 'Pen' : 'Ignore';

  let resReduction =
    getAttr('resReduction%', statMap) +
    getAttr(`${element}ResReduction%`, statMap);

  let resIgnore =
    getAttr(`res${keyword}%`, statMap) +
    getAttr(`${element}Res${keyword}%`, statMap);

  if (gameId === GI && element !== 'physical') {
    resReduction += getAttr('elementalResReduction%', statMap);
    resIgnore += getAttr(`elementalRes${keyword}%`, statMap);
  }

  const totalRes = BASE_RES[gameId] - resReduction - resIgnore;

  if (gameId === HSR || gameId === ZZZ) {
    return 1 - totalRes;
  }

  const threshold = gameId === WW ? 0.8 : 0.75;

  if (totalRes < 0) {
    return 1 - (totalRes / 2);
  } else if (totalRes < threshold) {
    return 1 - totalRes;
  } else {
    return 1 / (5 * totalRes + 1);
  }
};
