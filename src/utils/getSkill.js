import { MVS } from "@/data";

const DEFAULT_GROUP_INPUT = {
  "1": "BA",
  "2": "RS",
  "3": "RL",
  "6": "IS",
  "7": "AUTO",
  "8": "OS",
};
const DEFAULT_ATTR = "ATK";
const SPECIAL_INPUTS = new Set(["CA", "JA", "HK", "RK", "AUTO"]);

function getSkillMap(gameId, characterId) {
  const skillMap = MVS[gameId]?.[characterId];
  if (!skillMap) {
    throw new Error(`Skill map doesn't exist for character "${characterId}"`);
  }
  return skillMap;
}

export function getSkillList(gameId, characterId) {
  const skillMap = getSkillMap(gameId, characterId);

  return Object.entries(skillMap).flatMap(([groupId, { skills }]) =>
    Object.keys(skills).map(skillId => `${groupId}-${skillId}`)
  );
}

function formatConsidered(considered, input, groupId) {
  if (considered) return considered;

  if (input.endsWith("DC")) return "BA";
  if (input.startsWith("M")) return input.slice(1);
  if (SPECIAL_INPUTS.includes(input)) return DEFAULT_GROUP_INPUT[groupId];

  return input;
}

function formatName(name, considered) {
  if (considered === "HEAL") return `${name} Healing`;
  if (considered === "SHIELD") return `${name} Shield`;
  return name;
}

export function getSkill(gameId, characterId, skillKey) {
  if (!skillKey.includes("-")) throw new Error(`Invalid skillKey "${skillKey}"`);
  const skillMap = getSkillMap(gameId, characterId);

  const [groupId, skillId] = skillKey.split("-");
  const group = skillMap[groupId];
  if (!group) throw new Error(`Unknown group "${groupId}" in character "${characterId}" in game "${gameId}"`);
  if (!group.name) throw new Error(`Missing name for group "${groupId}" in character "${characterId}" in game "${gameId}"`);
  
  const skill = group.skills?.[skillId];
  if (!skill) throw new Error(`Unknown skill "${skillId}" in group "${groupId}" in character "${characterId}" in game "${gameId}"`);

  const input = skill.input ?? DEFAULT_GROUP_INPUT[groupId];
  if (!input) throw new Error(`Missing input for skill "${skillKey}" in character "${characterId}" in game "${gameId}"`);

  const considered = formatConsidered(skill.considered, input, groupId);
  if (!considered || considered === "AUTO") throw new Error(`Invalid considered for skill "${skillKey}" in character "${characterId}" in game "${gameId}"`);

  return {
    name: formatName(skill.name ?? group.name, considered),
    input,
    considered,
    special: skill.special,
    modifiers: skill.modifiers,
    attr: skill.attr ?? DEFAULT_ATTR,
    multipliers: skill.multipliers,
  };
}
