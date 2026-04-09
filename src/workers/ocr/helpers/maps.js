import { WEAPONS, STATS } from '@/data';

const { MAIN_STAT_TYPES } = STATS['wuthering-waves'];

export const whitelistStat = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .';
export const whitelistValue = '0123456789.%';

export const weaponNameToId = Object.fromEntries(
  Object.entries(WEAPONS['wuthering-waves']).map(([id, { name }]) => ([name, id]))
);

export const mainStatNameToIdByCost = Object.fromEntries(
  MAIN_STAT_TYPES
    .filter(statTypesMap => Object.keys(statTypesMap).length)
    .map((map, index) => {
      const nameToId = {};
      for (const [id, { NAME }] of Object.entries(map)) {
        nameToId[NAME] = id;
      }
      switch (index) {
        case 0:
          return [1, nameToId];
        case 1:
          return [3, nameToId];
        case 2:
          return [4, nameToId];
      }
    })
);

export const subStatFragmentToSuffix = {
  'HP': 'HP',
  'ATK': 'ATK',
  'DEF': 'DEF',
  'Crit. Rate': 'CR',
  'Crit. DMG': 'CD',
  'Energy Regen': 'ER',
  'Basic Attack DMG Bonus': 'BA',
  'Heavy Attack DMG Bonus': 'HA',
  'Resonance Skill DMG': 'RS',
  'Resonance Liberation': 'RL',
};

export const subStatValueOptionsById = {
  FLAT_HP: [320, 360, 390, 430, 470, 510, 540, 580],
  FLAT_ATK: [30, 40, 50, 60],
  FLAT_DEF: [40, 50, 60, 70],
  PERCENT_HP: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_ATK: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_DEF: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  PERCENT_CR: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  PERCENT_CD: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
  PERCENT_ER: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
  PERCENT_BA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_HA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_RS: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_RL: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
};
