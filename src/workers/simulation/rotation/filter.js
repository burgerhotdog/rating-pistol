import { CHARACTER, GI } from '@/data';
import { evaluateFilter } from '@/utils';

export function createEventFilter(ctx) {
  const { cache, states } = ctx;
  const { gameId } = cache;
  const { globalEffects, memberEffects } = states;

  return (filter, effect, spec = {}) => {
    const { fieldId } = spec;

    return evaluateFilter(filter, {
      ...spec,
      states,
      character: CHARACTER[gameId][fieldId],
      field: fieldId === states.onFieldId ? 'onField' : 'offField',
      health: states.memberHealth[fieldId],
      attrMap: ctx.attrMaps[effect.ownerId],
      get effectStacks() {
        const value = {};
        function checkStore(store) {
          for (const effectKey in store) {
            const { stacks } = store[effectKey];
            if (stacks > (value[effectKey] ?? 0)) {
              value[effectKey] = stacks;
            }
          }
        }

        checkStore(globalEffects);
        for (const id in memberEffects) {
          checkStore(memberEffects[id]);
        }

        Object.defineProperty(this, 'effectStacks', { value, enumerable: true });
        return value;
      },
      ...(gameId === GI && {
        radiance: states.aura.stellarConduct
          ? 'stellarConduct'
          : states.aura.stellarSwirl
            ? 'stellarSwirl'
            : null,
      }),
    });
  }
}
