import { modifyEffect } from './modifyEffect';

export function resolveModifyEffects(effectMap) {
  const effectDefs = {};
  const modifyQueue = [];

  for (const effectDef of Object.values(effectMap)) {
    const { modify } = effectDef;

    if (modify?.type === 'effect') {
      modifyQueue.push(modify);
    } else {
      effectDefs[effectDef.key] = effectDef;
    }
  }

  for (const { key, spec } of modifyQueue) {
    effectDefs[key] = modifyEffect(effectDefs[key], spec);
  }

  return effectDefs;
}
