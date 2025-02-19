const ZZZ_CHARACTERS = {
  // Version 1.5
  "1311": {
    name: "Astra",
    type: "Support",
    base: { FLAT_HP: 8609, FLAT_ATK: 715, FLAT_DEF: 600 },
    weights: {
      "ATK": 1,
      "ANOMALY_PROFICIENCY": 0.5,
      "PEN": 0.12,
    },
  },
  "1321": {
    name: "Evelyn",
    type: "Attack",
    base: { FLAT_HP: 7788, FLAT_ATK: 929, FLAT_DEF: 612 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },

  // Version 1.4
  "1201": {
    name: "Harumasa",
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
  "1161": {
    name: "Lighter",
    type: "Stun",
    base: { FLAT_HP: 8253, FLAT_ATK: 797, FLAT_DEF: 612 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1221": {
    name: "Yanagi",
    type: "Anomaly",
    base: { FLAT_HP: 7789, FLAT_ATK: 873, FLAT_DEF: 613 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.2
  "1171": {
    name: "Burnice",
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
    type: "Anomaly",
    base: { FLAT_HP: 7789, FLAT_ATK: 881, FLAT_DEF: 607 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1271": {
    name: "Seth",
    type: "Defense",
    base: { FLAT_HP: 8701, FLAT_ATK: 643, FLAT_DEF: 746 },
    weights: {
      "ATK": 1,
      "ANOMALY_PROFICIENCY": 0.6,
      "PEN": 0.24,
    },
  },
  "1251": {
    name: "Qingyi",
    type: "Stun",
    base: { FLAT_HP: 8251, FLAT_ATK: 758, FLAT_DEF: 613 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.0
  "1011": {
    name: "Anby",
    type: "Stun",
    base: { FLAT_HP: 7501, FLAT_ATK: 659, FLAT_DEF: 613 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1111": {
    name: "Anton",
    type: "Attack",
    base: { FLAT_HP: 7219, FLAT_ATK: 792, FLAT_DEF: 623 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1121": {
    name: "Ben",
    type: "Defense",
    base: { FLAT_HP: 8578, FLAT_ATK: 653, FLAT_DEF: 724 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "DEF": 0.6,
      "PEN": 0.24,
    },
  },
  "1081": {
    name: "Billy",
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
    type: "Attack",
    base: { FLAT_HP: 6977, FLAT_ATK: 807, FLAT_DEF: 605 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1191": {
    name: "Ellen",
    type: "Attack",
    base: { FLAT_HP: 7674, FLAT_ATK: 938, FLAT_DEF: 607 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1181": {
    name: "Grace",
    type: "Anomaly",
    base: { FLAT_HP: 7483, FLAT_ATK: 826, FLAT_DEF: 601 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1101": {
    name: "Koleda",
    type: "Stun",
    base: { FLAT_HP: 8127, FLAT_ATK: 736, FLAT_DEF: 595 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1151": {
    name: "Lucy",
    type: "Support",
    base: { FLAT_HP: 8026, FLAT_ATK: 659, FLAT_DEF: 613 },
    weights: {
      "ATK": 1,
      "CRIT_RATE": 0.5,
      "CRIT_DMG": 0.5,
      "PEN": 0.12,
    },
  },
  "1141": {
    name: "Lycaon",
    type: "Stun",
    base: { FLAT_HP: 8416, FLAT_ATK: 729, FLAT_DEF: 607 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1021": {
    name: "Nekomata",
    type: "Attack",
    base: { FLAT_HP: 7560, FLAT_ATK: 911, FLAT_DEF: 588 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1031": {
    name: "Nicole",
    type: "Support",
    base: { FLAT_HP: 8146, FLAT_ATK: 649, FLAT_DEF: 623 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1281": {
    name: "Piper",
    type: "Anomaly",
    base: { FLAT_HP: 6977, FLAT_ATK: 758, FLAT_DEF: 613 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1211": {
    name: "Rina",
    type: "Support",
    base: { FLAT_HP: 8609, FLAT_ATK: 717, FLAT_DEF: 601 },
    weights: {
      "ANOMALY_PROFICIENCY": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1041": {
    name: "Soldier 11",
    type: "Attack",
    base: { FLAT_HP: 7674, FLAT_ATK: 889, FLAT_DEF: 613 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
  "1131": {
    name: "Soukaku",
    type: "Support",
    base: { FLAT_HP: 8026, FLAT_ATK: 666, FLAT_DEF: 598 },
    weights: {
      "ATK": 1,
      "CRIT_RATE": 0.5,
      "CRIT_DMG": 0.5,
      "PEN": 0.12,
    },
  },
  "1241": {
    name: "Zhu Yuan",
    type: "Attack",
    base: { FLAT_HP: 7483, FLAT_ATK: 919, FLAT_DEF: 601 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "PEN": 0.24,
    },
  },
};

export default ZZZ_CHARACTERS;
