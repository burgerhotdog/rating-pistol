import getData from "../getData";

const rateAvatar = (gameId, data) => {
  if (!data.level) return -1;
  const { generalData } = getData(gameId);
  const level = data.level;
  const rawScore = (level / generalData.LEVEL_CAP) * 100;

  return Math.round(rawScore);
};

export default rateAvatar;
