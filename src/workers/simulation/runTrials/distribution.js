export function createDistribution() {
  const samples = [];
  let n = 0, mean = 0, M2 = 0;
  return {
    add(x) {
      samples.push(x);

      n++;
      const delta = x - mean;
      mean += delta / n;
      M2 += delta * (x - mean);
    },
    get relativeError() {
      if (n < 2) return Infinity;
      const stdErr = Math.sqrt(M2 / (n - 1) / n);
      return stdErr / Math.max(Math.abs(mean), 1e-8);
    },
    get stdDev() {
      if (n < 2) return 0;
      return Math.sqrt(M2 / (n - 1));
    },
    get mean() {
      return mean;
    },
    get bands() {
      const sorted = [...samples].sort((a, b) => a - b);
      const pick = (p) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
      return {
        mean,
        p10: pick(0.1),
        p25: pick(0.25),
        p50: pick(0.5),
        p75: pick(0.75),
        p90: pick(0.9),
      };
    },
  };
}
