const CHARACTERS = {
  /*// Version 3.1
  "Mydei": {
    type: "Destruction",
    base: { HP: 1000, ATK: 100, DEF: 100 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.6,
    },
  },

  "Tribbie": {
    type: "Harmony",
    base: { HP: 1000, ATK: 100, DEF: 100 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.6,
    },
  },*/

  // Version 3.0
  "Aglaea": {
    type: "Remembrance",
    base: { HP: 1242, ATK: 699, DEF: 485 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },

  "The Herta": {
    type: "Erudition",
    base: { HP: 1164, ATK: 679, DEF: 485 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },

  "Trailblazer (Remembrance)": {
    type: "Remembrance",
    base: { HP: 1047, ATK: 543, DEF: 630 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },

  // Version 2.7
  "Sunday": {
    type: "Harmony",
    base: { HP: 1241, ATK: 640, DEF: 533 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Fugue": {
    type: "Nihility",
    base: { HP: 1125, ATK: 582, DEF: 557 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.6
  "Rappa": {
    type: "Erudition",
    base: { HP: 1086, ATK: 717, DEF: 460 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.5
  "Feixiao": {
    type: "The Hunt",
    base: { HP: 1047, ATK: 601, DEF: 388 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Lingsha": {
    type: "Abundance",
    base: { HP: 1358, ATK: 679, DEF: 436 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Moze": {
    type: "The Hunt",
    base: { HP: 811, ATK: 599, DEF: 352 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 2.4
  "Jiaoqiu": {
    type: "Nihility",
    base: { HP: 1358, ATK: 601, DEF: 509 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "March 7th (The Hunt)": {
    type: "The Hunt",
    base: { HP: 1058, ATK: 564, DEF: 441 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Yunli": {
    type: "Destruction",
    base: { HP: 1358, ATK: 679, DEF: 460 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 2.3
  "Firefly": {
    type: "Destruction",
    base: { HP: 814, ATK: 523, DEF: 776 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Jade": {
    type: "Erudition",
    base: { HP: 1086, ATK: 659, DEF: 509 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 2.2
  "Boothill": {
    type: "The Hunt",
    base: { HP: 1203, ATK: 620, DEF: 436 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Robin": {
    type: "Harmony",
    base: { HP: 1280, ATK: 640, DEF: 485 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },

  "Trailblazer (Harmony)": {
    type: "Harmony",
    base: { HP: 1086, ATK: 446, DEF: 679 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.1
  "Acheron": {
    type: "Nihility",
    base: { HP: 1125, ATK: 698, DEF: 436 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Aventurine": {
    type: "Preservation",
    base: { HP: 1203, ATK: 446, DEF: 654 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Gallagher": {
    type: "Abundance",
    base: { HP: 1305, ATK: 529, DEF: 441 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 2.0
  "Black Swan": {
    type: "Nihility",
    base: { HP: 1086, ATK: 659, DEF: 485 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Misha": {
    type: "Destruction",
    base: { HP: 1270, ATK: 599, DEF: 396 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Sparkle": {
    type: "Harmony",
    base: { HP: 1397, ATK: 523, DEF: 485 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.6
  "Dr. Ratio": {
    type: "The Hunt",
    base: { HP: 1047, ATK: 776, DEF: 460 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Ruan Mei": {
    type: "Harmony",
    base: { HP: 1086, ATK: 659, DEF: 485 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Xueyi": {
    type: "Destruction",
    base: { HP: 1058, ATK: 599, DEF: 396 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 1.5
  "Argenti": {
    type: "Erudition",
    base: { HP: 1047, ATK: 737, DEF: 363 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Hanya": {
    type: "Harmony",
    base: { HP: 917, ATK: 564, DEF: 352 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Huohuo": {
    name: "Huohuo",
    type: "Abundance",
    base: { HP: 1358, ATK: 601, DEF: 509 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.4
  "Guinaifen": {
    type: "Nihility",
    base: { HP: 882, ATK: 582, DEF: 441 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Jingliu": {
    type: "Destruction",
    base: { HP: 1435, ATK: 679, DEF: 485 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Topaz & Numby": {
    type: "The Hunt",
    base: { HP: 931, ATK: 620, DEF: 412 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  // Version 1.3
  "Dan Heng • Imbibitor Lunae": {
    type: "Destruction",
    base: { HP: 1241, ATK: 698, DEF: 363 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Fu Xuan": {
    type: "Preservation",
    base: { HP: 1474, ATK: 465, DEF: 606 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Lynx": {
    type: "Abundance",
    base: { HP: 1058, ATK: 493, DEF: 551 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.2
  "Blade": {
    type: "Destruction",
    base: { HP: 1358, ATK: 543, DEF: 485 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.6,
    },
  },
  
  "Kafka": {
    type: "Nihility",
    base: { HP: 1086, ATK: 679, DEF: 485 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Luka": {
    type: "Nihility",
    base: { HP: 917, ATK: 582, DEF: 485 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.1
  "Luocha": {
    type: "Abundance",
    base: { HP: 1280, ATK: 756, DEF: 363 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Silver Wolf": {
    type: "Nihility",
    base: { HP: 1047, ATK: 640, DEF: 460 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Yukong": {
    type: "Harmony",
    base: { HP: 917, ATK: 599, DEF: 374 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  // Version 1.0
  "Arlan": {
    type: "Destruction",
    base: { HP: 1199, ATK: 599, DEF: 330 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Asta": {
    type: "Harmony",
    base: { HP: 1023, ATK: 511, DEF: 463 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Bailu": {
    type: "Abundance",
    base: { HP: 1319, ATK: 562, DEF: 485 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Bronya": {
    type: "Harmony",
    base: { HP: 1241, ATK: 582, DEF: 533 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Clara": {
    type: "Destruction",
    base: { HP: 1241, ATK: 737, DEF: 485 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Dan Heng": {
    type: "The Hunt",
    base: { HP: 882, ATK: 546, DEF: 396 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Gepard": {
    type: "Preservation",
    base: { HP: 1397, ATK: 543, DEF: 654 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Herta": {
    type: "Erudition",
    base: { HP: 952, ATK: 582, DEF: 396 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Himeko": {
    type: "Erudition",
    base: { HP: 1047, ATK: 756, DEF: 436 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Hook": {
    type: "Destruction",
    base: { HP: 1340, ATK: 617, DEF: 352 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Jing Yuan": {
    type: "Erudition",
    base: { HP: 1164, ATK: 698, DEF: 485 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "March 7th (Preservation)": {
    type: "Preservation",
    base: { HP: 1058, ATK: 511, DEF: 573 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Natasha": {
    type: "Abundance",
    base: { HP: 1164, ATK: 476, DEF: 507 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Pela": {
    type: "Nihility",
    base: { HP: 987, ATK: 546, DEF: 463 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
    },
  },
  
  "Qingque": {
    type: "Erudition",
    base: { HP: 1023, ATK: 652, DEF: 441 },
    includeSpd: false,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Sampo": {
    type: "Nihility",
    base: { HP: 1023, ATK: 617, DEF: 396 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "ATK%": 1,
    },
  },
  
  "Seele": {
    type: "The Hunt",
    base: { HP: 931, ATK: 640, DEF: 363 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Serval": {
    type: "Erudition",
    base: { HP: 917, ATK: 652, DEF: 374 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Sushang": {
    type: "The Hunt",
    base: { HP: 917, ATK: 564, DEF: 418 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Tingyun": {
    type: "Harmony",
    base: { HP: 846, ATK: 529, DEF: 396 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "ATK%": 1,
    },
  },

  "Trailblazer (Destruction)": {
    type: "Destruction",
    base: { HP: 1203, ATK: 620, DEF: 460 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },

  "Trailblazer (Preservation)": {
    type: "Preservation",
    base: { HP: 1241, ATK: 601, DEF: 606 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Welt": {
    type: "Nihility",
    base: { HP: 1125, ATK: 620, DEF: 509 },
    includeSpd: true,
    includeEhr: true,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
  
  "Yanqing": {
    type: "The Hunt",
    base: { HP: 892, ATK: 679, DEF: 412 },
    includeSpd: true,
    includeEhr: false,
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.6,
    },
  },
};

export default CHARACTERS;
