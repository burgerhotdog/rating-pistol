import { RATING, CHARACTERS, WEAPONS, MISC, MVS } from "@/data";
import { mergeStatMaps, computeTotalStat, compileStatMap } from "@/utils";

const DEFAULT_GROUP_INPUT = {
  "1": "BA",
  "2": "RS",
  "3": "RL",
  "6": "IS",
  "8": "OS",
};

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
  for (const step of rotation) {
    const damage = RATING[gameId].computeDamage(characterId, build, { ...calcs, rotation: [step] }, team);
    const [groupId, skillId] = step.split("-");
    const {
      input: rawInput,
      considered: rawConsidered,
    } = MVS[gameId]?.[characterId]?.[groupId]?.skills?.[skillId] ?? {};

    const input = rawInput ?? DEFAULT_GROUP_INPUT[groupId];
    const considered = rawConsidered ?? input;
    if (!considered) continue;

    grouped[considered] = (grouped[considered] ?? 0) + damage;
  }

  return Object.entries(grouped)
    .map(([abilityId, value]) => ({ name: MISC[gameId].ABILITY_TYPES[abilityId], value }))
    .sort((a, b) => b.value - a.value);
}
