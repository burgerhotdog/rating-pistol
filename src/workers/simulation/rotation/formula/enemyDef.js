import { GI, HSR, WW, ZZZ } from '@/data';
import { getAttr } from '@/utils';

const CONFIG = {
  [GI]: {
    charLevel: 90,
    getCharLevelFactor: (charLevel) => charLevel + 100,
    enemyLevel: 90,
    getEnemyBaseDef: (enemyLevel) => enemyLevel + 100,
  },
  [HSR]: {
    charLevel: 80,
    getCharLevelFactor: (charLevel) => charLevel + 20,
    enemyLevel: 80,
    getEnemyBaseDef: (enemyLevel) => enemyLevel + 20,
  },
  [WW]: {
    charLevel: 90,
    getCharLevelFactor: (charLevel) => 8 * charLevel + 800,
    enemyLevel: 90,
    getEnemyBaseDef: (enemyLevel) => 8 * enemyLevel + 792,
  },
  [ZZZ]: {
    charLevel: 60,
    getCharLevelFactor: (_) => 794,
    enemyLevel: 60,
    getEnemyBaseDef: (_) => 794,
  },
};

export const createGetDefMult = (gameId) => {
  const { charLevel, getCharLevelFactor, enemyLevel, getEnemyBaseDef } = CONFIG[gameId];
  const charLevelFactor = getCharLevelFactor(charLevel);
  const enemyBaseDef = getEnemyBaseDef(enemyLevel);

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

  return (statMap) => {
    const enemyDef = getEnemyDef(statMap);
    return charLevelFactor / Math.max(charLevelFactor + enemyDef, Number.EPSILON);
  };
};