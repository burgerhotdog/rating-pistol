export function sumRotationDmg(dmg) {
  return Object.values(dmg).reduce((acc, { damage }) => acc + damage, 0);
}
