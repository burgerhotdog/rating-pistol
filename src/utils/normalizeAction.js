import { CHARACTERS, MVS } from '@/data';
import { toArray } from '@/utils';

const ALT_CAST = new Set(['MA', 'DC', 'CA', 'JA', 'DA']);

export const normalizeAction = (gameId, characterId, skillId, actionId, level = 10) => {
  const action = MVS[gameId][characterId][skillId][actionId];
  const { element: ownerElement } = CHARACTERS[gameId][characterId];
  
  const name = action.name ?? '';
  const type = action.type ?? 'damage';
  const element = action.element ?? ownerElement;

  const cast = toArray(action.cast ?? skillId);
  const considered = toArray(action.considered ?? (ALT_CAST.has(cast[0]) ? [skillId, cast] : cast));

  const duration = action.duration ?? ((cast && !cast.includes('OS')) ? 1000 : 0);
  const offset = Math.min(duration, action.offset ?? ((cast && !cast.includes('OS')) ? 500 : 0));

  const attr = action.attr ?? 'ATK';

  let sumFlat = 0;
  let sumMv = 0;
  let sumTimes = 0;
  for (const { mv, flat, times = 1 } of toArray(action.multipliers)) {
    if (flat) {
      sumFlat += flat[level-1];
    }
    if (mv) {
      sumMv += mv[level-1] * times;
      sumTimes += times;
    }
  }

  return {
    owner: characterId,
    skill: skillId,
    name,
    type,
    element,
    cast,
    considered: [...considered, ...(element ? [element] : [])],
    duration,
    offset,
    attr,
    hasMultipliers: !!action.multipliers,
    sumFlat,
    sumMvTimes: sumMv,
    sumTimes,
    times: action.times ?? 1,
  };
}