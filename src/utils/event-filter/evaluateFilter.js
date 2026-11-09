import { toArray } from '@/utils';
import { COMPARISON_OPERATORS, compare } from './comparison';

/* ------------------------------------------------------------------ *
 * FILTER GRAMMAR
 *
 *   null / undefined            -> always passes
 *   "cryo"                      -> context equals / contains "cryo"
 *   [a, b, c]                   -> implicit OR of the items
 *   { key: filter, ... }        -> implicit AND; each key descends into context[key]
 *   { AND|OR|NOT|NOR|XOR: ... } -> logical operators
 *   { HAS: "key" | [..] | "*" } -> key existence check
 *   { ">=": 2 }                 -> numeric comparison against the context (number only)
 *
 * EXPRESSION NODES (detected by an arithmetic key; compute a number)
 *   { SUM: ["liyue", "arkhe"], ">=": 2, "<=": 3 }
 *   { DIFF: ["members", "arkhe"], ">": "arkhe" }
 *
 *   - Exactly one arithmetic key, plus comparison keys only.
 *     To combine with other conditions, wrap in AND.
 *   - Operands inside an arithmetic list:
 *       number            -> literal
 *       string            -> path lookup in the current context
 *       expression node   -> nested expression
 *       anything else     -> filter, counted as 1 (pass) or 0 (fail)
 *   - The right side of a comparison here: number, string path, or nested expression.
 *
 * Comparison operators are numeric only. To match a string, use the
 * string itself as the node.
 * ------------------------------------------------------------------ */

/* ----------------------------- Logical ----------------------------- */

const LOGICAL = {
  NOT: (context, node)  => !evaluateFilter(context, node),
  AND: (context, nodes) => nodes.every((n) => evaluateFilter(context, n)),
  OR:  (context, nodes) => nodes.some((n) => evaluateFilter(context, n)),
  NOR: (context, nodes) => !nodes.some((n) => evaluateFilter(context, n)),
  XOR: (context, nodes) => nodes.filter((n) => evaluateFilter(context, n)).length === 1,
};

/* ---------------------------- Arithmetic --------------------------- */

const ARITHMETIC = {
  SUM:  (xs) => xs.reduce((a, b) => a + b, 0),
  DIFF: ([first = 0, ...rest]) => rest.reduce((a, b) => a - b, first),
  MUL:  (xs) => xs.reduce((a, b) => a * b, 1),
  MIN:  (xs) => Math.min(...xs),
  MAX:  (xs) => Math.max(...xs),
};

const isExprKey = (key) => Object.hasOwn(ARITHMETIC, key);
const isExprNode = (node) => !Array.isArray(node) && Object.keys(node).some(isExprKey);

// Dotted path lookup, always returns a number (missing -> 0)
function lookup(context, path) {
  if (context != null && typeof context === 'object' && Object.hasOwn(context, path)) {
    return Number(context[path] ?? 0);
  }
  const value = path.split('.').reduce((obj, k) => obj?.[k], context);
  return Number(value ?? 0);
}

// Operand inside an arithmetic list
function resolveTerm(term, context) {
  if (typeof term === 'number') return term;
  if (typeof term === 'string') return lookup(context, term);
  if (term !== null && typeof term === 'object' && isExprNode(term)) {
    return resolveValue(term, context);
  }
  return Number(evaluateFilter(context, term)); // filter -> 1 or 0
}

// A bare expression: { SUM: [...] } (no comparisons)
function resolveValue(expr, context) {
  const entries = Object.entries(expr);
  if (entries.length !== 1) {
    throw new Error(`Nested expression must have exactly one key, found: ${Object.keys(expr)}`);
  }

  const [op, args] = entries[0];
  if (!Array.isArray(args)) {
    throw new Error(`${op} expects an array of operands`);
  }

  return ARITHMETIC[op](args.map((arg) => resolveTerm(arg, context)));
}

// Right side of a comparison inside an expression node
function resolveRhs(rhs, context) {
  if (typeof rhs === 'number') return rhs;
  if (typeof rhs === 'string') return lookup(context, rhs);
  return resolveValue(rhs, context);
}

// { SUM: [...], ">=": 2, "<=": 3 }
function evaluateExpressionNode(context, node) {
  const entries = Object.entries(node);
  const exprEntries = entries.filter(([key]) => isExprKey(key));

  if (exprEntries.length !== 1) {
    const names = exprEntries.map(([key]) => key).join(', ');
    throw new Error(`Node has multiple expression keys (${names}); wrap each in AND`);
  }

  const [exprKey, args] = exprEntries[0];
  const comparisons = entries.filter(([key]) => key !== exprKey);

  if (comparisons.length === 0) {
    throw new Error(`${exprKey} has no comparison`);
  }

  const bad = comparisons.find(([key]) => !COMPARISON_OPERATORS.has(key));
  if (bad) {
    throw new Error(
      `${exprKey} cannot be combined with "${bad[0]}" in one node; use AND`
    );
  }

  const value = resolveValue({ [exprKey]: args }, context);

  return comparisons.every(([op, rhs]) =>
    compare(value, op, resolveRhs(rhs, context))
  );
}

/* ------------------------- Regular filter nodes -------------------- */

// { ">=": 1 } against the current context. Absent context counts as 0.
function evaluateComparison(context, op, rhs) {
  if (typeof rhs !== 'number') {
    throw new Error(
      `"${op}" in a regular filter needs a number, got ${JSON.stringify(rhs)}; ` +
      `use an expression node to compare against a path`
    );
  }

  const left = context ?? 0;
  return typeof left === 'number' && compare(left, op, rhs);
}

// { HAS: "key" } | { HAS: ["a", "b"] } | { HAS: "*" }
function evaluateHas(target, context) {
  if (context == null) return false;

  if (Array.isArray(target)) {
    return target.some((key) => Object.hasOwn(context, key));
  }
  if (target === '*') {
    return Object.keys(context).length > 0;
  }
  return Object.hasOwn(context, target);
}

function evaluateEntry(context, key, value) {
  if (key === 'HAS') return evaluateHas(value, context);
  if (Object.hasOwn(LOGICAL, key)) return LOGICAL[key](context, value);
  if (COMPARISON_OPERATORS.has(key)) return evaluateComparison(context, key, value);

  // Catch typos like SUMM or ANDD; real context keys aren't all-caps
  if (/^[A-Z]+$/.test(key)) throw new Error(`Unknown operator: ${key}`);

  return evaluateFilter(context?.[key], value);
}

/* ----------------------------- Entry point ------------------------- */

export function evaluateFilter(context, node) {
  if (node == null) return true;
  if (typeof node !== 'object') return toArray(context).includes(node);
  if (Array.isArray(node)) return node.some((sub) => evaluateFilter(context, sub));

  if (isExprNode(node)) return evaluateExpressionNode(context, node);

  return Object.entries(node).every(([key, value]) => evaluateEntry(context, key, value));
}
