import { onFilters } from './onFilters';
import { ifFilters } from './ifFilters';
import { forFilters } from './forFilters';

const createMatcher = (prefix, filterFunctions, isMatchWhenNoFilters = true) => {
  const filters =
    Object.fromEntries(
      Object.entries(filterFunctions)
        .map(([suffix, fn]) => [`${prefix}${suffix}`, fn]));

  return (effect, { ctx, action }) => {
    const hasFilters = Object.keys(effect)
      .some((key) => key in filters);
    if (!hasFilters) return isMatchWhenNoFilters;
    
    return Object.entries(filters)
      .some(([field, fn]) =>
        field in effect &&
        fn(effect[field], { effect, action, ctx }));
  };
};

const matchRemoveOn = createMatcher('remove', onFilters, false);
const matchRemoveIf = createMatcher('remove', ifFilters, false);
const matchRemoveFor = createMatcher('remove', forFilters, false);
export const matchRemoveFilter = (effect, spec) =>
  matchRemoveOn(effect, spec) ||
  matchRemoveIf(effect, spec) ||
  matchRemoveFor(effect, spec);

const matchExtendOn = createMatcher('extend', onFilters);
const matchExtendIf = createMatcher('extend', ifFilters);
const matchExtendFor = createMatcher('extend', forFilters);
export const matchExtendFilter = (effect, spec) =>
  matchExtendOn(effect, spec) &&
  matchExtendIf(effect, spec) &&
  matchExtendFor(effect, spec);

const matchUseOn = createMatcher('use', onFilters);
const matchUseIf = createMatcher('use', ifFilters);
const matchUseFor = createMatcher('use', forFilters);
export const matchUseFilter = (effect, spec) =>
  matchUseOn(effect, spec) &&
  matchUseIf(effect, spec) &&
  matchUseFor(effect, spec);

const matchApplyOn = createMatcher('apply', onFilters);
const matchApplyIf = createMatcher('apply', ifFilters);
const matchApplyFor = createMatcher('apply', forFilters);
export const matchApplyFilter = (effect, spec) =>
  matchApplyOn(effect, spec) &&
  matchApplyIf(effect, spec) &&
  matchApplyFor(effect, spec);

export function matchWhenFilter(effect, spec, when) {
  switch (when) {
    case 'remove':
      return matchRemoveFilter(effect, spec);
    case 'extend':
      return matchExtendFilter(effect, spec);
    case 'use':
      return matchUseFilter(effect, spec);
    case 'apply':
      return matchApplyFilter(effect, spec);
  }
}
