const CHARACTERS = {
  // Version 1.6
  /*
  "Pulchra": {
    type: "Stun",
    base: {
      HP: 1000,
      ATK: 100,
      DEF: 100,
      "Impact": 10,
      "Anomaly Mastery": 10,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Silver Soldier Anby": {
    type: "Attack",
    base: {
      HP: 1000,
      ATK: 100,
      DEF: 100,
      "Impact": 10,
      "Anomaly Mastery": 10,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Trigger": {
    type: "Stun",
    base: {
      HP: 1000,
      ATK: 100,
      DEF: 100,
      "Impact": 10,
      "Anomaly Mastery": 10,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  */

  // Version 1.5
  "Astra": {
    type: "Support",
    base: {
      HP: 8609,
      ATK: 715,
      DEF: 600,
      "Impact": 83,
      "Anomaly Mastery": 93,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Evelyn": {
    type: "Attack",
    base: {
      HP: 7788,
      ATK: 929,
      DEF: 612,
      "Impact": 93,
      "Anomaly Mastery": 92,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  // Version 1.4
  "Harumasa": {
    type: "Attack",
    base: {
      HP: 7405,
      ATK: 915,
      DEF: 600,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Miyabi": {
    type: "Anomaly",
    base: {
      HP: 7673,
      ATK: 880,
      DEF: 606,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.3
  "Lighter": {
    type: "Stun",
    base: {
      HP: 8253,
      ATK: 797,
      DEF: 612,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yanagi": {
    type: "Anomaly",
    base: {
      HP: 7789,
      ATK: 873,
      DEF: 613,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.2
  "Burnice": {
    type: "Anomaly",
    base: {
      HP: 7368,
      ATK: 863,
      DEF: 601,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Caesar": {
    type: "Defense",
    base: {
      HP: 9526,
      ATK: 712,
      DEF: 754,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.1
  "Jane": {
    type: "Anomaly",
    base: {
      HP: 7789,
      ATK: 881,
      DEF: 607,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Seth": {
    type: "Defense",
    base: {
      HP: 8701,
      ATK: 643,
      DEF: 746,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Qingyi": {
    type: "Stun",
    base: {
      HP: 8251,
      ATK: 758,
      DEF: 613,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.0
  "Anby": {
    type: "Stun",
    base: {
      HP: 7501,
      ATK: 659,
      DEF: 613,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Anton": {
    type: "Attack",
    base: {
      HP: 7219,
      ATK: 792,
      DEF: 623,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Ben": {
    type: "Defense",
    base: {
      HP: 8578,
      ATK: 653,
      DEF: 724,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Billy": {
    type: "Attack",
    base: {
      HP: 6907,
      ATK: 787,
      DEF: 607,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Corin": {
    type: "Attack",
    base: {
      HP: 6977,
      ATK: 807,
      DEF: 605,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Ellen": {
    type: "Attack",
    base: {
      HP: 7674,
      ATK: 938,
      DEF: 607,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Grace": {
    type: "Anomaly",
    base: {
      HP: 7483,
      ATK: 826,
      DEF: 601,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Koleda": {
    type: "Stun",
    base: {
      HP: 8127,
      ATK: 736,
      DEF: 595,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lucy": {
    type: "Support",
    base: {
      HP: 8026,
      ATK: 659,
      DEF: 613,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lycaon": {
    type: "Stun",
    base: {
      HP: 8416,
      ATK: 729,
      DEF: 607,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Nekomata": {
    type: "Attack",
    base: {
      HP: 7560,
      ATK: 911,
      DEF: 588,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Nicole": {
    type: "Support",
    base: {
      HP: 8146,
      ATK: 649,
      DEF: 623,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Piper": {
    type: "Anomaly",
    base: {
      HP: 6977,
      ATK: 758,
      DEF: 613,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Rina": {
    type: "Support",
    base: {
      HP: 8609,
      ATK: 717,
      DEF: 601,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Soldier 11": {
    type: "Attack",
    base: {
      HP: 7674,
      ATK: 889,
      DEF: 613,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Soukaku": {
    type: "Support",
    base: {
      HP: 8026,
      ATK: 666,
      DEF: 598,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Zhu Yuan": {
    type: "Attack",
    base: {
      HP: 7483,
      ATK: 919,
      DEF: 601,
      "Impact": 100,
      "Anomaly Mastery": 100,
    },
    stats: {},
    thresholds: {},
    limits: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
};

export default CHARACTERS;
