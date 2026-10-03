import { getAttr, toMergedObj } from '@/utils';
import { getBuffMap } from '../../getStatMap';

export function applyOffTuneBuildup(ctx, action) {
  const { tune } = ctx.states;
  if (
    !action.damage ||
    tune.isMistune ||
    tune.offTuneCooldown
  ) return;

  const buildMap = ctx.buildMaps[action.ownerId];
  const { buffMap } = getBuffMap(ctx, { memberId: action.ownerId, action, ignoreSpecs: true });
  const statMap = toMergedObj(buildMap, buffMap);
  const offTuneBuildupRate = getAttr('offTuneBuildupRate%', statMap);

  const hitCount = action.damage.compressed.hitCount;

  tune.offTune += 10 * offTuneBuildupRate * hitCount;
  if (tune.offTune < 300) return;
  tune.offTune = 300;
  tune.isMistune = true;
}
