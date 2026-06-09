export function getAverageScores(trials, weekCount) {
  const averages = [];

  for (let week = 0; week <= weekCount; week++) {
    const currentWeekRotMap = {};

    for (const [member, actionMap] of Object.entries(trials[0].scores[week].byMember)) {
      const currentWeekMemberMap = {};

      for (const [actionKey, { element, considered }] of Object.entries(actionMap)) {
        let damageSum = 0;
        let healingSum = 0;

        for (const trial of trials) {
          damageSum += trial.scores[week].byMember[member][actionKey].damage ?? 0;
          healingSum += trial.scores[week].byMember[member][actionKey].healing ?? 0;
        }

        currentWeekMemberMap[actionKey] = {
          element,
          considered,
          damage: damageSum / trials.length,
          healing: healingSum / trials.length,
        };
      }

      currentWeekRotMap[member] = currentWeekMemberMap;
    }

    averages.push({ other: {}, byMember: currentWeekRotMap });
  }

  return averages;
}
