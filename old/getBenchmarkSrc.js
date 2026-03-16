export default (benchmark) => {
  if (benchmark >= 100) return 0;
  if (benchmark >= 90) return 1;
  if (benchmark >= 80) return 2;
  return 3;
};
