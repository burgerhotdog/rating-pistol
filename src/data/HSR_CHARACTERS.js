const HSR_CHARACTERS = {
  // Version 3.0
  "1402": {
    name: "Aglaea",
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
    type: "The Hunt",
    base: { FLAT_HP: 1203, FLAT_ATK: 620, FLAT_DEF: 436 },
    weights: {
      "SPD": 1,
      "BREAK_EFFECT": 1,
    },
  },
  "1309": {
    name: "Robin",
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
    type: "Harmony",
    base: { FLAT_HP: 917, FLAT_ATK: 564, FLAT_DEF: 352 },
    weights: {
      "SPD": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1217": {
    name: "Huohuo",
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
    type: "Harmony",
    base: { FLAT_HP: 1023, FLAT_ATK: 511, FLAT_DEF: 463 },
    weights: {
      "SPD": 1,
      "EFFECT_RES": 0.24,
    },
  },
  "1211": {
    name: "Bailu",
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

export default HSR_CHARACTERS;
