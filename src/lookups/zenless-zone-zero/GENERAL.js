export default {
  TITLE: 'Zenless Zone Zero',
  VERSION: '2.6',
  DROPS_PER_RUN: 2.25,
  NUM_MAINSTATS: 6,
  NUM_SUBSTATS: 4,
  EQUIP_NAMES: [
    'Disk 1',
    'Disk 2',
    'Disk 3',
    'Disk 4',
    'Disk 5',
    'Disk 6',
  ],
  ELEMENT_TYPES: [
    'Electric',
    'Ether',
    'Fire',
    'Ice',
    'Physical',
  ],
  WEAPON_TYPES: [
    'Anomaly',
    'Attack',
    'Defense',
    'Rupture',
    'Stun',
    'Support',
  ],
  DEFAULT_STATS: {
    BASE_HP: 0,
    BASE_ATK: 0,
    BASE_DEF: 0,
    BASE_IMPACT: 0,
    BASE_AM: 0,
    BASE_AP: 0,
    BASE_ER: 1.2,
    BASE_PEN: 0,
    PERCENT_CR: 0.05,
    PERCENT_CD: 0.5,
  },
  MAIN_STAT_TYPES: [
    {
      FLAT_HP: {
        NAME: 'HP',
        VALUE: 2200,
        WEIGHT: 1,
      },
    },
    {
      FLAT_ATK: {
        NAME: 'ATK',
        VALUE: 316,
        WEIGHT: 1,
      },
    },
    {
      FLAT_DEF: {
        NAME: 'DEF',
        VALUE: 184,
        WEIGHT: 1,
      },
    },
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.3,
        WEIGHT: 7,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.3,
        WEIGHT: 6,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.48,
        WEIGHT: 7,
      },
      PERCENT_CR: {
        NAME: 'CRIT Rate',
        VALUE: 0.24,
        WEIGHT: 4,
      },
      PERCENT_CD: {
        NAME: 'CRIT DMG',
        VALUE: 0.48,
        WEIGHT: 4,
      },
      FLAT_AP: {
        NAME: 'Anomaly Proficiency',
        VALUE: 92,
        WEIGHT: 5,
      },
    },
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.3,
        WEIGHT: 7,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.3,
        WEIGHT: 6,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.48,
        WEIGHT: 7,
      },
      PERCENT_PR: {
        NAME: 'PEN Ratio',
        VALUE: 0.24,
        WEIGHT: 3,
      },
      PERCENT_PHYSICAL: {
        NAME: 'Physical DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_FIRE: {
        NAME: 'Fire DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_ICE: {
        NAME: 'Ice DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_ELECTRIC: {
        NAME: 'Electric DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
      PERCENT_ETHER: {
        NAME: 'Ether DMG Bonus',
        VALUE: 0.3,
        WEIGHT: 2,
      },
    },
    {
      PERCENT_HP: {
        NAME: 'HP%',
        VALUE: 0.3,
        WEIGHT: 7,
      },
      PERCENT_ATK: {
        NAME: 'ATK%',
        VALUE: 0.3,
        WEIGHT: 6,
      },
      PERCENT_DEF: {
        NAME: 'DEF%',
        VALUE: 0.48,
        WEIGHT: 7,
      },
      PERCENT_AM: {
        NAME: 'Anomaly Mastery',
        VALUE: 0.3,
        WEIGHT: 5,
      },
      PERCENT_IMPACT: {
        NAME: 'Impact',
        VALUE: 0.18,
        WEIGHT: 5,
      },
      PERCENT_ER: {
        NAME: 'Energy Regen',
        VALUE: 0.6,
        WEIGHT: 3,
      },
    },
  ],
  SUB_STAT_TYPES: {
    FLAT_HP: {
      NAME: 'HP',
      VALUE: 112,
      WEIGHT: 6,
    },
    FLAT_ATK: {
      NAME: 'ATK',
      VALUE: 19,
      WEIGHT: 5,
    },
    FLAT_DEF: {
      NAME: 'DEF',
      VALUE: 15,
      WEIGHT: 6,
    },
    PERCENT_HP: {
      NAME: 'HP%',
      VALUE: 0.03,
      WEIGHT: 6,
    },
    PERCENT_ATK: {
      NAME: 'ATK%',
      VALUE: 0.03,
      WEIGHT: 5,
    },
    PERCENT_DEF: {
      NAME: 'DEF%',
      VALUE: 0.048,
      WEIGHT: 6,
    },
    FLAT_PEN: {
      NAME: 'PEN',
      VALUE: 9,
      WEIGHT: 5,
    },
    PERCENT_CR: {
      NAME: 'CRIT Rate',
      VALUE: 0.024,
      WEIGHT: 5,
    },
    PERCENT_CD: {
      NAME: 'CRIT DMG',
      VALUE: 0.048,
      WEIGHT: 5,
    },
    FLAT_AP: {
      NAME: 'Anomaly Proficiency',
      VALUE: 9,
      WEIGHT: 5,
    },
  },
  MENU_STATS: {
    HP: {
      label: 'HP',
      isPercent: false,
    },
    ATK: {
      label: 'ATK',
      isPercent: false,
    },
    DEF: {
      label: 'DEF',
      isPercent: false,
    },
    IMPACT: {
      label: 'Impact',
      isPercent: false,
    },
    CR: {
      label: 'CRIT Rate',
      isPercent: true,
    },
    CD: {
      label: 'CRIT DMG',
      isPercent: true,
    },
    AM: {
      label: 'Anomaly Mastery',
      isPercent: false,
    },
    AP: {
      label: 'Anomaly Proficiency',
      isPercent: false,
    },
    PR: {
      label: 'PEN Ratio',
      isPercent: true,
    },
    ER: {
      label: 'Energy Regen',
      isPercent: false,
    },
  },
};
