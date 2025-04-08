import MISC_ASSETS from "@assets/misc";
import SKILL_ASSETS from "@assets/skill";
import AVATAR_DATA from "@data/avatar";

export default (gameId, avatarId, nodeId) => {
  const minorIndex = Number(nodeId.slice(1)) - 1;

  if (nodeId[0] === "2") {
    const statId = AVATAR_DATA[gameId][avatarId].minor[minorIndex];
    return MISC_ASSETS[`./stats/${gameId}/${statId}.webp`]?.default;
  }
  return SKILL_ASSETS[`./${gameId}/${avatarId}/${nodeId}.webp`]?.default;
};
