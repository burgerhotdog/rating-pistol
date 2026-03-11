export default {
  TITLE: "Wuthering Waves",
  VERSION: "3.1",
  PATH: "/wuthering-waves",
  RESIN_PER_DAY: 240,
  RESIN_PER_RUN: 60,
  DROPS_PER_RUN: 4.33,
  NUM_MAINSTATS: 5,
  NUM_SUBSTATS: 5,
  EQUIP_NAMES: [
    "4-Cost",
    "3-Cost",
    "3-Cost",
    "1-Cost",
    "1-Cost"
  ],
  ELEMENT_TYPES: [
    "Aero",
    "Electro",
    "Fusion",
    "Glacio",
    "Havoc",
    "Spectro"
  ],
  WEAPON_TYPES: [
    "Broadblade",
    "Gauntlets",
    "Pistols",
    "Rectifier",
    "Sword"
  ],
  STATS: {
    "_HP": {
      "name": "HP",
      "subValue": 580,
      "subChance": 10
    },
    "_ATK": {
      "name": "ATK",
      "subValue": 60,
      "subChance": 10
    },
    "_DEF": {
      "name": "DEF",
      "subValue": 70,
      "subChance": 10
    },
    "HP": {
      "name": "HP%",
      "showPercent": true,
      mainValue: [33, 30, 22.8],
      "mainChance": [0.161667, 0.05875, 0.05875, 0.333333, 0.333333],
      "subValue": 11.6,
      "subChance": 10
    },
    "ATK": {
      "name": "ATK%",
      "showPercent": true,
      mainValue: [33, 30, 18],
      "mainChance": [0.161667, 0.05875, 0.05875, 0.333333, 0.333333],
      "subValue": 11.6,
      "subChance": 10
    },
    "DEF": {
      "name": "DEF%",
      "showPercent": true,
      mainValue: [41.5, 38, 18],
      "mainChance": [0.161667, 0.05875, 0.05875, 0.333333, 0.333333],
      "subValue": 14.7,
      "subChance": 10
    },
    "CR": {
      "name": "CRIT Rate",
      "showPercent": true,
      mainValue: [22, null, null],
      "mainChance": [0.2, 0, 0, 0, 0],
      "subValue": 10.5,
      "subChance": 6
    },
    "CD": {
      "name": "CRIT DMG",
      "showPercent": true,
      mainValue: [44, null, null],
      "mainChance": [0.2, 0, 0, 0, 0],
      "subValue": 21,
      "subChance": 6
    },
    "HB": {
      "name": "Healing Bonus",
      "showPercent": true,
      mainValue: [26, null, null],
      "mainChance": [0.1154, 0, 0, 0, 0]
    },
    "AERO": {
      "name": "Aero DMG Bonus",
      "showPercent": true,
      mainValue: [null, 30, null],
      "mainChance": [0, 0.1275, 0.1275, 0, 0]
    },
    "ELECTRO": {
      "name": "Electro DMG Bonus",
      "showPercent": true,
      mainValue: [null, 30, null],
      "mainChance": [0, 0.1275, 0.1275, 0, 0]
    },
    "FUSION": {
      "name": "Fusion DMG Bonus",
      "showPercent": true,
      mainValue: [null, 30, null],
      "mainChance": [0, 0.1275, 0.1275, 0, 0]
    },
    "GLACIO": {
      "name": "Glacio DMG Bonus",
      "showPercent": true,
      mainValue: [null, 30, null],
      "mainChance": [0, 0.1275, 0.1275, 0, 0]
    },
    "HAVOC": {
      "name": "Havoc DMG Bonus",
      "showPercent": true,
      mainValue: [null, 30, null],
      "mainChance": [0, 0.1275, 0.1275, 0, 0]
    },
    "SPECTRO": {
      "name": "Spectro DMG Bonus",
      "showPercent": true,
      mainValue: [null, 30, null],
      "mainChance": [0, 0.1275, 0.1275, 0, 0]
    },
    "ER": {
      "name": "Energy Regen",
      "showPercent": true,
      mainValue: [null, 32, null],
      "mainChance": [0, 0.05875, 0.05875, 0, 0],
      "subValue": 12.4,
      "subChance": 8
    },
    "BA": {
      "name": "Basic Attack DMG Bonus",
      "showPercent": true,
      "subValue": 11.6,
      "subChance": 8
    },
    "HA": {
      "name": "Heavy Attack DMG Bonus",
      "showPercent": true,
      "subValue": 11.6,
      "subChance": 8
    },
    "RS": {
      "name": "Resonance Skill DMG Bonus",
      "showPercent": true,
      "subValue": 11.6,
      "subChance": 8
    },
    "RL": {
      "name": "Resonance Liberation DMG Bonus",
      "showPercent": true,
      "subValue": 11.6,
      "subChance": 8
    },
  },
  FLATCOSTSTAT: {
    4: { _ATK: 150 },
    3: { _ATK: 100 },
    1: { _HP: 2280 },
  },
};
