export function findBenchmarkWeek(weeklyScores, minGain = 0.01) {
  let gain = 0;
  for (let i = 1; i < weeklyScores.length; i++) {
    const prev = weeklyScores[i - 1];
    const curr = weeklyScores[i];
    if (!Number.isFinite(prev) || prev <= 0) continue;

    gain = (curr - prev) / prev;
    if (gain < minGain) return { benchmarkWeek: i, diff: gain };
  }
  return { benchmarkWeek: -1, diff: gain };
}
