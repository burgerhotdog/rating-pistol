export function weightedLottery(weightsList) {
  // Given an array of weights, returns the index of the winner
  const sum = weightsList.reduce((acc, weight) => acc + weight, 0);
  const winner = Math.random() * sum;

  let count = 0;
  for (let i = 0; i < weightsList.length; i++) {
    count += weightsList[i];
    if (count > winner) return i;
  }
  return weightsList.length - 1;
}
