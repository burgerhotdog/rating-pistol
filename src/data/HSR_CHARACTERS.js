const HSR_CHARACTERS = {
  /*// Version 3.1
  [`Mydei`]: {
    type: "Destruction",
    base: { HPDelta: 1000, AttackDelta: 100, DefenceDelta: 100 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "HPAddedRatio": 0.6,
    },
  },

  [`Tribbie`]: {
    type: "Harmony",
    base: { HPDelta: 1000, AttackDelta: 100, DefenceDelta: 100 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "HPAddedRatio": 0.6,
    },
  },*/

  // Version 3.0
  [`Aglaea`]: {
    type: "Remembrance",
    base: { HPDelta: 1242, AttackDelta: 699, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },

  [`The Herta`]: {
    type: "Erudition",
    base: { HPDelta: 1164, AttackDelta: 679, DefenceDelta: 485 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },

  [`Trailblazer (Remembrance)`]: {
    type: "Remembrance",
    base: { HPDelta: 1047, AttackDelta: 543, DefenceDelta: 630 },
    weights: {
      "SpeedDelta": 1,
      "CriticalDamage": 0.6,
      "AttackAddedRatio": 0.24,
    },
  },

  // Version 2.7
  [`Sunday`]: {
    type: "Harmony",
    base: { HPDelta: 1241, AttackDelta: 640, DefenceDelta: 533 },
    weights: {
      "SpeedDelta": 1,
      "CriticalDamage": 0.6,
      "StatusResistance": 0.24,
    },
  },
  
  [`Fugue`]: {
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
  [`Rappa`]: {
    type: "Erudition",
    base: { HPDelta: 1086, AttackDelta: 717, DefenceDelta: 460 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 2.5
  [`Feixiao`]: {
    type: "The Hunt",
    base: { HPDelta: 1047, AttackDelta: 601, DefenceDelta: 388 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Lingsha`]: {
    type: "Abundance",
    base: { HPDelta: 1358, AttackDelta: 679, DefenceDelta: 436 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "AttackAddedRatio": 0.6,
      "StatusResistance": 0.24,
    },
  },
  
  [`Moze`]: {
    type: "The Hunt",
    base: { HPDelta: 811, AttackDelta: 599, DefenceDelta: 352 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 2.4
  [`Jiaoqiu`]: {
    type: "Nihility",
    base: { HPDelta: 1358, AttackDelta: 601, DefenceDelta: 509 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`March 7th (The Hunt)`]: {
    type: "The Hunt",
    base: { HPDelta: 1058, AttackDelta: 564, DefenceDelta: 441 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Yunli`]: {
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
  [`Firefly`]: {
    type: "Destruction",
    base: { HPDelta: 814, AttackDelta: 523, DefenceDelta: 776 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Jade`]: {
    type: "Erudition",
    base: { HPDelta: 1086, AttackDelta: 659, DefenceDelta: 509 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  // Version 2.2
  [`Boothill`]: {
    type: "The Hunt",
    base: { HPDelta: 1203, AttackDelta: 620, DefenceDelta: 436 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
    },
  },
  
  [`Robin`]: {
    type: "Harmony",
    base: { HPDelta: 1280, AttackDelta: 640, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "AttackAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },

  [`Trailblazer (Harmony)`]: {
    type: "Harmony",
    base: { HPDelta: 1086, AttackDelta: 446, DefenceDelta: 679 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 2.1
  [`Acheron`]: {
    type: "Nihility",
    base: { HPDelta: 1125, AttackDelta: 698, DefenceDelta: 436 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Aventurine`]: {
    type: "Preservation",
    base: { HPDelta: 1203, AttackDelta: 446, DefenceDelta: 654 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "DefenceAddedRatio": 0.6,
    },
  },
  
  [`Gallagher`]: {
    type: "Abundance",
    base: { HPDelta: 1305, AttackDelta: 529, DefenceDelta: 441 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 0.9,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 2.0
  [`Black Swan`]: {
    type: "Nihility",
    base: { HPDelta: 1086, AttackDelta: 659, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 1,
    },
  },
  
  [`Misha`]: {
    type: "Destruction",
    base: { HPDelta: 1270, AttackDelta: 599, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Sparkle`]: {
    type: "Harmony",
    base: { HPDelta: 1397, AttackDelta: 523, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "CriticalDamage": 0.6,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 1.6
  [`Dr. Ratio`]: {
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
  
  [`Ruan Mei`]: {
    type: "Harmony",
    base: { HPDelta: 1086, AttackDelta: 659, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "BreakDamageAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Xueyi`]: {
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
  [`Argenti`]: {
    type: "Erudition",
    base: { HPDelta: 1047, AttackDelta: 737, DefenceDelta: 363 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Hanya`]: {
    type: "Harmony",
    base: { HPDelta: 917, AttackDelta: 564, DefenceDelta: 352 },
    weights: {
      "SpeedDelta": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Huohuo`]: {
    type: "Abundance",
    base: { HPDelta: 1358, AttackDelta: 601, DefenceDelta: 509 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 1.4
  [`Guinaifen`]: {
    type: "Nihility",
    base: { HPDelta: 882, AttackDelta: 582, DefenceDelta: 441 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Jingliu`]: {
    type: "Destruction",
    base: { HPDelta: 1435, AttackDelta: 679, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Topaz & Numby`]: {
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
  [`Dan Heng • Imbibitor Lunae`]: {
    type: "Destruction",
    base: { HPDelta: 1241, AttackDelta: 698, DefenceDelta: 363 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Fu Xuan`]: {
    type: "Preservation",
    base: { HPDelta: 1474, AttackDelta: 465, DefenceDelta: 606 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "DefenceAddedRatio": 0.6,
      "StatusResistance": 0.24,
    },
  },
  
  [`Lynx`]: {
    type: "Abundance",
    base: { HPDelta: 1058, AttackDelta: 493, DefenceDelta: 551 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 1.2
  [`Blade`]: {
    type: "Destruction",
    base: { HPDelta: 1358, AttackDelta: 543, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "HPAddedRatio": 0.6,
    },
  },
  
  [`Kafka`]: {
    type: "Nihility",
    base: { HPDelta: 1086, AttackDelta: 679, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 1,
    },
  },
  
  [`Luka`]: {
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
  [`Luocha`]: {
    type: "Abundance",
    base: { HPDelta: 1280, AttackDelta: 756, DefenceDelta: 363 },
    weights: {
      "SpeedDelta": 1,
      "AttackAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Silver Wolf`]: {
    type: "Nihility",
    base: { HPDelta: 1047, AttackDelta: 640, DefenceDelta: 460 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Yukong`]: {
    type: "Harmony",
    base: { HPDelta: 917, AttackDelta: 599, DefenceDelta: 374 },
    weights: {
      "SpeedDelta": 1,
      "StatusResistance": 0.24,
    },
  },
  
  // Version 1.0
  [`Arlan`]: {
    type: "Destruction",
    base: { HPDelta: 1199, AttackDelta: 599, DefenceDelta: 330 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Asta`]: {
    type: "Harmony",
    base: { HPDelta: 1023, AttackDelta: 511, DefenceDelta: 463 },
    weights: {
      "SpeedDelta": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Bailu`]: {
    type: "Abundance",
    base: { HPDelta: 1319, AttackDelta: 562, DefenceDelta: 485 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Bronya`]: {
    type: "Harmony",
    base: { HPDelta: 1241, AttackDelta: 582, DefenceDelta: 533 },
    weights: {
      "SpeedDelta": 1,
      "CriticalDamage": 0.6,
      "StatusResistance": 0.24,
    },
  },
  
  [`Clara`]: {
    type: "Destruction",
    base: { HPDelta: 1241, AttackDelta: 737, DefenceDelta: 485 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Dan Heng`]: {
    type: "The Hunt",
    base: { HPDelta: 882, AttackDelta: 546, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Gepard`]: {
    type: "Preservation",
    base: { HPDelta: 1397, AttackDelta: 543, DefenceDelta: 654 },
    weights: {
      "SpeedDelta": 1,
      "DefenceAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Herta`]: {
    type: "Erudition",
    base: { HPDelta: 952, AttackDelta: 582, DefenceDelta: 396 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Himeko`]: {
    type: "Erudition",
    base: { HPDelta: 1047, AttackDelta: 756, DefenceDelta: 436 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Hook`]: {
    type: "Destruction",
    base: { HPDelta: 1340, AttackDelta: 617, DefenceDelta: 352 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Jing Yuan`]: {
    type: "Erudition",
    base: { HPDelta: 1164, AttackDelta: 698, DefenceDelta: 485 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`March 7th (Preservation)`]: {
    type: "Preservation",
    base: { HPDelta: 1058, AttackDelta: 511, DefenceDelta: 573 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "DefenceAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Natasha`]: {
    type: "Abundance",
    base: { HPDelta: 1164, AttackDelta: 476, DefenceDelta: 507 },
    weights: {
      "SpeedDelta": 1,
      "HPAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Pela`]: {
    type: "Nihility",
    base: { HPDelta: 987, AttackDelta: 546, DefenceDelta: 463 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Qingque`]: {
    type: "Erudition",
    base: { HPDelta: 1023, AttackDelta: 652, DefenceDelta: 441 },
    weights: {
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Sampo`]: {
    type: "Nihility",
    base: { HPDelta: 1023, AttackDelta: 617, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "StatusProbability": 1,
      "AttackAddedRatio": 1,
    },
  },
  
  [`Seele`]: {
    type: "The Hunt",
    base: { HPDelta: 931, AttackDelta: 640, DefenceDelta: 363 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Serval`]: {
    type: "Erudition",
    base: { HPDelta: 917, AttackDelta: 652, DefenceDelta: 374 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },
  
  [`Sushang`]: {
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
  
  [`Tingyun`]: {
    type: "Harmony",
    base: { HPDelta: 846, AttackDelta: 529, DefenceDelta: 396 },
    weights: {
      "SpeedDelta": 1,
      "AttackAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },

  [`Trailblazer (Destruction)`]: {
    type: "Destruction",
    base: { HPDelta: 1203, AttackDelta: 620, DefenceDelta: 460 },
    weights: {
      "SpeedDelta": 1,
      "CriticalChance": 1,
      "CriticalDamage": 1,
      "AttackAddedRatio": 0.6,
    },
  },

  [`Trailblazer (Preservation)`]: {
    type: "Preservation",
    base: { HPDelta: 1241, AttackDelta: 601, DefenceDelta: 606 },
    weights: {
      "SpeedDelta": 1,
      "DefenceAddedRatio": 1,
      "StatusResistance": 0.24,
    },
  },
  
  [`Welt`]: {
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
  
  [`Yanqing`]: {
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
