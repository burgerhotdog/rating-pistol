import { round, pick } from '../../common.js';

const statNames = {
  'HP': 'hp%',
  'ATK': 'atk%',
  'DEF': 'def%',
  'Impact': 'impact%',
  'Anomaly Mastery': 'anomalyMastery',
  'Anomaly Proficiency': 'anomalyProficiency',
  'Energy Regen': 'energyRegen%',
  'CRIT Rate': 'critRate%',
  'CRIT DMG': 'critDmg%',
  'PEN Ratio': 'penRatio%',
};

export function zzzWeapon(id, data) {
  const wt = Object.values(data.weapon_type)[0].toLowerCase();
  const baseStat = wt === 'armorer' ? 'baseDef' : 'baseAtk';
  const stat = pick(statNames, data.rand_property.name);
  const value = data.rand_property.value * 2.5;

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `zenless-zone-zero/weapon/${id}.webp`,
    quality: Number(data.rarity) + 1,
    type: wt,
    stats: {
      [baseStat]: round(data.base_property.value * 14.85),
      [stat]: stat.endsWith('%')
        ? value / 10000
        : Math.trunc(value),
    },
    effects: [],
  };
}
