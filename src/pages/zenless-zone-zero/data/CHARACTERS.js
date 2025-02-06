const CHARACTERS = {
  // Version 1.6
  /*
  "Pulchra": {
    type: "Stun",
    base: { HP: 1000, ATK: 100, DEF: 100 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },

  "Silver Soldier Anby": {
    type: "Attack",
    base: { HP: 1000, ATK: 100, DEF: 100 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },

  "Trigger": {
    type: "Stun",
    base: { HP: 1000, ATK: 100, DEF: 100 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  */

  // Version 1.5
  "Astra": {
    type: "Support",
    base: { HP: 8609, ATK: 715, DEF: 600 },
    weights: {
      "ATK%": 1,
      "Anomaly Proficiency": 0.6,
      "PEN": 0.24,
    },
  },

  "Evelyn": {
    type: "Attack",
    base: { HP: 7788, ATK: 929, DEF: 612 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },

  // Version 1.4
  "Harumasa": {
    type: "Attack",
    base: { HP: 7405, ATK: 915, DEF: 600 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Miyabi": {
    type: "Anomaly",
    base: { HP: 7673, ATK: 880, DEF: 606 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Anomaly Proficiency": 0.24,
      "PEN": 0.24,
    },
  },
  
  // Version 1.3
  "Lighter": {
    type: "Stun",
    base: { HP: 8253, ATK: 797, DEF: 612 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Yanagi": {
    type: "Anomaly",
    base: { HP: 7789, ATK: 873, DEF: 613 },
    weights: {
      "Anomaly Proficiency": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.2
  "Burnice": {
    type: "Anomaly",
    base: { HP: 7368, ATK: 863, DEF: 601 },
    weights: {
      "Anomaly Proficiency": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Caesar": {
    type: "Defense",
    base: { HP: 9526, ATK: 712, DEF: 754 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.1
  "Jane": {
    type: "Anomaly",
    base: { HP: 7789, ATK: 881, DEF: 607 },
    weights: {
      "Anomaly Proficiency": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Seth": {
    type: "Defense",
    base: { HP: 8701, ATK: 643, DEF: 746 },
    weights: {
      "ATK%": 1,
      "Anomaly Proficiency": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Qingyi": {
    type: "Stun",
    base: { HP: 8251, ATK: 758, DEF: 613 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  // Version 1.0
  "Anby": {
    type: "Stun",
    base: { HP: 7501, ATK: 659, DEF: 613 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Anton": {
    type: "Attack",
    base: { HP: 7219, ATK: 792, DEF: 623 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Ben": {
    type: "Defense",
    base: { HP: 8578, ATK: 653, DEF: 724 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Billy": {
    type: "Attack",
    base: { HP: 6907, ATK: 787, DEF: 607 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Corin": {
    type: "Attack",
    base: { HP: 6977, ATK: 807, DEF: 605 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Ellen": {
    type: "Attack",
    base: { HP: 7674, ATK: 938, DEF: 607 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Grace": {
    type: "Anomaly",
    base: { HP: 7483, ATK: 826, DEF: 601 },
    weights: {
      "Anomaly Proficiency": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Koleda": {
    type: "Stun",
    base: { HP: 8127, ATK: 736, DEF: 595 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Lucy": {
    type: "Support",
    base: { HP: 8026, ATK: 659, DEF: 613 },
    weights: {
      "ATK%": 1,
      "CRIT Rate": 0.6,
      "CRIT DMG": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Lycaon": {
    type: "Stun",
    base: { HP: 8416, ATK: 729, DEF: 607 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Nekomata": {
    type: "Attack",
    base: { HP: 7560, ATK: 911, DEF: 588 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Nicole": {
    type: "Support",
    base: { HP: 8146, ATK: 649, DEF: 623 },
    weights: {
      "Anomaly Proficiency": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Piper": {
    type: "Anomaly",
    base: { HP: 6977, ATK: 758, DEF: 613 },
    weights: {
      "Anomaly Proficiency": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Rina": {
    type: "Support",
    base: { HP: 8609, ATK: 717, DEF: 601 },
    weights: {
      "Anomaly Proficiency": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Soldier 11": {
    type: "Attack",
    base: { HP: 7674, ATK: 889, DEF: 613 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Soukaku": {
    type: "Support",
    base: { HP: 8026, ATK: 666, DEF: 598 },
    weights: {
      "ATK%": 1,
      "CRIT Rate": 0.6,
      "CRIT DMG": 0.6,
      "PEN": 0.24,
    },
  },
  
  "Zhu Yuan": {
    type: "Attack",
    base: { HP: 7483, ATK: 919, DEF: 601 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "PEN": 0.24,
    },
  },
};

export default CHARACTERS;
