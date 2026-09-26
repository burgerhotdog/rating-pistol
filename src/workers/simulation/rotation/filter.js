import { CHARACTER, GI } from '@/data';
import { toArray } from '@/utils';

const ops = new Set(['>', '<', '>=', '<=']);

function compareNumber(a = 0, op, b) {
  switch (op) {
    case '>': return a > b;
    case '<': return a < b;
    case '>=': return a >= b;
    case '<=': return a <= b;
  }
}

function evaluateNode(node, context) {
  if (node == null) {
    return true;
  }

  if (typeof node !== 'object') {
    return toArray(context).includes(node);
  }

  if (Array.isArray(node)) {
    return node.some((subNode) => evaluateNode(subNode, context));
  }

  if ('and' in node) {
    return node.and.every((subNode) => evaluateNode(subNode, context));
  }

  if ('or' in node) {
    return node.or.some((subNode) => evaluateNode(subNode, context));
  }

  if ('not' in node) {
    return !evaluateNode(node.not, context);
  }

  if ('has' in node) {
    if (context == null) {
      return false;
    }

    if (Array.isArray(node.has)) {
      return node.has.some((key) => Object.hasOwn(context, key));
    }

    return node.has === '*'
      ? Object.keys(context).length > 0
      : Object.hasOwn(context, node.has);
  }

  const [nodeKey, nodeValue] = Object.entries(node)[0];

  if (ops.has(nodeKey)) {
    return compareNumber(context, nodeKey, nodeValue);
  }

  return evaluateNode(nodeValue, context?.[nodeKey]);
}

export function createEventFilter(ctx) {
  const { cache, states } = ctx;
  const { gameId } = cache;
  const { globalEffects, memberEffects } = states;

  return (filter, effect, spec = {}) => {
    const { fieldId } = spec;

    return evaluateNode(filter, {
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
