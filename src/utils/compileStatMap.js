import { CHARACTERS, WEAPONS, STATS } from "@/data";
import { mergeEquipList, mergeStatMaps, getFixedSetBuffs, getVariableSetBuffs, computeTotalStat } from '@/utils';

function buildVariableSourceMap(mergedSourceMap, variable) {
  const varSourceMap = {};
  for (const [stat, details] of Object.entries(variable)) {
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

  const { constantMenuSetBuffs, constantCombatSetBuffs } = getFixedSetBuffs(gameId, equipList);
  const constantSetBuffs = inCombat
    ? mergeStatMaps(constantMenuSetBuffs, constantCombatSetBuffs)
    : constantMenuSetBuffs;

  const constantTeamBuffs = team.reduce((acc, member) => {
    const { buffs } = CHARACTERS[gameId][member] ?? {};
    if (!buffs) return acc;
    const { self, ally, team } = buffs;
    const buffMap = member === characterId
      ? mergeStatMaps(self?.constant ?? {}, team?.constant ?? {})
      : mergeStatMaps(ally?.constant ?? {}, team?.constant ?? {});
    return mergeStatMaps(acc, buffMap);
  }, {});

  const constantStatMap = mergeStatMaps(
    STATS[gameId].DEFAULT_STATS,
    CHARACTERS[gameId][characterId].stats.constant,
    WEAPONS[gameId][weaponId].stats.constant,
    mergeEquipList(equipList),
    constantSetBuffs,
    inCombat ? constantTeamBuffs : {}
  );

  const { variableMenuSetBuffs, variableCombatSetBuffs } = getVariableSetBuffs(gameId, equipList, constantStatMap);
  const variableSetBuffs = inCombat
    ? mergeStatMaps(variableMenuSetBuffs, variableCombatSetBuffs)
    : variableMenuSetBuffs;

  const variableSelfBuffs = team.reduce((acc, member) => {
    if (member !== characterId) return acc;
    const { buffs } = CHARACTERS[gameId][characterId];
    if (!buffs) return acc;
    const { self, team } = buffs;
    const selfVariableStatMap = buildVariableSourceMap(constantStatMap, self?.variable ?? {});
    const teamVariableStatMap = buildVariableSourceMap(constantStatMap, team?.variable ?? {});
    return mergeStatMaps(acc, selfVariableStatMap, teamVariableStatMap);
  }, {});

  const variableStatMap = mergeStatMaps(
    buildVariableSourceMap(constantStatMap, CHARACTERS[gameId][characterId].variable ?? {}),
    buildVariableSourceMap(constantStatMap, WEAPONS[gameId][weaponId]?.variable ?? {}),
    variableSetBuffs,
    inCombat ? variableSelfBuffs : {}
  );

  return mergeStatMaps(constantStatMap, variableStatMap);
}
