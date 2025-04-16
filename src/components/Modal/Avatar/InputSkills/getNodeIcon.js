import { SKILL_ASSETS, STATS_ASSETS } from "@assets";
import { AVATAR_DATA } from "@data";

export default (gameId, avatarId, nodeId) => {
  const minorIndex = Number(nodeId.slice(1)) - 1;

  if (nodeId[0] === "2") {
    const statId = AVATAR_DATA[gameId][avatarId].minor[minorIndex];
    return STATS_ASSETS[`./${gameId}/${statId}.webp`]?.default;
  }
  return SKILL_ASSETS[`./${gameId}/${avatarId}/${nodeId}.webp`]?.default;
};
