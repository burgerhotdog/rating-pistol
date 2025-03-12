export default (weapon, weaponRank) => {
  if (!weapon) {
    return [];
  }

  if (weapon.descVar) {
    const descBodyArr = weapon.descBody.split(/({\d+})/).map((part) => {
      const match = part.match(/^{(\d+)}$/);
      if (match) {
        const varIndex = Number(match[1]);
        const varArr = weapon.descVar[varIndex];
        const varValue = varArr.length === 1 ? varArr[0] : varArr[weaponRank - 1];
        return ["true", varValue];
      }
      return ["", part];
    });

    return descBodyArr;
  }

  console.log(["", weapon.descBody]);
  return [["", weapon.descBody]];
};
