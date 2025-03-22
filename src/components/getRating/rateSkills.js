import getData from "../getData";

const rateSkillMap = (gameId, data) => {
  const { SKILL_CAPS } = getData[gameId];
  let levelTotal = 0;
  let capTotal = 0;
  for (const [skillKey, skillValue] of Object.entries(data.skillMap)) {
    const type = skillKey[0];
    const isMajorMinor = type === "M" || type === "m";
    levelTotal += Number(skillValue);
    capTotal += isMajorMinor ? 1 : SKILL_CAPS[skillKey];
  }
  return (levelTotal / capTotal) * 100;
};

export default rateSkillMap;
