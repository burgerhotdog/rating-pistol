const HSR_CHARACTERS = {
  // Version 3.0
  "1402": {
    name: "Aglaea",
    type: "Remembrance",
    base: { HPDelta: 1242, AttackDelta: 699, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1401": {
    name: "The Herta",
    type: "Erudition",
    base: { HPDelta: 1164, AttackDelta: 679, DefenceDelta: 485 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "8008": {
    name: "Trailblazer (Remembrance)",
    type: "Remembrance",
    base: { HPDelta: 1047, AttackDelta: 543, DefenceDelta: 630 },
    weights: {
      "SpeedDelta": 1,
      "CriticalDamage": 0.6,
      "AttackAddedRatio": 0.24,
    },
  },
  
  // Version 2.7
  "1313": {
    name: "Sunday",
    type: "Harmony",
    base: { HPDelta: 1241, AttackDelta: 640, DefenceDelta: 533 },
    weights: {
      "SpeedDelta": 1,
      "CriticalDamage": 0.6,
      "StatusResistance": 0.24,
    },
  },
  "1225": {
    name: "Fugue",
    type: "Nihility",
    base: { HPDelta: 1125, AttackDelta: 582, DefenceDelta: 557 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "BreakDamageAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 2.6
  "1317": {
    name: "Rappa",
    type: "Erudition",
    base: { HPDelta: 1086, AttackDelta: 717, DefenceDelta: 460 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 2.5
  "1220": {
    name: "Feixiao",
    type: "The Hunt",
    base: { HPDelta: 1047, AttackDelta: 601, DefenceDelta: 388 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1222": {
    name: "Lingsha",
    type: "Abundance",
    base: { HPDelta: 1358, AttackDelta: 679, DefenceDelta: 436 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "AttackAddedRatio": 0.6,
      "StatusResistance": 0.24,
    },
  },
  "1223": {
    name: "Moze",
    type: "The Hunt",
    base: { HPDelta: 811, AttackDelta: 599, DefenceDelta: 352 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 2.4
  "1218": {
    name: "Jiaoqiu",
    type: "Nihility",
    base: { HPDelta: 1358, AttackDelta: 601, DefenceDelta: 509 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1224": {
    name: "March 7th (The Hunt)",
    type: "The Hunt",
    base: { HPDelta: 1058, AttackDelta: 564, DefenceDelta: 441 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1221": {
    name: "Yunli",
    type: "Destruction",
    base: { HPDelta: 1358, AttackDelta: 679, DefenceDelta: 460 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 2.3
  "1310": {
    name: "Firefly",
    type: "Destruction",
    base: { HPDelta: 814, AttackDelta: 523, DefenceDelta: 776 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1314": {
    name: "Jade",
    type: "Erudition",
    base: { HPDelta: 1086, AttackDelta: 659, DefenceDelta: 509 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 2.2
  "1315": {
    name: "Boothill",
    type: "The Hunt",
    base: { HPDelta: 1203, AttackDelta: 620, DefenceDelta: 436 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
    },
  },
  "1309": {
    name: "Robin",
    type: "Harmony",
    base: { HPDelta: 1280, AttackDelta: 640, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "AttackAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "8006": {
    name: "Trailblazer (Harmony)",
    type: "Harmony",
    base: { HPDelta: 1086, AttackDelta: 446, DefenceDelta: 679 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 2.1
  "1308": {
    name: "Acheron",
    type: "Nihility",
    base: { HPDelta: 1125, AttackDelta: 698, DefenceDelta: 436 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1304": {
    name: "Aventurine",
    type: "Preservation",
    base: { HPDelta: 1203, AttackDelta: 446, DefenceDelta: 654 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "DefenceAddedRatio": 0.6,
    },
  },
  "1301": {
    name: "Gallagher",
    type: "Abundance",
    base: { HPDelta: 1305, AttackDelta: 529, DefenceDelta: 441 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 0.9,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 2.0
  "1307": {
    name: "Black Swan",
    type: "Nihility",
    base: { HPDelta: 1086, AttackDelta: 659, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 1,
    },
  },
  "1312": {
    name: "Misha",
    type: "Destruction",
    base: { HPDelta: 1270, AttackDelta: 599, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1306": {
    name: "Sparkle",
    type: "Harmony",
    base: { HPDelta: 1397, AttackDelta: 523, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "CriticalDamage": 0.6,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 1.6
  "1305": {
    name: "Dr. Ratio",
    type: "The Hunt",
    base: { HPDelta: 1047, AttackDelta: 776, DefenceDelta: 460 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
      "StatusProbability": 0.24,
    },
  },
  "1303": {
    name: "Ruan Mei",
    type: "Harmony",
    base: { HPDelta: 1086, AttackDelta: 659, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "1214": {
    name: "Xueyi",
    type: "Destruction",
    base: { HPDelta: 1058, AttackDelta: 599, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "BreakDamageAddedRatio": 0.9,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 1.5
  "1302": {
    name: "Argenti",
    type: "Erudition",
    base: { HPDelta: 1047, AttackDelta: 737, DefenceDelta: 363 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1215": {
    name: "Hanya",
    type: "Harmony",
    base: { HPDelta: 917, AttackDelta: 564, DefenceDelta: 352 },
    weights: {
      "SpeedDelta": 1,
      "StatusResistance": 0.24,
    },
  },
  "1217": {
    name: "Huohuo",
    type: "Abundance",
    base: { HPDelta: 1358, AttackDelta: 601, DefenceDelta: 509 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 1.4
  "1210": {
    name: "Guinaifen",
    type: "Nihility",
    base: { HPDelta: 882, AttackDelta: 582, DefenceDelta: 441 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "1212": {
    name: "Jingliu",
    type: "Destruction",
    base: { HPDelta: 1435, AttackDelta: 679, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1112": {
    name: "Topaz & Numby",
    type: "The Hunt",
    base: { HPDelta: 931, AttackDelta: 620, DefenceDelta: 412 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 1.3
  "1213": {
    name: "Dan Heng • Imbibitor Lunae",
    type: "Destruction",
    base: { HPDelta: 1241, AttackDelta: 698, DefenceDelta: 363 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1208": {
    name: "Fu Xuan",
    type: "Preservation",
    base: { HPDelta: 1474, AttackDelta: 465, DefenceDelta: 606 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "DefenceAddedRatio": 0.6,
      "StatusResistance": 0.24,
    },
  },
  "1110": {
    name: "Lynx",
    type: "Abundance",
    base: { HPDelta: 1058, AttackDelta: 493, DefenceDelta: 551 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 1.2
  "1205": {
    name: "Blade",
    type: "Destruction",
    base: { HPDelta: 1358, AttackDelta: 543, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "HPAddedRatio": 0.6,
    },
  },
  "1005": {
    name: "Kafka",
    type: "Nihility",
    base: { HPDelta: 1086, AttackDelta: 679, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 1,
    },
  },
  "1111": {
    name: "Luka",
    type: "Nihility",
    base: { HPDelta: 917, AttackDelta: 582, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "BreakDamageAddedRatio": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 1.1
  "1203": {
    name: "Luocha",
    type: "Abundance",
    base: { HPDelta: 1280, AttackDelta: 756, DefenceDelta: 363 },
    weights: {
      "SpeedDelta": 1,
      "AttackAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "1006": {
    name: "Silver Wolf",
    type: "Nihility",
    base: { HPDelta: 1047, AttackDelta: 640, DefenceDelta: 460 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "StatusResistance": 0.24,
    },
  },
  "1207": {
    name: "Yukong",
    type: "Harmony",
    base: { HPDelta: 917, AttackDelta: 599, DefenceDelta: 374 },
    weights: {
      "SpeedDelta": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 1.0
  "1008": {
    name: "Arlan",
    type: "Destruction",
    base: { HPDelta: 1199, AttackDelta: 599, DefenceDelta: 330 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1009": {
    name: "Asta",
    type: "Harmony",
    base: { HPDelta: 1023, AttackDelta: 511, DefenceDelta: 463 },
    weights: {
      "SpeedDelta": 1,
      "StatusResistance": 0.24,
    },
  },
  "1211": {
    name: "Bailu",
    type: "Abundance",
    base: { HPDelta: 1319, AttackDelta: 562, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "1101": {
    name: "Bronya",
    type: "Harmony",
    base: { HPDelta: 1241, AttackDelta: 582, DefenceDelta: 533 },
    weights: {
      "SpeedDelta": 1,
      "CriticalDamage": 0.6,
      "StatusResistance": 0.24,
    },
  },
  "1107": {
    name: "Clara",
    type: "Destruction",
    base: { HPDelta: 1241, AttackDelta: 737, DefenceDelta: 485 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1002": {
    name: "Dan Heng",
    type: "The Hunt",
    base: { HPDelta: 882, AttackDelta: 546, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1104": {
    name: "Gepard",
    type: "Preservation",
    base: { HPDelta: 1397, AttackDelta: 543, DefenceDelta: 654 },
    weights: {
      "SpeedDelta": 1,
      "DefenceAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "1013": {
    name: "Herta",
    type: "Erudition",
    base: { HPDelta: 952, AttackDelta: 582, DefenceDelta: 396 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1003": {
    name: "Himeko",
    type: "Erudition",
    base: { HPDelta: 1047, AttackDelta: 756, DefenceDelta: 436 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1109": {
    name: "Hook",
    type: "Destruction",
    base: { HPDelta: 1340, AttackDelta: 617, DefenceDelta: 352 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1204": {
    name: "Jing Yuan",
    type: "Erudition",
    base: { HPDelta: 1164, AttackDelta: 698, DefenceDelta: 485 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1001": {
    name: "March 7th (Preservation)",
    type: "Preservation",
    base: { HPDelta: 1058, AttackDelta: 511, DefenceDelta: 573 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "DefenceAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "1105": {
    name: "Natasha",
    type: "Abundance",
    base: { HPDelta: 1164, AttackDelta: 476, DefenceDelta: 507 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "1106": {
    name: "Pela",
    type: "Nihility",
    base: { HPDelta: 987, AttackDelta: 546, DefenceDelta: 463 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "StatusResistance": 0.24,
    },
  },
  "1201": {
    name: "Qingque",
    type: "Erudition",
    base: { HPDelta: 1023, AttackDelta: 652, DefenceDelta: 441 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1108": {
    name: "Sampo",
    type: "Nihility",
    base: { HPDelta: 1023, AttackDelta: 617, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 1,
    },
  },
  "1102": {
    name: "Seele",
    type: "The Hunt",
    base: { HPDelta: 931, AttackDelta: 640, DefenceDelta: 363 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1103": {
    name: "Serval",
    type: "Erudition",
    base: { HPDelta: 917, AttackDelta: 652, DefenceDelta: 374 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1206": {
    name: "Sushang",
    type: "The Hunt",
    base: { HPDelta: 917, AttackDelta: 564, DefenceDelta: 418 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
      "BreakDamageAddedRatio": 0.24,
    },
  },
  "1202": {
    name: "Tingyun",
    type: "Harmony",
    base: { HPDelta: 846, AttackDelta: 529, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "AttackAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "8002": {
    name: "Trailblazer (Destruction)",
    type: "Destruction",
    base: { HPDelta: 1203, AttackDelta: 620, DefenceDelta: 460 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "8004": {
    name: "Trailblazer (Preservation)",
    type: "Preservation",
    base: { HPDelta: 1241, AttackDelta: 601, DefenceDelta: 606 },
    weights: {
      "SpeedDelta": 1,
      "DefenceAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  "1004": {
    name: "Welt",
    type: "Nihility",
    base: { HPDelta: 1125, AttackDelta: 620, DefenceDelta: 509 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  "1209": {
    name: "Yanqing",
    type: "The Hunt",
    base: { HPDelta: 892, AttackDelta: 679, DefenceDelta: 412 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
};

export default HSR_CHARACTERS;
