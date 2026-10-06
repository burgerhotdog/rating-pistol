import { CHARACTER, GI } from '@/data';
import { normalizeEffect, toMergedObj } from '@/utils';

const ELEMENTAL_RESONANCES = {
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
                  shielded: {
                    '>': 0,
                  },
                },
                {
                  aura: {
                    has: "lunarCrystallize",
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
                      shielded: {
                        '>': 0,
                      },
                    },
                    {
                      aura: {
                        has: "lunarCrystallize",
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

function cacheElementalResonance(cache) {
  const { counts, teamResonance } = cache;
  const entries = Object.entries(counts.element);

  if (entries.length === 4) {
    teamResonance.stats = toMergedObj(teamResonance.stats, {
      'elementalRes%': 0.15,
      'physicalRes%': 0.15,
    });
    return;
  }

  for (const [element, count] of entries) {
    if (count < 2) continue;

    const { stats, effects } = ELEMENTAL_RESONANCES[element];

    if (stats) {
      teamResonance.stats = toMergedObj(teamResonance.stats, stats);
    }

    if (effects) {
      const sharedSpec = {
        ownerId: 'system',
        sourceId: 'element',
        memberIds: cache.memberIds,
      };

      for (const [index, rawEffect] of effects.entries()) {
        const effect = normalizeEffect(GI, rawEffect, { ...sharedSpec, index });
        teamResonance.effects.push(effect);
      }
    }
  }
}

const ascendantGleamEffectShell = {
  stores: '$team',
  apply: {
    when: 'start',
    filter: {
      action: {
        type: [
          'elementalSkill',
          'elementalBurst',
        ],
      },
    },
    duration: 20000,
  },
  buff: {},
};

function cacheMoonsignResonance(cache) {
  const { memberIds, counts, teamResonance } = cache;
  if (counts.moonsign < 2) return;

  for (const memberId of memberIds) {
    const { element, moonsign } = CHARACTER[GI][memberId];
    if (moonsign) continue;

    const effect = normalizeEffect(GI, ascendantGleamEffectShell, {
      ownerId: memberId,
      sourceId: 'moonsign',
      memberIds,
      index: 0,
    });

    switch (element) {
      case 'pyro':
      case 'electro':
      case 'cryo':
        effect.buff.specs = {
          'lunarReactionBonus%': {
            attr: 'atk',
            step: 100,
            value: 0.009,
            maxValue: 0.36,
          },
        };
        break;

      case 'hydro':
        effect.buff.specs = {
          'lunarReactionBonus%': {
            attr: 'hp',
            step: 1000,
            value: 0.006,
            maxValue: 0.36,
          },
        };
        break;

      case 'geo':
        effect.buff.specs = {
          'lunarReactionBonus%': {
            attr: 'def',
            step: 100,
            value: 0.01,
            maxValue: 0.36,
          },
        };
        break;

      case 'anemo':
      case 'dendro':
        effect.buff.specs = {
          'lunarReactionBonus%': {
            attr: 'elementalMastery',
            step: 100,
            value: 0.0225,
            maxValue: 0.36,
          },
        };
        break;
    }

    teamResonance.effects.push(effect);
  }
}

export function cacheTeamResonance(cache) {
  cache.teamResonance = { stats: {}, effects: [] };

  cacheElementalResonance(cache);
  cacheMoonsignResonance(cache);
}
