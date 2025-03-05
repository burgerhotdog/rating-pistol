const CHARACTERS = {
  // Version 1.5
  "1321": {
    name: "Evelyn",
    rarity: 5,
    type: "Attack",
    base: { FLAT_HP: 7788, FLAT_ATK: 929, FLAT_DEF: 612 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1311": {
    name: "Astra",
    rarity: 5,
    type: "Support",
    base: { FLAT_HP: 8609, FLAT_ATK: 715, FLAT_DEF: 600 },
    weights: {
      "ATK": 1,
      "ANOMALY_PROFICIENCY": 0.5,
      "PEN": 0.12,
    },
  },

  // Version 1.4
  "1201": {
    name: "Harumasa",
    rarity: 5,
    type: "Attack",
    base: { FLAT_HP: 7405, FLAT_ATK: 915, FLAT_DEF: 600 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1091": {
    name: "Miyabi",
    rarity: 5,
    type: "Anomaly",
    base: { FLAT_HP: 7673, FLAT_ATK: 880, FLAT_DEF: 606 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 0.6,
      "ATK": 0.6,
      "ANOMALY_PROFICIENCY": 0.24,
      "PEN": 0.24,
    },
  },
  
  // Version 1.3
  "1221": {
    name: "Yanagi",
    rarity: 5,
    type: "Anomaly",
    base: { FLAT_HP: 7789, FLAT_ATK: 873, FLAT_DEF: 613 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1161": {
    name: "Lighter",
    rarity: 5,
    type: "Stun",
    base: { FLAT_HP: 8253, FLAT_ATK: 797, FLAT_DEF: 612 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.2
  "1171": {
    name: "Burnice",
    rarity: 5,
    type: "Anomaly",
    base: { FLAT_HP: 7368, FLAT_ATK: 863, FLAT_DEF: 601 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1071": {
    name: "Caesar",
    rarity: 5,
    type: "Defense",
    base: { FLAT_HP: 9526, FLAT_ATK: 712, FLAT_DEF: 754 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.1
  "1261": {
    name: "Jane",
    rarity: 5,
    type: "Anomaly",
    base: { FLAT_HP: 7789, FLAT_ATK: 881, FLAT_DEF: 607 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1251": {
    name: "Qingyi",
    rarity: 5,
    type: "Stun",
    base: { FLAT_HP: 8251, FLAT_ATK: 758, FLAT_DEF: 613 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1271": {
    name: "Seth",
    rarity: 4,
    type: "Defense",
    base: { FLAT_HP: 8701, FLAT_ATK: 643, FLAT_DEF: 746 },
    weights: {
      "ATK": 1,
      "ANOMALY_PROFICIENCY": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.0
  "1241": {
    name: "Zhu Yuan",
    rarity: 5,
    type: "Attack",
    base: { FLAT_HP: 7483, FLAT_ATK: 919, FLAT_DEF: 601 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1191": {
    name: "Ellen",
    rarity: 5,
    type: "Attack",
    base: { FLAT_HP: 7674, FLAT_ATK: 938, FLAT_DEF: 607 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1211": {
    name: "Rina",
    rarity: 5,
    type: "Support",
    base: { FLAT_HP: 8609, FLAT_ATK: 717, FLAT_DEF: 601 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1181": {
    name: "Grace",
    rarity: 5,
    type: "Anomaly",
    base: { FLAT_HP: 7483, FLAT_ATK: 826, FLAT_DEF: 601 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1141": {
    name: "Lycaon",
    rarity: 5,
    type: "Stun",
    base: { FLAT_HP: 8416, FLAT_ATK: 729, FLAT_DEF: 607 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1101": {
    name: "Koleda",
    rarity: 5,
    type: "Stun",
    base: { FLAT_HP: 8127, FLAT_ATK: 736, FLAT_DEF: 595 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1041": {
    name: "Soldier 11",
    rarity: 5,
    type: "Attack",
    base: { FLAT_HP: 7674, FLAT_ATK: 889, FLAT_DEF: 613 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1021": {
    name: "Nekomata",
    rarity: 5,
    type: "Attack",
    base: { FLAT_HP: 7560, FLAT_ATK: 911, FLAT_DEF: 588 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1281": {
    name: "Piper",
    rarity: 4,
    type: "Anomaly",
    base: { FLAT_HP: 6977, FLAT_ATK: 758, FLAT_DEF: 613 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1151": {
    name: "Lucy",
    rarity: 4,
    type: "Support",
    base: { FLAT_HP: 8026, FLAT_ATK: 659, FLAT_DEF: 613 },
    weights: {
      "ATK": 1,
      "CRIT_RATE": 0.5,
      "CRIT_DMG": 0.5,
      "PEN": 0.12,
    },
  },
  "1131": {
    name: "Soukaku",
    rarity: 4,
    type: "Support",
    base: { FLAT_HP: 8026, FLAT_ATK: 666, FLAT_DEF: 598 },
    weights: {
      "ATK": 1,
      "CRIT_RATE": 0.5,
      "CRIT_DMG": 0.5,
      "PEN": 0.12,
    },
  },
  "1121": {
    name: "Ben",
    rarity: 4,
    type: "Defense",
    base: { FLAT_HP: 8578, FLAT_ATK: 653, FLAT_DEF: 724 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "DEF": 0.6,
      "PEN": 0.24,
    },
  },
  "1111": {
    name: "Anton",
    rarity: 4,
    type: "Attack",
    base: { FLAT_HP: 7219, FLAT_ATK: 792, FLAT_DEF: 623 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1081": {
    name: "Billy",
    rarity: 4,
    type: "Attack",
    base: { FLAT_HP: 6907, FLAT_ATK: 787, FLAT_DEF: 607 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1061": {
    name: "Corin",
    rarity: 4,
    type: "Attack",
    base: { FLAT_HP: 6977, FLAT_ATK: 807, FLAT_DEF: 605 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1031": {
    name: "Nicole",
    rarity: 4,
    type: "Support",
    base: { FLAT_HP: 8146, FLAT_ATK: 649, FLAT_DEF: 623 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1011": {
    name: "Anby",
    rarity: 4,
    type: "Stun",
    base: { FLAT_HP: 7501, FLAT_ATK: 659, FLAT_DEF: 613 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
};

export default CHARACTERS;
