import { GI, HSR, WW, ZZZ } from '@/data';
import { weightedLottery } from './utils';

const HOYO_WEIGHTS = {
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

const HOYO_VALUES = {
  [GI]: {
    'hp': 4780,
    'atk': 311,
    'hp%': 0.466,
    'atk%': 0.466,
    'def%': 0.583,
    'elementalMastery': 186.5,
    'energyRecharge%': 0.518,
    'physicalDmgBonus%': 0.583,
    'pyroDmgBonus%': 0.466,
    'electroDmgBonus%': 0.466,
    'hydroDmgBonus%': 0.466,
    'dendroDmgBonus%': 0.466,
    'anemoDmgBonus%': 0.466,
    'geoDmgBonus%': 0.466,
    'cryoDmgBonus%': 0.466,
    'critRate%': 0.311,
    'critDmg%': 0.622,
    'healingBonus%': 0.359,
  },
  [HSR]: {
    'hp': 705.6,
    'atk': 352.8,
    'hp%': 0.432,
    'atk%': 0.432,
    'def%': 0.54,
    'critRate%': 0.324,
    'critDmg%': 0.648,
    'outgoingHealingBoost%': 0.3456,
    'effectHitRate%': 0.432,
    'spd': 25,
    'physicalDmgBonus%': 0.3888,
    'fireDmgBonus%': 0.3888,
    'iceDmgBonus%': 0.3888,
    'lightningDmgBonus%': 0.3888,
    'windDmgBonus%': 0.3888,
    'quantumDmgBonus%': 0.3888,
    'imaginaryDmgBonus%': 0.3888,
    'breakEffect%': 0.648,
    'energyRegenerationRate%': 0.1944,
  },
  [ZZZ]: {
    'hp': 2200,
    'atk': 316,
    'def': 184,
    'hp%': 0.3,
    'atk%': 0.3,
    'def%': 0.48,
    'critRate%': 0.24,
    'critDmg%': 0.48,
    'anomalyProficiency': 92,
    'penRatio%': 0.24,
    'physicalDmgBonus%': 0.3,
    'fireDmgBonus%': 0.3,
    'iceDmgBonus%': 0.3,
    'electricDmgBonus%': 0.3,
    'etherDmgBonus%': 0.3,
    'windDmgBonus%': 0.3,
    'anomalyMastery%': 0.3,
    'impact%': 0.18,
    'energyRegen%': 0.6,
  },
};

const KURO_WEIGHTS = {
  4: {
    'hp%': 3,
    'atk%': 3,
    'def%': 3,
    'critRate%': 4,
    'critDmg%': 4,
    'healingBonus%': 2,
  },
  3: {
    'hp%': 1,
    'atk%': 1,
    'def%': 1,
    'glacioDmgBonus%': 2,
    'fusionDmgBonus%': 2,
    'electroDmgBonus%': 2,
    'aeroDmgBonus%': 2,
    'spectroDmgBonus%': 2,
    'havocDmgBonus%': 2,
    'energyRegen%': 1,
  },
  1: {
    'hp%': 1,
    'atk%': 1,
    'def%': 1,
  },
};

const KURO_VALUES = {
  4: {
    'hp%': 0.33,
    'atk%': 0.33,
    'def%': 0.415,
    'critRate%': 0.22,
    'critDmg%': 0.44,
    'healingBonus%': 0.26,
  },
  3: {
    'hp%': 0.3,
    'atk%': 0.3,
    'def%': 0.38,
    'glacioDmgBonus%': 0.3,
    'fusionDmgBonus%': 0.3,
    'electroDmgBonus%': 0.3,
    'aeroDmgBonus%': 0.3,
    'spectroDmgBonus%': 0.3,
    'havocDmgBonus%': 0.3,
    'energyRegen%': 0.32,
  },
  1: {
    'hp%': 0.228,
    'atk%': 0.18,
    'def%': 0.18,
  },
};

const KURO_FLATS = {
  4: ["atk", 150],
  3: ["atk", 100],
  1: ["hp", 2280],
};

const assignHoyo = (gameId, index) => {
  const options = HOYO_WEIGHTS[gameId][index];
  const winnerIndex = weightedLottery(Object.values(options));
  const mainStatId = Object.keys(options)[winnerIndex];
  const mainStatValue = HOYO_VALUES[gameId][mainStatId];

  return { index, mainStatId, mainStatValue };
};

const assignKuro = (cost) => {
  const weightMap = KURO_WEIGHTS[cost];
  const valueMap = KURO_VALUES[cost];
  const [mainStatFlatId, mainStatFlatValue] = KURO_FLATS[cost];

  const winnerIndex = weightedLottery(Object.values(weightMap));
  const mainStatId = Object.keys(weightMap)[winnerIndex];
  const mainStatValue = valueMap[mainStatId];

  return { cost, mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue };
};

export const assignMainStat = (gameId, spec = {}) => {
  if (gameId === WW) {
    const cost = spec.cost ?? (Math.random() < 0.5 ? 3 : 1);

    return assignKuro(cost);
  } else {
    if (gameId === HSR) {
      const randomIndex = spec.type === 'relic'
        ? Math.floor(Math.random() * 4)
        : Math.random() < 0.5 ? 4 : 5;

      return assignHoyo(gameId, randomIndex);
    } else {
      const numMainStats = gameId === GI ? 5 : 6;
      const randomIndex = Math.floor(Math.random() * numMainStats);

      return assignHoyo(gameId, randomIndex);
    }
  }
};
