import getData from "../getData";

const rateSkills = (gameType, id, data) => {
  const { INFO } = getData(gameType);
  let percentLeveledTotal = 0;
  let count = 0;
  for (const [skillKey, skillValue] of Object.entries(data.info.skills)) {
    const percentLeveled = Number(skillValue) / INFO.SKILL_DATA[skillKey].skill_cap;
    percentLeveledTotal += percentLeveled;
    count++;
  }
  return Math.round((percentLeveledTotal / count) * 100);
};

export default rateSkills;
