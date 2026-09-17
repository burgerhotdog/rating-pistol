import { GI } from '@/data';
import { normalizeEffect, toMergedObj } from '@/utils';

const RESONANCE_DATAS = {
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
        stores: '$team',
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
        stores: '$team',
        buff: {
          filter: {
            states: {
              or: [
                {
                  shielded: true,
                },
                {
                  aura: {
                    has: "moondrifts",
                  },
                },
              ],
            },
          },
          stats: {
            'dmgBonus%': 0.15,
          },
        },
      },
      {
        stores: '$team',
        apply: {
          by: '$team',
          when: 'hit',
          filter: {
            and: [
              {
                states: {
                  or: [
                    {
                      shielded: true,
                    },
                    {
                      aura: {
                        has: "moondrifts",
                      },
                    },
                  ],
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
    effects: [
      {
        stores: '$team',
        apply: {
          by: '$team',
          when: 'reaction',
          filter: {
            reaction: {
              reaction: [
                'burning',
                'quicken',
                'bloom',
                'lunarBloom',
              ],
            },
          },
          duration: 6000,
        },
        buff: {
          stats: {
            'elementalMastery': 30,
          },
        },
      },
      {
        stores: '$team',
        apply: {
          by: '$team',
          when: 'reaction',
          filter: {
            reaction: {
              reaction: [
                'aggravate',
                'spread',
                'hyperbloom',
                'burgeon',
              ],
            },
          },
          duration: 6000,
        },
        buff: {
          stats: {
            'elementalMastery': 20,
          },
        },
      },
    ],
  },
};

export function cacheElementalResonance(cache) {
  const elementCounts = cache.counts.element;
  const elementalResonance = cache.elementalResonance = { stats: {}, effects: [] };

  if (Object.keys(elementCounts).length === 4) {
    elementalResonance.stats = { 'elementalRes%': 0.15, 'physicalRes%': 0.15 };
    return;
  }

  for (const [element, count] of Object.entries(elementCounts)) {
    if (count < 2) continue;

    const { stats, effects } = RESONANCE_DATAS[element];

    if (stats) {
      elementalResonance.stats = toMergedObj(elementalResonance.stats, stats);
    }

    if (effects) {
      const sharedSpec = {
        ownerId: 'system',
        sourceId: 'element',
        memberIds: cache.memberIds,
      };

      for (const [index, rawEffect] of effects.entries()) {
        const effect = normalizeEffect(GI, rawEffect, { ...sharedSpec, index });
        elementalResonance.effects.push(effect);
      }
    }
  }
}
