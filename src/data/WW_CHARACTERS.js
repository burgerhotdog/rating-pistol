const WW_CHARACTERS = {
  /*// Version 2.1
  "": {
    name: "Brant",
    type: "Sword",
    base: { HP: 1000, ATK: 100, DEF: 1000 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
    },
  },
  "": {
    name: "Phoebe",
    type: "Rectifier",
    base: { HP: 10000, ATK: 100, DEF: 1000 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
    },
  },*/
  
  // Version 2.0
  "1107": {
    name: "Carlotta",
    type: "Pistols",
    base: { HP: 12450, ATK: 463, DEF: 1198 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RSDB": 0.5,
    },
  },
  "1606": {
    name: "Roccia",
    type: "Gauntlets",
    base: { HP: 12250, ATK: 375, DEF: 1198 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "HADB": 0.35,
    },
  },
  
  // Version 1.4
  "1603": {
    name: "Camellya",
    type: "Sword",
    base: { HP: 10325, ATK: 450, DEF: 1161 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "BADB": 0.4,
      "RLDB": 0.1,
    },
  },
  "1504": {
    name: "Lumi",
    type: "Broadblade",
    base: { HP: 8500, ATK: 338, DEF: 880 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "BADB": 0.22,
      "RLDB": 0.18,
      "RSDB": 0.16,
    },
  },
  
  // Version 1.3
  "1505": {
    name: "The Shorekeeper",
    type: "Rectifier",
    base: { HP: 16713, ATK: 288, DEF: 1100 },
    weights: {
      "ENERGY_REGEN": 1,
      "HP_PERCENT": 0.6,
      "CD": 0.5,
      "RLDB": 0.25,
    },
  },
  "1106": {
    name: "Youhu",
    type: "Gauntlets",
    base: { HP: 9975, ATK: 263, DEF: 1051 },
    weights: {
      "ENERGY_REGEN": 1,
      "ATK_PERCENT": 0.6,
      "CR": 0.5,
      "CD": 0.5,
    },
  },
  
  // Version 1.2
  "1305": {
    name: "Xiangli Yao",
    type: "Gauntlets",
    base: { HP: 10625, ATK: 425, DEF: 1222 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RLDB": 0.34,
      "RSDB": 0.1,
    },
  },
  "1105": {
    name: "Zhezhi",
    type: "Rectifier",
    base: { HP: 12250, ATK: 375, DEF: 1198 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "BADB": 0.47,
    },
  },
  
  // Version 1.1
  "1205": {
    name: "Changli",
    type: "Sword",
    base: { HP: 10388, ATK: 463, DEF: 1100 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RSDB": 0.37,
      "RLDB": 0.14,
    },
  },
  "1304": {
    name: "Jinhsi",
    type: "Broadblade",
    base: { HP: 10825, ATK: 413, DEF: 1259 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RSDB": 0.45,
      "RLDB": 0.11,
    },
  },
  
  // Version 1.0
  "1403": {
    name: "Aalto",
    type: "Pistols",
    base: { HP: 9850, ATK: 263, DEF: 1075 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "BADB": 0.26,
      "RSDB": 0.16,
    },
  },
  "1103": {
    name: "Baizhi",
    type: "Rectifier",
    base: { HP: 12813, ATK: 213, DEF: 1002 },
    weights: {
      "ENERGY_REGEN": 1,
      "HP_PERCENT": 0.6,
    },
  },
  "1301": {
    name: "Calcharo",
    type: "Broadblade",
    base: { HP: 10500, ATK: 438, DEF: 1185 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RLDB": 0.33,
      "BADB": 0.15,
    },
  },
  "1202": {
    name: "Chixia",
    type: "Pistols",
    base: { HP: 9088, ATK: 300, DEF: 953 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RSDB": 0.29,
      "RLDB": 0.2,
    },
  },
  "1602": {
    name: "Danjin",
    type: "Sword",
    base: { HP: 9438, ATK: 263, DEF: 1149 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RLDB": 0.18,
      "RSDB": 0.15,
      "HADB": 0.15,
    },
  },
  "1203": {
    name: "Encore",
    type: "Rectifier",
    base: { HP: 10513, ATK: 425, DEF: 1246 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "BADB": 0.28,
    },
  },
  "1405": {
    name: "Jianxin",
    type: "Gauntlets",
    base: { HP: 14113, ATK: 338, DEF: 1124 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RLDB": 0.22,
      "BADB": 0.19,
    },
  },
  "1404": {
    name: "Jiyan",
    type: "Broadblade",
    base: { HP: 10488, ATK: 438, DEF: 1185 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "HADB": 0.41,
    },
  },
  "1104": {
    name: "Lingyang",
    type: "Gauntlets",
    base: { HP: 10388, ATK: 438, DEF: 1210 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "BADB": 0.22,
      "RSDB": 0.17,
    },
  },
  "1204": {
    name: "Mortefi",
    type: "Pistols",
    base: { HP: 10025, ATK: 250, DEF: 1136 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RLDB": 0.4,
      "RSDB": 0.11,
    },
  },
  "1604": {
    name: "Rover (Havoc)",
    type: "Sword",
    base: { HP: 10825, ATK: 413, DEF: 1259 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "BADB": 0.19,
      "RLDB": 0.16,
      "RSDB": 0.11,
    },
  },
  "1502": {
    name: "Rover (Spectro)",
    type: "Sword",
    base: { HP: 11400, ATK: 375, DEF: 1369 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
    },
  },
  "1102": {
    name: "Sanhua",
    type: "Sword",
    base: { HP: 10063, ATK: 275, DEF: 941 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "HADB": 0.21,
      "RLDB": 0.17,
      "RSDB": 0.16,
    },
  },
  "1601": {
    name: "Taoqi",
    type: "Broadblade",
    base: { HP: 8950, ATK: 225, DEF: 1564 },
    weights: {
      "ENERGY_REGEN": 1,
      "DEF_PERCENT": 0.6,
      "CR": 0.5,
      "CD": 0.5,
    },
  },
  "1503": {
    name: "Verina",
    type: "Rectifier",
    base: { HP: 14238, ATK: 338, DEF: 1100 },
    weights: {
      "ENERGY_REGEN": 1,
      "ATK_PERCENT": 0.6,
    },
  },
  "1402": {
    name: "Yangyang",
    type: "Sword",
    base: { HP: 10200, ATK: 250, DEF: 1100 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RLDB": 0.25,
      "BADB": 0.19,
    },
  },
  "1302": {
    name: "Yinlin",
    type: "Rectifier",
    base: { HP: 11000, ATK: 400, DEF: 1283 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "ATK_PERCENT": 0.6,
      "RSDB": 0.33,
      "RLDB": 0.12,
    },
  },
  "1303": {
    name: "Yuanwu",
    type: "Gauntlets",
    base: { HP: 8525, ATK: 225, DEF: 1637 },
    weights: {
      "ENERGY_REGEN": 1,
      "CR": 1,
      "CD": 1,
      "DEF_PERCENT": 0.6,
      "RSDB": 0.29,
      "RLDB": 0.24,
    },
  },
};

export default WW_CHARACTERS;
