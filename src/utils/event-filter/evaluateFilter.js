import { toArray } from '@/utils';
import { COMPARISON_OPS, compare } from './comparison';

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

const LOGICAL = {
  NOT: (context, node)  => !evaluateFilter(context, node),
  AND: (context, nodes) => nodes.every((n) => evaluateFilter(context, n)),
  OR:  (context, nodes) => nodes.some((n) => evaluateFilter(context, n)),
  NOR: (context, nodes) => !nodes.some((n) => evaluateFilter(context, n)),
  XOR: (context, nodes) => nodes.filter((n) => evaluateFilter(context, n)).length === 1,
};

const ARITHMETIC = {
  SUM:  (terms) => terms.reduce((acc, term) => acc + term, 0),
  DIFF: ([first = 0, ...rest]) => rest.reduce((acc, term) => acc - term, first),
  MIN:  (terms) => Math.min(...terms),
  MAX:  (terms) => Math.max(...terms),
};

const findArithmeticKey = (obj) => Object.keys(obj).find((key) => key in ARITHMETIC);

// Dotted path lookup, always returns a number (missing -> 0)
function lookup(context, path) {
  if (
    context != null &&
    typeof context === 'object' &&
    Object.hasOwn(context, path)
  ) {
    return Number(context[path] ?? 0);
  }

  const value = path.split('.').reduce((obj, k) => obj?.[k], context);
  return Number(value ?? 0);
}

// A bare expression: { SUM: [...] } (no comparisons)
function resolveArithmetic(context, arithmeticKey, rawTerms) {
  const arithOp = ARITHMETIC[arithmeticKey];

  const terms = rawTerms.map((rawTerm) => {
    if (rawTerm == null || Array.isArray(rawTerm)) {
      throw new Error('invalid term in arithmetic filter');
    }

    if (typeof rawTerm === 'number') return rawTerm;
    if (typeof rawTerm === 'string') return lookup(context, rawTerm);

    const termArithmeticKey = findArithmeticKey(rawTerm);
    if (termArithmeticKey && Object.keys(rawTerm).length === 1) {
      return resolveArithmetic(context, termArithmeticKey, rawTerm[termArithmeticKey]);
    }

    return Number(evaluateFilter(context, rawTerm)); // filter -> 1 or 0
  });

  return arithOp(terms);
}

// Right side of a comparison inside an expression node
function resolveRight(context, rawRight) {
  if (typeof rawRight === 'number') return rawRight;
  if (typeof rawRight === 'string') return lookup(context, rawRight);

  const [arithmeticKey, rawTerms] = Object.entries(rawRight)[0];
  return resolveArithmetic(context, arithmeticKey, rawTerms);
}

// { SUM: [...], ">=": 2, "<=": 3 }
function evalExprNode(context, exprNode, arithmeticKey) {
  const left = resolveArithmetic(context, arithmeticKey, exprNode[arithmeticKey]);

  for (const key in exprNode) {
    if (key === arithmeticKey) continue;

    const comparisonKey = key;
    const right = resolveRight(context, exprNode[comparisonKey]);

    const result = compare(left, comparisonKey, right);
    if (!result) return false;
  }

  return true;
}

/* ------------------------- Regular filter nodes -------------------- */

// { HAS: "key" } | { HAS: ["a", "b"] } | { HAS: "*" }
function evaluateHas(context, value) {
  if (context == null) return false;
  if (Array.isArray(value)) return value.some((key) => Object.hasOwn(context, key));
  if (value === '*') return Object.keys(context).length > 0;
  return Object.hasOwn(context, value);
}

export function evaluateFilter(context, node) {
  if (node == null) return true;
  if (typeof node !== 'object') return toArray(context).includes(node);
  if (Array.isArray(node)) return node.some((sub) => evaluateFilter(context, sub));

  const arithmeticKey = findArithmeticKey(node);
  if (arithmeticKey) return evalExprNode(context, node, arithmeticKey);

  return Object.entries(node).every(([key, value]) => {
    if (key === 'HAS') return evaluateHas(context, value);
    if (Object.hasOwn(LOGICAL, key)) return LOGICAL[key](context, value);
    if (COMPARISON_OPS.has(key)) return compare(context, key, value);
    return evaluateFilter(context?.[key], value);
  });
}
