import { toArray, getAttr } from '@/utils';

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

export const ifField = (filter, field) =>
  filter != null && filter === field;

const ifEffectStacks = (filter, state, op) =>
  Object.entries(filter).every(([key, stacks]) =>
    [
      ...Object.values(state.memberEffects),
      ...Object.values(state.fieldEffects),
      state.debuffs,
    ].some((stateMap) =>
      op(stateMap[key]?.stacks, stacks)));

export const ifEffectStacksMin = (filter, state) =>
  ifEffectStacks(filter, state, (a, b) => a >= b);

export const ifEffectStacksMax = (filter, state) =>
  ifEffectStacks(filter, state, (a, b) => a <= b);

export const ifNegativeStatus = (filter = {}, { negativeStatuses }) =>
  filter === 'any'
    ? Object.keys(negativeStatuses).length
    : Object.entries(filter).some(([statusId, threshold]) =>
      negativeStatuses[statusId]?.stacks >= threshold);

export const ifShifting = (filter, { tune }) =>
  toArray(filter).includes(tune.shifting);

export const ifInterfered = (filter, { tune }) =>
  toArray(filter).includes(tune.interfered);
