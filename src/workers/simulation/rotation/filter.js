import { toArray, getAttr } from '@/utils';

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
  if (node == null) return true;

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
    if (context == null) return false;
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

const toAttr = (stat) =>
  stat.startsWith('base')
    ? stat[4].toLowerCase() + stat.slice(5)
    : stat;

export function createEventFilter(ctx) {
  const { states, buildMaps } = ctx;
  return (filter, action, effect) => {
    return evaluateNode(filter, {
      action,
      states,
      get field() {
        const value = action.ownerId === states.onFieldId ? 'onField' : 'offField';
        Object.defineProperty(this, 'field', { value, enumerable: true });
        return value;
      },
      get attrMap() {
        const value = {};

        const buildMap = buildMaps[effect.ownerId];
        for (const stat in buildMap) {
          const attr = toAttr(stat);
          if (attr in value) continue;
          value[attr] = getAttr(attr, buildMap)
        }

        Object.defineProperty(this, 'attrMap', { value, enumerable: true });
        return value;
      },
      get effectStacks() {
        const value = {};

        const toEval = [states.globalEffects, ...Object.values(states.memberEffects)];
        for (const store of toEval) {
          for (const [effectId, { stacks }] of Object.entries(store)) {
            if (stacks > (value[effectId] ?? 0)) {
              value[effectId] = stacks;
            }
          }
        }

        Object.defineProperty(this, 'effectStacks', { value, enumerable: true });
        return value;
      },
    });
  }
}
