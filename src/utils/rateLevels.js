import BASIC_DATA from "@data/misc/basic";

const rateLevels = (gameId, data) => {
  const level = Number(data.level);
  const weaponLevel = Number(data.weaponLevel);
  if (!level || !weaponLevel) return 0;

  const avg = (level + weaponLevel) / 2
  return (avg / BASIC_DATA[gameId].MAX_LEVEL) * 100;
};

export default rateLevels;
