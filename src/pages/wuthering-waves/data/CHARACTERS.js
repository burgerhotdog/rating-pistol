const CHARACTERS = {
  // Version 2.0
  "Carlotta": {
    type: "Pistols",
    base: { HP: 12450, ATK: 463, DEF: 1198 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Roccia": {
    type: "Gauntlets",
    base: { HP: 12250, ATK: 375, DEF: 1198 },
    stats: {},
    conditions: {},
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
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lumi": {
    type: "Broadblade",
    base: { HP: 8500, ATK: 338, DEF: 880 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.3
  "The Shorekeeper": {
    type: "Rectifier",
    base: { HP: 16713, ATK: 288, DEF: 1100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Youhu": {
    type: "Gauntlets",
    base: { HP: 9975, ATK: 263, DEF: 1051 },
    stats: {},
    conditions: {},
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
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Zhezhi": {
    type: "Rectifier",
    base: { HP: 12250, ATK: 375, DEF: 1198 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.1
  "Changli": {
    type: "Sword",
    base: { HP: 10388, ATK: 463, DEF: 1100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Jinhsi": {
    type: "Broadblade",
    base: { HP: 10825, ATK: 413, DEF: 1259 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.0
  "Aalto": {
    type: "Pistols",
    base: { HP: 9850, ATK: 263, DEF: 1075 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Baizhi": {
    type: "Rectifier",
    base: { HP: 12813, ATK: 213, DEF: 1002 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Calcharo": {
    type: "Broadblade",
    base: { HP: 10500, ATK: 438, DEF: 1185 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Chixia": {
    type: "Pistols",
    base: { HP: 9088, ATK: 300, DEF: 953 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Danjin": {
    type: "Sword",
    base: { HP: 9438, ATK: 263, DEF: 1149 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Encore": {
    type: "Rectifier",
    base: { HP: 10513, ATK: 425, DEF: 1246 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Jianxin": {
    type: "Gauntlets",
    base: { HP: 14113, ATK: 338, DEF: 1124 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Jiyan": {
    type: "Broadblade",
    base: { HP: 10488, ATK: 438, DEF: 1185 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lingyang": {
    type: "Gauntlets",
    base: { HP: 10388, ATK: 438, DEF: 1210 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Mortefi": {
    type: "Pistols",
    base: { HP: 10025, ATK: 250, DEF: 1136 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Rover (Havoc)": {
    type: "Sword",
    base: { HP: 10825, ATK: 413, DEF: 1259 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Rover (Spectro)": {
    type: "Sword",
    base: { HP: 11400, ATK: 375, DEF: 1369 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Sanhua": {
    type: "Sword",
    base: { HP: 10063, ATK: 275, DEF: 941 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Taoqi": {
    type: "Broadblade",
    base: { HP: 8950, ATK: 225, DEF: 1564 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Verina": {
    type: "Rectifier",
    base: { HP: 14238, ATK: 338, DEF: 1100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yangyang": {
    type: "Sword",
    base: { HP: 10200, ATK: 250, DEF: 1100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yinlin": {
    type: "Rectifier",
    base: { HP: 11000, ATK: 400, DEF: 1283 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yuanwu": {
    type: "Gauntlets",
    base: { HP: 8525, ATK: 225, DEF: 1637 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
};

export default CHARACTERS;
