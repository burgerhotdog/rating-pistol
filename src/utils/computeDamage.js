import { RATING, MISC } from "@/data";
import { getSkill, resolveCalcsWithTeamRotation } from "@/utils";

const DEFAULT_GROUP_INPUT = {
  "1": "BA",
  "2": "RS",
  "3": "RL",
  "6": "IS",
  "8": "OS",
};

export function computeDamage(gameId, characterId, build, calcs, team) {
  const effectiveCalcs = resolveCalcsWithTeamRotation(characterId, calcs, team);
  return RATING[gameId].computeDamage(characterId, build, effectiveCalcs, team);
}

export function computeDamageBreakdown(gameId, characterId, build, calcs, team) {
  if (!calcs || !build) return [];

  const effectiveCalcs = resolveCalcsWithTeamRotation(characterId, calcs, team);
  const rotation = effectiveCalcs.rotation;

  // Games without rotation (HSR, ZZZ) - single calculation
  if (!rotation) return [];

  // Games with rotation (GI, WW) - per-hit breakdown
  const grouped = {};
  for (const step of rotation) {
    const damage = RATING[gameId].computeDamage(characterId, build, { ...effectiveCalcs, rotation: [step] }, team);
    const { considered } = getSkill(gameId, characterId, step);
    grouped[considered] = (grouped[considered] ?? 0) + damage;
  }

  return Object.entries(grouped)
    .map(([abilityId, value]) => ({ name: MISC[gameId].ABILITY_TYPES[abilityId], value }))
    .sort((a, b) => b.value - a.value);
}
