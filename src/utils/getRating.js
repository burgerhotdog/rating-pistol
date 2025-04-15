import AVATARS from "@data/dynamic/avatars";
import getRollValue from "@utils/getRollValue";
import runSimulation from "@utils/runSimulation";

const getRating = (gameId, avatarId, equipList) => {
  const rating = equipList.map((equipObj) => {
    const { stat, statList } = equipObj;
    const weights = AVATARS[gameId][avatarId].weights;
    const rollValue = getRollValue(gameId, statList, weights);
    const simData = runSimulation(gameId, stat, weights);

    const simMax = simData.at(-1);
    const rank = rollValue > simMax
      ? 1
      : simData.length - simData.findIndex(rv => rv > rollValue) + 1;
    const percent = Math.min((rank / simData.length * 100), 100);

    return { percent, simData };
  });

  return rating;
};

export default getRating;
