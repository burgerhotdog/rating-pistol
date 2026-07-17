import { toArray, getAttr } from '@/utils';

const ifAttr = (filter = {}, spec) => {
  const statMap = spec.ctx.buildMaps[spec.effect.ownerId]

  return Object.entries(filter)
    .some(([attr, threshold]) =>
      getAttr(attr, statMap) >= threshold);
};

const ifField = (filter, spec) => {
  const field = spec.ctx.getField(spec.action.ownerId)
  return filter != null && filter === field;
};

const ifEffectStacks = (filter, state, op) =>
  Object.entries(filter).every(([key, stacks]) =>
    [
      ...Object.values(state.memberEffects),
      ...Object.values(state.fieldEffects),
      state.debuffs,
    ].some((stateMap) =>
      op(stateMap[key]?.stacks, stacks)));

const ifEffectStacksMin = (filter = {}, spec) => {
  const { state } = spec.ctx;
  return ifEffectStacks(filter, state, (a, b) => a >= b);
};

const ifEffectStacksMax = (filter = {}, spec) => {
  const { state } = spec.ctx;
  return ifEffectStacks(filter, state, (a, b) => a <= b);
};

const ifNegativeStatus = (filter = {}, spec) => {
  const { negativeStatuses } = spec.ctx.state;

  return filter === 'any'
    ? Object.keys(negativeStatuses).length
    : Object.entries(filter).some(([statusId, threshold]) =>
      negativeStatuses[statusId]?.stacks >= threshold);
};

const ifShifting = (filter, spec) => {
  const { tune } = spec.ctx.state;
  return toArray(filter).includes(tune.shifting);
};

const ifInterfered = (filter, spec) => {
  const { tune } = spec.ctx.state;
  return toArray(filter).includes(tune.interfered);
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
