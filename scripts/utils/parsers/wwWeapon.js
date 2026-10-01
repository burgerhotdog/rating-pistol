import { pick } from '../../common.js';

const types = [
  'broadblade',
  'sword',
  'pistols',
  'gauntlets',
  'rectifier',
];

const statNames = {
  'HP': 'hp%',
  'HP+': 'hp%',
  'HP Up': 'hp%',
  'ATK': 'atk%',
  'ATK+': 'atk%',
  'ATK Up': 'atk%',
  'DEF': 'def%',
  'DEF+': 'def%',
  'DEF Up': 'def%',
  'Crit. Rate': 'critRate%',
  'Crit. Rate+': 'critRate%',
  'Crit. Rate Up': 'critRate%',
  'Crit. DMG': 'critDmg%',
  'Crit. DMG+': 'critDmg%',
  'Crit. DMG Up': 'critDmg%',
  'Healing Bonus': 'healingBonus%',
  'Healing Bonus+': 'healingBonus%',
  'Glacio DMG Bonus': 'glacioDmgBonus%',
  'Glacio DMG Bonus+': 'glacioDmgBonus%',
  'Fusion DMG Bonus': 'fusionDmgBonus%',
  'Fusion DMG Bonus+': 'fusionDmgBonus%',
  'Electro DMG Bonus': 'electroDmgBonus%',
  'Electro DMG Bonus+': 'electroDmgBonus%',
  'Aero DMG Bonus': 'aeroDmgBonus%',
  'Aero DMG Bonus+': 'aeroDmgBonus%',
  'Spectro DMG Bonus': 'spectroDmgBonus%',
  'Spectro DMG Bonus+': 'spectroDmgBonus%',
  'Havoc DMG Bonus': 'havocDmgBonus%',
  'Havoc DMG Bonus+': 'havocDmgBonus%',
  'Energy Regen': 'energyRegen%',
};

export function wwWeapon(id, data) {
  const b = data.stats[6][90];
  const stat = pick(statNames, b[1].name);

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `wuthering-waves/weapon/${id}.webp`,
    quality: Number(data.rarity),
    type: types[Number(data.type) - 1],
    stats: {
      baseAtk: Math.floor(b[0].value),
      [stat]: b[1].is_ratio
        ? b[1].value / 10000
        : Math.trunc(b[1].value),
    },
    effects: [],
  };
}
