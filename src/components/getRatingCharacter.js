const getRatingCharacter = (gameType, gameData, id, data) => {
  if (!data.info.characterLevel) return -1;
  const { INFO } = gameData;
  const level = Number(data.info.characterLevel);
  const rawRating = (level / INFO.LEVEL_CAP) * 100 ;
  return Math.round(rawRating);
};

export default getRatingCharacter;
