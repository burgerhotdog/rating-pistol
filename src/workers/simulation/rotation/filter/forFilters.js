import { toArray } from '@/utils';

// Filter based on what action inflicts
const forInflictStatus = (rawFilter, { action }) => {
  const inflicted = action.inflictStatus ?? {};
  if (rawFilter === 'any') {
    return Object.keys(inflicted).length;
  }
  const filter = toArray(rawFilter);
  return filter.some((statusId) => statusId in inflicted);
};

const forInflictShifting = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  return filter.some((shifting) => shifting === action.inflictShifting);
};

export const forFilters = {
  'ForInflictStatus': forInflictStatus,
  'ForInflictShifting': forInflictShifting,
};
