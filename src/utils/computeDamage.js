import { RATING, CHARACTERS, WEAPONS } from "@/data";
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
  for (const hit of rotation) {
    const singleCalcs = { ...calcs, rotation: [hit] };
    const damage = RATING[gameId].computeDamage(characterId, build, singleCalcs, team);
    const label = hit.type?.ability ?? 'Other';
    grouped[label] = (grouped[label] ?? 0) + damage;
  }

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
