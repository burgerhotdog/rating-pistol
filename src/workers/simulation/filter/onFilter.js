import { toArray } from '@/utils';

const onAction = (filter, action) =>
  toArray(filter).some((key) => key.includes(':')
    ? key === action.key
    : key === action.short);

const onType = (filter, action) =>
  toArray(filter).includes(action.type);

const onTagged = (filter, action) =>
  toArray(filter).some((tag) =>
    toArray(action.tagged).includes(tag));

const onSkillType = (filter, action) =>
  toArray(filter).some((skillType) =>
    skillType === action.skillType ||
    skillType === action.extraSkillType);

const onDmgType = (filter, action) =>
  toArray(filter).some((dmgType) =>
    dmgType === action.dmgType ||
    dmgType === action.extraDmgType);

const onInflictNegativeStatus = (filter, action) =>
  filter === 'any'
    ? Object.keys(action.inflictNegativeStatus ?? {}).length
    : toArray(filter).some((statusId) =>
      (action.inflictNegativeStatus ?? {})[statusId]);

const onShiftTune = (filter, action) =>
  toArray(filter).some((shifting) =>
    shifting === action.shiftTune);

const onElement = (filter, element) =>
  toArray(filter).includes(element);

export const onFilters1 = {
  'OnAction': onAction,
  'OnType': onType,
  'OnTagged': onTagged,
  'OnSkillType': onSkillType,
  'OnDmgType': onDmgType,
  'OnElement': onElement,
};

export const onFilters2 = {
  'OnInflictNegativeStatus': onInflictNegativeStatus,
  'OnShiftTune': onShiftTune,
};