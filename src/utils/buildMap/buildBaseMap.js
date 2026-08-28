import { GI, HSR, WW, ZZZ, CHARACTER, WEAPON } from '@/data';
import { toMergedObj } from '../merge';

const GAME_STATS = {
  [GI]: {
    'critRate%': 0.05,
    'critDmg%': 0.5,
    'energyRecharge%': 1,
  },
  [HSR]: {
    'critRate%': 0.05,
    'critDmg%': 0.5,
    'energyRegenerationRate%': 1,
  },
  [WW]: {
    'critRate%': 0.05,
    'critDmg%': 0.5,
    'energyRegen%': 1,
    'offTuneBuildupRate%': 1,
  },
  [ZZZ]: {
    'baseEnergyRegen': 1.2,
    'critRate%': 0.05,
    'critDmg%': 0.5,
  },
};

export function buildBaseMap(gameId, charId, weapId) {
  const gameStats = GAME_STATS[gameId];
  const charStats = CHARACTER[gameId][charId]?.stats ?? {};
  const weapStats = WEAPON[gameId][weapId]?.stats ?? {};

  return toMergedObj(gameStats, charStats, weapStats);
}
