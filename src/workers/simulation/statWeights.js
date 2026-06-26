import { GI, HSR, ZZZ } from '@/data';

export const HOYO_MAINSTAT_WEIGHTS = {
  [GI]: [
    {
      'hp': 1,
    },
    {
      'atk': 1,
    },
    {
      'hp%': 8,
      'atk%': 8,
      'def%': 8,
      'elementalMastery': 3,
      'energyRecharge%': 3,
    },
    {
      'hp%': 8,
      'atk%': 8,
      'def%': 8,
      'elementalMastery': 1,
      'physicalDmgBonus%': 2,
      'pyroDmgBonus%': 2,
      'electroDmgBonus%': 2,
      'hydroDmgBonus%': 2,
      'dendroDmgBonus%': 2,
      'anemoDmgBonus%': 2,
      'geoDmgBonus%': 2,
      'cryoDmgBonus%': 2,
    },
    {
      'hp%': 8,
      'atk%': 8,
      'def%': 8,
      'elementalMastery': 1,
      'critRate%': 3,
      'critDmg%': 3,
      'healingBonus%': 3,
    }
  ],
  [HSR]: [
    {
      'hp': 1,
    },
    {
      'atk': 1,
    },
    {
      'hp%': 2,
      'atk%': 2,
      'def%': 2,
      'critRate%': 1,
      'critDmg%': 1,
      'outgoingHealingBoost%': 1,
      'effectHitRate%': 1,
    },
    {
      'hp%': 3,
      'atk%': 3,
      'def%': 3,
      'spd': 1,
    },
    {
      'hp%': 4,
      'atk%': 4,
      'def%': 4,
      'physicalDmgBonus%': 3,
      'fireDmgBonus%': 3,
      'iceDmgBonus%': 3,
      'lightningDmgBonus%': 3,
      'windDmgBonus%': 3,
      'quantumDmgBonus%': 3,
      'imaginaryDmgBonus%': 3,
    },
    {
      'hp%': 5,
      'atk%': 5,
      'def%': 5,
      'breakEffect%': 3,
      'energyRegenerationRate%': 1,
    },
  ],
  [ZZZ]: [
    {
      "hp": 1,
    },
    {
      "atk": 1,
    },
    {
      "def": 1,
    },
    {
      "hp%": 7,
      "atk%": 6,
      "def%": 7,
      "critRate%": 4,
      "critDmg%": 4,
      "anomalyProficiency": 5,
    },
    {
      "hp%": 7,
      "atk%": 6,
      "def%": 7,
      "penRatio%": 3,
      "physicalDmgBonus%": 2,
      "fireDmgBonus%": 2,
      "iceDmgBonus%": 2,
      "electricDmgBonus%": 2,
      "etherDmgBonus%": 2,
      "windDmgBonus%": 2,
    },
    {
      "hp%": 7,
      "atk%": 6,
      "def%": 7,
      "anomalyMastery%": 5,
      "impact%": 5,
      "energyRegen%": 3,
    }
  ],
};

export const KURO_MAINSTAT_WEIGHTS = {
  4: {
    'critRate%': 4,
    'critDmg%': 4,
    'hp%': 3,
    'atk%': 3,
    'def%': 3,
    'healingBonus%': 2,
  },
  3: {
    'glacioDmgBonus%': 2,
    'fusionDmgBonus%': 2,
    'electroDmgBonus%': 2,
    'aeroDmgBonus%': 2,
    'spectroDmgBonus%': 2,
    'havocDmgBonus%': 2,
    'energyRegen%': 1,
    'hp%': 1,
    'atk%': 1,
    'def%': 1,
  },
  1: {
    'hp%': 1,
    'atk%': 1,
    'def%': 1,
  },
};

export const KURO_MAINSTAT_INDEX_ORDER = {
  4: {
    'critRate%': 1,
    'critDmg%': 2,
    'healingBonus%': 3,
    'hp%': 4,
    'atk%': 5,
    'def%': 6,
  },
  3: {
    'glacioDmgBonus%': 1,
    'fusionDmgBonus%': 2,
    'electroDmgBonus%': 3,
    'aeroDmgBonus%': 4,
    'spectroDmgBonus%': 5,
    'havocDmgBonus%': 6,
    'energyRegen%': 7,
    'hp%': 8,
    'atk%': 9,
    'def%': 10,
  },
  1: {
    'hp%': 1,
    'atk%': 2,
    'def%': 3,
  },
};

export const HOYO_SUBSTAT_WEIGHTS = {
  [GI]: {
    'hp': 6,
    'atk': 6,
    'def': 6,
    'hp%': 4,
    'atk%': 4,
    'def%': 4,
    'critRate%': 3,
    'critDmg%': 3,
    'elementalMastery': 4,
    'energyRecharge%': 4,
  },
  [HSR]: {
    'hp': 10,
    'atk': 10,
    'def': 10,
    'hp%': 10,
    'atk%': 10,
    'def%': 10,
    'spd': 4,
    'critRate%': 6,
    'critDmg%': 6,
    'effectHitRate%': 8,
    'effectRes%': 8,
    'breakEffect%': 8,
  },
  [ZZZ]: {
    'hp': 6,
    'atk': 5,
    'def': 6,
    'hp%': 6,
    'atk%': 5,
    'def%': 6,
    'pen': 5,
    'critRate%': 5,
    'critDmg%': 5,
    'anomalyProficiency': 5,
  },
};
