import { GI, HSR, WW, ZZZ } from '@/data';
import { getAttr } from '@/utils';

const BASE_DEF = { [GI]: 1512, [HSR]: 1512, [WW]: 1512, [ZZZ]: 1512 };

export const createGetDefMult = (gameId) => {
  const baseDef = BASE_DEF[gameId];

  const getEnemyDef = (enemyMap, statMap) => {
    const defReduction = getAttr('defReduction%', enemyMap);
    const defIgnore = getAttr('defIgnore%', statMap);

    if (gameId === HSR) {
      return baseDef * (1 - defReduction - defIgnore);
    }

    return baseDef * (1 - defReduction) * (1 - defIgnore);
  };

  const getMult = (def, statMap) => {
    switch (gameId) {
      case GI:
        return 190 / (def + 190);

      case HSR:
        return 100 / (100 * def + 100);

      case WW:
        return 1520 / (1520 + def);

      case ZZZ: {
        const penRatio = getAttr('penRatio%', statMap);
        const flatPen = getAttr('pen', statMap);
        return 794 / (Math.max(def * (1 - penRatio) - flatPen, 0) + 794);
      }
    }
  };

  return (enemyMap, statMap = {}) => {
    const enemyDef = getEnemyDef(enemyMap, statMap);
    return getMult(enemyDef, statMap);
  };
};