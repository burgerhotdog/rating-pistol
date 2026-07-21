import { toArray, getAttr } from '@/utils';

const ifAttr = (rawFilter = {}, { effect, ctx }) => {
  const filter = Object.entries(rawFilter);
  const statMap = ctx.buildMaps[effect.ownerId];
  return filter.some(([attr, value]) => getAttr(attr, statMap) >= value);
};

const ifField = (filter, { action, ctx }) => {
  const field = ctx.getField(action.ownerId)
  return filter != null && filter === field;
};

const ifEffectStacks = (rawFilter = {}, state, op) => { // helper
  const filter = Object.entries(rawFilter);
  const stateMaps = [
    ...Object.values(state.memberEffects),
    ...Object.values(state.fieldEffects),
    state.enemyEffects,
  ];
  return filter.every(([key, stacks]) =>
    stateMaps.some((stateMap) => op(stateMap[key]?.stacks, stacks)));
};

const ifEffectStacksMin = (rawFilter, { ctx }) =>
  ifEffectStacks(rawFilter, ctx.state, (a, b) => a >= b);

const ifEffectStacksMax = (rawFilter, { ctx }) => 
  ifEffectStacks(rawFilter, ctx.state, (a, b) => a <= b);

const ifNegativeStatus = (rawFilter = {}, { ctx }) => {
  const { negativeStatuses } = ctx.state;
  if (rawFilter === 'any') {
    return Object.keys(negativeStatuses).length;
  }
  const filter = Object.entries(rawFilter);
  return filter.some(([statusId, stacks]) => negativeStatuses[statusId]?.stacks >= stacks);
};

const ifShifting = (rawFilter, { ctx }) => {
  const filter = toArray(rawFilter);
  const { tune } = ctx.state;
  return filter.includes(tune.shifting);
};

const ifInterfered = (rawFilter, { ctx }) => {
  const filter = toArray(rawFilter);
  const { tune } = ctx.state;
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
