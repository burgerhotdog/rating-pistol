import getData from "../getData";

const rateSkills = (gameId, id, data) => {
  const { generalData } = getData(gameId);
  let percentLeveledTotal = 0;
  let count = 0;
  for (const [skillKey, skillValue] of Object.entries(data.info.skills)) {
    const percentLeveled = Number(skillValue) / generalData.SKILL_DATA[skillKey].skill_cap;
    percentLeveledTotal += percentLeveled;
    count++;
  }
  return Math.round((percentLeveledTotal / count) * 100);
};

export default rateSkills;
