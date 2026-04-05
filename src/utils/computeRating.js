import { RATING, CHARACTERS, WEAPONS } from "@/data";
import { buildSourceMapList, mergeStatMaps, computeTotalStat } from "@/utils";

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

export function computeRating(gameId, charId, build, criteria, buffs = {}) {
  const { computeDamage } = RATING[gameId];
  const sourceMapList = buildSourceMapList(gameId, charId, build, buffs);
  const mergedSourceMap = mergeStatMaps(...sourceMapList);
  const variableSourceMapCharacter = buildVariableSourceMap(mergedSourceMap, CHARACTERS[gameId][charId]?.variableStats ?? {});
  const variableSourceMapCharacterSelf = buildVariableSourceMap(mergedSourceMap, CHARACTERS[gameId][charId]?.buffs?.self?.variableStats ?? {});
  const variableSourceMapWeapon = buildVariableSourceMap(mergedSourceMap, WEAPONS[gameId][build?.weaponId]?.variableStats ?? {});
  const mergedAllSourceMaps = mergeStatMaps(mergedSourceMap, variableSourceMapCharacter, variableSourceMapCharacterSelf, variableSourceMapWeapon);
  if (criteria.name === "Damage") {
    return computeDamage(mergedAllSourceMaps, criteria);
  }
}
