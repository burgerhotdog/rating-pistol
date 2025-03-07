import getData from "../getData";

const rateWeapon = (gameId, id, data) => {
  if (!data.weaponId || !data.weaponLevel) return -1;
  const { generalData } = getData(gameId);
  const level = Number(data.weaponLevel);
  const rawRating = (level / generalData.LEVEL_CAP) * 100 ;
  return Math.round(rawRating);
};

export default rateWeapon;
