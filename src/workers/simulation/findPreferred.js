import { GI, HSR, WW, ZZZ } from '@/data';
import { mergeObj, getTotals } from '@/utils';

const HOYO_OPTIONS = {
  [GI]: [
    {
      'hp': 4780,
    },
    {
      'atk': 311,
    },
    {
      'hp%': 0.466,
      'atk%': 0.466,
      'def%': 0.583,
      'elementalMastery': 186.5,
      'energyRecharge%': 0.518,
    },
    {
      'hp%': 0.466,
      'atk%': 0.466,
      'def%': 0.583,
      'elementalMastery': 186.5,
      'physicalDmgBonus%': 0.583,
      'pyroDmgBonus%': 0.466,
      'electroDmgBonus%': 0.466,
      'hydroDmgBonus%': 0.466,
      'dendroDmgBonus%': 0.466,
      'anemoDmgBonus%': 0.466,
      'geoDmgBonus%': 0.466,
      'cryoDmgBonus%': 0.466,
    },
    {
      'hp%': 0.466,
      'atk%': 0.466,
      'def%': 0.583,
      'elementalMastery': 186.5,
      'critRate%': 0.311,
      'critDmg%': 0.622,
      'healingBonus%': 0.359,
    }
  ],
  [HSR]: [
    {
      'hp': 705.6,
    },
    {
      'atk': 352.8,
    },
    {
      'hp%': 0.432,
      'atk%': 0.432,
      'def%': 0.54,
      'critRate%': 0.324,
      'critDmg%': 0.648,
      'outgoingHealingBoost%': 0.3456,
      'effectHitRate%': 0.432,
    },
    {
      'hp%': 0.432,
      'atk%': 0.432,
      'def%': 0.54,
      'spd': 25,
    },
    {
      'hp%': 0.432,
      'atk%': 0.432,
      'def%': 0.54,
      'physicalDmgBonus%': 0.3888,
      'fireDmgBonus%': 0.3888,
      'iceDmgBonus%': 0.3888,
      'lightningDmgBonus%': 0.3888,
      'windDmgBonus%': 0.3888,
      'quantumDmgBonus%': 0.3888,
      'imaginaryDmgBonus%': 0.3888,
    },
    {
      'hp%': 0.432,
      'atk%': 0.432,
      'def%': 0.54,
      'breakEffect%': 0.648,
      'energyRegenerationRate%': 0.1944,
    },
  ],
  [ZZZ]: [
    {
      'hp': 2200,
    },
    {
      'atk': 316,
    },
    {
      'def': 184,
    },
    {
      'hp%': 0.3,
      'atk%': 0.3,
      'def%': 0.48,
      'critRate%': 0.24,
      'critDmg%': 0.48,
      'anomalyProficiency': 92,
    },
    {
      'hp%': 0.3,
      'atk%': 0.3,
      'def%': 0.48,
      'penRatio%': 0.24,
      'physicalDmgBonus%': 0.3,
      'fireDmgBonus%': 0.3,
      'iceDmgBonus%': 0.3,
      'electricDmgBonus%': 0.3,
      'etherDmgBonus%': 0.3,
      'windDmgBonus%': 0.3,
    },
    {
      'hp%': 0.3,
      'atk%': 0.3,
      'def%': 0.48,
      'anomalyMastery%': 0.3,
      'impact%': 0.18,
      'energyRegen%': 0.6,
    }
  ],
};

const KURO_OPTIONS = {
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

export const findPreferred = (cache, baseScore, currId, simulateRotation, getPenalty) => {
  const { gameId, member } = cache;
  const { baseMap } = member[currId];

  const options = gameId === WW ? KURO_OPTIONS : HOYO_OPTIONS[gameId];

  const preferredMap = {};

  for (const [keyType, mainStatValues] of Object.entries(options)) {
    const preferred = [];

    for (const [mainStatId, mainStatValue] of Object.entries(mainStatValues)) {
      const equipMap = { [mainStatId]: mainStatValue };
      const statMap = mergeObj(baseMap, equipMap);
      const summary = simulateRotation(statMap);
      const totals = getTotals(summary);
      const summed = (totals.damage + totals.healing + totals.shield) * getPenalty(statMap);

      if (summed > baseScore) {
        preferred.push(mainStatId);
      }
    }

    if (!preferred.length) {
      preferredMap[keyType] = Object.keys(mainStatValues);
    } else {
      preferredMap[keyType] = preferred;
    }
  }

  return preferredMap;
};
