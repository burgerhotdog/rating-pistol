export function getAverageScores(trials, weekCount) {
  const averages = [];
  for (let week = 0; week <= weekCount; week++) {
    let sum = 0;
    for (const trial of trials) sum += trial.scores[week];
    averages.push(sum / trials.length);
  }
  return averages;
}
