import { GI, HSR, WW, ZZZ } from '@/data';
import { getAttr } from '@/utils';

const BASE_RES = { [GI]: 0.1, [HSR]: 0, [WW]: 0.1, [ZZZ]: -0.2 };

export const createGetResMult = (gameId) => {
  const baseRes = BASE_RES[gameId];
  const keyword = gameId === HSR ? 'Pen' : 'Ignore';
  const threshold = gameId === WW ? 0.8 : 0.75;

  const getMult = (res) => {
    if (gameId === HSR || gameId === ZZZ) {
      return 1 - res;
    }

    if (res < 0) {
      return 1 - (res / 2);
    } else if (res < threshold) {
      return 1 - res;
    } else {
      return 1 / (5 * res + 1);
    }
  };

  return (element, statMap) => {
    const resReduction = getAttr('resReduction%', statMap);
    const elementResReduction = getAttr(`${element}ResReduction%`, statMap);
    const totalResReduction = resReduction + elementResReduction;

    const resIgnore = getAttr(`res${keyword}%`, statMap);
    const elementResIgnore = getAttr(`${element}Res${keyword}%`, statMap);
    const totalResIgnore = resIgnore + elementResIgnore;

    const totalRes = baseRes - totalResReduction - totalResIgnore;

    return getMult(totalRes);
  }
};
