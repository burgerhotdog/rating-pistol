export default {
  TITLE: 'Wuthering Waves',
  VERSION: '3.1',
  DROPS_PER_RUN: 4.33,
  NUM_MAINSTATS: 5,
  NUM_SUBSTATS: 5,
  EQUIP_NAMES: [
    '4-Cost',
    '3-Cost',
    '3-Cost',
    '1-Cost',
    '1-Cost',
  ],
  ELEMENT_TYPES: [
    'Aero',
    'Electro',
    'Fusion',
    'Glacio',
    'Havoc',
    'Spectro',
  ],
  WEAPON_TYPES: [
    'Broadblade',
    'Gauntlets',
    'Pistols',
    'Rectifier',
    'Sword',
  ],
  DEFAULT_STATS: {
    BASE_HP: 0,
    BASE_ATK: 0,
    BASE_DEF: 0,
    PERCENT_ER: 1,
    PERCENT_CR: 0.05,
    PERCENT_CD: 1.5,
  },
  MAIN_STAT_FLATS: [
    {
      FLAT_HP: {
        NAME: 'HP',
        VALUE: 2280,
      },
    },
    {
      FLAT_ATK: {
        NAME: 'ATK',
        VALUE: 100,
      },
    },
    {
      FLAT_ATK: {
        NAME: 'ATK',
        VALUE: 150,
      },
    },
  ],
  MAIN_STAT_TYPES: [
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.228,
        WEIGHT: 1,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.18,
        WEIGHT: 1,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.18,
        WEIGHT: 1,
      },
    },
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.3,
        WEIGHT: 1,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.3,
        WEIGHT: 1,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.38,
        WEIGHT: 1,
      },
      PERCENT_GLACIO: {
        NAME: 'Glacio DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_FUSION: {
        NAME: 'Fusion DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_ELECTRO: {
        NAME: 'Electro DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_AERO: {
        NAME: 'Aero DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_SPECTRO: {
        NAME: 'Spectro DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_HAVOC: {
        NAME: 'Havoc DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_ER: {
        NAME: 'Energy Regen',
        VALUE: 0.32,
        WEIGHT: 1,
      },
    },
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.33,
        WEIGHT: 3,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.33,
        WEIGHT: 3,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.415,
        WEIGHT: 3,
      },
      PERCENT_CR: {
        NAME: 'CRIT Rate',
        VALUE: 0.22,
        WEIGHT: 4,
      },
      PERCENT_CD: {
        NAME: 'CRIT DMG',
        VALUE: 0.44,
        WEIGHT: 4,
      },
      PERCENT_HB: {
        NAME: 'Healing Bonus',
        VALUE: 0.26,
        WEIGHT: 2,
      },
    },
  ],
  SUB_STAT_TYPES: {
    FLAT_HP: {
      NAME: 'HP',
      VALUE: 580,
      WEIGHT: 1,
    },
    FLAT_ATK: {
      NAME: 'ATK',
      VALUE: 60,
      WEIGHT: 1,
    },
    FLAT_DEF: {
      NAME: 'DEF',
      VALUE: 70,
      WEIGHT: 1,
    },
    PERCENT_HP: {
      NAME: 'HP%',
      VALUE: 0.116,
      WEIGHT: 1,
    },
    PERCENT_ATK: {
      NAME: 'ATK%',
      VALUE: 0.116,
      WEIGHT: 1,
    },
    PERCENT_DEF: {
      NAME: 'DEF%',
      VALUE: 0.147,
      WEIGHT: 1,
    },
    PERCENT_ER: {
      NAME: 'Energy Regen',
      VALUE: 0.124,
      WEIGHT: 1,
    },
    PERCENT_CR: {
      NAME: 'CRIT Rate',
      VALUE: 0.105,
      WEIGHT: 1,
    },
    PERCENT_CD: {
      NAME: 'CRIT DMG',
      VALUE: 0.21,
      WEIGHT: 1,
    },
    PERCENT_BA: {
      NAME: 'Basic Attack DMG Bonus',
      VALUE: 0.116,
      WEIGHT: 1,
    },
    PERCENT_HA: {
      NAME: 'Heavy Attack DMG Bonus',
      VALUE: 0.116,
      WEIGHT: 1,
    },
    PERCENT_RS: {
      NAME: 'Resonance Skill DMG Bonus',
      VALUE: 0.116,
      WEIGHT: 1,
    },
    PERCENT_RL: {
      NAME: 'Resonance Liberation DMG Bonus',
      VALUE: 0.116,
      WEIGHT: 1,
    },
  },
  MENU_STAT_ORDER: [
    { id: 'HP', label: 'HP', isPercent: false },
    { id: 'ATK', label: 'ATK', isPercent: false },
    { id: 'DEF', label: 'DEF', isPercent: false },
    { id: 'ER', label: 'Energy Regen', isPercent: true },
    { id: 'CR', label: 'CRIT Rate', isPercent: true },
    { id: 'CD', label: 'CRIT DMG', isPercent: true },
    { id: 'RS', label: 'Resonance Skill DMG Bonus', isPercent: true },
    { id: 'BA', label: 'Basic Attack DMG Bonus', isPercent: true },
    { id: 'HA', label: 'Heavy Attack DMG Bonus', isPercent: true },
    { id: 'RL', label: 'Resonance Liberation DMG Bonus', isPercent: true },
    { id: 'GLACIO', label: 'Glacio DMG Bonus', isPercent: true },
    { id: 'FUSION', label: 'Fusion DMG Bonus', isPercent: true },
    { id: 'ELECTRO', label: 'Electro DMG Bonus', isPercent: true },
    { id: 'AERO', label: 'Aero DMG Bonus', isPercent: true },
    { id: 'SPECTRO', label: 'Spectro DMG Bonus', isPercent: true },
    { id: 'HAVOC', label: 'Havoc DMG Bonus', isPercent: true },
    { id: 'HB', label: 'Healing Bonus', isPercent: true },
  ],
};
