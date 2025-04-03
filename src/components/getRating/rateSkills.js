import { DATA } from "../importData";

const rateSkillMap = (gameId, data) => {
  const { SKILL_CAPS } = DATA[gameId];
  let levelTotal = 0;
  let capTotal = 0;
  for (const [id, value] of Object.entries(data.skillMap)) {
    levelTotal += value;
    capTotal += id[0] === "0" ? SKILL_CAPS[Number(id[2]) - 1] : 1;
  }
  return (levelTotal / capTotal) * 100;
};

export default rateSkillMap;
