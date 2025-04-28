import { AVATAR_ASSETS, STAT_ASSETS } from "@assets";
import { AVATAR_DATA } from "@data";

export default (gameId, avatarId, nodeId) => {
  const minorIndex = Number(nodeId.slice(1)) - 1;

  if (nodeId[0] === "2") {
    const statId = AVATAR_DATA[gameId][avatarId].minor[minorIndex];
    return STAT_ASSETS[gameId][statId];
  }

  if (gameId === "zzz") {
    return AVATAR_ASSETS[gameId].skill[nodeId];
  }
  
  return AVATAR_ASSETS[gameId][avatarId]?.[nodeId];
};
