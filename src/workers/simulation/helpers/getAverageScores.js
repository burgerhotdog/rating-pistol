export function getAverageScores(trials, weekCount) {
  const averages = [];

  for (let week = 0; week <= weekCount; week++) {
    const currentWeekRotMap = {};
    const blueprintSummary = trials[0].scores[week];

    for (const key in blueprintSummary) {
      const footprint = blueprintSummary[key];
      const { type } = footprint;

      let sum = 0;

      for (const trial of trials) {
        const currentWeekSummary = trial.scores[week];

        sum += currentWeekSummary[key][type] ?? 0;
      }

      currentWeekRotMap[key] = {
        ...footprint,
        [type]: sum / trials.length,
      };
    }

    averages.push(currentWeekRotMap);
  }

  return averages;
}
