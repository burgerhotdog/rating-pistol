const CHARACTERS = {
  // Version 3.0
  "Aglaea": {
    type: "Remembrance",
    base: { HP: 1242, ATK: 699, DEF: 485, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "The Herta": {
    type: "Erudition",
    base: { HP: 1164, ATK: 679, DEF: 485, SPD: 99 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Trailblazer (Remembrance)": {
    type: "Remembrance",
    base: { HP: 1047, ATK: 543, DEF: 630, SPD: 103 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  // Version 2.7
  "Sunday": {
    type: "Harmony",
    base: { HP: 1241, ATK: 640, DEF: 533, SPD: 96 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Fugue": {
    type: "Nihility",
    base: { HP: 1125, ATK: 582, DEF: 557, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.6
  "Rappa": {
    type: "Erudition",
    base: { HP: 1086, ATK: 717, DEF: 460, SPD: 96 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.5
  "Feixiao": {
    type: "The Hunt",
    base: { HP: 1047, ATK: 601, DEF: 388, SPD: 112 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lingsha": {
    type: "Abundance",
    base: { HP: 1358, ATK: 679, DEF: 436, SPD: 98 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Moze": {
    type: "The Hunt",
    base: { HP: 811, ATK: 599, DEF: 352, SPD: 111 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.4
  "Jiaoqiu": {
    type: "Nihility",
    base: { HP: 1358, ATK: 601, DEF: 509, SPD: 98 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "March 7th (The Hunt)": {
    type: "The Hunt",
    base: { HP: 1058, ATK: 564, DEF: 441, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yunli": {
    type: "Destruction",
    base: { HP: 1358, ATK: 679, DEF: 460, SPD: 94 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.3
  "Firefly": {
    type: "Destruction",
    base: { HP: 814, ATK: 523, DEF: 776, SPD: 104 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Jade": {
    type: "Erudition",
    base: { HP: 1086, ATK: 659, DEF: 509, SPD: 103 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.2
  "Boothill": {
    type: "The Hunt",
    base: { HP: 1203, ATK: 620, DEF: 436, SPD: 107 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Robin": {
    type: "Harmony",
    base: { HP: 1280, ATK: 640, DEF: 485, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Trailblazer (Harmony)": {
    type: "Harmony",
    base: { HP: 1086, ATK: 446, DEF: 679, SPD: 105 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.1
  "Acheron": {
    type: "Nihility",
    base: { HP: 1125, ATK: 698, DEF: 436, SPD: 101 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Aventurine": {
    type: "Preservation",
    base: { HP: 1203, ATK: 446, DEF: 654, SPD: 106 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Gallagher": {
    type: "Abundance",
    base: { HP: 1305, ATK: 529, DEF: 441, SPD: 98 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.0
  "Black Swan": {
    type: "Nihility",
    base: { HP: 1086, ATK: 659, DEF: 485, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Misha": {
    type: "Destruction",
    base: { HP: 1270, ATK: 599, DEF: 396, SPD: 96 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Sparkle": {
    type: "Harmony",
    base: { HP: 1397, ATK: 523, DEF: 485, SPD: 101 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.6
  "Dr. Ratio": {
    type: "The Hunt",
    base: { HP: 1047, ATK: 776, DEF: 460, SPD: 103 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Ruan Mei": {
    type: "Harmony",
    base: { HP: 1086, ATK: 659, DEF: 485, SPD: 104 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Xueyi": {
    type: "Destruction",
    base: { HP: 1058, ATK: 599, DEF: 396, SPD: 103 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.5
  "Argenti": {
    type: "Erudition",
    base: { HP: 1047, ATK: 737, DEF: 363, SPD: 103 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Hanya": {
    type: "Harmony",
    base: { HP: 917, ATK: 564, DEF: 352, SPD: 110 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Huohuo": {
    name: "Huohuo",
    type: "Abundance",
    base: { HP: 1358, ATK: 601, DEF: 509, SPD: 98 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.4
  "Guinaifen": {
    type: "Nihility",
    base: { HP: 882, ATK: 582, DEF: 441, SPD: 106 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Jingliu": {
    type: "Destruction",
    base: { HP: 1435, ATK: 679, DEF: 485, SPD: 96 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Topaz & Numby": {
    type: "The Hunt",
    base: { HP: 931, ATK: 620, DEF: 412, SPD: 110 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.3
  "Dan Heng • Imbibitor Lunae": {
    type: "Destruction",
    base: { HP: 1241, ATK: 698, DEF: 363, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Fu Xuan": {
    type: "Preservation",
    base: { HP: 1474, ATK: 465, DEF: 606, SPD: 100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lynx": {
    type: "Abundance",
    base: { HP: 1058, ATK: 493, DEF: 551, SPD: 100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.2
  "Blade": {
    type: "Destruction",
    base: { HP: 1358, ATK: 543, DEF: 485, SPD: 97 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Kafka": {
    type: "Nihility",
    base: { HP: 1086, ATK: 679, DEF: 485, SPD: 100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Luka": {
    type: "Nihility",
    base: { HP: 917, ATK: 582, DEF: 485, SPD: 103 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.1
  "Luocha": {
    type: "Abundance",
    base: { HP: 1280, ATK: 756, DEF: 363, SPD: 101 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Silver Wolf": {
    type: "Nihility",
    base: { HP: 1047, ATK: 640, DEF: 460, SPD: 107 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yukong": {
    type: "Harmony",
    base: { HP: 917, ATK: 599, DEF: 374, SPD: 107 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.0
  "Arlan": {
    type: "Destruction",
    base: { HP: 1199, ATK: 599, DEF: 330, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Asta": {
    type: "Harmony",
    base: { HP: 1023, ATK: 511, DEF: 463, SPD: 106 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Bailu": {
    type: "Abundance",
    base: { HP: 1319, ATK: 562, DEF: 485, SPD: 98 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Bronya": {
    type: "Harmony",
    base: { HP: 1241, ATK: 582, DEF: 533, SPD: 99 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Clara": {
    type: "Destruction",
    base: { HP: 1241, ATK: 737, DEF: 485, SPD: 90 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Dan Heng": {
    type: "The Hunt",
    base: { HP: 882, ATK: 546, DEF: 396, SPD: 110 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Gepard": {
    type: "Preservation",
    base: { HP: 1397, ATK: 543, DEF: 654, SPD: 92 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Herta": {
    type: "Erudition",
    base: { HP: 952, ATK: 582, DEF: 396, SPD: 100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Himeko": {
    type: "Erudition",
    base: { HP: 1047, ATK: 756, DEF: 436, SPD: 96 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Hook": {
    type: "Destruction",
    base: { HP: 1340, ATK: 617, DEF: 352, SPD: 94 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Jing Yuan": {
    type: "Erudition",
    base: { HP: 1164, ATK: 698, DEF: 485, SPD: 99 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "March 7th (Preservation)": {
    type: "Preservation",
    base: { HP: 1058, ATK: 511, DEF: 573, SPD: 101 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Natasha": {
    type: "Abundance",
    base: { HP: 1164, ATK: 476, DEF: 507, SPD: 98 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Pela": {
    type: "Nihility",
    base: { HP: 987, ATK: 546, DEF: 463, SPD: 105 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Qingque": {
    type: "Erudition",
    base: { HP: 1023, ATK: 652, DEF: 441, SPD: 98 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Sampo": {
    type: "Nihility",
    base: { HP: 1023, ATK: 617, DEF: 396, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Seele": {
    type: "The Hunt",
    base: { HP: 931, ATK: 640, DEF: 363, SPD: 115 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Serval": {
    type: "Erudition",
    base: { HP: 917, ATK: 652, DEF: 374, SPD: 104 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Sushang": {
    type: "The Hunt",
    base: { HP: 917, ATK: 564, DEF: 418, SPD: 107 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Tingyun": {
    type: "Harmony",
    base: { HP: 846, ATK: 529, DEF: 396, SPD: 112 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Trailblazer (Destruction)": {
    type: "Destruction",
    base: { HP: 1203, ATK: 620, DEF: 460, SPD: 100 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Trailblazer (Preservation)": {
    type: "Preservation",
    base: { HP: 1241, ATK: 601, DEF: 606, SPD: 95 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Welt": {
    type: "Nihility",
    base: { HP: 1125, ATK: 620, DEF: 509, SPD: 102 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yanqing": {
    type: "The Hunt",
    base: { HP: 892, ATK: 679, DEF: 412, SPD: 109 },
    stats: {},
    conditions: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
};

export default CHARACTERS;
