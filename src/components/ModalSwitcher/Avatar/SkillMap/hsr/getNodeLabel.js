import getData from "../../../../getData";
import getImgs from "../../../../getImgs";

const skillLabels = {
  basic: "Basic Attack",
  skill: "Skill",
  ult: "Ultimate",
  talent: "Talent",
  tech: "Technique",
};

export default (type, id, nodeId) => {
  const { AVATAR_DATA } = getData.hsr;
  const { STAT_IMGS } = getImgs.hsr;
  const subType = nodeId[1];

  switch (type) {
    case "skill":
      return skillLabels[nodeId];

    case "major":
      return AVATAR_DATA[id].major[subType];
    
    case "minor":
      const statId = AVATAR_DATA[id].minor[subType];
      return STAT_IMGS[`./${statId}.webp`]?.default;
  }
};
