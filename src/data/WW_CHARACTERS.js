const WW_CHARACTERS = {
  // Version 2.1
  "1206": {
    name: "Brant",
    type: "Sword",
    base: { FLAT_HP: 11675, FLAT_ATK: 375, FLAT_DEF: 1308 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1506": {
    name: "Phoebe",
    type: "Rectifier",
    base: { FLAT_HP: 10825, FLAT_ATK: 413, FLAT_DEF: 1259 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  
  // Version 2.0
  "1107": {
    name: "Carlotta",
    type: "Pistols",
    base: { FLAT_HP: 12450, FLAT_ATK: 463, FLAT_DEF: 1198 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_SKILL_DMG_BONUS": 0.5,
    },
  },
  "1606": {
    name: "Roccia",
    type: "Gauntlets",
    base: { FLAT_HP: 12250, FLAT_ATK: 375, FLAT_DEF: 1198 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "HEAVY_ATTACK_DMG_BONUS": 0.35,
    },
  },
  
  // Version 1.4
  "1603": {
    name: "Camellya",
    type: "Sword",
    base: { FLAT_HP: 10325, FLAT_ATK: 450, FLAT_DEF: 1161 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "BASIC_ATTACK_DMG_BONUS": 0.4,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.1,
    },
  },
  "1504": {
    name: "Lumi",
    type: "Broadblade",
    base: { FLAT_HP: 8500, FLAT_ATK: 338, FLAT_DEF: 880 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "BASIC_ATTACK_DMG_BONUS": 0.22,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.18,
      "RESONANCE_SKILL_DMG_BONUS": 0.16,
    },
  },
  
  // Version 1.3
  "1505": {
    name: "The Shorekeeper",
    type: "Rectifier",
    base: { FLAT_HP: 16713, FLAT_ATK: 288, FLAT_DEF: 1100 },
    weights: {
      "ENERGY_REGEN": 1,
      "HP": 0.6,
      "CRIT_DMG": 0.5,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.25,
    },
  },
  "1106": {
    name: "Youhu",
    type: "Gauntlets",
    base: { FLAT_HP: 9975, FLAT_ATK: 263, FLAT_DEF: 1051 },
    weights: {
      "ENERGY_REGEN": 1,
      "ATK": 0.6,
      "CRIT_RATE": 0.5,
      "CRIT_DMG": 0.5,
    },
  },
  
  // Version 1.2
  "1305": {
    name: "Xiangli Yao",
    type: "Gauntlets",
    base: { FLAT_HP: 10625, FLAT_ATK: 425, FLAT_DEF: 1222 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.34,
      "RESONANCE_SKILL_DMG_BONUS": 0.1,
    },
  },
  "1105": {
    name: "Zhezhi",
    type: "Rectifier",
    base: { FLAT_HP: 12250, FLAT_ATK: 375, FLAT_DEF: 1198 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "BASIC_ATTACK_DMG_BONUS": 0.47,
    },
  },
  
  // Version 1.1
  "1205": {
    name: "Changli",
    type: "Sword",
    base: { FLAT_HP: 10388, FLAT_ATK: 463, FLAT_DEF: 1100 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_SKILL_DMG_BONUS": 0.37,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.14,
    },
  },
  "1304": {
    name: "Jinhsi",
    type: "Broadblade",
    base: { FLAT_HP: 10825, FLAT_ATK: 413, FLAT_DEF: 1259 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_SKILL_DMG_BONUS": 0.45,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.11,
    },
  },
  
  // Version 1.0
  "1403": {
    name: "Aalto",
    type: "Pistols",
    base: { FLAT_HP: 9850, FLAT_ATK: 263, FLAT_DEF: 1075 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "BASIC_ATTACK_DMG_BONUS": 0.26,
      "RESONANCE_SKILL_DMG_BONUS": 0.16,
    },
  },
  "1103": {
    name: "Baizhi",
    type: "Rectifier",
    base: { FLAT_HP: 12813, FLAT_ATK: 213, FLAT_DEF: 1002 },
    weights: {
      "ENERGY_REGEN": 1,
      "HP": 0.6,
    },
  },
  "1301": {
    name: "Calcharo",
    type: "Broadblade",
    base: { FLAT_HP: 10500, FLAT_ATK: 438, FLAT_DEF: 1185 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.33,
      "BASIC_ATTACK_DMG_BONUS": 0.15,
    },
  },
  "1202": {
    name: "Chixia",
    type: "Pistols",
    base: { FLAT_HP: 9088, FLAT_ATK: 300, FLAT_DEF: 953 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_SKILL_DMG_BONUS": 0.29,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.2,
    },
  },
  "1602": {
    name: "Danjin",
    type: "Sword",
    base: { FLAT_HP: 9438, FLAT_ATK: 263, FLAT_DEF: 1149 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.18,
      "RESONANCE_SKILL_DMG_BONUS": 0.15,
      "HEAVY_ATTACK_DMG_BONUS": 0.15,
    },
  },
  "1203": {
    name: "Encore",
    type: "Rectifier",
    base: { FLAT_HP: 10513, FLAT_ATK: 425, FLAT_DEF: 1246 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "BASIC_ATTACK_DMG_BONUS": 0.28,
    },
  },
  "1405": {
    name: "Jianxin",
    type: "Gauntlets",
    base: { FLAT_HP: 14113, FLAT_ATK: 338, FLAT_DEF: 1124 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.22,
      "BASIC_ATTACK_DMG_BONUS": 0.19,
    },
  },
  "1404": {
    name: "Jiyan",
    type: "Broadblade",
    base: { FLAT_HP: 10488, FLAT_ATK: 438, FLAT_DEF: 1185 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "HEAVY_ATTACK_DMG_BONUS": 0.41,
    },
  },
  "1104": {
    name: "Lingyang",
    type: "Gauntlets",
    base: { FLAT_HP: 10388, FLAT_ATK: 438, FLAT_DEF: 1210 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "BASIC_ATTACK_DMG_BONUS": 0.22,
      "RESONANCE_SKILL_DMG_BONUS": 0.17,
    },
  },
  "1204": {
    name: "Mortefi",
    type: "Pistols",
    base: { FLAT_HP: 10025, FLAT_ATK: 250, FLAT_DEF: 1136 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.4,
      "RESONANCE_SKILL_DMG_BONUS": 0.11,
    },
  },
  "1604": {
    name: "Rover (Havoc)",
    type: "Sword",
    base: { FLAT_HP: 10825, FLAT_ATK: 413, FLAT_DEF: 1259 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "BASIC_ATTACK_DMG_BONUS": 0.19,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.16,
      "RESONANCE_SKILL_DMG_BONUS": 0.11,
    },
  },
  "1502": {
    name: "Rover (Spectro)",
    type: "Sword",
    base: { FLAT_HP: 11400, FLAT_ATK: 375, FLAT_DEF: 1369 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1102": {
    name: "Sanhua",
    type: "Sword",
    base: { FLAT_HP: 10063, FLAT_ATK: 275, FLAT_DEF: 941 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "HEAVY_ATTACK_DMG_BONUS": 0.21,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.17,
      "RESONANCE_SKILL_DMG_BONUS": 0.16,
    },
  },
  "1601": {
    name: "Taoqi",
    type: "Broadblade",
    base: { FLAT_HP: 8950, FLAT_ATK: 225, FLAT_DEF: 1564 },
    weights: {
      "ENERGY_REGEN": 1,
      "DEF": 0.6,
      "CRIT_RATE": 0.5,
      "CRIT_DMG": 0.5,
    },
  },
  "1503": {
    name: "Verina",
    type: "Rectifier",
    base: { FLAT_HP: 14238, FLAT_ATK: 338, FLAT_DEF: 1100 },
    weights: {
      "ENERGY_REGEN": 1,
      "ATK": 0.6,
    },
  },
  "1402": {
    name: "Yangyang",
    type: "Sword",
    base: { FLAT_HP: 10200, FLAT_ATK: 250, FLAT_DEF: 1100 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.25,
      "BASIC_ATTACK_DMG_BONUS": 0.19,
    },
  },
  "1302": {
    name: "Yinlin",
    type: "Rectifier",
    base: { FLAT_HP: 11000, FLAT_ATK: 400, FLAT_DEF: 1283 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "RESONANCE_SKILL_DMG_BONUS": 0.33,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.12,
    },
  },
  "1303": {
    name: "Yuanwu",
    type: "Gauntlets",
    base: { FLAT_HP: 8525, FLAT_ATK: 225, FLAT_DEF: 1637 },
    weights: {
      "ENERGY_REGEN": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "DEF": 0.6,
      "RESONANCE_SKILL_DMG_BONUS": 0.29,
      "RESONANCE_LIBERATION_DMG_BONUS": 0.24,
    },
  },
};

export default WW_CHARACTERS;
