import { toArray, getAttr } from '@/utils';

const ifAttr = (rawFilter = {}, { effect, ctx }) => {
  const filter = Object.entries(rawFilter);
  const statMap = ctx.buildMaps[effect.ownerId];
  return filter.some(([attr, value]) => getAttr(attr, statMap) >= value);
};

const ifField = (filter, { action, ctx }) => {
  const isOnField = action.ownerId === ctx.states.onFieldId;
  const field = isOnField ? 'onField' : 'offField';
  return filter != null && filter === field;
};

const ifEffectStacks = (rawFilter = {}, states, op) => { // helper
  const filter = Object.entries(rawFilter);
  const stores = [
    ...Object.values(states.memberEffects),
    states.globalEffects,
  ];
  return filter.every(([effectKey, stacks]) =>
    stores.some((store) => op(store[effectKey]?.stacks, stacks)));
};

const ifEffectStacksMin = (rawFilter, { ctx }) =>
  ifEffectStacks(rawFilter, ctx.states, (a, b) => a >= b);

const ifEffectStacksMax = (rawFilter, { ctx }) => 
  ifEffectStacks(rawFilter, ctx.states, (a, b) => a <= b);

const ifNegativeStatus = (rawFilter = {}, { ctx }) => {
  const { negativeStatuses } = ctx.states;
  if (rawFilter === 'any') {
    return Object.keys(negativeStatuses).length;
  }
  const filter = Object.entries(rawFilter);
  return filter.some(([statusId, stacks]) => negativeStatuses[statusId]?.stacks >= stacks);
};

const ifShifting = (rawFilter, { ctx }) => {
  const filter = toArray(rawFilter);
  const { tune } = ctx.states;
  return filter.includes(tune.shifting);
};

const ifInterfered = (rawFilter, { ctx }) => {
  const filter = toArray(rawFilter);
  const { tune } = ctx.states;
  return filter.includes(tune.interfered);
};

export const ifFilters = {
  'IfAttr': ifAttr,
  'IfField': ifField,
  'IfEffectStacksMin': ifEffectStacksMin,
  'IfEffectStacksMax': ifEffectStacksMax,
  'IfNegativeStatus': ifNegativeStatus,
  'IfShifting': ifShifting,
  'IfInterfered': ifInterfered,
};
