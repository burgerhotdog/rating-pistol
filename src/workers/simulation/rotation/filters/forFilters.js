import { toArray } from '@/utils';

const forInflictStatus = (rawFilter, { action }) => {
  const inflicted = action.inflictStatus ?? {};
  if (rawFilter === 'any') return Object.keys(inflicted).length;
  const filter = toArray(rawFilter);
  return filter.some((status) => status in inflicted);
};

const forConsumeStatus = (rawFilter, { action }) => {
  const consumed = action.consumeStatus ?? {};
  if (rawFilter === 'any') return Object.keys(consumed).length;
  const filter = toArray(rawFilter);
  return filter.some((status) => status in consumed);
};

const forInflictShifting = (rawFilter, { action }) => {
  const filter = toArray(rawFilter);
  return filter.some((shifting) => shifting === action.inflictShifting);
};

export const forFilters = {
  'ForInflictStatus': forInflictStatus,
  'ForConsumeStatus': forConsumeStatus,
  'ForInflictShifting': forInflictShifting,
};
