export default (benchmark) => {
  if (benchmark >= 120) return 'SSS';
  if (benchmark >= 110) return 'SS';
  if (benchmark >= 100) return 'S';
  if (benchmark >= 90) return 'A';
  if (benchmark >= 80) return 'B';
  if (benchmark >= 70) return 'C';
  return 'D';
};
