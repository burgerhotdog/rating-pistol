import { getAttr } from '@/utils';

export const getDmgBonusMult = (statMap, dmgTypes) => {
  const dmgBonus = getAttr('dmgBonus%', statMap);

  const typeDmgBonus = dmgTypes.reduce((acc, type) =>
    acc + getAttr(`${type}DmgBonus%`, statMap), 0);

  return 1 + dmgBonus + typeDmgBonus;
};
