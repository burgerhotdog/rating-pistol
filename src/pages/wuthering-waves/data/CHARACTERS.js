const CHARACTERS = {
  // Version 2.1
  /*
  "Brant": {
    type: "Sword",
    base: { HP: 1000, ATK: 100, DEF: 1000 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },

  "Phoebe": {
    type: "Rectifier",
    base: { HP: 10000, ATK: 100, DEF: 1000 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  */

  // Version 2.0
  "Carlotta": {
    type: "Pistols",
    base: { HP: 12450, ATK: 463, DEF: 1198 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },

  "Roccia": {
    type: "Gauntlets",
    base: { HP: 12250, ATK: 375, DEF: 1198 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.4
  "Camellya": {
    type: "Sword",
    base: { HP: 10325, ATK: 450, DEF: 1161 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Lumi": {
    type: "Broadblade",
    base: { HP: 8500, ATK: 338, DEF: 880 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 1.3
  "The Shorekeeper": {
    type: "Rectifier",
    base: { HP: 16713, ATK: 288, DEF: 1100 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Youhu": {
    type: "Gauntlets",
    base: { HP: 9975, ATK: 263, DEF: 1051 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.2
  "Xiangli Yao": {
    type: "Gauntlets",
    base: { HP: 10625, ATK: 425, DEF: 1222 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Zhezhi": {
    type: "Rectifier",
    base: { HP: 12250, ATK: 375, DEF: 1198 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 1.1
  "Changli": {
    type: "Sword",
    base: { HP: 10388, ATK: 463, DEF: 1100 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Jinhsi": {
    type: "Broadblade",
    base: { HP: 10825, ATK: 413, DEF: 1259 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 1.0
  "Aalto": {
    type: "Pistols",
    base: { HP: 9850, ATK: 263, DEF: 1075 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Baizhi": {
    type: "Rectifier",
    base: { HP: 12813, ATK: 213, DEF: 1002 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Calcharo": {
    type: "Broadblade",
    base: { HP: 10500, ATK: 438, DEF: 1185 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Chixia": {
    type: "Pistols",
    base: { HP: 9088, ATK: 300, DEF: 953 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Danjin": {
    type: "Sword",
    base: { HP: 9438, ATK: 263, DEF: 1149 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Encore": {
    type: "Rectifier",
    base: { HP: 10513, ATK: 425, DEF: 1246 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Jianxin": {
    type: "Gauntlets",
    base: { HP: 14113, ATK: 338, DEF: 1124 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Jiyan": {
    type: "Broadblade",
    base: { HP: 10488, ATK: 438, DEF: 1185 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Lingyang": {
    type: "Gauntlets",
    base: { HP: 10388, ATK: 438, DEF: 1210 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Mortefi": {
    type: "Pistols",
    base: { HP: 10025, ATK: 250, DEF: 1136 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Rover (Havoc)": {
    type: "Sword",
    base: { HP: 10825, ATK: 413, DEF: 1259 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Rover (Spectro)": {
    type: "Sword",
    base: { HP: 11400, ATK: 375, DEF: 1369 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Sanhua": {
    type: "Sword",
    base: { HP: 10063, ATK: 275, DEF: 941 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Taoqi": {
    type: "Broadblade",
    base: { HP: 8950, ATK: 225, DEF: 1564 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Verina": {
    type: "Rectifier",
    base: { HP: 14238, ATK: 338, DEF: 1100 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yangyang": {
    type: "Sword",
    base: { HP: 10200, ATK: 250, DEF: 1100 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Yinlin": {
    type: "Rectifier",
    base: { HP: 11000, ATK: 400, DEF: 1283 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Yuanwu": {
    type: "Gauntlets",
    base: { HP: 8525, ATK: 225, DEF: 1637 },
    stats: {},
    thresholds: {},
    limits: {},
    includeEnergy: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.6,
    },
  },
};

export default CHARACTERS;
