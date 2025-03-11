export default (weapon, weaponRank) => {
  return weapon.descVar
    ? weapon.descVar.reduce((descBody, values, index) => 
      descBody.replace(`{${index}}`, values[weaponRank - 1]),
      weapon.descBody)
    : weapon.descBody;
};
