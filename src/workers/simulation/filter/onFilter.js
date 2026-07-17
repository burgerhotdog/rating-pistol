import { toArray } from '@/utils';

// Filter based on what action is
const onAction = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  const isMatch = (key) =>
    key.includes(':')
      ? key === action.key
      : key === action.short;
  return filter.some((key) => isMatch(key));
};

const onType = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  return filter.includes(action.type);
};

const onTagged = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  const actionTags = toArray(action.tagged);
  return filter.some((tag) => actionTags.includes(tag));
};

const onSkillType = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  const isMatch = (type) =>
    type === action.skillType ||
    type === action.extraSkillType;
  return filter.some((skillType) => isMatch(skillType));
};

const onDmgType = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  const isMatch = (type) =>
    type === action.dmgType ||
    type === action.extraDmgType;
  return filter.some((dmgType) => isMatch(dmgType));
};

const onElement = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  return filter.includes(action.element);
};

export const onFilters1 = {
  'OnAction': onAction,
  'OnType': onType,
  'OnTagged': onTagged,
  'OnSkillType': onSkillType,
  'OnDmgType': onDmgType,
  'OnElement': onElement,
};

// Filter based on what action does
const onInflictNegativeStatus = (rawFilter, { action }) => {
  const inflicted = action.inflictNegativeStatus ?? {};
  if (rawFilter === 'any') {
    return Object.keys(inflicted).length;
  }
  const filter = toArray(rawFilter);
  return filter.some((statusId) => statusId in inflicted);
};

const onShiftTune = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  return filter.some((shifting) => shifting === action.shiftTune);
};

export const onFilters2 = {
  'OnInflictNegativeStatus': onInflictNegativeStatus,
  'OnShiftTune': onShiftTune,
};