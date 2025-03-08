import getData from "../getData";

const rateWeapon = (gameId, data) => {
  if (!data.weaponLevel) return -1;
  const { generalData } = getData(gameId);
  const level = data.weaponLevel;
  const rawScore = (level / generalData.LEVEL_CAP) * 100;

  return Math.round(rawScore);
};

export default rateWeapon;
