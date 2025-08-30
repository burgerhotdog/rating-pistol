import { STAT_DATA } from '@data';

const HOYO_QUALITY = {
  gi: [1, 0.9, 0.8, 0.7],
  hsr: [1, 0.9, 0.8],
  zzz: [1],
};

const WW_4_VAL = {
  _ATK: [30, 40, 50, 60],
  _DEF: [40, 50, 60, 70],
};

const WW_8_VAL = {
  _HP: [320, 360, 390, 430, 470, 510, 540, 580],
  HP: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  ATK: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  DEF: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  ER: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
  BA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  HA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  RS: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  RL: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
};

const WW_CRIT_VAL = {
  CR: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  CD: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
};

const oneIn = (n) => {
  return !Math.floor(Math.random() * n);
};

export default (gameId, stat) => {
  // hoyo games
  if (gameId !== 'ww') {
    const QUALITY = HOYO_QUALITY[gameId];
    const index = Math.floor(Math.random() * QUALITY.length);
    return QUALITY[index];
  }

  // wuwa logic is more complex
  const { subValue } = STAT_DATA[gameId][stat]

  // _ATK and _DEF have 4 possible values
  if (stat === '_ATK' || stat === '_DEF') {
    // there is a 1 in 2 chance for it to be value 2
    if (oneIn(2)) return WW_4_VAL[stat][1] / subValue;
    // otherwise, there is a 1 in 5 chance for it to be value 1
    if (oneIn(5)) return WW_4_VAL[stat][0] / subValue;
    // otherwise, there is a 1 in 15 chance for it to be value 4
    if (oneIn(15)) return WW_4_VAL[stat][3] / subValue;
    // otherwise, it is value 3
    return WW_4_VAL[stat][2] / subValue;
  }

  // crit subs have their own separate rates
  if (stat === 'CR' || stat === 'CD') {
    // there is a 1 in 11 chance for it to be value 4
    if (oneIn(11)) return WW_CRIT_VAL[stat][3] / subValue;
    // otherwise, there is a 1 in 4 chance for it to be either value 5, 6, 7, or 8
    if (oneIn(4)) {
      // and then there is a 1 in 3 chance for it to be either value 7 or 8
      if (oneIn(3)) {
        // and then the chance is evenly split between values 7 and 8
        if (oneIn(2)) return WW_CRIT_VAL[stat][6] / subValue; 
        return WW_CRIT_VAL[stat][7] / subValue;
      }
      // otherwise, the chance is evenly split between values 5 and 6
      if (oneIn(2)) return WW_CRIT_VAL[stat][4] / subValue;
      return WW_CRIT_VAL[stat][5] / subValue;
    }
    // otherwise, the chance is evenly split between values 1, 2, and 3
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        return WW_CRIT_VAL[stat][0] / subValue;
      case 1:
        return WW_CRIT_VAL[stat][1] / subValue;
      case 2:
        return WW_CRIT_VAL[stat][2] / subValue;
    }
  }

  // now for all the other subs
  // there is a 1 in 4 chance for it to be value 4
  if (oneIn(4)) return WW_8_VAL[stat][3] / subValue;
  // otherwise, there is a 1 in 3 chance for it to be either value 5, 7, and 8
  if (oneIn(3)) {
    // and then there is a 1 in 3 chance for it to be either value 7 or 8
    if (oneIn(3)) {
      // and then there is a 1 in 3 chance for it to be value 8
      if (oneIn(3)) return WW_8_VAL[stat][7] / subValue;
      // otherwise, it is value 7
      return WW_8_VAL[stat][6] / subValue;
    }
    // otherwise, it is value 5
    return WW_8_VAL[stat][4] / subValue;
  }
  // otherwise, there is a 2 in 5 chance for it to be value 3
  if (Math.floor(Math.random() * 5) < 2) return WW_8_VAL[stat][2] / subValue;
  // otherwise, there is a 1 in 2 chance for it to be value 6
  if (oneIn(2)) return WW_8_VAL[stat][5] / subValue;
  // otherwise, the chance is evenly split between values 1 and 2
  if (oneIn(2)) return WW_8_VAL[stat][0] / subValue;
  return WW_8_VAL[stat][1] / subValue;
};
