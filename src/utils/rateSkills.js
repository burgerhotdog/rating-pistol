import BASIC_DATA from "@data/misc/basic";

const rateSkillMap = (gameId, data) => {
  let levelTotal = 0;
  let capTotal = 0;
  for (const [id, value] of Object.entries(data.skillMap)) {
    levelTotal += value;
    capTotal += id[0] === "0"
      ? BASIC_DATA[gameId].SKILL_MAX_LEVEL[Number(id[2]) - 1]
      : 1;
  }
  return (levelTotal / capTotal) * 100;
};

export default rateSkillMap;
