import { MVS } from '@/data';
import { toArray } from '@/utils';

const DEFAULT_CAST = {
  "1": "BA",
  "2": "RS",
  "3": "RL",
  "6": "IS",
  "8": "OS",
};
const DEFAULT_ATTR = "ATK";

function getActionMetaMap(gameId, characterId) {
  const skillMap = MVS[gameId]?.[characterId];
  if (!skillMap) {
    throw new Error(`Skill map doesn't exist for character "${characterId}"`);
  }
  return skillMap;
}

export function getActionList(gameId, characterId) {
  if (!characterId) return [];
  const skillMap = getActionMetaMap(gameId, characterId);

  return Object.entries(skillMap).flatMap(([skillId, { skills }]) =>
    Object.keys(skills).map(actionId => `${characterId}-${skillId}-${actionId}`)
  );
}

function formatName(name, type) {
  if (type === "HEAL") return `${name} Healing`;
  if (type === "SHIELD") return `${name} Shield`;
  return name;
}

export function getAction(gameId, actionKey) {
  if (!actionKey.includes('-')) throw new Error(`Invalid actionKey "${actionKey}"`);
  const [ownerId, skillId, actionId] = actionKey.split('-');

  const skillMap = getActionMetaMap(gameId, ownerId);

  const group = skillMap[skillId];
  if (!group) throw new Error(`Unknown group "${skillId}" in character "${ownerId}" in game "${gameId}"`);
  if (!group.name) throw new Error(`Missing name for group "${skillId}" in character "${ownerId}" in game "${gameId}"`);
  
  const skill = group.skills?.[actionId];
  if (!skill) throw new Error(`Unknown skill "${actionId}" in group "${skillId}" in character "${ownerId}" in game "${gameId}"`);

  const type = skill.type ?? 'DAMAGE';
  const cast = toArray(skill.cast ?? DEFAULT_CAST[skillId]);
  const considered = toArray(skill.considered ?? cast);

  return {
    ownerId,
    name: formatName(skill.name ?? group.name, type),
    type,
    cast,
    considered,
    special: skill.special,
    duration: skill.duration,
    offset: skill.offset,
    attr: skill.attr ?? DEFAULT_ATTR,
    multipliers: skill.multipliers,
    times: skill.times ?? 1, 
  };
}
