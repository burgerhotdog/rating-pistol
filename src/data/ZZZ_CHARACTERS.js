const ZZZ_CHARACTERS = {
  /*// Version 1.6
  "": {
    name: "Pulchra",
    type: "Stun",
    base: { HP: 1000, ATK: 100, DEF: 100 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "": {
    name: "Silver Soldier Anby",
    type: "Attack",
    base: { HP: 1000, ATK: 100, DEF: 100 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "": {
    name: "Trigger",
    type: "Stun",
    base: { HP: 1000, ATK: 100, DEF: 100 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },*/
  
  // Version 1.5
  "1311": {
    name: "Astra",
    type: "Support",
    base: { HP: 8609, ATK: 715, DEF: 600 },
    weights: {
      "ATK_PERCENT": 1,
      "AP": 0.5,
      "PEN": 0.12,
    },
  },
  "1321": {
    name: "Evelyn",
    type: "Attack",
    base: { HP: 7788, ATK: 929, DEF: 612 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },

  // Version 1.4
  "1201": {
    name: "Harumasa",
    type: "Attack",
    base: { HP: 7405, ATK: 915, DEF: 600 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1091": {
    name: "Miyabi",
    type: "Anomaly",
    base: { HP: 7673, ATK: 880, DEF: 606 },
    weights: {
      "CR": 1,
      "CD": 0.6,
      "ATK_PERCENT": 0.6,
      "AP": 0.24,
      "PEN": 0.24,
    },
  },
  
  // Version 1.3
  "1161": {
    name: "Lighter",
    type: "Stun",
    base: { HP: 8253, ATK: 797, DEF: 612 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1221": {
    name: "Yanagi",
    type: "Anomaly",
    base: { HP: 7789, ATK: 873, DEF: 613 },
    weights: {
      "AP": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.2
  "1171": {
    name: "Burnice",
    type: "Anomaly",
    base: { HP: 7368, ATK: 863, DEF: 601 },
    weights: {
      "AP": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1071": {
    name: "Caesar",
    type: "Defense",
    base: { HP: 9526, ATK: 712, DEF: 754 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.1
  "1261": {
    name: "Jane",
    type: "Anomaly",
    base: { HP: 7789, ATK: 881, DEF: 607 },
    weights: {
      "AP": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1271": {
    name: "Seth",
    type: "Defense",
    base: { HP: 8701, ATK: 643, DEF: 746 },
    weights: {
      "ATK_PERCENT": 1,
      "AP": 0.6,
      "PEN": 0.24,
    },
  },
  "1251": {
    name: "Qingyi",
    type: "Stun",
    base: { HP: 8251, ATK: 758, DEF: 613 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.0
  "1011": {
    name: "Anby",
    type: "Stun",
    base: { HP: 7501, ATK: 659, DEF: 613 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1111": {
    name: "Anton",
    type: "Attack",
    base: { HP: 7219, ATK: 792, DEF: 623 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1121": {
    name: "Ben",
    type: "Defense",
    base: { HP: 8578, ATK: 653, DEF: 724 },
    weights: {
      "CR": 1,
      "CD": 1,
      "DEF_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1081": {
    name: "Billy",
    type: "Attack",
    base: { HP: 6907, ATK: 787, DEF: 607 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1061": {
    name: "Corin",
    type: "Attack",
    base: { HP: 6977, ATK: 807, DEF: 605 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1191": {
    name: "Ellen",
    type: "Attack",
    base: { HP: 7674, ATK: 938, DEF: 607 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1181": {
    name: "Grace",
    type: "Anomaly",
    base: { HP: 7483, ATK: 826, DEF: 601 },
    weights: {
      "AP": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1101": {
    name: "Koleda",
    type: "Stun",
    base: { HP: 8127, ATK: 736, DEF: 595 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1151": {
    name: "Lucy",
    type: "Support",
    base: { HP: 8026, ATK: 659, DEF: 613 },
    weights: {
      "ATK_PERCENT": 1,
      "CR": 0.5,
      "CD": 0.5,
      "PEN": 0.12,
    },
  },
  "1141": {
    name: "Lycaon",
    type: "Stun",
    base: { HP: 8416, ATK: 729, DEF: 607 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1021": {
    name: "Nekomata",
    type: "Attack",
    base: { HP: 7560, ATK: 911, DEF: 588 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1031": {
    name: "Nicole",
    type: "Support",
    base: { HP: 8146, ATK: 649, DEF: 623 },
    weights: {
      "AP": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1281": {
    name: "Piper",
    type: "Anomaly",
    base: { HP: 6977, ATK: 758, DEF: 613 },
    weights: {
      "AP": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1211": {
    name: "Rina",
    type: "Support",
    base: { HP: 8609, ATK: 717, DEF: 601 },
    weights: {
      "AP": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1041": {
    name: "Soldier 11",
    type: "Attack",
    base: { HP: 7674, ATK: 889, DEF: 613 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
  "1131": {
    name: "Soukaku",
    type: "Support",
    base: { HP: 8026, ATK: 666, DEF: 598 },
    weights: {
      "ATK_PERCENT": 1,
      "CR": 0.5,
      "CD": 0.5,
      "PEN": 0.12,
    },
  },
  "1241": {
    name: "Zhu Yuan",
    type: "Attack",
    base: { HP: 7483, ATK: 919, DEF: 601 },
    weights: {
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "PEN": 0.24,
    },
  },
};

export default ZZZ_CHARACTERS;
