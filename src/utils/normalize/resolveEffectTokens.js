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

  for (const effect of Object.values(normalized)) {
    const { ownerId, sourceId } = effect;

    for (const field in effect) {
      if (/^on[A-Z]\w*Do[A-Z]\w*$/.test(field)) {
        const doEvent = effect[field] = { ...effect[field] };

        for (const effectRef of Object.keys(doEvent)) {
          const effectKey = resolveEffectRef(effectRef, ownerId, sourceId);
          doEvent[effectKey] = doEvent[effectRef];
          delete doEvent[effectRef];
        }
      }
    }

    if (effect.apply?.filter) {
      effect.apply.filter = structuredClone(effect.apply.filter);
      traverseFilter(effect.apply.filter, ownerId, sourceId);
    }

    if (effect.remove?.filter) {
      effect.remove.filter = structuredClone(effect.remove.filter);
      traverseFilter(effect.remove.filter, ownerId, sourceId);
    }

    if (effect.use?.filter) {
      effect.use.filter = structuredClone(effect.use.filter);
      traverseFilter(effect.use.filter, ownerId, sourceId);
    }

    if (effect.buff?.filter) {
      effect.buff.filter = structuredClone(effect.buff.filter);
      traverseFilter(effect.buff.filter, ownerId, sourceId);
    }
  }

  return normalized;
};
