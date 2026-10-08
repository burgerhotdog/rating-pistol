import { CHARACTER, GI } from '@/data';
import { evaluateFilter } from '@/utils';

function evaluateSpecialFilter(ctx, special, effect, spec) {
  const { cache, states } = ctx;
  const { gameId } = cache;

  switch (special) {
    case 'cinderCityPyro': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const reactionElements = spec.reaction?.elements;
      return (
        reactionElements.includes('pyro') &&
        reactionElements.includes(ownerElement)
      );
    }

    case 'cinderCityElectro': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const reactionElements = spec.reaction?.elements;
      return (
        reactionElements.includes('electro') &&
        reactionElements.includes(ownerElement)
      );
    }

    case 'cinderCityHydro': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const reactionElements = spec.reaction?.elements;
      return (
        reactionElements.includes('hydro') &&
        reactionElements.includes(ownerElement)
      );
    }

    case 'cinderCityDendro': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const reactionElements = spec.reaction?.elements;
      return (
        reactionElements.includes('dendro') &&
        reactionElements.includes(ownerElement)
      );
    }

    case 'cinderCityAnemo': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const reactionElements = spec.reaction?.elements;
      return (
        reactionElements.includes('anemo') &&
        reactionElements.includes(ownerElement)
      );
    }

    case 'cinderCityGeo': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const reactionElements = spec.reaction?.elements;
      return (
        reactionElements.includes('geo') &&
        reactionElements.includes(ownerElement)
      );
    }

    case 'cinderCityCryo': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const reactionElements = spec.reaction?.elements;
      return (
        reactionElements.includes('cryo') &&
        reactionElements.includes(ownerElement)
      );
    }

    case 'celestialGift1': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const damageElement = spec.action?.damage?.element;
      return damageElement === ownerElement;
    }

    case 'celestialGift2': {
      const { ownerId } = effect;
      const ownerElement = CHARACTER[gameId][ownerId].element;
      const { onFieldId } = states;
      const onFieldElement = CHARACTER[gameId][onFieldId].element;
      const damageElement = spec.action?.damage?.element;
      return (
        damageElement === ownerElement ||
        damageElement === onFieldElement
      );
    }
  }
}

export function createEventFilter(ctx) {
  const { cache, states } = ctx;
  const { gameId } = cache;
  const { globalEffects, memberEffects } = states;

  return (filter, effect, spec = {}) => {
    const { fieldId } = spec;

    if (filter?.special) {
      return evaluateSpecialFilter(ctx, filter.special, effect, spec);
    }

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
