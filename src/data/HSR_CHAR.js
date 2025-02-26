const HSR_CHAR = {
  // Version 3.1
  "1403": {
    name: "Tribbie",
    rarity: 5,
    type: "Harmony",
    base: { FLAT_HP: 1048, FLAT_ATK: 524, FLAT_DEF: 728 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "HP": 0.6,
    },
  },
  "1404": {
    name: "Mydei",
    rarity: 5,
    type: "Destruction",
    base: { FLAT_HP: 1552, FLAT_ATK: 427, FLAT_DEF: 194 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "HP": 0.6,
    },
  },
  
  // Version 3.0
  "1402": {
    name: "Aglaea",
    rarity: 5,
    type: "Remembrance",
    base: { FLAT_HP: 1242, FLAT_ATK: 699, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1401": {
    name: "The Herta",
    rarity: 5,
    type: "Erudition",
    base: { FLAT_HP: 1164, FLAT_ATK: 679, FLAT_DEF: 485 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "8008": {
    name: "Trailblazer (Remembrance)",
    rarity: 5,
    type: "Remembrance",
    base: { FLAT_HP: 1047, FLAT_ATK: 543, FLAT_DEF: 630 },
    weights: {
      "SPD": 1,
      "CRIT_DMG": 0.6,
      "ATK": 0.24,
    },
  },
  
  // Version 2.7
  "1313": {
    name: "Sunday",
    rarity: 5,
    type: "Harmony",
    base: { FLAT_HP: 1241, FLAT_ATK: 640, FLAT_DEF: 533 },
    weights: {
      "SPD": 1,
      "CRIT_DMG": 0.6,
      "EFFECT_RES": 0.24,
    },
  },
  "1225": {
    name: "Fugue",
    rarity: 5,
    type: "Nihility",
    base: { FLAT_HP: 1125, FLAT_ATK: 582, FLAT_DEF: 557 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "BREAK_EFFECT": 1,
      "EFFECT_RES": 0.24,
    },
  },
  
  // Version 2.6
  "1317": {
    name: "Rappa",
    rarity: 5,
    type: "Erudition",
    base: { FLAT_HP: 1086, FLAT_ATK: 717, FLAT_DEF: 460 },
    weights: {
      "SPD": 1,
      "BREAK_EFFECT": 1,
      "ATK": 0.6,
    },
  },
  
  // Version 2.5
  "1220": {
    name: "Feixiao",
    rarity: 5,
    type: "The Hunt",
    base: { FLAT_HP: 1047, FLAT_ATK: 601, FLAT_DEF: 388 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1222": {
    name: "Lingsha",
    rarity: 5,
    type: "Abundance",
    base: { FLAT_HP: 1358, FLAT_ATK: 679, FLAT_DEF: 436 },
    weights: {
      "SPD": 1,
      "BREAK_EFFECT": 1,
      "ATK": 0.6,
      "EFFECT_RES": 0.24,
    },
  },
  "1223": {
    name: "Moze",
    rarity: 4,
    type: "The Hunt",
    base: { FLAT_HP: 811, FLAT_ATK: 599, FLAT_DEF: 352 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  
  // Version 2.4
  "1218": {
    name: "Jiaoqiu",
    rarity: 5,
    type: "Nihility",
    base: { FLAT_HP: 1358, FLAT_ATK: 601, FLAT_DEF: 509 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "ATK": 0.6,
    },
  },
  "1224": {
    name: "March 7th (The Hunt)",
    rarity: 4,
    type: "The Hunt",
    base: { FLAT_HP: 1058, FLAT_ATK: 564, FLAT_DEF: 441 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1221": {
    name: "Yunli",
    rarity: 5,
    type: "Destruction",
    base: { FLAT_HP: 1358, FLAT_ATK: 679, FLAT_DEF: 460 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  
  // Version 2.3
  "1310": {
    name: "Firefly",
    rarity: 5,
    type: "Destruction",
    base: { FLAT_HP: 814, FLAT_ATK: 523, FLAT_DEF: 776 },
    weights: {
      "SPD": 1,
      "BREAK_EFFECT": 1,
      "ATK": 0.6,
    },
  },
  "1314": {
    name: "Jade",
    rarity: 5,
    type: "Erudition",
    base: { FLAT_HP: 1086, FLAT_ATK: 659, FLAT_DEF: 509 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  
  // Version 2.2
  "1315": {
    name: "Boothill",
    rarity: 5,
    type: "The Hunt",
    base: { FLAT_HP: 1203, FLAT_ATK: 620, FLAT_DEF: 436 },
    weights: {
      "SPD": 1,
      "BREAK_EFFECT": 1,
    },
  },
  "1309": {
    name: "Robin",
    rarity: 5,
    type: "Harmony",
    base: { FLAT_HP: 1280, FLAT_ATK: 640, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "ATK": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "8006": {
    name: "Trailblazer (Harmony)",
    rarity: 5,
    type: "Harmony",
    base: { FLAT_HP: 1086, FLAT_ATK: 446, FLAT_DEF: 679 },
    weights: {
      "SPD": 1,
      "BREAK_EFFECT": 1,
      "EFFECT_RES": 0.24,
    },
  },
  
  // Version 2.1
  "1308": {
    name: "Acheron",
    rarity: 5,
    type: "Nihility",
    base: { FLAT_HP: 1125, FLAT_ATK: 698, FLAT_DEF: 436 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1304": {
    name: "Aventurine",
    rarity: 5,
    type: "Preservation",
    base: { FLAT_HP: 1203, FLAT_ATK: 446, FLAT_DEF: 654 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "DEF": 0.6,
    },
  },
  "1301": {
    name: "Gallagher",
    rarity: 4,
    type: "Abundance",
    base: { FLAT_HP: 1305, FLAT_ATK: 529, FLAT_DEF: 441 },
    weights: {
      "SPD": 1,
      "BREAK_EFFECT": 0.9,
      "EFFECT_RES": 0.24,
    },
  },
  
  // Version 2.0
  "1307": {
    name: "Black Swan",
    rarity: 5,
    type: "Nihility",
    base: { FLAT_HP: 1086, FLAT_ATK: 659, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "ATK": 1,
    },
  },
  "1312": {
    name: "Misha",
    rarity: 4,
    type: "Destruction",
    base: { FLAT_HP: 1270, FLAT_ATK: 599, FLAT_DEF: 396 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1306": {
    name: "Sparkle",
    rarity: 5,
    type: "Harmony",
    base: { FLAT_HP: 1397, FLAT_ATK: 523, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "CRIT_DMG": 0.6,
      "EFFECT_RES": 0.24,
    },
  },
  
  // Version 1.6
  "1305": {
    name: "Dr. Ratio",
    rarity: 5,
    type: "The Hunt",
    base: { FLAT_HP: 1047, FLAT_ATK: 776, FLAT_DEF: 460 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "EFFECT_HIT_RATE": 0.24,
    },
  },
  "1303": {
    name: "Ruan Mei",
    rarity: 5,
    type: "Harmony",
    base: { FLAT_HP: 1086, FLAT_ATK: 659, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "BREAK_EFFECT": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1214": {
    name: "Xueyi",
    rarity: 4,
    type: "Destruction",
    base: { FLAT_HP: 1058, FLAT_ATK: 599, FLAT_DEF: 396 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "BREAK_EFFECT": 0.9,
      "ATK": 0.6,
    },
  },
  
  // Version 1.5
  "1302": {
    name: "Argenti",
    rarity: 5,
    type: "Erudition",
    base: { FLAT_HP: 1047, FLAT_ATK: 737, FLAT_DEF: 363 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1215": {
    name: "Hanya",
    rarity: 4,
    type: "Harmony",
    base: { FLAT_HP: 917, FLAT_ATK: 564, FLAT_DEF: 352 },
    weights: {
      "SPD": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1217": {
    name: "Huohuo",
    rarity: 5,
    type: "Abundance",
    base: { FLAT_HP: 1358, FLAT_ATK: 601, FLAT_DEF: 509 },
    weights: {
      "SPD": 1,
      "HP": 1,
      "EFFECT_RES": 0.24,
    },
  },
  
  // Version 1.4
  "1210": {
    name: "Guinaifen",
    rarity: 4,
    type: "Nihility",
    base: { FLAT_HP: 882, FLAT_ATK: 582, FLAT_DEF: 441 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "ATK": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1212": {
    name: "Jingliu",
    rarity: 5,
    type: "Destruction",
    base: { FLAT_HP: 1435, FLAT_ATK: 679, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1112": {
    name: "Topaz & Numby",
    rarity: 5,
    type: "The Hunt",
    base: { FLAT_HP: 931, FLAT_ATK: 620, FLAT_DEF: 412 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  
  // Version 1.3
  "1213": {
    name: "Dan Heng • Imbibitor Lunae",
    rarity: 5,
    type: "Destruction",
    base: { FLAT_HP: 1241, FLAT_ATK: 698, FLAT_DEF: 363 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1208": {
    name: "Fu Xuan",
    rarity: 5,
    type: "Preservation",
    base: { FLAT_HP: 1474, FLAT_ATK: 465, FLAT_DEF: 606 },
    weights: {
      "SPD": 1,
      "HP": 1,
      "DEF": 0.6,
      "EFFECT_RES": 0.24,
    },
  },
  "1110": {
    name: "Lynx",
    rarity: 4,
    type: "Abundance",
    base: { FLAT_HP: 1058, FLAT_ATK: 493, FLAT_DEF: 551 },
    weights: {
      "SPD": 1,
      "HP": 1,
      "EFFECT_RES": 0.24,
    },
  },
  
  // Version 1.2
  "1205": {
    name: "Blade",
    rarity: 5,
    type: "Destruction",
    base: { FLAT_HP: 1358, FLAT_ATK: 543, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "HP": 0.6,
    },
  },
  "1005": {
    name: "Kafka",
    rarity: 5,
    type: "Nihility",
    base: { FLAT_HP: 1086, FLAT_ATK: 679, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "ATK": 1,
    },
  },
  "1111": {
    name: "Luka",
    rarity: 4,
    type: "Nihility",
    base: { FLAT_HP: 917, FLAT_ATK: 582, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "BREAK_EFFECT": 1,
      "ATK": 0.6,
    },
  },
  
  // Version 1.1
  "1203": {
    name: "Luocha",
    rarity: 5,
    type: "Abundance",
    base: { FLAT_HP: 1280, FLAT_ATK: 756, FLAT_DEF: 363 },
    weights: {
      "SPD": 1,
      "ATK": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1006": {
    name: "Silver Wolf",
    rarity: 5,
    type: "Nihility",
    base: { FLAT_HP: 1047, FLAT_ATK: 640, FLAT_DEF: 460 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1207": {
    name: "Yukong",
    rarity: 4,
    type: "Harmony",
    base: { FLAT_HP: 917, FLAT_ATK: 599, FLAT_DEF: 374 },
    weights: {
      "SPD": 1,
      "EFFECT_RES": 0.24,
    },
  },
  
  // Version 1.0
  "1008": {
    name: "Arlan",
    rarity: 4,
    type: "Destruction",
    base: { FLAT_HP: 1199, FLAT_ATK: 599, FLAT_DEF: 330 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1009": {
    name: "Asta",
    rarity: 4,
    type: "Harmony",
    base: { FLAT_HP: 1023, FLAT_ATK: 511, FLAT_DEF: 463 },
    weights: {
      "SPD": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1211": {
    name: "Bailu",
    rarity: 5,
    type: "Abundance",
    base: { FLAT_HP: 1319, FLAT_ATK: 562, FLAT_DEF: 485 },
    weights: {
      "SPD": 1,
      "HP": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1101": {
    name: "Bronya",
    rarity: 5,
    type: "Harmony",
    base: { FLAT_HP: 1241, FLAT_ATK: 582, FLAT_DEF: 533 },
    weights: {
      "SPD": 1,
      "CRIT_DMG": 0.6,
      "EFFECT_RES": 0.24,
    },
  },
  "1107": {
    name: "Clara",
    rarity: 5,
    type: "Destruction",
    base: { FLAT_HP: 1241, FLAT_ATK: 737, FLAT_DEF: 485 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1002": {
    name: "Dan Heng",
    rarity: 4,
    type: "The Hunt",
    base: { FLAT_HP: 882, FLAT_ATK: 546, FLAT_DEF: 396 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1104": {
    name: "Gepard",
    rarity: 5,
    type: "Preservation",
    base: { FLAT_HP: 1397, FLAT_ATK: 543, FLAT_DEF: 654 },
    weights: {
      "SPD": 1,
      "DEF": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1013": {
    name: "Herta",
    rarity: 4,
    type: "Erudition",
    base: { FLAT_HP: 952, FLAT_ATK: 582, FLAT_DEF: 396 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1003": {
    name: "Himeko",
    rarity: 5,
    type: "Erudition",
    base: { FLAT_HP: 1047, FLAT_ATK: 756, FLAT_DEF: 436 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1109": {
    name: "Hook",
    rarity: 4,
    type: "Destruction",
    base: { FLAT_HP: 1340, FLAT_ATK: 617, FLAT_DEF: 352 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1204": {
    name: "Jing Yuan",
    rarity: 5,
    type: "Erudition",
    base: { FLAT_HP: 1164, FLAT_ATK: 698, FLAT_DEF: 485 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1001": {
    name: "March 7th (Preservation)",
    rarity: 4,
    type: "Preservation",
    base: { FLAT_HP: 1058, FLAT_ATK: 511, FLAT_DEF: 573 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "DEF": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1105": {
    name: "Natasha",
    rarity: 4,
    type: "Abundance",
    base: { FLAT_HP: 1164, FLAT_ATK: 476, FLAT_DEF: 507 },
    weights: {
      "SPD": 1,
      "HP": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1106": {
    name: "Pela",
    rarity: 4,
    type: "Nihility",
    base: { FLAT_HP: 987, FLAT_ATK: 546, FLAT_DEF: 463 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1201": {
    name: "Qingque",
    rarity: 4,
    type: "Erudition",
    base: { FLAT_HP: 1023, FLAT_ATK: 652, FLAT_DEF: 441 },
    weights: {
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1108": {
    name: "Sampo",
    rarity: 4,
    type: "Nihility",
    base: { FLAT_HP: 1023, FLAT_ATK: 617, FLAT_DEF: 396 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "ATK": 1,
    },
  },
  "1102": {
    name: "Seele",
    rarity: 5,
    type: "The Hunt",
    base: { FLAT_HP: 931, FLAT_ATK: 640, FLAT_DEF: 363 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1103": {
    name: "Serval",
    rarity: 4,
    type: "Erudition",
    base: { FLAT_HP: 917, FLAT_ATK: 652, FLAT_DEF: 374 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1206": {
    name: "Sushang",
    rarity: 4,
    type: "The Hunt",
    base: { FLAT_HP: 917, FLAT_ATK: 564, FLAT_DEF: 418 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
      "BREAK_EFFECT": 0.24,
    },
  },
  "1202": {
    name: "Tingyun",
    rarity: 4,
    type: "Harmony",
    base: { FLAT_HP: 846, FLAT_ATK: 529, FLAT_DEF: 396 },
    weights: {
      "SPD": 1,
      "ATK": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "8002": {
    name: "Trailblazer (Destruction)",
    rarity: 5,
    type: "Destruction",
    base: { FLAT_HP: 1203, FLAT_ATK: 620, FLAT_DEF: 460 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "8004": {
    name: "Trailblazer (Preservation)",
    rarity: 5,
    type: "Preservation",
    base: { FLAT_HP: 1241, FLAT_ATK: 601, FLAT_DEF: 606 },
    weights: {
      "SPD": 1,
      "DEF": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1004": {
    name: "Welt",
    rarity: 5,
    type: "Nihility",
    base: { FLAT_HP: 1125, FLAT_ATK: 620, FLAT_DEF: 509 },
    weights: {
      "SPD": 1,
      "EFFECT_HIT_RATE": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
  "1209": {
    name: "Yanqing",
    rarity: 5,
    type: "The Hunt",
    base: { FLAT_HP: 892, FLAT_ATK: 679, FLAT_DEF: 412 },
    weights: {
      "SPD": 1,
      "CRIT_RATE": 1,
      "CRIT_DMG": 1,
      "ATK": 0.6,
    },
  },
};

export default HSR_CHAR;
