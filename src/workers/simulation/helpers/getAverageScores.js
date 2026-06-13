export function getAverageScores(trials, weekCount) {
  const averages = [];

  for (let week = 0; week <= weekCount; week++) {
    const currentWeekRotMap = {};

    for (const key in trials[0].scores[week]) {
      const footprint = trials[0].scores[week][key];

      let damageSum = 0;
      let healingSum = 0;
      let shieldSum = 0;

      for (const trial of trials) {
        damageSum += trial.scores[week][key].damage ?? 0;
        healingSum += trial.scores[week][key].healing ?? 0;
        shieldSum += trial.scores[week][key].shield ?? 0;
      }

      currentWeekRotMap[key] = {
        ...footprint,
        damage: damageSum / trials.length,
        healing: healingSum / trials.length,
        shield: shieldSum / trials.length,
      };
    }

    averages.push(currentWeekRotMap);
  }

  return averages;
}
