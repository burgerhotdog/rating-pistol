import React from 'react';

const Score = ({ character }) => {
  const getScore = () => {
    // Calculate total sum of rolls
    // First and second substats count as 1 roll
    // Third substat counts as 0.5 roll
    let total = 0;
    for (let slot = 0; slot <= 4; slot++) {
      total += Number(character[slot][0] ?? 0);
      total += Number(character[slot][1] ?? 0);
      total += Number(character[slot][2] ?? 0) / 2;
    }

    /* Return it as a percentage of 25
    25 represents an ideal amount of substat rolls
    
    This is calculated using Prydwen's algorithm.
    There are 40 total substats possible (5 slots * 8 substats per slot).
    20 rolls are evenly distributed between all 10 different substats (2 rolls each).
    The remaining 20 rolls are assigned to the best substats for each character.
    Only restriction is that substats can't be allocated more than 10 rolls.
    This comes out to: 10 + 10 + 0.
    Add this to the original 20 distributed rolls: 12 + 12 + 2.
    After taking into account the weights, our final sum is 25. */
    return Math.round((total / 25) * 100);
  };

  return <div>{getScore()}</div>;
};

export default Score;
