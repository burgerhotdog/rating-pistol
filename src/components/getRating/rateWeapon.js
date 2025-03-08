import getData from "../getData";

const rateWeapon = (gameId, data) => {
  if (!data.weaponLevel) return -1;
  const { generalData } = getData(gameId);
  const level = data.weaponLevel;

  return (level / generalData.LEVEL_CAP) * 100;
};

export default rateWeapon;
