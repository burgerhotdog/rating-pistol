export default {
  TITLE: "Zenless Zone Zero",
  VERSION: "2.6",
  PATH: "/zenless-zone-zero",
  RESIN_PER_DAY: 320,
  RESIN_PER_RUN: 60,
  DROPS_PER_RUN: 2.25,
  NUM_MAINSTATS: 6,
  NUM_SUBSTATS: 4,
  EQUIP_NAMES: [
    "Disk 1",
    "Disk 2",
    "Disk 3",
    "Disk 4",
    "Disk 5",
    "Disk 6"
  ],
  ELEMENT_TYPES: [
    "Electric",
    "Ether",
    "Fire",
    "Ice",
    "Physical"
  ],
  WEAPON_TYPES: [
    "Anomaly",
    "Attack",
    "Defense",
    "Rupture",
    "Stun",
    "Support"
  ],
  STATS: {
    "_HP": {
      "name": "HP",
      "mainChance": [1, 0, 0, 0, 0, 0],
      "subValue": 112,
      "subChance": 10
    },
    "_ATK": {
      "name": "ATK",
      "mainChance": [0, 1, 0, 0, 0, 0],
      "subValue": 19,
      "subChance": 10
    },
    "_DEF": {
      "name": "DEF",
      "mainChance": [0, 0, 1, 0, 0, 0],
      "subValue": 15,
      "subChance": 10
    },
    "HP": {
      "name": "HP%",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0.233333, 0.133333, 0.233333],
      "subValue": 3,
      "subChance": 10
    },
    "ATK": {
      "name": "ATK%",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0.223333, 0.133333, 0.233333],
      "subValue": 3,
      "subChance": 10
    },
    "DEF": {
      "name": "DEF%",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0.223333, 0.133333, 0.233333],
      "subValue": 4.8,
      "subChance": 10
    },
    "CR": {
      "name": "CRIT Rate",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0.1, 0, 0],
      "subValue": 2.4,
      "subChance": 6
    },
    "CD": {
      "name": "CRIT DMG",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0.1, 0, 0],
      "subValue": 4.8,
      "subChance": 6
    },
    "AP": {
      "name": "Anomaly Proficiency",
      "mainChance": [0, 0, 0, 0.1, 0, 0],
      "subValue": 9,
      "subChance": 8
    },
    "ETHER": {
      "name": "Ether DMG Bonus",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0, 0.1, 0]
    },
    "ELECTRIC": {
      "name": "Electric DMG Bonus",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0, 0.1, 0]
    },
    "FIRE": {
      "name": "Fire DMG Bonus",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0, 0.1, 0]
    },
    "ICE": {
      "name": "Ice DMG Bonus",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0, 0.1, 0]
    },
    "PHYSICAL": {
      "name": "Physical DMG Bonus",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0, 0.1, 0]
    },
    "PR": {
      "name": "PEN Ratio",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0, 0.1, 0]
    },
    "AM": {
      "name": "Anomaly Mastery",
      "mainChance": [0, 0, 0, 0, 0, 0.1]
    },
    "IMPACT": {
      "name": "Impact",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0, 0, 0.1]
    },
    "ER": {
      "name": "Energy Regen",
      "showPercent": true,
      "mainChance": [0, 0, 0, 0, 0, 0.1]
    },
    "PEN": {
      "name": "PEN",
      "subValue": 9,
      "subChance": 8
    },
  },
};
