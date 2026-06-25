import { GI, HSR, WW, ZZZ } from '@/data';

export const formulaConfig = {
  [GI]: {
    ENEMY_RES: 0.1,
    getDefMult: (defRed, defIgn) => 190 / (200 * ((1 - defRed) * (1 - defIgn)) + 190),
  },
  [HSR]: {
    ENEMY_RES: 0,
    getDefMult: (defRed, defIgn) => 100 / (110 * (Math.max(0, 1 - defRed - defIgn)) + 100),
  },
  [WW]: {
    ENEMY_RES: 0.1,
    getDefMult: (defRed, defIgn) => 1520 / (1592 * ((1 - defRed) * (1 - defIgn)) + 1520),
  },
  [ZZZ]: {
    ENEMY_RES: -0.2,
    getDefMult: (defRed, defIgn, pen) => 60 / (Math.max(0, 794 * (1 - defRed) * (1 - defIgn) - pen) + 60),
  },
};
