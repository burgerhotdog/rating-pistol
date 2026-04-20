import { MISC } from "@/data";
import { computeDamage, compileStatMap, computeTotalStat } from "@/utils";
import { matchPenalty } from './helpers/matchPenalty';

export function findPreferredWuwa(trial, gameId, characterId, calcs, team, matchTargets) {
  const { MAIN_STAT_TYPES } = MISC[gameId];

  return MAIN_STAT_TYPES.map((statOptions, costIndex) => {
    if (costIndex === 0 || costIndex === 2) return [];

    const preferred = [];
    for (const [id, data] of Object.entries(statOptions)) {
      const testObj = { mainStatId: id, mainStatValue: data.VALUE, subStatList: [] };
      const testBuild = { ...trial.build, equipList: [testObj] };

      const testDamage = computeDamage(gameId, characterId, testBuild, calcs, team);
      const testPenalty = (calcs.match ?? []).reduce((acc, stat, index) => {
        const currentValue = computeTotalStat(stat, compileStatMap(gameId, characterId, testBuild, team, "menu"));
        const targetValue = matchTargets[index];
        return acc * matchPenalty(currentValue, targetValue);
      }, 1)

      if (testDamage * testPenalty > trial.scores[0] * trial.penalty) {
        preferred.push(id);
      }
    }

    if (!preferred.length) return Object.keys(statOptions);
    return preferred;
  });
}


export function findPreferred(trial, gameId, characterId, calcs, team, matchTargets) {
  const { MAIN_STAT_TYPES } = MISC[gameId];

  return MAIN_STAT_TYPES.map((statOptions, slotIndex) => {
    if (Object.keys(statOptions).length === 1) {
      return [Object.keys(statOptions)[0]];
    }

    const preferred = [];
    for (const [id, data] of Object.entries(statOptions)) {
      const testObj = { mainStatId: id, mainStatValue: data.VALUE, subStatList: [] };
      const testEquipList = trial.build.equipList.map((equip, index) => {
        if (index === slotIndex) return testObj;
        return equip;
      });
      const testBuild = { ...trial.build, equipList: testEquipList };

      const testDamage = computeDamage(gameId, characterId, testBuild, calcs, team);
      const testPenalty = (calcs.match ?? []).reduce((acc, stat, index) => {
        const currentValue = computeTotalStat(stat, compileStatMap(gameId, characterId, testBuild, team, "menu"));
        const targetValue = matchTargets[index];
        return acc * matchPenalty(currentValue, targetValue);
      }, 1)

      if (testDamage * testPenalty > trial.scores[0] * trial.penalty) {
        preferred.push(id);
      }
    }

    if (!preferred.length) return Object.keys(statOptions);
    return preferred;
  });
}
