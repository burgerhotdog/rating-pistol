import { RATING, MISC } from "@/data";
import { getSkill, resolveCalcsWithTeamRotation } from "@/utils";

export function computeDamage(gameId, characterId, build, team) {
  const { rotation } = team.find(member => characterId === member?.characterId);
  return RATING[gameId].computeDamage(characterId, build, rotation, team);
}

export function computeDamageBreakdown(gameId, characterId, build, team) {
  if (!build) return [];

  const { rotation } = team.find(member => characterId === member?.characterId);

  // Games without rotation (HSR, ZZZ) - single calculation
  if (!rotation) return [];

  // Games with rotation (GI, WW) - per-hit breakdown
  const grouped = {};
  for (const step of rotation) {
    const damage = RATING[gameId].computeDamage(characterId, build, [step], team);
    const { considered } = getSkill(gameId, characterId, step);
    grouped[considered] = (grouped[considered] ?? 0) + damage;
  }

  return Object.entries(grouped)
    .map(([abilityId, value]) => ({ name: MISC[gameId].ABILITY_TYPES[abilityId], value }))
    .sort((a, b) => b.value - a.value);
}
