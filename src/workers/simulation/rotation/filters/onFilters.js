import { toArray } from '@/utils';

const onAction = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  const isMatch = (key) =>
    key.includes(':')
      ? key === action.key
      : key === action.ref;
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

export const onFilters = {
  'OnAction': onAction,
  'OnType': onType,
  'OnTagged': onTagged,
  'OnSkillType': onSkillType,
  'OnDmgType': onDmgType,
  'OnElement': onElement,
};
