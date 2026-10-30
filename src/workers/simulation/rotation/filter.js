import { CHARACTER, GI, WW } from '@/data';
import { evaluateFilter } from '@/utils';

function evaluateSpecial(ctx, special, effect, spec) {
  const gameId = ctx.cache.gameId
  const onFieldId = ctx.states.onFieldId;
  const effOwnerId = effect.ownerId;
  const ownerElem = CHARACTER[gameId][effOwnerId]?.element;
  const actionElem = spec.action?.damage?.element;
  const rxnElems = spec.reaction?.elements ?? [];
  const nsState = ctx.states.nightsoul[effOwnerId];

  switch (special) {
    case 'baizhu1':
      return ctx.states.memberHealth[onFieldId] < 0.5;
    case 'baizhu2':
      return ctx.states.memberHealth[onFieldId] >= 0.5;

    case 'neuvillette1':
    case 'neuvillette2':
    case 'neuvillette3': {
      if (spec.action?.ref !== 'normalAttack.4') return false;

      const required = Number(special.at(-1));

      const count = Object.values(ctx.states.memberEffects[10000087])
        .filter(({ effect }) => effect.ref?.startsWith('pastDraconicGlories'))
        .length;

      if (required === 3) {
        return count >= 3;
      } else {
        return count === required;
      }
    }

    case 'furina1':
    case 'furina2':
    case 'furina3':
    case 'furina4': {
      if (
        spec.action?.ref !== 'elementalSkill.2' &&
        spec.action?.ref !== 'elementalSkill.3' &&
        spec.action?.ref !== 'elementalSkill.4'
      ) return false;

      const required = Number(special.at(-1));

      const count = Object.values(ctx.states.memberHealth)
        .filter((health) => health > 0.5)
        .length;

      return count === required;
    }

    case 'iansanMovement': {
      const { fieldId, action } = spec;
      if (fieldId !== onFieldId) return false;
      if (!action) return false;

      if (action.type === 'plungingAttack') return true;

      if ( // Kinich
        action.ownerId === 10000101 &&
        action.category === 'elementalSkill'
      ) return true;

      if ( // Mualani
        action.ownerId === 10000102 &&
        action.category === 'elementalSkill'
      ) return true;

      if ( // Chasca
        action.ownerId === 10000104 &&
        action.category === 'elementalSkill'
      ) {
        return true;
      }

      if ( // Mavuika
        action.ownerId === 10000106 &&
        (
          action.type === 'chargedAttack' ||
          action.type === 'elementalBurst'
        )
      ) return true;

      if ( // Varesa
        action.ownerId === 10000111 &&
        (
          action.type === 'chargedAttack' ||
          action.type === 'elementalSkill'
        )
      ) return true;

      return false;
    }

    case 'cinderCityPyro1':
      return rxnElems.includes('pyro') && rxnElems.includes(ownerElem);
    case 'cinderCityPyro2':
      return rxnElems.includes('pyro') && rxnElems.includes(ownerElem) && nsState.blessing;
    case 'cinderCityElectro1':
      return rxnElems.includes('electro') && rxnElems.includes(ownerElem);
    case 'cinderCityElectro2':
      return rxnElems.includes('electro') && rxnElems.includes(ownerElem) && nsState.blessing;
    case 'cinderCityHydro1':
      return rxnElems.includes('hydro') && rxnElems.includes(ownerElem);
    case 'cinderCityHydro2':
      return rxnElems.includes('hydro') && rxnElems.includes(ownerElem) && nsState.blessing;
    case 'cinderCityDendro1':
      return rxnElems.includes('dendro') && rxnElems.includes(ownerElem);
    case 'cinderCityDendro2':
      return rxnElems.includes('dendro') && rxnElems.includes(ownerElem) && nsState.blessing;
    case 'cinderCityAnemo1':
      return rxnElems.includes('anemo') && rxnElems.includes(ownerElem);
    case 'cinderCityAnemo2':
      return rxnElems.includes('anemo') && rxnElems.includes(ownerElem) && nsState.blessing;
    case 'cinderCityGeo1':
      return rxnElems.includes('geo') && rxnElems.includes(ownerElem);
    case 'cinderCityGeo2':
      return rxnElems.includes('geo') && rxnElems.includes(ownerElem) && nsState.blessing;
    case 'cinderCityCryo1':
      return rxnElems.includes('cryo') && rxnElems.includes(ownerElem);
    case 'cinderCityCryo2':
      return rxnElems.includes('cryo') && rxnElems.includes(ownerElem) && nsState.blessing;

    case 'celestialGift1':
      return actionElem === ownerElem;
    case 'celestialGift2': {
      const onFieldElem = CHARACTER[gameId][onFieldId].element;
      return actionElem === ownerElem || actionElem === onFieldElem;
    }

    case 'consumeConcerto': {
      const isCamellyaForte = 
        spec.action.ownerId === 1603 &&
        spec.action.ref === 'forteCircuit.1';

      const isSuomingForte = 
        spec.action.ownerId === 1312 &&
        spec.action.ref === 'resonanceSkill.0';

      return isCamellyaForte || isSuomingForte;
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
        bondOfLife: states.bondOfLife[fieldId],
        nightsoul: states.nightsoul[effect.ownerId],
        radiance: states.aura.stellarConduct
          ? 'stellarConduct'
          : states.aura.stellarSwirl
            ? 'stellarSwirl'
            : null,
      }),
      ...(gameId === WW && {
        unison: states.unison[effect.ownerId],
      }),
    });
  }
}
