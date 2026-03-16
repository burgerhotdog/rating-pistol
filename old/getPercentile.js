export default (number, array) => {
  const countBelowOrEqual = array.filter(item => item <= number).length;
  return countBelowOrEqual / array.length * 100;
};
