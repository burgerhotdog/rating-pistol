import { CHARACTERS, WEAPONS, SETS, MISC } from "@/data";
import { mergeEquipList, mergeStatMaps, computeTotalStat } from '@/utils';

function constructConstantMap(data, buffTypes) {
  if (!data) return {};
  const { stats, buffs } = data;

  const sources = [
    stats?.constant,
    ...buffTypes.map(type => buffs?.[type]?.constant),
  ].filter(Boolean);

  return mergeStatMaps(...sources);
}

function constructVariableMap(data, buffTypes, statMap) {
  if (!data) return {};
  const { stats, buffs } = data;

  const sources = [
    buildVariableSourceMap(statMap, stats?.variable ?? {}),
    ...buffTypes.map(type => buildVariableSourceMap(statMap, buffs?.[type]?.variable ?? {})),
  ].filter(Boolean);

  return mergeStatMaps(...sources);
}

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
  const characterIndex = team.indexOf(characterId);
  const inCombat = mode === "combat";
  const isFirst = characterIndex === 0;
  const { weaponId, equipList } = build;
  const setCounts = equipList.reduce((acc, equip) => {
    const setId = equip?.setId;
    if (!setId) return acc;
    acc[setId] = (acc[setId] ?? 0) + 1;
    return acc;
  }, {});

  // First construct constant stat map
  const constantSources = [];
  const buffTypes = inCombat ? ["self", "team", ...(isFirst ? ["first"] : [])] : [];
  // Default stats that every character has (e.g. 5% CRIT Rate, 50% CRIT DMG)
  constantSources.push(MISC[gameId].DEFAULT_STATS);
  // Character and weapon specific stats
  constantSources.push(constructConstantMap(CHARACTERS[gameId][characterId], buffTypes));
  constantSources.push(constructConstantMap(WEAPONS[gameId][weaponId], buffTypes));
  // EquipList
  constantSources.push(mergeEquipList(equipList));
  // Set specific stats
  const setBonusDatas = [];
  for (const [setId, activePieces] of Object.entries(setCounts)) {
    const setBonuses = SETS[gameId][setId]?.setBonus;
    if (!setBonuses) continue;
    for (const [numPiecesToActivate, setBonusData] of Object.entries(setBonuses)) {
      if (activePieces < Number(numPiecesToActivate)) continue;
      setBonusDatas.push(setBonusData);
    }
  }

  constantSources.push(
    setBonusDatas.reduce((acc, data) => mergeStatMaps(acc, constructConstantMap(data, buffTypes)), {})
  );

  // From team
  if (inCombat) {
    const teamMaps = [];
    const appliedSetBonuses = new Set();
    for (const [index, member] of Object.entries(team)) {
      const memberData = CHARACTERS[gameId][member];
      if (!memberData || (member === characterId)) continue;

      const isNext = (characterIndex === team.length - 1)
        ? index === 0
        : index === characterIndex + 1;
      const memberBuffTypes = ["ally", "team", ...(isFirst ? ["first"] : []), ...(isNext ? ["next"] : [])];

      if (memberData.preset) {
        const { weaponId, setBonuses = [] } = memberData.preset;
        if (WEAPONS[gameId][weaponId]?.buffs) {
          teamMaps.push(constructConstantMap({ buffs: WEAPONS[gameId][weaponId].buffs }, memberBuffTypes));
        }

        for ( const [setId, numPieces] of setBonuses) {
          const key = `${setId}-${numPieces}`;
          if (appliedSetBonuses.has(key)) continue;
          appliedSetBonuses.add(key);
          teamMaps.push(constructConstantMap({ buffs: SETS[gameId][setId]?.setBonus?.[String(numPieces)]?.buffs ?? {} }, memberBuffTypes));
        }
      }

      if (memberData.buffs) {
        teamMaps.push(constructConstantMap({ buffs: memberData.buffs }, memberBuffTypes));
      }
    }

    constantSources.push(mergeStatMaps(...teamMaps));
  }

  const constantStatMap = mergeStatMaps(...constantSources);
  
  // Then construct variable stat map using source stats from constant stat map
  const variableSources = [];
  variableSources.push(constructVariableMap(CHARACTERS[gameId][characterId], buffTypes, constantStatMap));
  variableSources.push(constructVariableMap(WEAPONS[gameId][weaponId], buffTypes, constantStatMap));
  variableSources.push(
    setBonusDatas.reduce((acc, data) => mergeStatMaps(acc, constructVariableMap(data, buffTypes, constantStatMap)), {})
  );
  const variableStatMap = mergeStatMaps(...variableSources);

  return mergeStatMaps(constantStatMap, variableStatMap);
}
