import { onFilters1, onFilters2 } from './onFilter';
import { ifFilters } from './ifFilter';

const createMatcher = (prefix, filterType, emptyResult = true) => {
  const filters =
    Object.fromEntries(
      Object.entries(filterType)
        .map(([suffix, fn]) => [`${prefix}${suffix}`, fn]));

  return ({ effect, action, ctx }) => {
    const hasNoFilters = !Object.keys(effect).some((key) => key in filters);
    return hasNoFilters
      ? emptyResult
      : Object.entries(filters)
        .some(([field, fn]) =>
          field in effect &&
          fn(effect[field], { effect, action, ctx }));
  };
};

const matchApplyOn1 = createMatcher('apply', onFilters1);
const matchApplyOn2 = createMatcher('apply', onFilters2);
const matchApplyIf = createMatcher('apply', ifFilters);
export const matchApplyFilter = (spec) =>
  matchApplyOn1(spec) &&
  matchApplyOn2(spec) &&
  matchApplyIf(spec);

const matchUseOn1 = createMatcher('use', onFilters1);
const matchUseOn2 = createMatcher('use', onFilters2);
const matchUseIf = createMatcher('use', ifFilters);
export const matchUseFilter = (spec) =>
  matchUseOn1(spec) &&
  matchUseOn2(spec) &&
  matchUseIf(spec);

const matchRemoveOn1 = createMatcher('remove', onFilters1, false);
const matchRemoveOn2 = createMatcher('remove', onFilters2, false);
const matchRemoveIf = createMatcher('remove', ifFilters, false);
export const matchRemoveFilter = (spec) =>
  matchRemoveOn1(spec) ||
  matchRemoveOn2(spec) ||
  matchRemoveIf(spec);
