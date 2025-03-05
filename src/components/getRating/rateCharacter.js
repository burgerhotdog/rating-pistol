import getData from "../getData";

const rateCharacter = (gameType, id, data) => {
  if (!data.info.characterLevel) return -1;
  const { INFO } = getData(gameType);
  const level = Number(data.info.characterLevel);
  const rawRating = (level / INFO.LEVEL_CAP) * 100 ;
  return Math.round(rawRating);
};

export default rateCharacter;
