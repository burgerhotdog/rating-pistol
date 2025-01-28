const CHARACTERS = {
  // Version 1.5
  "Astra": {
    type: "Support",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Evelyn": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  // Version 1.4
  "Harumasa": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Miyabi": {
    type: "Anomaly",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.3
  "Lighter": {
    type: "Stun",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yanagi": {
    type: "Anomaly",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.2
  "Burnice": {
    type: "Anomaly",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Caesar": {
    type: "Defense",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.1
  "Jane": {
    type: "Anomaly",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Seth": {
    type: "Defense",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Qingyi": {
    type: "Stun",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.0
  "Anby": {
    type: "Stun",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Anton": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Ben": {
    type: "Defense",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Billy": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Corin": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Ellen": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Grace": {
    type: "Anomaly",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Koleda": {
    type: "Stun",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lucy": {
    type: "Support",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lycaon": {
    type: "Stun",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Nekomata": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Nicole": {
    type: "Support",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Piper": {
    type: "Anomaly",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Rina": {
    type: "Support",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Soldier 11": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Soukaku": {
    type: "Support",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Zhu Yuan": {
    type: "Attack",
    base: { HP: 100, ATK: 100, DEF: 100 },
    stats: {},
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
};

export default CHARACTERS;
