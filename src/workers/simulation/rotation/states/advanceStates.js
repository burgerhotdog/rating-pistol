import { GI, WW } from '@/data';
import { advanceIcdStates } from './icd';
import { advanceAuras } from './aura';
import { advanceNegativeStatuses } from './negativeStatuses';
import { advanceTune } from './tune';
import { advanceEffects } from './effects';
import { advanceCooldowns } from './cooldowns';
import { advanceShielded } from './shielded';

export const advanceStates = (ctx, elapsed) => {
  if (!elapsed) return;
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
