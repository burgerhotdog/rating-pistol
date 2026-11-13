export const COMPARISON_OPS = new Set(['>', '<', '>=', '<=', '==', '!=']);

export function compare(a = 0, op, b) {
  switch (op) {
    case '>':  return a > b;
    case '<':  return a < b;
    case '>=': return a >= b;
    case '<=': return a <= b;
    case '==': return a === b;
    case '!=': return a !== b;
    default:   return false;
  }
}
