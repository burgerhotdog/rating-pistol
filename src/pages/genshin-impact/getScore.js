import charData from "./data/charData";

const getScore = ( id, char ) => {
  return "0";
  // Values for 1 roll
  const subValues = {
    "HP": 254,
    "ATK": 16.5,
    "DEF": 19.5,
    "HP%": 5,
    "ATK%": 5,
    "DEF%": 6,
    "EM": 19.5,
    "CRIT Rate": 3.3,
    "CRIT DMG": 6.6,
    "ER%": 5.5,
  }

  let total = 0;

  // Calculate total sum of rolls
  // First and second substats count as 1 roll
  // Third substat counts as 0.5 roll
  for (let slot = 0; slot < 5; slot++) {
    total += Number(char[slot][0] ?? 0) / subValues[charData[id].substats[0]];
    total += Number(char[slot][1] ?? 0) / subValues[charData[id].substats[1]];
    total += (Number(char[slot][2] ?? 0) / subValues[charData[id].substats[2]]) / 2;
  }

  console.log(total);

  // Return it as a percentage of 25
  // 25 represents an ideal amount of substat rolls
  
  /* This is calculated using Prydwen's algorithm.
  There are 40 total substats possible (5 slots * 8 substats per slot).
  20 rolls are evenly distributed between all 10 different substats (2 rolls each).
  The remaining 20 rolls are assigned to the best substats for each character.
  Only restriction is that substats can't be allocated more than 10 rolls.
  This comes out to: 10 + 10 + 0.
  Add this to the original 20 distributed rolls: 12 + 12 + 2.
  After taking into account the weights, our final sum is 25. */
  return Math.round((total / 25) * 100);
};

export default getScore;