import { MVS } from '@/data';

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
  if (!characterId) return [];
  const skillMap = getSkillMap(gameId, characterId);

  return Object.entries(skillMap).flatMap(([skillId, { skills }]) =>
    Object.keys(skills).map(actionId => `${characterId}-${skillId}-${actionId}`)
  );
}

function formatConsidered(considered, input, skillId) {
  if (considered) return considered;

  if (input.endsWith("DC")) return "BA";
  if (input.startsWith("M")) return input.slice(1);
  if (SPECIAL_INPUTS.has(input)) return DEFAULT_GROUP_INPUT[skillId];

  return input;
}

function formatName(name, considered) {
  if (considered === "HEAL") return `${name} Healing`;
  if (considered === "SHIELD") return `${name} Shield`;
  return name;
}

export function getSkill(gameId, actionKey) {
  if (!actionKey.includes('-')) throw new Error(`Invalid actionKey "${actionKey}"`);
  const [ownerId, skillId, actionId] = actionKey.split('-');

  const skillMap = getSkillMap(gameId, ownerId);

  const group = skillMap[skillId];
  if (!group) throw new Error(`Unknown group "${skillId}" in character "${ownerId}" in game "${gameId}"`);
  if (!group.name) throw new Error(`Missing name for group "${skillId}" in character "${ownerId}" in game "${gameId}"`);
  
  const skill = group.skills?.[actionId];
  if (!skill) throw new Error(`Unknown skill "${actionId}" in group "${skillId}" in character "${ownerId}" in game "${gameId}"`);

  const input = skill.input ?? DEFAULT_GROUP_INPUT[skillId];
  if (!input) throw new Error(`Missing input for skill "${actionKey}" in character "${ownerId}" in game "${gameId}"`);

  const considered = formatConsidered(skill.considered, input, skillId);
  if (!considered || considered === "AUTO") throw new Error(`Invalid considered for skill "${actionKey}" in character "${ownerId}" in game "${gameId}"`);

  return {
    ownerId,
    name: formatName(skill.name ?? group.name, considered),
    input,
    considered,
    special: skill.special,
    effects: skill.effects,
    modifiers: skill.modifiers,
    attr: skill.attr ?? DEFAULT_ATTR,
    multipliers: skill.multipliers,
  };
}
