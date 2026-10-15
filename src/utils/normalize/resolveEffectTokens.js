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

  function traverseFilter(node, ownerId, sourceId, inEffectStacks = false) {
    if (node == null || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach((subNode) =>
        traverseFilter(subNode, ownerId, sourceId, inEffectStacks)
      );
      return;
    }

    for (const op of ['and', 'or', 'xor', 'nor']) {
      if (op in node) {
        traverseFilter(node[op], ownerId, sourceId, inEffectStacks);
        return;
      }
    }

    if ('not' in node) {
      traverseFilter(node.not, ownerId, sourceId, inEffectStacks);
      return;
    }

    if ('count' in node) {
      traverseFilter(node.count.conditions, ownerId, sourceId, inEffectStacks);
      return;
    }

    if ('sum' in node) {
      if (inEffectStacks) {
        node.sum.keys = node.sum.keys.map((ref) =>
          resolveEffectRef(ref, ownerId, sourceId)
        );
      }
      return;
    }

    if ('has' in node) {
      if (inEffectStacks) {
        if (Array.isArray(node.has)) {
          node.has = node.has.map((ref) =>
            resolveEffectRef(ref, ownerId, sourceId)
          );
        } else if (node.has !== '*') {
          node.has = resolveEffectRef(node.has, ownerId, sourceId);
        }
      }
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      if (inEffectStacks) {
        const effectKey = resolveEffectRef(key, ownerId, sourceId);

        if (effectKey !== key) {
          node[effectKey] = value;
          delete node[key];
        }
      } else {
        traverseFilter(value, ownerId, sourceId, key === 'effectStacks');
      }
    }
  }

  const resolved = structuredClone(normalized);

  for (const effect of Object.values(resolved)) {
    const { ownerId, sourceId } = effect;

    if (effect.apply) {
      effect.apply = effect.apply.map((rawApply) => {
        const { filter, commands } = rawApply;
        if (!filter && !commands) return rawApply;
        const apply = { ...rawApply };

        if (filter) {
          apply.filter = structuredClone(filter);
          traverseFilter(apply.filter, ownerId, sourceId);
        }

        if (commands) {
          apply.commands = commands
            .map((command) => ({
              ...command,
              key: resolveEffectRef(command.ref, ownerId, sourceId),
            }))
            .filter((command) => command.key);
        }

        return apply;
      });
    }

    if (effect.remove) {
      effect.remove = effect.remove.map((rawRemove) => {
        const { filter, commands } = rawRemove;
        if (!filter && !commands) return rawRemove;
        const remove = { ...rawRemove };

        if (filter) {
          remove.filter = structuredClone(filter);
          traverseFilter(remove.filter, ownerId, sourceId);
        }

        if (commands) {
          remove.commands = commands
            .map((command) => ({
              ...command,
              key: resolveEffectRef(command.ref, ownerId, sourceId),
            }))
            .filter((command) => command.key);
        }

        return remove;
      });
    }

    if (effect.use) {
      effect.use = effect.use.map((rawUse) => {
        const { filter, commands } = rawUse;
        if (!filter && !commands) return rawUse;
        const use = { ...rawUse };

        if (filter) {
          use.filter = structuredClone(filter);
          traverseFilter(use.filter, ownerId, sourceId);
        }

        if (commands) {
          use.commands = commands
            .map((command) => ({
              ...command,
              key: resolveEffectRef(command.ref, ownerId, sourceId),
            }))
            .filter((command) => command.key);
        }

        return use;
      });
    }

    if (effect.buff?.filter) {
      effect.buff.filter = structuredClone(effect.buff.filter);
      traverseFilter(effect.buff.filter, ownerId, sourceId);
    }

    if (effect.buff?.commands) {
      effect.buff.commands = effect.buff.commands
        .map((command) => ({
          ...command,
          key: resolveEffectRef(command.ref, ownerId, sourceId),
        }))
        .filter((command) => command.key);
    }

    if (effect.modify?.type === 'effect') {
      const modify = effect.modify = { ...effect.modify };
      modify.key = resolveEffectRef(modify.ref, ownerId, sourceId);
    }

    if (effect.expire) {
      const expire = effect.expire = { ...effect.expire };

      if (expire.filter) {
        expire.filter = structuredClone(expire.filter);
        traverseFilter(expire.filter, ownerId, sourceId);
      }

      if (expire.commands) {
        expire.commands = expire.commands
          .map((command) => ({
            ...command,
            key: resolveEffectRef(command.ref, ownerId, sourceId),
          }))
          .filter((command) => command.key);
      }
    }
  }

  return resolved;
};
