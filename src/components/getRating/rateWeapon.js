import getData from "../getData";

const rateWeapon = (gameType, id, data) => {
  if (!data.info.weapon || !data.info.weaponLevel) return -1;
  const { generalData } = getData(gameType);
  const level = Number(data.info.weaponLevel);
  const rawRating = (level / generalData.LEVEL_CAP) * 100 ;
  return Math.round(rawRating);
};

export default rateWeapon;
