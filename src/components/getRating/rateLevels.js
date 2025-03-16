import getData from "../getData";

const rateLevels = (gameId, data) => {
  const { LEVEL_CAP } = getData[gameId];
  const level = Number(data.level);
  const weaponLevel = Number(data.weaponLevel);

  if (!level || !weaponLevel) return 0;

  const avg = (level + weaponLevel) / 2
  return (avg / LEVEL_CAP) * 100;
};

export default rateLevels;
