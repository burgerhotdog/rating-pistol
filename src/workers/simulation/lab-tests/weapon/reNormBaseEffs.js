import { resolveBuffValue } from '@/utils';

export function reNormBaseEffs(nonWeapBaseEffs, baseMap) {
  const resolved = structuredClone(nonWeapBaseEffs);

  for (const effect of Object.values(resolved)) {
    for (const buff of effect.buff) {
      if (buff.statRefs) {
        for (const [id, { multipliers, baseAttr, mvIndex }] of Object.entries(buff.statRefsRaw)) {
          if (!baseAttr) continue;

          const baseAttrValue = baseMap[baseAttr] ?? 0;
          buff.stats[id] = resolveBuffValue(multipliers[0], baseAttrValue, mvIndex);
        }
      }

      if (buff.specRefs) {
        for (const [id, fieldMap] of Object.entries(buff.specRefsRaw)) {
          for (const [field, { multipliers, baseAttr, mvIndex }] of Object.entries(fieldMap)) {
            if (!baseAttr) continue;

            const baseAttrValue = baseMap[baseAttr] ?? 0;
            buff.specs[id][field] = resolveBuffValue(multipliers[0], baseAttrValue, mvIndex);
          }
        }
      }
    }
  }

  return resolved;
}
