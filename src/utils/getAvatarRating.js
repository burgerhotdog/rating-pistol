import simulateAvatarRVs from "@utils/simulateAvatarRVs";

const getAvatarRating = (gameId, equipRatings) => {
  const sumValue = equipRatings.reduce((acc, { rollValue }) => acc + rollValue, 0);
  const simData = simulateAvatarRVs(gameId, equipRatings);

  const simMax = simData.at(-1);
  const rank = sumValue > simMax
    ? 1
    : simData.length - simData.findIndex(rv => rv > sumValue) + 1;
  const percent = Math.min((rank / simData.length * 100), 100);

  return { rollValue: sumValue, percent, simData };
};

export default getAvatarRating;
