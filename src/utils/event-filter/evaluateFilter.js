import { toArray } from '@/utils';

const COMPARISON_OPS = new Set(['>', '<', '>=', '<=', '==', '!=']);

function compare(a = 0, op, b) {
  switch (op) {
    case '>':
      return a > b;

    case '<':
      return a < b;

    case '>=':
      return a >= b;

    case '<=':
      return a <= b;

    case '==':
      return a === b;

    case '!=':
      return a !== b;

    default:
      return false;
  }
}

export function evaluateFilter(node, context) {
  if (node == null) {
    return true;
  }

  if (typeof node !== 'object') {
    return toArray(context).includes(node);
  }

  if (Array.isArray(node)) {
    return node.some((subNode) => evaluateFilter(subNode, context));
  }

  if ('COUNT' in node) {
    const { conditions, ...comparison } = node.COUNT;

    const count = conditions.reduce(
      (acc, subNode) => acc + Number(evaluateFilter(subNode, context)),
      0
    );

    return evaluateFilter(comparison, count);
  }

  if ('SUM' in node) {
    const { keys, ...comparison } = node.SUM;

    const total = keys.reduce(
      (acc, key) => acc + (context?.[key] ?? 0),
      0
    );

    return evaluateFilter(comparison, total);
  }

  if ('AND' in node) {
    return node.AND.every((subNode) => evaluateFilter(subNode, context));
  }

  if ('OR' in node) {
    return node.OR.some((subNode) => evaluateFilter(subNode, context));
  }

  if ('NOT' in node) {
    return !evaluateFilter(node.NOT, context);
  }

  if ('XOR' in node) {
    return node.XOR.filter((subNode) => evaluateFilter(subNode, context)).length === 1;
  }

  if ('NOR' in node) {
    return !node.NOR.some((subNode) => evaluateFilter(subNode, context));
  }

  if ('HAS' in node) {
    if (context == null) {
      return false;
    }

    if (Array.isArray(node.HAS)) {
      return node.HAS.some((key) => Object.hasOwn(context, key));
    }

    return node.HAS === '*'
      ? Object.keys(context).length > 0
      : Object.hasOwn(context, node.HAS);
  }

  const [key, value] = Object.entries(node)[0];

  if (COMPARISON_OPS.has(key)) {
    return compare(context, key, value);
  }

  return evaluateFilter(value, context?.[key]);
}
