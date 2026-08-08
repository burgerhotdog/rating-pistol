import { toArray } from '@/utils';

const onAction = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  const isMatch = (id) => id === action.ref;
  return filter.some(isMatch);
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

const onType = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  const isMatch = (type) =>
    type === action.type ||
    type === action.extraType;
  return filter.some((type) => isMatch(type));
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
  return filter.includes(action.damage?.element);
};

export const onFilters = {
  'OnAction': onAction,
  'OnHas': onHas,
  'OnTagged': onTagged,
  'OnType': onType,
  'OnDamageType': onDamageType,
  'OnElement': onElement,
};
