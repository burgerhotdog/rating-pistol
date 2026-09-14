import { getAttr } from '@/utils';

export const computeBase = (part, compressed, statMap) => {
  const { flat, mvs, hitCount } = compressed;
  const mvMultiplier = getAttr(`${part}Mv%`, statMap);
  const mvFlat = getAttr(`${part}Mv`, statMap);
  let totalMvPart = 0;

  for (const [attr, mv] of Object.entries(mvs)) {
    const attrValue = getAttr(attr, statMap);
    totalMvPart += attrValue * (mv + mvFlat * hitCount);
  }

  const flatBuff = getAttr(`${part}Flat`, statMap) * hitCount;

  return totalMvPart * (1 + mvMultiplier) + flat + flatBuff;
};
