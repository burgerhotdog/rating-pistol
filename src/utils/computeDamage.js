import { RATING, CHARACTERS, WEAPONS, STATS } from "@/data";
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
    const damage = RATING[gameId].computeDamage(characterId, build, singleCalcs, team);
    const label = part.dmgType[1];
    grouped[label] = (grouped[label] ?? 0) + damage;
  }

  return Object.entries(grouped)
    .map(([abilityId, value]) => ({ name: STATS[gameId].ABILITY_TYPES[abilityId], value }))
    .sort((a, b) => b.value - a.value);
}
