export default (weapon, weaponRank) => {
  if (!weapon) {
    return [];
  }

  if (weapon.descVar) {
    const descBodyArr = weapon.descBody.split(/({\d+})/).map((part) => {
      const match = part.match(/^{(\d+)}$/);
      if (match) {
        const varIndex = Number(match[1]);
        const varValue = String(weapon.descVar[varIndex][weaponRank - 1]);
        return ["true", varValue];
      }
      return ["", part];
    });

    return descBodyArr;
  }

  return [["", weapon.descBody]];
};
