import charData from '../data/charData';

const getScore = ( id, char ) => {
  // Values for 1 roll
  const subValues = {
    "HP": 38,
    "ATK": 19,
    "DEF": 19,
    "HP%": 3.8,
    "ATK%": 3.8,
    "DEF%": 4.8,
    "CRIT Rate": 2.9,
    "CRIT DMG": 5.8,
    "EHR%": 3.8,
    "EFF RES%": 3.8,
    "BE": 5.8,
    "SPD": 2.3,
  }

  let total = 0;

  // Calculate total sum of rolls
  // First and second substats count as 1 roll
  // Third substat counts as 0.5 roll
  for (let slot = 0; slot < 6; slot++) {
    total += Number(char[slot][0] ?? 0) / subValues[charData[id].substats[0]];
    total += Number(char[slot][1] ?? 0) / subValues[charData[id].substats[1]];
    total += (Number(char[slot][2] ?? 0) / subValues[charData[id].substats[2]]) / 2;
  }

  console.log(total);

  // Return it as a percentage of 29
  // 25 represents an ideal amount of substat rolls
  
  /* This is calculated using Prydwen's algorithm.
  There are 48 total substats possible (6 slots * 8 substats per slot).
  24 rolls are evenly distributed between all 12 different substats (2 rolls each).
  The remaining 24 rolls are assigned to the best substats for each character.
  Only restriction is that substats can't be allocated more than 12 rolls.
  This comes out to: 12 + 12 + 0.
  Add this to the original 20 distributed rolls: 14 + 14 + 2.
  After taking into account the weights, our final sum is 29. */
  return Math.round((total / 29) * 100);
};

export default getScore;