import getData from "../getData";

const rateLevels = (gameId, data) => {
  const { generalData } = getData[gameId];
  const { level, weaponLevel } = data;

  if (!level || !weaponLevel) return 0;

  const avg = (level + weaponLevel) / 2
  return (avg / generalData.LEVEL_CAP) * 100;
};

export default rateLevels;
