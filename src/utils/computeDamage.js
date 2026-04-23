import { RATING, CHARACTERS, WEAPONS, MISC, MVS } from "@/data";
import { mergeStatMaps, computeTotalStat, compileStatMap } from "@/utils";

export function computeDamage(gameId, characterId, build, calcs, team) {
  return RATING[gameId].computeDamage(characterId, build, calcs, team);
}

export function computeDamageBreakdown(gameId, characterId, build, calcs, team) {
  if (!calcs || !build) return [];

  const rotation = calcs.rotation;

  // Games without rotation (HSR, ZZZ) - single calculation
  if (!rotation) return [];

  // Games with rotation (GI, WW) - per-hit breakdown
  const grouped = {};
  for (const part of rotation) {
    const singleCalcs = { ...calcs, rotation: [part] };
    const parts = part.split("-");
    const damage = RATING[gameId].computeDamage(characterId, build, singleCalcs, team);
    const label = MVS[gameId]?.[characterId]?.[parts[0]]?.subSkills?.[parts[1]]?.dmgType?.[0];
    if (!label) continue;
    grouped[label] = (grouped[label] ?? 0) + damage;
  }

  return Object.entries(grouped)
    .map(([abilityId, value]) => ({ name: MISC[gameId].ABILITY_TYPES[abilityId], value }))
    .sort((a, b) => b.value - a.value);
}
