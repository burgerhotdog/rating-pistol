import { WW, WEAPON } from '@/data';

export const whitelistStat = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .';
export const whitelistValue = '0123456789.%';

export const weaponNameToId = Object.fromEntries(
  Object.entries(WEAPON[WW]).map(([id, { name }]) => ([name, id]))
);

export const mainStatNameToIdByCost = {
  4: {
    'HP': 'hp%',
    'ATK': 'atk%',
    'DEF': 'def%',
    'Crit. Rate': 'critRate%',
    'Crit. DMG': 'critDmg%',
    'Healing Bonus': 'healingBonus%',
  },
  3: {
    'HP': 'hp%',
    'ATK': 'atk%',
    'DEF': 'def%',
    'Glacio DMG Bonus': 'glacioDmgBonus%',
    'Fusion DMG Bonus': 'fusionDmgBonus%',
    'Electro DMG Bonus': 'electroDmgBonus%',
    'Aero DMG Bonus': 'aeroDmgBonus%',
    'Spectro DMG Bonus': 'spectroDmgBonus%',
    'Havoc DMG Bonus': 'havocDmgBonus%',
    'Energy Regen': 'energyRegen%',
  },
  1: {
    'HP': 'hp%',
    'ATK': 'atk%',
    'DEF': 'def%',
  },
};

export const subStatFragmentToSuffix = {
  'HP': 'hp',
  'ATK': 'atk',
  'DEF': 'def',
  'Crit. Rate': 'critRate',
  'Crit. DMG': 'critDmg',
  'Energy Regen': 'energyRegen',
  'Basic Attack DMG Bonus': 'basicAttackDmgBonus',
  'Heavy Attack DMG Bonus': 'heavyAttackDmgBonus',
  'Resonance Skill DMG': 'resonanceSkillDmgBonus',
  'Resonance Liberation': 'resonanceLiberationDmgBonus',
};

export const subStatValueOptionsById = {
  'hp': [320, 360, 390, 430, 470, 510, 540, 580],
  'atk': [30, 40, 50, 60],
  'def': [40, 50, 60, 70],
  'hp%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'atk%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'def%': [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  'critRate%': [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  'critDmg%': [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
  'energyRegen%': [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
  'basicAttackDmgBonus%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'heavyAttackDmgBonus%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'resonanceSkillDmgBonus%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'resonanceLiberationDmgBonus%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
};
