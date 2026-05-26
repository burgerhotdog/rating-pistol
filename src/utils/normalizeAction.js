import { CHARACTERS, MVS } from '@/data';
import { toArray } from '@/utils';

const DEFAULT_CAST = {
  "1": "BA",
  "2": "RS",
  "3": "RL",
  "6": "IS",
  "8": "OS",
};

const ALT_CAST = new Set(['MA', 'DC', 'CA']);

export const normalizeAction = (gameId, characterId, skillId, actionId, level = 10) => {
  const action = MVS[gameId][characterId][skillId].skills[actionId];
  const { element: ownerElement } = CHARACTERS[gameId][characterId];
  
  let name = action.name ?? MVS[gameId][characterId][skillId].name ?? '';
  const type = action.type ?? 'damage';

  if (type !== 'damage') {
    name = `${name} ${type}`;
  }

  const element = type === 'damage'
    ? (action.element ?? ownerElement)
    : undefined;
  const cast = toArray(action.cast ?? DEFAULT_CAST[skillId]);
  const considered = toArray(action.considered ?? (ALT_CAST.has(cast) ? [DEFAULT_CAST[skillId], cast] : cast));
  const duration = action.duration ?? ((cast && !cast.includes('OS')) ? 1000 : 0);
  const offset = action.offset ?? ((cast && !cast.includes('OS')) ? 500 : 0);
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