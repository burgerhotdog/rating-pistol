import { SETS } from '@/data';
import { computeTotalStat } from "@/utils";

export function getFixedSetBuffs(gameId, equipList) {
  const setCounts = equipList.reduce((acc, equip) => {
    const setId = equip?.setId;
    if (!setId) return acc;
    acc[setId] = (acc[setId] ?? 0) + 1;
    return acc;
  }, {});

  const constantMenuSetBuffs = Object.entries(setCounts)
    .flatMap(([setId, activePieces]) => {
      const setData = SETS[gameId][setId];
      if (!setData) return {}; // invalid set
      const { setBonus } = setData;
      if (!setBonus) return {}; // set provides no bonus

      return Object.entries(setBonus)
        .filter(([numPiecesToActivate]) => activePieces >= Number(numPiecesToActivate))
        .reduce((acc, [, { stats }]) => {
          if (!stats) return acc;

          const { constant } = stats;
          if (!constant) return acc;

          const statsList = Object.entries(constant);
          for (const [statId, statValue] of statsList) {
            acc[statId] = (acc[statId] ?? 0) + statValue;
          }
          return acc;
        }, {});
    })
    .reduce((acc, effects) => {
      for (const [statId, statValue] of Object.entries(effects)) {
        acc[statId] = (acc[statId] ?? 0) + statValue;
      }
      return acc;
    }, {});

  const constantCombatSetBuffs = Object.entries(setCounts)
    .flatMap(([setId, activePieces]) => {
      const setData = SETS[gameId][setId];
      if (!setData) return {}; // invalid set
      const { setBonus } = setData;
      if (!setBonus) return {}; // set provides no bonus

      return Object.entries(setBonus)
        .filter(([numPiecesToActivate]) => activePieces >= Number(numPiecesToActivate))
        .reduce((acc, [, { buffs }]) => {
          if (!buffs) return acc;

          const { constant } = buffs;
          if (!constant) return acc;

          const statsList = Object.entries(constant);
          for (const [statId, statValue] of statsList) {
            acc[statId] = (acc[statId] ?? 0) + statValue;
          }
          return acc;
        }, {});
    })
    .reduce((acc, effects) => {
      for (const [statId, statValue] of Object.entries(effects)) {
        acc[statId] = (acc[statId] ?? 0) + statValue;
      }
      return acc;
    }, {});

  return { constantMenuSetBuffs, constantCombatSetBuffs };
}

export function getVariableSetBuffs(gameId, equipList, statMap) {
  const setCounts = equipList.reduce((acc, equip) => {
    const setId = equip?.setId;
    if (!setId) return acc;
    acc[setId] = (acc[setId] ?? 0) + 1;
    return acc;
  }, {});

  const variableMenuSetBuffs = Object.entries(setCounts)
    .flatMap(([setId, activePieces]) => {
      const setData = SETS[gameId][setId];
      if (!setData) return {}; // invalid set
      const { setBonus } = setData;
      if (!setBonus) return {}; // set provides no bonus

      return Object.entries(setBonus)
        .filter(([numPiecesToActivate]) => activePieces >= Number(numPiecesToActivate))
        .reduce((acc, [, { stats }]) => {
          if (!stats) return acc;

          const { variable } = stats;
          if (!variable) return acc;

          const statsList = Object.entries(variable);
          for (const [statId, statParams] of statsList) {
            const { source, offset, value, max } = statParams;
            const totalSource = computeTotalStat(source[0], statMap);
            const mult = (totalSource - (offset ?? 0)) / source[1];
            const statValue = Math.min(mult * value, max);
            acc[statId] = (acc[statId] ?? 0) + statValue;
          }
          return acc;
        }, {});
    })
    .reduce((acc, effects) => {
      for (const [statId, statValue] of Object.entries(effects)) {
        acc[statId] = (acc[statId] ?? 0) + statValue;
      }
      return acc;
    }, {});

  const variableCombatSetBuffs = Object.entries(setCounts)
    .flatMap(([setId, activePieces]) => {
      const setData = SETS[gameId][setId];
      if (!setData) return {}; // invalid set
      const { setBonus } = setData;
      if (!setBonus) return {}; // set provides no bonus

      return Object.entries(setBonus)
        .filter(([numPiecesToActivate]) => activePieces >= Number(numPiecesToActivate))
        .reduce((acc, [, { buffs }]) => {
          if (!buffs) return acc;

          const { variable } = buffs;
          if (!variable) return acc;

          const statsList = Object.entries(variable);
          for (const [statId, statParams] of statsList) {
            const { source, offset, value, max } = statParams;
            const totalSource = computeTotalStat(source[0], statMap);
            const mult = (totalSource - (offset ?? 0)) / source[1];
            const statValue = Math.min(mult * value, max);
            acc[statId] = (acc[statId] ?? 0) + statValue;
          }
          return acc;
        }, {});
    })
    .reduce((acc, effects) => {
      for (const [statId, statValue] of Object.entries(effects)) {
        acc[statId] = (acc[statId] ?? 0) + statValue;
      }
      return acc;
    }, {});

  return { variableMenuSetBuffs, variableCombatSetBuffs };
}
