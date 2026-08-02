import { getAttr } from '@/utils';

export const computeBase = (part, compressed, statMap) => {
  const { flat, mvs, hitCount } = compressed;
  const percentMv = getAttr(`${part}Mv%`, statMap);
  const flatMv = getAttr(`${part}Mv`, statMap);
  let totalMvPart = 0;

  for (const [attr, mv] of Object.entries(mvs)) {
    const attrValue = getAttr(attr, statMap);
    totalMvPart += attrValue * (mv + flatMv * hitCount);
  }

  const flatBuff = getAttr('flat', statMap) * hitCount;

  return totalMvPart * (1 + percentMv) + flat + flatBuff;
};
