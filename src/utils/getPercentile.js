export default (item, array) => {
  const countBelow = array.filter(cur => cur < item).length;
  return countBelow / array.length * 100;
};
