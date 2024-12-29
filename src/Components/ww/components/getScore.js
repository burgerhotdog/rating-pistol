import charData from '../data/charData';

const getScore = ( id, char ) => {
  // Values for 1 roll
  const subValues = {
    "ATK": 50,
    "HP": 450,
    "DEF": 50,
    "ATK%": 9,
    "HP%": 9,
    "DEF%": 11.4,
    "ER": 10.3,
    "CRIT Rate": 8.4,
    "CRIT DMG": 16.8,
    "Basic DMG": 9,
    "Heavy DMG": 9,
    "Skill DMG": 9,
    "Lib. DMG": 9,
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

  // Return it as a percentage of 12.5
  // 12.5 represents an ideal amount of substat rolls
  
  /* This is calculated using Prydwen's algorithm.
  There are 25 total substats possible (5 slots * 5 substats per slot).
  13 rolls are evenly distributed between all 13 different substats (1 roll each).
  The remaining 12 rolls are assigned to the best substats for each character.
  Only restriction is that substats can't be allocated more than 4 rolls.
  This comes out to: 4 + 4 + 4.
  Add this to the original 20 distributed rolls: 5 + 5 + 5.
  After taking into account the weights, our final sum is 12.5 */
  return Math.round((total / 12.5) * 100);
};

export default getScore;