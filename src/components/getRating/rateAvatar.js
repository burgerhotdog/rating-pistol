import getData from "../getData";

const rateAvatar = (gameId, data) => {
  if (!data.level) return -1;
  const { generalData } = getData(gameId);
  const level = data.level;

  return (level / generalData.LEVEL_CAP) * 100;
};

export default rateAvatar;
