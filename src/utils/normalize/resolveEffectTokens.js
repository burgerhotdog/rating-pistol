// Keep in sync with the evaluator (or export ARITHMETIC_KEYS from there and import it).
const ARITHMETIC_KEYS = new Set(['SUM', 'DIFF', 'MIN', 'MAX']);
const LOGICAL_KEYS = new Set(['AND', 'OR', 'XOR', 'NOR', 'NOT']);

const isExpressionNode = (node) => Object.keys(node).some((key) => ARITHMETIC_KEYS.has(key));

export const resolveEffectTokens = (normalized) => {
  const resolveEffectRef = (ref, ownerId, sourceId) => {
    if (ref.includes(':')) return ref;

    const effect = Object.values(normalized).find((effect) =>
      effect.ownerId === ownerId &&
      effect.sourceId === sourceId &&
      effect.ref === ref
    );

    if (!effect) {
      console.warn(`Unresolved effect reference: ${ref}`);
    }

    return effect?.key;
  };

  /**
   * Walks a filter and replaces effect refs with full effect keys.
   *
   * Refs only appear where the context is `effectStacks`:
   *   { effectStacks: { a4_1: { ">=": 1 } } }              -> object keys
   *   { effectStacks: { HAS: ["a4_1"] } }                  -> HAS targets
   *   { effectStacks: { SUM: ["a4_1", "a4_2"], ">=": 2 } } -> string operands / right sides
   *
   * Elsewhere (e.g. `counts`), strings are plain paths and are left alone.
   */
  function traverseFilter(node, ownerId, sourceId, inEffectStacks = false) {
    if (node == null || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach((sub) => traverseFilter(sub, ownerId, sourceId, inEffectStacks));
      return;
    }

    // Unresolved refs are kept as-is (a warning is already logged)
    const toKey = (ref) =>
      inEffectStacks ? (resolveEffectRef(ref, ownerId, sourceId) ?? ref) : ref;

    // Operand or right-hand side: string path, number, nested expression, or filter.
    // Nested expressions and filters share the same context, so the flag carries over.
    const resolveTerm = (term) => {
      if (typeof term === 'string') return toKey(term);
      traverseFilter(term, ownerId, sourceId, inEffectStacks);
      return term;
    };

    // { SUM: [...], ">=": 2 }
    if (isExpressionNode(node)) {
      for (const [key, value] of Object.entries(node)) {
        node[key] = ARITHMETIC_KEYS.has(key) && Array.isArray(value)
          ? value.map(resolveTerm)
          : resolveTerm(value);
      }
      return;
    }

    // Regular node: every key is an independent filter (implicit AND)
    for (const [key, value] of Object.entries(node)) {
      if (key === 'HAS') {
        if (inEffectStacks) {
          node.HAS = Array.isArray(value)
            ? value.map(toKey)
            : value === '*' ? value : toKey(value);
        }
      } else if (LOGICAL_KEYS.has(key)) {
        traverseFilter(value, ownerId, sourceId, inEffectStacks);
      } else if (inEffectStacks) {
        const effectKey = toKey(key);

        if (effectKey !== key) {
          node[effectKey] = value;
          delete node[key];
        }
      } else {
        traverseFilter(value, ownerId, sourceId, key === 'effectStacks');
      }
    }
  }

  function resolveCommands(commands, ownerId, sourceId) {
    return commands
      .map((command) => {
        const key = resolveEffectRef(command.ref, ownerId, sourceId);
        if (!key) return null;

        if (command.filter) {
          traverseFilter(command.filter, ownerId, sourceId);
        }

        return { ...command, key };
      })
      .filter(Boolean);
  }

  // Shared by apply / remove / use / buff / expire entries
  function resolveStep(raw, ownerId, sourceId) {
    const { filter, commands } = raw;
    if (!filter && !commands) return raw;

    const step = { ...raw };

    if (filter) {
      step.filter = structuredClone(filter);
      traverseFilter(step.filter, ownerId, sourceId);
    }

    if (commands) {
      step.commands = resolveCommands(commands, ownerId, sourceId);
    }

    return step;
  }

  const resolved = structuredClone(normalized);

  for (const effect of Object.values(resolved)) {
    const { ownerId, sourceId } = effect;

    for (const field of ['apply', 'remove', 'use', 'buff']) {
      if (effect[field]) {
        effect[field] = effect[field].map((raw) =>
          resolveStep(raw, ownerId, sourceId)
        );
      }
    }

    if (effect.expire) {
      effect.expire = resolveStep(effect.expire, ownerId, sourceId);
    }

    if (effect.modify?.type === 'effect') {
      const modify = effect.modify = { ...effect.modify };
      modify.key = resolveEffectRef(modify.ref, ownerId, sourceId);
    }

    if (effect.modify?.type === 'action') {
      const modify = effect.modify = { ...effect.modify };
      modify.filter = structuredClone(modify.filter);
      traverseFilter(modify.filter, ownerId, sourceId);
    }
  }

  return resolved;
};
