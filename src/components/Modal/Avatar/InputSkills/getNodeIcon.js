import STATS_ASSETS from "@assets/static/stats";
import SKILL_ASSETS from "@assets/dynamic/skill";
import { AVATARS } from "@data";

export default (gameId, avatarId, nodeId) => {
  const minorIndex = Number(nodeId.slice(1)) - 1;

  if (nodeId[0] === "2") {
    const statId = AVATARS[gameId][avatarId].minor[minorIndex];
    return STATS_ASSETS[`./${gameId}/${statId}.webp`]?.default;
  }
  return SKILL_ASSETS[`./${gameId}/${avatarId}/${nodeId}.webp`]?.default;
};
