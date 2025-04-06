import { ASSETS, DATA } from "../../importData";

export default (gameId, id, nodeId) => {
  const { AVATAR_DATA } = DATA[gameId];
  const { STAT_IMGS, SKILL_IMGS } = ASSETS[gameId];
  const minorIndex = Number(nodeId.slice(1)) - 1;

  if (nodeId[0] === "2") {
    const statId = AVATAR_DATA[id].minor[minorIndex];
    return STAT_IMGS[`./${statId}.webp`]?.default;
  }
  return SKILL_IMGS[`./${id}/${nodeId}.webp`]?.default;
};
