import scoreData from "./data/scoreData";

const AVERAGE_ROLLS = {
  hp: 254,
  atk: 16.5,
  def: 19.5,
  hpp: 5,
  atkp: 5,
  defp: 6,
  em: 19.5,
  cr: 3.3,
  cd: 6.6,
  er: 5.5,
}

const getScore = ( id, char ) => {
  // Sum up all the substat values
  const substatTotals = {
    hp: 0,
    atk: 0,
    def: 0,
    hpp: 0,
    atkp: 0,
    defp: 0,
    em: 0,
    cr: 0,
    cd: 0,
    er: 0,
  }
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 4; j++) {
      const subRef = char.pieces[i].substats[j];
      if (subRef.name === "") continue;
      substatTotals[subRef.name] += Number(subRef.value);
    }
  }
  console.log("substatTotals", substatTotals);

  // Divide substat totals by average roll value
  const substatRollValues = {};
  for (const key in substatTotals) {
    substatRollValues[key] = substatTotals[key] / AVERAGE_ROLLS[key];
  }
  console.log("substatRollValues:",substatRollValues);

  // Weights
  const weightedRollValues = {};
  for (const key in substatRollValues) {
    if (scoreData[id].weights[key] !== undefined) {
      weightedRollValues[key] = substatRollValues[key] * scoreData[id].weights[key];
    } else {
      weightedRollValues[key] = 0;
    }
  }
  console.log("weighted:", weightedRollValues);

  // Sum up all the weighted values
  let score = Object.values(weightedRollValues).reduce((sum, value) => sum + value, 0);
  console.log("score:", score);

  // Penalties
  // Overcapped crit rate
  // Unmet energy requirements

  // Return as percentage of the ideal substat spread
  let initRollCount = 40;
  const idealRolls = {
    hp: 0,
    atk: 0,
    def: 0,
    hpp: 0,
    atkp: 0,
    defp: 0,
    em: 0,
    cr: 0,
    cd: 0,
    er: 0,
  }
  for (const key in idealRolls) {
    idealRolls[key] += 2;
    initRollCount -= 2;
  }
  // work in progress

  return Math.round((score * 100) / 25);
};

export default getScore;