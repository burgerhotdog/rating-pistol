import { toArray } from '@/utils';

const onAction = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  const isMatch = (key) =>
    key.includes(':')
      ? key === action.key
      : key === action.ref;
  return filter.some((key) => isMatch(key));
};

const onHas = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  return filter.some((part) => part in action);
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

const onDamageType = (rawFilter, { action }) => {
  const damage = action?.damage;
  if (!damage) return;

  const filter = toArray(rawFilter);
  const isMatch = (type) =>
    type === damage.type ||
    type === damage.extraType;

  return filter.some((type) => isMatch(type));
};

const onElement = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  return filter.includes(action.element);
};

export const onFilters = {
  'OnAction': onAction,
  'OnHas': onHas,
  'OnTagged': onTagged,
  'OnSkillType': onSkillType,
  'OnDamageType': onDamageType,
  'OnElement': onElement,
};
