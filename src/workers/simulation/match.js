import { toArray, mergeObj, getAttr } from '@/utils';

export const onAction = (filter, action) =>
  toArray(filter).some((key) => key.includes(':')
    ? key === action.key
    : key === action.short);

export const onType = (filter, action) =>
  toArray(filter).includes(action.type);

export const onTagged = (filter, action) =>
  toArray(filter).some((tag) =>
    toArray(action.tagged).includes(tag));

export const onSkillType = (filter, action) =>
  toArray(filter).some((skillType) =>
    skillType === action.skillType ||
    skillType === action.extraSkillType);

export const onDmgType = (filter, action) =>
  toArray(filter).some((dmgType) =>
    dmgType === action.dmgType ||
    dmgType === action.extraDmgType);

export const onInflictNegativeStatus = (filter, action) =>
  filter === 'any'
    ? Object.keys(action.inflictNegativeStatus ?? {}).length
    : toArray(filter).some((statusId) =>
      (action.inflictNegativeStatus ?? {})[statusId]);

export const onShiftTune = (filter, action) =>
  toArray(filter).some((shifting) =>
    shifting === action.shiftTune);

export const onElement = (filter, element) =>
  toArray(filter).includes(element);

export const ifAttr = (filter = {}, statMap) =>
  Object.entries(filter).some(([attr, threshold]) =>
    getAttr(attr, statMap) >= threshold);

export const ifField = (fieldKey, memberId, onFieldId) =>
  fieldKey != null &&
  (fieldKey === 'onField'
    ? memberId === onFieldId
    : memberId !== onFieldId);

export const ifNegativeStatus = (filter = {}, { negativeStatuses }) =>
  filter === 'any'
    ? Object.keys(negativeStatuses).length
    : Object.entries(filter).some(([statusId, threshold]) =>
      negativeStatuses[statusId]?.stacks >= threshold);

export const ifShifting = (filter, { tune }) =>
  toArray(filter).includes(tune.shifting);

export const ifInterfered = (filter, { tune }) =>
  toArray(filter).includes(tune.interfered);

const matchUseOn = (effect, action = {}) => {
  const hasUseOn =
    'useOnAction' in effect ||
    'useOnType' in effect ||
    'useOnTagged' in effect ||
    'useOnSkillType' in effect ||
    'useOnDmgType' in effect ||
    'useOnElement' in effect;

  return !hasUseOn ||
    onAction(effect.useOnAction, action) ||
    onType(effect.useOnType, action) ||
    onTagged(effect.useOnTagged, action) ||
    onSkillType(effect.useOnSkillType, action) ||
    onDmgType(effect.useOnDmgType, action) ||
    onElement(effect.useOnElement, action.element);
};

const matchUseIf = (effect, memberId, ctx) => {
  const hasUseIf =
    'useIfAttr' in effect ||
    'useIfField' in effect ||
    'useIfNegativeStatus' in effect ||
    'useIfShifting' in effect ||
    'useIfInterfered' in effect;

  return !hasUseIf ||
    ifAttr(effect.useIfAttr, mergeObj(ctx.cache.member[effect.ownerId].baseMap, ctx.equipMaps[effect.ownerId])) ||
    ifField(effect.useIfField, memberId, ctx.onFieldId) ||
    ifNegativeStatus(effect.useIfNegativeStatus, ctx.state) ||
    ifShifting(effect.useIfShifting, ctx.state) ||
    ifInterfered(effect.useIfInterfered, ctx.state);
};

export const matchUse = (effect, action, memberId, ctx) => {
  return matchUseOn(effect, action) && matchUseIf(effect, memberId, ctx);
};
