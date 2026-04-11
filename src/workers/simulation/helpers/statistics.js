export function findRelativeError(list) {
  const n = list.length;
  const mean = list.reduce((a, b) => a + b) / n;
  const sumSquaredDiff = list.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  const standardDeviation = Math.sqrt(sumSquaredDiff / (n - 1));
  const standardError = standardDeviation / Math.sqrt(n);
  return standardError / Math.max(Math.abs(mean), 1e-8);
}
