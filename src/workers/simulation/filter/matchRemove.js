import { onFilters1, onFilters2 } from './onFilter';
import { ifFilters } from './ifFilter';

const matchRemoveOnPrimary = (effect, action) => {
  return Object.entries(onFilters1).some(([suffix, fn]) =>
    fn(effect[`remove${suffix}`], action));
};

const matchRemoveOnSecondary = (effect, action) => {
  return Object.entries(onFilters2).some(([suffix, fn]) =>
    fn(effect[`remove${suffix}`], action));
};

const matchRemoveIf = (effect, ctx, action) => {
  return Object.entries(ifFilters).some(([suffix, fn]) => {
    const field = `remove${suffix}`;
    if (field in effect) {
      return fn(effect[field], { ctx, effect, action });
    }
  });
};

export const matchRemoveFilter = (effect, action, ctx) =>
  matchRemoveOnPrimary(effect, action) ||
  matchRemoveOnSecondary(effect, action) ||
  matchRemoveIf(effect, ctx, action);
