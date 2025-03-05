import getData from "../getData";

const rateWeapon = (gameType, id, data) => {
  if (!data.info.weapon || !data.info.weaponLevel) return -1;
  const { INFO } = getData(gameType);
  const level = Number(data.info.weaponLevel);
  const rawRating = (level / INFO.LEVEL_CAP) * 100 ;
  return Math.round(rawRating);
};

export default rateWeapon;
