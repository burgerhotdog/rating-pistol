import { getAttr } from '@/utils';

export const getDmgAmpMult = (statMap, dmgTypes) => {
  const dmgAmp = getAttr('dmgAmp%', statMap);

  const typeDmgAmp = dmgTypes.reduce((acc, type) => (
    acc +
    getAttr(`${type}DmgAmp%`, statMap)
  ), 0);

  return 1 + dmgAmp + typeDmgAmp;
};
