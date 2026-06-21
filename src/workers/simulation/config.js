import { GI, HSR, WW, ZZZ } from '@/data';

export const trialConfig = {
  [GI]: {
    weeklyRoutine: function (ctx, next, generateEquip, evaluateEquip) {
      for (let i = 0; i < 66; i++) {
        const newEquipObj = generateEquip(ctx, 1);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, 1, newEquipObj, next));
      }
    },
  },
  [HSR]: {
    DROPS_PER_WEEK: 84,
  },
  [WW]: {
    weeklyRoutine: function (ctx, next, generateEquip, evaluateEquip) {
      for (let i = 0; i < 20; i++) {
        const newEquipObj = generateEquip(ctx, 4);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, 4, newEquipObj, next));
      }

      for (let i = 0; i < 75; i++) {
        const newEquipObj = generateEquip(ctx, 3);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, 3, newEquipObj, next));
      }

      for (let i = 0; i < 60; i++) {
        const newEquipObj = generateEquip(ctx, 1);
        if (!newEquipObj) continue;

        Object.assign(next, evaluateEquip(ctx, 1, newEquipObj, next));
      }
    },
  },
  [ZZZ]: {
    DROPS_PER_WEEK: 120,
  },
};

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
