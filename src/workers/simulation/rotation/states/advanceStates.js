import { GI, WW } from '@/data';
import {
  advanceAuras,
  advanceIcdStates,
} from '../game-specific/genshin-impact';
import { advanceTune } from '../game-specific/wuthering-waves';
import { advanceNegativeStatuses } from './negativeStatuses';
import { advanceEffects } from './effects/advanceEffects';
import { advanceCooldowns } from './cooldowns';
import { advanceShielded } from './shielded';

export const advanceStates = (ctx, elapsed) => {
  const { cache, states, saveSnapshots } = ctx;
  const { gameId } = cache;

  if (gameId === GI) {
    advanceAuras(ctx, elapsed);
    advanceIcdStates(ctx, elapsed);
  }

  if (gameId === WW) {
    advanceNegativeStatuses(ctx, elapsed);
    advanceTune(ctx, elapsed);
  }

  advanceEffects(ctx, elapsed);
  advanceCooldowns(ctx, elapsed);
  advanceShielded(ctx, elapsed);

  if (saveSnapshots) {
    states.runtime += elapsed;
  }
};
