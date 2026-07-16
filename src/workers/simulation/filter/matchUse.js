import { onFilters1, onFilters2 } from './onFilter';
import { ifFilters } from './ifFilter';

const matchUseOnPrimary = (effect, action) => {
  const hasAny = Object.keys(effect).some((key) =>
    key.startsWith('useOn') &&
    Object.keys(onFilters1).some((suffix) =>
      key.endsWith(suffix)));

  return !hasAny || Object.entries(onFilters1).some(([suffix, fn]) =>
    fn(effect[`use${suffix}`], action));
};

const matchUseOnSecondary = (effect, action) => {
  const hasAny = Object.keys(effect).some((key) =>
    key.startsWith('useOn') &&
    Object.keys(onFilters2).some((suffix) =>
      key.endsWith(suffix)));

  return !hasAny || Object.entries(onFilters2).some(([suffix, fn]) =>
    fn(effect[`use${suffix}`], action));
};

const matchUseIf = (effect, ctx, action) => {
  const hasAny = Object.keys(effect).some((key) =>
    key.startsWith('useIf'));

  return !hasAny || Object.entries(ifFilters).some(([suffix, fn]) => {
    const field = `use${suffix}`;
    if (field in effect) {
      return fn(effect[field], { ctx, effect, action });
    }
  });
};

export const matchUse = (effect, action, ctx) =>
  matchUseOnPrimary(effect, action) &&
  matchUseOnSecondary(effect, action) &&
  matchUseIf(effect, ctx, action);
