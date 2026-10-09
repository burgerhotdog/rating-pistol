import { CHARACTER, GI } from '@/data';
import { evaluateFilter } from '@/utils';

function evaluateSpecial(ctx, special, effect, spec) {
  const gameId = ctx.cache.gameId
  const onFieldId = ctx.states.onFieldId;
  const effOwnerId = effect.ownerId;
  const ownerElem = CHARACTER[gameId][effOwnerId]?.element;
  const actionElem = spec.action?.damage?.element;
  const rxnElems = spec.reaction?.elements ?? [];
  const nsStore = ctx.states.nightsoul;

  switch (special) {
    case 'cinderCityPyro1':
      return rxnElems.includes('pyro') && rxnElems.includes(ownerElem);
    case 'cinderCityPyro2':
      return rxnElems.includes('pyro') && rxnElems.includes(ownerElem) && nsStore[effOwnerId];
    case 'cinderCityElectro1':
      return rxnElems.includes('electro') && rxnElems.includes(ownerElem);
    case 'cinderCityElectro2':
      return rxnElems.includes('electro') && rxnElems.includes(ownerElem) && nsStore[effOwnerId];
    case 'cinderCityHydro1':
      return rxnElems.includes('hydro') && rxnElems.includes(ownerElem);
    case 'cinderCityHydro2':
      return rxnElems.includes('hydro') && rxnElems.includes(ownerElem) && nsStore[effOwnerId];
    case 'cinderCityDendro1':
      return rxnElems.includes('dendro') && rxnElems.includes(ownerElem);
    case 'cinderCityDendro2':
      return rxnElems.includes('dendro') && rxnElems.includes(ownerElem) && nsStore[effOwnerId];
    case 'cinderCityAnemo1':
      return rxnElems.includes('anemo') && rxnElems.includes(ownerElem);
    case 'cinderCityAnemo2':
      return rxnElems.includes('anemo') && rxnElems.includes(ownerElem) && nsStore[effOwnerId];
    case 'cinderCityGeo1':
      return rxnElems.includes('geo') && rxnElems.includes(ownerElem);
    case 'cinderCityGeo2':
      return rxnElems.includes('geo') && rxnElems.includes(ownerElem) && nsStore[effOwnerId];
    case 'cinderCityCryo1':
      return rxnElems.includes('cryo') && rxnElems.includes(ownerElem);
    case 'cinderCityCryo2':
      return rxnElems.includes('cryo') && rxnElems.includes(ownerElem) && nsStore[effOwnerId];

    case 'celestialGift1':
      return actionElem === ownerElem;
    case 'celestialGift2': {
      const onFieldElem = CHARACTER[gameId][onFieldId].element;
      return actionElem === ownerElem || actionElem === onFieldElem;
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
      return evaluateSpecial(ctx, filter.special, effect, spec);
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
        nightsoul: states.nightsoul[effect.ownerId],
        radiance: states.aura.stellarConduct
          ? 'stellarConduct'
          : states.aura.stellarSwirl
            ? 'stellarSwirl'
            : null,
      }),
    });
  }
}
