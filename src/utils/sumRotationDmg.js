export function sumRotationDmg(dmg, filters = {}) {
  return Object.entries(dmg).reduce((acc, [actionKey, { damage }]) => {
    const [ownerId, skillId, actionId] = actionKey.split('-');
    if (filters.ownerId && filters.ownerId !== ownerId) return acc;
    if (filters.skillId && filters.skillId !== skillId) return acc;
    if (filters.actionId && filters.actionId !== actionId) return acc;
    return acc + damage;
  }, 0);
}
