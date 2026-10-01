import { toArray } from '@/utils';

const COMPARISON_OPS = new Set(['>', '<', '>=', '<=']);

function compare(a = 0, op, b) {
  switch (op) {
    case '>': return a > b;
    case '<': return a < b;
    case '>=': return a >= b;
    case '<=': return a <= b;
    default: return false;
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

  if ('and' in node) {
    return node.and.every((subNode) => evaluateFilter(subNode, context));
  }

  if ('or' in node) {
    return node.or.some((subNode) => evaluateFilter(subNode, context));
  }

  if ('not' in node) {
    return !evaluateFilter(node.not, context);
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
