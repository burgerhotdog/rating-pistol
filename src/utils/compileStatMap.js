import { CHARACTERS, WEAPONS, STATS } from "@/data";
import { mergeEquipList, mergeStatMaps, getFixedSetBuffs, getVariableSetBuffs, computeTotalStat } from '@/utils';

function buildVariableSourceMap(mergedSourceMap, variableStats) {
  const varSourceMap = {};
  for (const [stat, details] of Object.entries(variableStats)) {
    const { source, offset = 0, value, max = Infinity } = details;
    const totalStat = computeTotalStat(source[0], mergedSourceMap);
    const mult = (totalStat - offset) / source[1];
    const variableStatValue = Math.min(mult * value, max);
    varSourceMap[stat] = (varSourceMap[stat] ?? 0) + variableStatValue;
  }
  return varSourceMap;
}

export function compileStatMap(gameId, characterId, build, team, mode) {
  const inCombat = mode === "combat";
  const { weaponId, equipList } = build;

  const { fixedMenuSetBuffs, fixedCombatSetBuffs } = getFixedSetBuffs(gameId, equipList);
  const fixedSetBuffs = inCombat
    ? mergeStatMaps(fixedMenuSetBuffs, fixedCombatSetBuffs)
    : fixedMenuSetBuffs;

  const fixedTeamBuffs = team.reduce((acc, member) => {
    const { combatBuffs } = CHARACTERS[gameId][characterId];
    if (!combatBuffs) return acc;
    const { self, ally, team } = combatBuffs;
    const buffMap = member === characterId
      ? mergeStatMaps(self?.fixedStats ?? {}, team?.fixedStats ?? {})
      : mergeStatMaps(ally?.fixedStats ?? {}, team?.fixedStats ?? {});
    return mergeStatMaps(acc, buffMap);
  }, {});

  const fixedStatMap = mergeStatMaps(
    STATS[gameId].DEFAULT_STATS,
    CHARACTERS[gameId][characterId].fixedStats,
    WEAPONS[gameId][weaponId].fixedStats,
    mergeEquipList(equipList),
    fixedSetBuffs,
    inCombat ? fixedTeamBuffs : {}
  );

  const { variableMenuSetBuffs, variableCombatSetBuffs } = getVariableSetBuffs(gameId, equipList, fixedStatMap);
  const variableSetBuffs = inCombat
    ? mergeStatMaps(variableMenuSetBuffs, variableCombatSetBuffs)
    : variableMenuSetBuffs;

  const variableSelfBuffs = team.reduce((acc, member) => {
    if (member !== characterId) return acc;
    const { combatBuffs } = CHARACTERS[gameId][characterId];
    if (!combatBuffs) return acc;
    const { self, team } = combatBuffs;
    const selfVariableStatMap = buildVariableSourceMap(fixedStatMap, self?.variableStats ?? {});
    const teamVariableStatMap = buildVariableSourceMap(fixedStatMap, team?.variableStats ?? {});
    return mergeStatMaps(acc, selfVariableStatMap, teamVariableStatMap);
  }, {});

  const variableStatMap = mergeStatMaps(
    buildVariableSourceMap(fixedStatMap, CHARACTERS[gameId][characterId].variableStats ?? {}),
    buildVariableSourceMap(fixedStatMap, WEAPONS[gameId][weaponId]?.variableStats ?? {}),
    variableSetBuffs,
    inCombat ? variableSelfBuffs : {}
  );

  return mergeStatMaps(fixedStatMap, variableStatMap);
}
