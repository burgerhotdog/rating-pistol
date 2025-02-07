const CHARACTERS = {
  // Version 2.1
  /*
  "Brant": {
    type: "Sword",
    base: { HP: 1000, ATK: 100, DEF: 1000 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },

  "Phoebe": {
    type: "Rectifier",
    base: { HP: 10000, ATK: 100, DEF: 1000 },
    includeEr: true,
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
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Skill DMG": 0.5,
    },
  },

  "Roccia": {
    type: "Gauntlets",
    base: { HP: 12250, ATK: 375, DEF: 1198 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Heavy Attack DMG": 0.35,
      "Resonance Skill DMG": 0.09,
    },
  },
  
  // Version 1.4
  "Camellya": {
    type: "Sword",
    base: { HP: 10325, ATK: 450, DEF: 1161 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Basic Attack DMG": 0.4,
      "Resonance Liberation DMG": 0.1,
    },
  },
  
  "Lumi": {
    type: "Broadblade",
    base: { HP: 8500, ATK: 338, DEF: 880 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Basic Attack DMG": 0.22,
      "Resonance Liberation DMG": 0.18,
      "Resonance Skill DMG": 0.16,
    },
  },
  
  // Version 1.3
  "The Shorekeeper": {
    type: "Rectifier",
    base: { HP: 16713, ATK: 288, DEF: 1100 },
    includeEr: true,
    weights: {
      "HP%": 0.6,
    },
  },
  
  "Youhu": {
    type: "Gauntlets",
    base: { HP: 9975, ATK: 263, DEF: 1051 },
    includeEr: true,
    weights: {
      "ATK%": 0.6,
    },
  },
  
  // Version 1.2
  "Xiangli Yao": {
    type: "Gauntlets",
    base: { HP: 10625, ATK: 425, DEF: 1222 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Liberation DMG": 0.34,
      "Resonance Skill DMG": 0.1,
      "Basic Attack DMG": 0.06,
    },
  },
  
  "Zhezhi": {
    type: "Rectifier",
    base: { HP: 12250, ATK: 375, DEF: 1198 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Basic Attack DMG": 0.47,
    },
  },
  
  // Version 1.1
  "Changli": {
    type: "Sword",
    base: { HP: 10388, ATK: 463, DEF: 1100 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Skill DMG": 0.37,
      "Resonance Liberation DMG": 0.14,
    },
  },
  
  "Jinhsi": {
    type: "Broadblade",
    base: { HP: 10825, ATK: 413, DEF: 1259 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Skill DMG": 0.45,
      "Resonance Liberation DMG": 0.11,
    },
  },
  
  // Version 1.0
  "Aalto": {
    type: "Pistols",
    base: { HP: 9850, ATK: 263, DEF: 1075 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Basic Attack DMG": 0.26,
      "Resonance Skill DMG": 0.16,
      "Resonance Liberation DMG": 0.08,
    },
  },
  
  "Baizhi": {
    type: "Rectifier",
    base: { HP: 12813, ATK: 213, DEF: 1002 },
    includeEr: true,
    weights: {
      "HP%": 0.6,
    },
  },
  
  "Calcharo": {
    type: "Broadblade",
    base: { HP: 10500, ATK: 438, DEF: 1185 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Liberation DMG": 0.33,
      "Basic Attack DMG": 0.15,
    },
  },
  
  "Chixia": {
    type: "Pistols",
    base: { HP: 9088, ATK: 300, DEF: 953 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Skill DMG": 0.29,
      "Resonance Liberation DMG": 0.2,
    },
  },
  
  "Danjin": {
    type: "Sword",
    base: { HP: 9438, ATK: 263, DEF: 1149 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Liberation DMG": 0.18,
      "Resonance Skill DMG": 0.15,
      "Heavy Attack DMG": 0.15,
    },
  },
  
  "Encore": {
    type: "Rectifier",
    base: { HP: 10513, ATK: 425, DEF: 1246 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Basic Attack DMG": 0.28,
      "Resonance Skill DMG": 0.09,
      "Resonance Liberation DMG": 0.09,
    },
  },
  
  "Jianxin": {
    type: "Gauntlets",
    base: { HP: 14113, ATK: 338, DEF: 1124 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Liberation DMG": 0.22,
      "Basic Attack DMG": 0.19,
      "Heavy Attack DMG": 0.07,
    },
  },
  
  "Jiyan": {
    type: "Broadblade",
    base: { HP: 10488, ATK: 438, DEF: 1185 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Heavy Attack DMG": 0.41,
      "Resonance Skill DMG": 0.09,
    },
  },
  
  "Lingyang": {
    type: "Gauntlets",
    base: { HP: 10388, ATK: 438, DEF: 1210 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Basic Attack DMG": 0.22,
      "Resonance Skill DMG": 0.17,
    },
  },
  
  "Mortefi": {
    type: "Pistols",
    base: { HP: 10025, ATK: 250, DEF: 1136 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Liberation DMG": 0.4,
      "Resonance Skill DMG": 0.11,
    },
  },
  
  "Rover (Havoc)": {
    type: "Sword",
    base: { HP: 10825, ATK: 413, DEF: 1259 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Basic Attack DMG": 0.19,
      "Resonance Liberation DMG": 0.16,
      "Resonance Skill DMG": 0.11,
    },
  },
  
  "Rover (Spectro)": {
    type: "Sword",
    base: { HP: 11400, ATK: 375, DEF: 1369 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Sanhua": {
    type: "Sword",
    base: { HP: 10063, ATK: 275, DEF: 941 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Heavy Attack DMG": 0.21,
      "Resonance Liberation DMG": 0.17,
      "Resonance Skill DMG": 0.16,
    },
  },
  
  "Taoqi": {
    type: "Broadblade",
    base: { HP: 8950, ATK: 225, DEF: 1564 },
    includeEr: true,
    weights: {
      "DEF%": 0.6,
    },
  },
  
  "Verina": {
    type: "Rectifier",
    base: { HP: 14238, ATK: 338, DEF: 1100 },
    includeEr: true,
    weights: {
      "ATK%": 0.6,
    },
  },
  
  "Yangyang": {
    type: "Sword",
    base: { HP: 10200, ATK: 250, DEF: 1100 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Liberation DMG": 0.25,
      "Basic Attack DMG": 0.19,
      "Resonance Skill DMG": 0.08,
    },
  },
  
  "Yinlin": {
    type: "Rectifier",
    base: { HP: 11000, ATK: 400, DEF: 1283 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
      "Resonance Skill DMG": 0.33,
      "Resonance Liberation DMG": 0.12,
      "Heavy Attack DMG": 0.05,
    },
  },
  
  "Yuanwu": {
    type: "Gauntlets",
    base: { HP: 8525, ATK: 225, DEF: 1637 },
    includeEr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.6,
      "Resonance Skill DMG": 0.29,
      "Resonance Liberation DMG": 0.24,
    },
  },
};

export default CHARACTERS;
