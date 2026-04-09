import { STATS } from "@/data";
import { computeDamage, compileStatMap, computeTotalStat } from "@/utils";
import { matchPenalty } from './helpers/matchPenalty';

export function findPreferred(trial, gameId, characterId, criteria, team, matchTargets) {
  const { MAIN_STAT_TYPES } = STATS[gameId];

  return MAIN_STAT_TYPES.map((slotTypes, index) => {
    if (Object.keys(slotTypes).length === 1) {
      return [Object.keys(slotTypes)[0]];
    }

    const preferred = [];
    for (const [id, data] of Object.entries(slotTypes)) {
      const testObj = { mainStatId: id, mainStatValue: data.VALUE, subStatList: [] };
      const testEquipList = trial.build.equipList.map((equip, idx) => {
        if (idx === index) return testObj;
        return equip;
      });
      const testBuild = { ...trial.build, equipList: testEquipList };

      const testDamage = computeDamage(gameId, characterId, testBuild, criteria, team);
      const testPenalty = (criteria.match ?? []).reduce((acc, stat, index) => {
        const currentValue = computeTotalStat(stat, compileStatMap(gameId, characterId, testBuild, team, "menu"));
        const targetValue = matchTargets[index];
        return acc * matchPenalty(currentValue, targetValue);
      }, 1)

      if (testDamage * testPenalty > trial.scores[0] * trial.penalty) {
        preferred.push(id);
      }
    }

    if (!preferred.length) return Object.keys(slotTypes);
    return preferred;
  });
}
