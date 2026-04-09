export function findBenchmarkWeek(weeklyScores, minGain = 0.01) {
  for (let i = 1; i < weeklyScores.length; i++) {
    const prev = weeklyScores[i - 1];
    const curr = weeklyScores[i];
    if (!Number.isFinite(prev) || prev <= 0) continue;

    const gain = (curr - prev) / prev;
    if (gain < minGain) return i;
  }
  return -1;
}
