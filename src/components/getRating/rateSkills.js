import getData from "../getData";

const rateSkillMap = (gameId, data) => {
  const { SKILL_CAPS } = getData[gameId];
  let levelTotal = 0;
  let capTotal = 0;
  for (const [skillKey, skillValue] of Object.entries(data.skillMap)) {
    levelTotal += Number(skillValue);
    capTotal += SKILL_CAPS[skillKey];
  }
  return (levelTotal / capTotal) * 100;
};

export default rateSkillMap;
