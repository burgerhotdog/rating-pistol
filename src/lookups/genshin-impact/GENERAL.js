export default {
  TITLE: 'Genshin Impact',
  VERSION: '6.4',
  RESIN_PER_DAY: 180,
  RESIN_PER_RUN: 20,
  DROPS_PER_RUN: 1.065,
  NUM_MAINSTATS: 5,
  NUM_SUBSTATS: 4,
  EQUIP_NAMES: [
    'Flower',
    'Plume',
    'Sands',
    'Goblet',
    'Circlet',
  ],
  ELEMENT_TYPES: [
    'Anemo',
    'Cryo',
    'Dendro',
    'Electro',
    'Geo',
    'Hydro',
    'Pyro',
  ],
  WEAPON_TYPES: [
    'Bow',
    'Catalyst',
    'Claymore',
    'Polearm',
    'Sword',
  ],
  DEFAULT_STATS: {
    BASE_HP: 0,
    BASE_ATK: 0,
    BASE_DEF: 0,
    BASE_EM: 0,
    PERCENT_CR: 0.05,
    PERCENT_CD: 0.5,
    PERCENT_ER: 1,
  },
  MAIN_STAT_TYPES: [
    {
      FLAT_HP: {
        NAME: 'HP',
        VALUE: 4780,
        WEIGHT: 1,
      },
    },
    {
      FLAT_ATK: {
        NAME: 'ATK',
        VALUE: 311,
        WEIGHT: 1,
      },
    },
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.466,
        WEIGHT: 8,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.466,
        WEIGHT: 8,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.583,
        WEIGHT: 8,
      },
      FLAT_EM: {
        NAME: 'Elemental Mastery',
        VALUE: 186.5,
        WEIGHT: 3,
      },
      PERCENT_ER: {
        NAME: 'Energy Recharge',
        VALUE: 0.518,
        WEIGHT: 3,
      },
    },
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.466,
        WEIGHT: 8,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.466,
        WEIGHT: 8,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.583,
        WEIGHT: 8,
      },
      FLAT_EM: {
        NAME: 'Elemental Mastery',
        VALUE: 186.5,
        WEIGHT: 1,
      },
      PERCENT_PHYSICAL: {
        NAME: 'Physical DMG Bonus',
        VALUE: 0.583,
        WEIGHT: 2,
      },
      PERCENT_PYRO: {
        NAME: 'Pyro DMG Bonus',
        VALUE: 0.466,
        WEIGHT: 2,
      },
      PERCENT_ELECTRO: {
        NAME: 'Electro DMG Bonus',
        VALUE: 0.466,
        WEIGHT: 2,
      },
      PERCENT_HYDRO: {
        NAME: 'Hydro DMG Bonus',
        VALUE: 0.466,
        WEIGHT: 2,
      },
      PERCENT_DENDRO: {
        NAME: 'Dendro DMG Bonus',
        VALUE: 0.466,
        WEIGHT: 2,
      },
      PERCENT_ANEMO: {
        NAME: 'Anemo DMG Bonus',
        VALUE: 0.466,
        WEIGHT: 2,
      },
      PERCENT_GEO: {
        NAME: 'Geo DMG Bonus',
        VALUE: 0.466,
        WEIGHT: 2,
      },
      PERCENT_CRYO: {
        NAME: 'Cryo DMG Bonus',
        VALUE: 0.466,
        WEIGHT: 2,
      },
    },
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.466,
        WEIGHT: 8,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.466,
        WEIGHT: 8,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.583,
        WEIGHT: 8,
      },
      FLAT_EM: {
        NAME: 'Elemental Mastery',
        VALUE: 186.5,
        WEIGHT: 1,
      },
      PERCENT_CR: {
        NAME: 'CRIT Rate',
        VALUE: 0.311,
        WEIGHT: 3,
      },
      PERCENT_CD: {
        NAME: 'CRIT DMG',
        VALUE: 0.622,
        WEIGHT: 3,
      },
      PERCENT_HB: {
        NAME: 'Healing Bonus',
        VALUE: 0.359,
        WEIGHT: 3,
      },
    },
  ],
  SUB_STAT_TYPES: {
    FLAT_HP: {
      NAME: 'HP',
      VALUE: 298.75,
      WEIGHT: 6,
    },
    FLAT_ATK: {
      NAME: 'ATK',
      VALUE: 19.45,
      WEIGHT: 6,
    },
    FLAT_DEF: {
      NAME: 'DEF',
      VALUE: 23.15,
      WEIGHT: 6,
    },
    PERCENT_HP: {
      NAME: 'HP%',
      VALUE: 0.0583,
      WEIGHT: 4,
    },
    PERCENT_ATK: {
      NAME: 'ATK%',
      VALUE: 0.0583,
      WEIGHT: 4,
    },
    PERCENT_DEF: {
      NAME: 'DEF%',
      VALUE: 0.0729,
      WEIGHT: 4,
    },
    PERCENT_CR: {
      NAME: 'CRIT Rate',
      VALUE: 0.0389,
      WEIGHT: 3,
    },
    PERCENT_CD: {
      NAME: 'CRIT DMG',
      VALUE: 0.0777,
      WEIGHT: 3,
    },
    FLAT_EM: {
      NAME: 'Elemental Mastery',
      VALUE: 23.31,
      WEIGHT: 4,
    },
    PERCENT_ER: {
      NAME: 'Energy Recharge',
      VALUE: 0.0648,
      WEIGHT: 4,
    },
  },
  MENU_STAT_TYPES: [
    ['HP', 'Max HP'],
    ['ATK', 'ATK'],
    ['DEF', 'DEF'],
    ['EM', 'Elemental Mastery'],
    ['CR', 'CRIT Rate'],
    ['CD', 'CRIT DMG'],
    ['HB', 'Healing Bonus'],
    ['ER', 'Energy Recharge'],
    ['PYRO', 'Pyro DMG Bonus'],
    ['HYDRO', 'Hydro DMG Bonus'],
    ['DENDRO', 'Dendro DMG Bonus'],
    ['ELECTRO', 'Electro DMG Bonus'],
    ['ANEMO', 'Anemo DMG Bonus'],
    ['CRYO', 'Cryo DMG Bonus'],
    ['GEO', 'Geo DMG Bonus'],
    ['PHYSICAL', 'Physical DMG Bonus'],
  ],
};
