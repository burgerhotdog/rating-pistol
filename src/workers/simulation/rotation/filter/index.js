import { onFilters } from './onFilters';
import { ifFilters } from './ifFilters';
import { forFilters } from './forFilters';

const createMatcher = (prefix, filterFunctions, isMatchWhenNoFilters = true) => {
  const filters =
    Object.fromEntries(
      Object.entries(filterFunctions)
        .map(([suffix, fn]) => [`${prefix}${suffix}`, fn]));

  return ({ effect, action, ctx }) => {
    const hasNoFilters = !Object.keys(effect).some((key) => key in filters);
    return hasNoFilters
      ? isMatchWhenNoFilters
      : Object.entries(filters)
        .some(([field, fn]) =>
          field in effect &&
          fn(effect[field], { effect, action, ctx }));
  };
};

const matchApplyOn = createMatcher('apply', onFilters);
const matchApplyIf = createMatcher('apply', ifFilters);
const matchApplyFor = createMatcher('apply', forFilters);
export const matchApplyFilter = (spec) =>
  matchApplyOn(spec) &&
  matchApplyIf(spec) &&
  matchApplyFor(spec);

const matchUseOn = createMatcher('use', onFilters);
const matchUseIf = createMatcher('use', ifFilters);
const matchUseFor = createMatcher('use', forFilters);
export const matchUseFilter = (spec) =>
  matchUseOn(spec) &&
  matchUseIf(spec) &&
  matchUseFor(spec);

const matchRemoveOn = createMatcher('remove', onFilters, false);
const matchRemoveIf = createMatcher('remove', ifFilters, false);
const matchRemoveFor = createMatcher('remove', forFilters, false);
export const matchRemoveFilter = (spec) =>
  matchRemoveOn(spec) ||
  matchRemoveIf(spec) ||
  matchRemoveFor(spec);

const matchExtendOn = createMatcher('extend', onFilters);
const matchExtendIf = createMatcher('extend', ifFilters);
const matchExtendFor = createMatcher('extend', forFilters);
export const matchExtendFilter = (spec) =>
  matchExtendOn(spec) &&
  matchExtendIf(spec) &&
  matchExtendFor(spec);
