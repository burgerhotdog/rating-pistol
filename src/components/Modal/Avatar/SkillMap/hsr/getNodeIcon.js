import getData from "../../../../getData";
import getImgs from "../../../../getImgs";

export default (id, nodeId) => {
  const { AVATAR_DATA } = getData.hsr;
  const { STAT_IMGS, SKILL_IMGS } = getImgs.hsr;
  const minorIndex = Number(nodeId.slice(1)) - 1;

  if (nodeId[0] === "2") {
    const statId = AVATAR_DATA[id].minor[minorIndex];
    return STAT_IMGS[`./${statId}.webp`]?.default;
  } else {
    return SKILL_IMGS[`./${id}/${nodeId}.webp`]?.default;
  }
};
