import charData from '../data/charData';

const getScore = ( id, char ) => {
  // Values for 1 roll
  const subValues = {
    "ATK": 19,
    "ATK%": 3,
    "HP": 112,
    "HP%": 3,
    "DEF": 15,
    "DEF%": 4.8,
    "CRIT Rate": 2.4,
    "CRIT DMG": 4.8,
    "PEN": 9,
    "AP": 9,
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

  // Return it as a percentage of 31
  // 31 represents an ideal amount of substat rolls
  
  /* This is calculated using Prydwen's algorithm.
  There are 48 total substats possible (6 slots * 8 substats per slot).
  20 rolls are evenly distributed between all 10 different substats (2 rolls each).
  The remaining 28 rolls are assigned to the best substats for each character.
  Only restriction is that substats can't be allocated more than 12 rolls.
  This comes out to: 12 + 12 + 4.
  Add this to the original 20 distributed rolls: 14 + 14 + 6.
  After taking into account the weights, our final sum is 31. */
  return Math.round((total / 31) * 100);
};

export default getScore;