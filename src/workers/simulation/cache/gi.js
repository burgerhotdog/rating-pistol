import { GI, CHARACTER } from '@/data';
import { toMergedObj } from '@/utils';

const RESONANCES = {
  pyro: {
    stats: {
      'atk%': 0.25,
    },
  },
  hydro: {
    stats: {
      'hp%': 0.25,
    },
  },
  electro: {},
  cryo: {
    effects: [
      {
        buff: {
          filter: {
            states: {
              aura: {
                has: [
                  'cryo',
                  'frozen',
                ],
              },
            },
          },
          stats: {
            'critRate%': 0.15,
          },
        },
      },
    ],
  },
  anemo: {},
  geo: {
    stats: {
      'shieldStrength%': 0.15,
    },
    effects: [
      {
        buff: {
          filter: {
            states: {
              shielded: true,
            },
          },
          stats: {
            'dmgBonus%': 0.15,
          },
        },
      },
      {
        apply: {
          when: 'hit',
          filter: {
            and: [
              {
                states: {
                  shielded: true,
                },
              },
              {
                action: {
                  has: 'damage',
                },
              },
            ],
          },
          duration: 15000,
        },
        buff: {
          stats: {
            'geoResReduction%': 0.2,
          },
        },
      },
    ],
  },
  dendro: {
    stats: {
      'elementalMastery': 50,
    },
  },
  unique: {
    stats: {
      'elementalRes%': 0.15,
      'physicalRes%': 0.15,
    },
  },
};

export function cacheTeamResonance(cache) {
  const elementCounts = {};

  for (const memberId of cache.memberIds) {
    const { element } = CHARACTER[GI][memberId];

    elementCounts[element] = (elementCounts[element] ?? 0) + 1;
  }

  const elementalResonance = cache.elementalResonance = { stats: {} };

  if (Object.keys(elementCounts).length === 4) {
    elementalResonance.stats = RESONANCES.unique.stats;
  } else {
    for (const [element, count] of Object.entries(elementCounts)) {
      if (count < 2) continue;

      const { stats } = RESONANCES[element];

      if (stats) {
        elementalResonance.stats = toMergedObj(elementalResonance.stats, stats);
      }
    }
  }
}
