import getData from "../../../../getData";

export default (id, nodeId) => {
  const { AVATAR_DATA, STAT_INDEX } = getData.hsr;

  switch (nodeId) {
    case "basic":
      return "Basic Attack";

    case "skill":
      return "Skill";
    
    case "ult":
      return "Ultimate";

    case "talent":
      return "Talent";

    case "tech":
      return "Technique";
    
    default:
      const type = nodeId[0];
      const subType = nodeId[1];

      if (type === "A") {
        return AVATAR_DATA[id].major[subType];
      } else {
        const statId = AVATAR_DATA[id].minor[subType];
        return STAT_INDEX[statId]?.name ?? statId;
      }
  }
};
