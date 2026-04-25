import { MVS } from "@/data";

const DEFAULT_GROUP_INPUT = {
  "1": "BA",
  "2": "RS",
  "3": "RL",
  "6": "IS",
  "8": "OS",
};

export function getSkillList(gameId, characterId) {
  const skillMap = MVS[gameId]?.[characterId];
  if (!skillMap) {
    throw new Error(`Skill map doesn't exist for character "${characterId}"`);
  }

  return Object.entries(skillMap).flatMap(([groupId, { skills }]) =>
    Object.keys(skills).map(skillId => `${groupId}-${skillId}`)
  );
}

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
    name = group.name,
    input = DEFAULT_GROUP_INPUT[groupId],
    special,
    modifiers,
    attr = "ATK",
    multipliers,
  } = skill;

  if (!input) {
    throw new Error(`Input is not defined for skill "${skillKey}" of character "${characterId}"`);
  }

  return {
    name: skill.considered === "HEAL" ? `${name} Healing` : skill.considered === "SHIELD" ? `${name} Shield` : name,
    input,
    considered: skill.considered ?? input,
    special,
    modifiers,
    attr,
    multipliers,
  };
}
