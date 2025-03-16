import getData from "../getData";

const rateSkillMap = (gameId, data) => {
  const { SKILL_INDEX } = getData[gameId];
  let levelTotal = 0;
  let capTotal = 0;
  for (const [skillKey, skillValue] of Object.entries(data.skillMap)) {
    levelTotal += Number(skillValue);
    capTotal += SKILL_INDEX[skillKey].levelCap;
  }
  return (levelTotal / capTotal) * 100;
};

export default rateSkillMap;
