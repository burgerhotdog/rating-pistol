import getData from "../getData";

const rateCharacter = (gameId, id, data) => {
  if (!data.info.characterLevel) return -1;
  const { generalData } = getData(gameId);
  const level = Number(data.info.characterLevel);
  const rawRating = (level / generalData.LEVEL_CAP) * 100 ;
  return Math.round(rawRating);
};

export default rateCharacter;
