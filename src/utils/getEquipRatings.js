import { AVATARS } from "@data";
import getRollValue from "@utils/getRollValue";
import simulateEquipRVs from "@utils/simulateEquipRVs";

const getEquipRatings = (gameId, avatarId, equipList) => {
  const rating = equipList.map((equipObj) => {
    const { stat, statList } = equipObj;
    const weights = AVATARS[gameId][avatarId].weights;
    const rollValue = getRollValue(gameId, statList, weights);
    const simData = simulateEquipRVs(gameId, stat, weights);

    const simMax = simData.at(-1);
    const rank = rollValue > simMax
      ? 1
      : simData.length - simData.findIndex(rv => rv > rollValue) + 1;
    const percent = Math.min((rank / simData.length * 100), 100);

    return { rollValue, percent, simData };
  });

  return rating;
};

export default getEquipRatings;
