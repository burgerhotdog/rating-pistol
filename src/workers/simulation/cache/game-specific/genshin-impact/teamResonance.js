import { CHARACTER, GI } from '@/data';
import { normalizeEffect, toMergedObj } from '@/utils';
import ELEMENTAL_RESONANCE from './elemental-resonance.json';

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

    const { stats, effects } = ELEMENTAL_RESONANCE[element];

    teamResonance.stats = toMergedObj(teamResonance.stats, stats);

    for (const [index, rawEffect] of effects.entries()) {
      const effect = normalizeEffect(GI, rawEffect, {
        ownerId: 'system',
        sourceId: 'element',
        memberIds: cache.memberIds,
        index,
      });

      teamResonance.effects.push(effect);
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

  cacheNightsoulBurstCooldown(cache);
  cacheElementalResonance(cache);
  cacheMoonsignResonance(cache);
}

function cacheNightsoulBurstCooldown(cache) {
  const numNightsoul = cache.counts.nightsoul;

  if (numNightsoul >= 3) {
    cache.nightsoulBurst = 9000;
  } else if (numNightsoul === 2) {
    cache.nightsoulBurst = 12000;
  } else if (numNightsoul === 1) {
    cache.nightsoulBurst = 18000;
  }
}
