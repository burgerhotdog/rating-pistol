import { CHARACTERS, MVS } from '@/data';
import { compileStatMap, mergeStatMaps } from '@/utils';

export function getActiveEffects() {

}

export function computeActionDamage(gameId, actionKey, statMap, buffs) {
  const [characterId, skillId, actionId] = actionKey.split('-');
  return { damage: 0 };
}

export function computeRotationDamage(gameId, team) {
  const totalDamage = {};
  for (const member of team) {
    const { memberId, build = {}, rotation } = member;
    if (!memberId) continue;
    const activeEffects = getActiveEffects(gameId, );
    const selfEffects = CHARACTERS[gameId][memberId].effects;
    const statMap = compileStatMap(gameId, memberId, build, team, 'combat');

    const mergedMap = mergeStatMaps(statMap, activeEffects);
    for (const actionKey of rotation) {
      const { damage } = computeActionDamage(gameId, actionKey, mergedMap);
      if (selfEffects)
      totalDamage[actionKey] = (totalDamage[actionKey] ?? 0) + damage;
    }
  }
}
