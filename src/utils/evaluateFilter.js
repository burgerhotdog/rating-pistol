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

  if ('count' in node) {
    const { conditions, ...comparison } = node.count;

    const count = conditions.reduce(
      (acc, subNode) => acc + Number(evaluateFilter(subNode, context)),
      0
    );

    return evaluateFilter(comparison, count);
  }

  if ('sum' in node) {
    const { keys, ...comparison } = node.sum;

    const total = keys.reduce(
      (acc, key) => acc + (context?.[key] ?? 0),
      0
    );

    return evaluateFilter(comparison, total);
  }

  if ('and' in node) {
    return node.and.every((subNode) => evaluateFilter(subNode, context));
  }

  if ('or' in node) {
    return node.or.some((subNode) => evaluateFilter(subNode, context));
  }

  if ('not' in node) {
    return !evaluateFilter(node.not, context);
  }

  if ('xor' in node) {
    return node.xor.filter((subNode) => evaluateFilter(subNode, context)).length === 1;
  }

  if ('nor' in node) {
    return !node.nor.some((subNode) => evaluateFilter(subNode, context));
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

  const [key, value] = Object.entries(node)[0];

  if (COMPARISON_OPS.has(key)) {
    return compare(context, key, value);
  }

  return evaluateFilter(value, context?.[key]);
}
