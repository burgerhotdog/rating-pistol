import INFO from "@data/static/info";

const rateSkillMap = (gameId, data) => {
  let levelTotal = 0;
  let capTotal = 0;
  for (const [id, value] of Object.entries(data.skillMap)) {
    levelTotal += value;
    capTotal += id[0] === "0"
      ? INFO[gameId].SKILL_MAX_LEVEL[Number(id[2]) - 1]
      : 1;
  }
  return (levelTotal / capTotal) * 100;
};

export default rateSkillMap;
