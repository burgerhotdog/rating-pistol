export const resolveEffectTokens = (normalized) => {
  const resolveEffectRef = (ref, ownerId, sourceId) => {
    if (ref.includes(':')) return ref;

    const effect = Object.values(normalized).find((effect) =>
      effect.ownerId === ownerId &&
      effect.sourceId === sourceId &&
      effect.ref === ref
    );

    return effect.key;
  };

  function walkBooleanTree(node, onLeaf) {
    if (node == null || typeof node !== 'object') return;

    if (Array.isArray(node)) {
      node.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }

    if ('and' in node) {
      node.and.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }

    if ('or' in node) {
      node.or.forEach((n) => walkBooleanTree(n, onLeaf));
      return;
    }

    if ('not' in node) {
      walkBooleanTree(node.not, onLeaf);
      return;
    }

    onLeaf(node);
  }

  function traverseFilter(node, ownerId, sourceId) {
    walkBooleanTree(node, (leaf) => {
      if ('has' in leaf) return; // generic has (e.g. action.has) - not an effect reference

      const [key, value] = Object.entries(leaf)[0];

      if (key === 'effectStacks') {
        resolveEffectStacksKeys(value, ownerId, sourceId);
        return;
      }

      traverseFilter(value, ownerId, sourceId);
    });
  }

  function resolveEffectStacksKeys(value, ownerId, sourceId) {
    walkBooleanTree(value, (leaf) => {
      if ('has' in leaf) {
        if (Array.isArray(leaf.has)) {
          leaf.has = leaf.has.map((effectRef) => resolveEffectRef(effectRef, ownerId, sourceId));
        } else if (leaf.has !== '*') {
          leaf.has = resolveEffectRef(leaf.has, ownerId, sourceId);
        }
        return;
      }

      // remaining keys are effect ids being compared (stacks thresholds etc.)
      for (const effectRef of Object.keys(leaf)) {
        const effectKey = resolveEffectRef(effectRef, ownerId, sourceId);
        leaf[effectKey] = leaf[effectRef];
        delete leaf[effectRef];
      }
    });
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
          apply.commands = commands.map((command) => ({
            ...command,
            key: resolveEffectRef(command.ref, ownerId, sourceId),
          }));
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
          remove.commands = commands.map((command) => ({
            ...command,
            key: resolveEffectRef(command.ref, ownerId, sourceId),
          }));
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
          use.commands = commands.map((command) => ({
            ...command,
            key: resolveEffectRef(command.ref, ownerId, sourceId),
          }));
        }

        return use;
      });
    }

    if (effect.buff?.filter) {
      effect.buff.filter = structuredClone(effect.buff.filter);
      traverseFilter(effect.buff.filter, ownerId, sourceId);
    }

    if (effect.modify?.type === 'effect') {
      const modify = effect.modify = { ...effect.modify };
      modify.key = resolveEffectRef(modify.ref, ownerId, sourceId);
    }
  }

  return resolved;
};
