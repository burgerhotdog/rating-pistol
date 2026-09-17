import { GI, HSR, WW, ZZZ, MISC } from '@/data';
import { getAttr } from '@/utils';

const CONFIG = {
  [GI]: {
    getCharLevelFactor: (level) => level + 100,
    getEnemyBaseDef: (level) => level + 100,
  },
  [HSR]: {
    getCharLevelFactor: (level) => level + 20,
    getEnemyBaseDef: (level) => level + 20,
  },
  [WW]: {
    getCharLevelFactor: (level) => 8 * level + 800,
    getEnemyBaseDef: (level) => 8 * level + 792,
  },
  [ZZZ]: {
    getCharLevelFactor: () => 794,
    getEnemyBaseDef: () => 794,
  },
};

export const getDefMult = (gameId, statMap) => {
  const { getCharLevelFactor, getEnemyBaseDef } = CONFIG[gameId];
  const { maxLevel } = MISC[gameId];

  const charLevelFactor = getCharLevelFactor(maxLevel);
  const enemyBaseDef = getEnemyBaseDef(maxLevel);

  const getEnemyDef = (statMap) => {
    const defReduction = getAttr('defReduction%', statMap);
    const defIgnore = getAttr('defIgnore%', statMap);

    if (gameId === HSR) {
      return enemyBaseDef * Math.max(1 - defReduction - defIgnore, 0);
    }

    if (gameId === ZZZ) {
      const penRatio = getAttr('penRatio%', statMap);
      const flatPen = getAttr('pen', statMap);
      return Math.max(enemyBaseDef * (1 - defReduction) * (1 - penRatio) - flatPen, 0);
    }

    return enemyBaseDef * (1 - defReduction) * (1 - defIgnore);
  };

  const enemyDef = getEnemyDef(statMap);
  return charLevelFactor / Math.max(charLevelFactor + enemyDef, Number.EPSILON);
};
