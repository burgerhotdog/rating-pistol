import { onFilters1, onFilters2 } from './onFilter';
import { ifFilters } from './ifFilter';

const matchApplyOnPrimary = (effect, action) => {
  const hasAny = Object.keys(effect).some((key) =>
    key.startsWith('applyOn') &&
    Object.keys(onFilters1).some((suffix) =>
      key.endsWith(suffix)));

  return !hasAny || Object.entries(onFilters1).some(([suffix, fn]) =>
    fn(effect[`apply${suffix}`], action));
};

const matchApplyOnSecondary = (effect, action) => {
  const hasAny = Object.keys(effect).some((key) =>
    key.startsWith('applyOn') &&
    Object.keys(onFilters2).some((suffix) =>
      key.endsWith(suffix)));

  return !hasAny || Object.entries(onFilters2).some(([suffix, fn]) =>
    fn(effect[`apply${suffix}`], action));
};

const matchApplyIf = (effect, ctx, action) => {
  const hasAny = Object.keys(effect).some((key) =>
    key.startsWith('applyIf'));

  const someMatch = Object.entries(ifFilters)
    .some(([suffix, fn]) =>
      fn(effect[`apply${suffix}`], { ctx, effect, action }));

  return !hasAny || someMatch;
};

export const matchApplyFilter = (effect, action, ctx) =>
  matchApplyOnPrimary(effect, action) &&
  matchApplyOnSecondary(effect, action) &&
  matchApplyIf(effect, ctx, action);

