import AVATARS from "@data/dynamic/avatars";

const getRankBonus = (gameId, avatarId, rank, nodeId) => {
  const skillRank = AVATARS[gameId][avatarId].skillRank;
  const skillIndex = Number(nodeId.slice(1)) - 1;

  switch (gameId) {
    case "gi":
      if (skillRank[skillIndex] && rank >= skillRank[skillIndex]) return 3;
      return 0;
    
    case "hsr":
      if (rank >= skillRank[skillIndex]) {
        if ([0, 4, 5].includes(skillIndex)) return 1;
        return 2;
      };
      return 0;

    case "ww":
      return 0;
      
    case "zzz":
      if (rank >= 5) return 4;
      if (rank >= 3) return 2;
      return 0;
  }
};

export default getRankBonus;