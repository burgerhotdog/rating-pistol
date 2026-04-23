import { MVS } from "@/data";

const DEFAULT_GROUP_INPUT = {
  "1": "BA",
  "2": "RS",
  "3": "RL",
  "6": "IS",
  "8": "OS",
};

export function getSkill(gameId, characterId, skillKey) {
  const skillMap = MVS[gameId]?.[characterId];
  if (!skillMap) {
    throw new Error(`Skill map doesn't exist for character "${characterId}"`);
  }

  const [groupId, skillId] = skillKey.split("-");
  const group = skillMap[groupId];
  if (!group) {
    throw new Error(`Skill group "${groupId}" doesn't exist for character "${characterId}"`);
  }

  const skill = group.skills?.[skillId];
  if (!skill) {
    throw new Error(`Skill "${skillKey}" doesn't exist for character "${characterId}"`);
  }

  const {
    name: rawName,
    input: rawInput,
    considered: rawConsidered,
    special,
    modifiers,
    attr = "ATK",
    multipliers,
  } = skill;

  const name = name ?? group.name;
  const input = rawInput ?? DEFAULT_GROUP_INPUT[groupId];
  if (!input) {
    throw new Error(`Input is not defined for skill "${skillKey}" of character "${characterId}"`);
  }
  const considered = rawConsidered ?? input;

  return {
    name,
    input,
    considered,
    special,
    modifiers,
    attr,
    multipliers,
  };
}
