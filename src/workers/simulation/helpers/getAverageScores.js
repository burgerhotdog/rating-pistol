export function getAverageScores(trials, weekCount) {
  const averages = [];
  for (let week = 0; week <= weekCount; week++) {
    const currentWeekRotMap = {};
    for (const actionKey of Object.keys(trials[0].scores[week])) {
      let sum = 0;
      for (const trial of trials) {
        sum += trial.scores[week][actionKey].damage ?? 0;
      }
      currentWeekRotMap[actionKey] = { damage: sum / trials.length };
    }
    averages.push(currentWeekRotMap);
  }
  return averages;
}
