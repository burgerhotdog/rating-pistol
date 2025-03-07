import getData from "../getData";

const rateAvatar = (gameId, id, data) => {
  if (!data.level) return -1;
  const { generalData } = getData(gameId);
  const level = Number(data.level);
  const rawRating = (level / generalData.LEVEL_CAP) * 100 ;
  return Math.round(rawRating);
};

export default rateAvatar;
