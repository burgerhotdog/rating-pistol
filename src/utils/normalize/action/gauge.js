function isDirectElevationDamage(damageType) {
  return damageType && (
    damageType.startsWith('lunar') ||
    damageType.startsWith('stellar')
  );
}

export function normalizeGauge(action, weaponType) {
  const { category, damage } = action;

  if (category !== 'normalAttack') return;

  if (isDirectElevationDamage(damage.type)) {
    delete damage.gauge;
    return;
  }

  if (weaponType !== 'bow' || damage.type === 'chargedAttack') {
    damage.gauge ??= 1;
  }
}
