import getData from "../getData";

const rateSkillMap = (gameId, data) => {
  const { generalData } = getData[gameId];
  let levelTotal = 0;
  let capTotal = 0;
  for (const [skillKey, skillValue] of Object.entries(data.skillMap)) {
    levelTotal += Number(skillValue);
    capTotal += generalData.SKILL_DATA[skillKey].skill_cap;
  }
  return (levelTotal / capTotal) * 100;
};

export default rateSkillMap;
