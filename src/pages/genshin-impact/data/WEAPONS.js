const WEAPONS = {
  // Version 5.3
  "A Thousand Blazing Suns": {
    type: "Claymore",
    base: { ATK: 741 },
    stats: { "CRIT Rate": 11 },
    thresholds: {},
    limits: {},
  },
  
  "Starcaller's Watch": {
    type: "Catalyst",
    base: { ATK: 542 },
    stats: { "Elemental Mastery": 265 },
    thresholds: {},
    limits: {},
  },
  
  // Version 5.2
  "Astral Vulture's Crimson Plumage": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2 },
    thresholds: {},
    limits: {},
  },
  
  "Calamity of Eshu": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Flower-Wreathed Feathers": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Waveriding Whirl": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
    thresholds: {},
    limits: {},
  },
  
  // Version 5.1
  "Fruitful Hook": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Mountain-Bracing Bolt": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  "Peak Patrol Song": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "DEF%": 82.7 },
    thresholds: {},
    limits: {},
  },
  
  "Sturdy Bone": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 5.0
  "Ash-Graven Drinking Horn": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Chain Breaker": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Earth Shaker": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Fang of the Mountain King": {
    type: "Claymore",
    base: { ATK: 741 },
    stats: { "CRIT Rate": 11 },
    thresholds: {},
    limits: {},
  },
  
  "Flute of Ezpitzal": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "DEF%": 69 },
    thresholds: {},
    limits: {},
  },
  
  "Footprint of the Rainbow": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "DEF%": 51.7 },
    thresholds: {},
    limits: {},
  },
  
  "Ring of Yaxche": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Surf's Up": {
    type: "Catalyst",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.8
  "Lumidouce Elegy": {
    type: "Polearm",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.7
  "Absolution": {
    type: "Sword",
    base: { ATK: 674 },
    stats: { "CRIT DMG": 44.1 },
    thresholds: {},
    limits: {},
  },
  
  "Cloudforged": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  "Silvershower Heartstrings": {
    type: "Bow",
    base: { ATK: 542 },
    stats: { "HP%": 66.2 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.6
  "Crimson Moon's Semblance": {
    type: "Polearm",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.5
  "Dialogues of the Desert Sages": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Uraku Misugiri": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.4
  "Crane's Echoing Call": {
    type: "Catalyst",
    base: { ATK: 741 },
    stats: { "ATK%": 16.5 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.3
  "Ultimate Overlord's Mega Magic Sword": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  "Verdict": {
    type: "Claymore",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.2
  "Splendor of Tranquil Waters": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
    thresholds: {},
    limits: {},
  },
  
  "Sword of Narzissenkreuz": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.1
  "Ballad of the Boundless Blue": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  "Cashflow Supervision": {
    type: "Catalyst",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
    thresholds: {},
    limits: {},
  },
  
  "Portable Power Saw": {
    type: "Claymore",
    base: { ATK: 454 },
    stats: { "HP%": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Prospector's Drill": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Range Gauge": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "The Dockhand's Assistant": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Tome of the Eternal Flow": {
    type: "Catalyst",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
    thresholds: {},
    limits: {},
  },
  
  // Version 4.0
  "Ballad of the Fjords": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Finale of the Deep": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Fleuve Cendre Ferryman": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
    thresholds: {},
    limits: {},
  },
  
  "Flowing Purity": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Rightful Reward": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "HP%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Sacrificial Jade": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "CRIT Rate": 36.8 },
    thresholds: {},
    limits: {},
  },
  
  "Scion of the Blazing Sun": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "CRIT Rate": 18.4 },
    thresholds: {},
    limits: {},
  },
  
  "Song of Stillness": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Talking Stick": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "CRIT Rate": 18.4 },
    thresholds: {},
    limits: {},
  },
  
  "The First Great Magic": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2 },
    thresholds: {},
    limits: {},
  },
  
  "Tidal Shadow": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Wolf-Fang": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  
  // Version 3.8
  
  // Version 3.7
  "Ibis Piercer": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 3.6
  "Jadefall's Splendor": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "HP%": 49.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 3.5
  "Beacon of the Reed Sea": {
    type: "Claymore",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
    thresholds: {},
    limits: {},
  },
  
  "Mailed Flower": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Elemental Mastery": 110 },
    thresholds: {},
    limits: {},
  },
  
  // Version 3.4
  "Light of Foliar Incision": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
    thresholds: {},
    limits: {},
  },
  
  // Version 3.3
  "Toukabou Shigure": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  "Tulaytullah's Remembrance": {
    type: "Catalyst",
    base: { ATK: 674 },
    stats: { "CRIT DMG": 44.1 },
    thresholds: {},
    limits: {},
  },
  
  // Version 3.2
  "A Thousand Floating Dreams": {
    type: "Catalyst",
    base: { ATK: 542 },
    stats: { "Elemental Mastery": 265 },
    thresholds: {},
    limits: {},
  },
  
  // Version 3.1
  "Key of Khaj-Nisut": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "HP%": 66.2 },
    thresholds: {},
    limits: {},
  },
  
  "Makhaira Aquamarine": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  "Missive Windspear": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Staff of the Scarlet Sands": {
    type: "Polearm",
    base: { ATK: 542 },
    stats: { "CRIT Rate": 44.1 },
    thresholds: {},
    limits: {},
  },
  
  "Wandering Evenstar": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  "Xiphos' Moonlight": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  // Version 3.0
  "End of the Line": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
    thresholds: {},
    limits: {},
  },
  
  "Forest Regalia": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  "Fruit of Fulfillment": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
    thresholds: {},
    limits: {},
  },
  
  "Hunter's Path": {
    type: "Bow",
    base: { ATK: 542 },
    stats: { "CRIT Rate": 44.1 },
    thresholds: {},
    limits: {},
  },
  
  "King's Squire": {
    type: "Bow",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Moonpiercer": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Elemental Mastery": 110 },
    thresholds: {},
    limits: {},
  },
  
  "Sapwood Blade": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.8
  "Kagotsurube Isshin": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.7
  "Aqua Simulacra": {
    type: "Bow",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
    thresholds: {},
    limits: {},
  },
  
  "Fading Twilight": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.6
  "Haran Geppaku Futsu": {
    type: "Sword",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.5
  "Kagura's Verity": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2 },
    thresholds: {},
    limits: {},
  },
  
  "Oathsworn Eye": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.4
  "Calamity Queller": {
    type: "Polearm",
    base: { ATK: 741 },
    stats: { "ATK%": 16.5 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.3
  "Cinnabar Spindle": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "DEF%": 69 },
    thresholds: {},
    limits: {},
  },
  
  "Redhorn Stonethresher": {
    type: "Claymore",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.2
  "Akuoumaru": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Mouun's Moon": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Polar Star": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
    thresholds: {},
    limits: {},
  },
  
  "Wavebreaker's Fin": {
    type: "Polearm",
    base: { ATK: 620 },
    stats: { "ATK%": 13.8 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.1
  "Engulfing Lightning": {
    type: "Polearm",
    base: { ATK: 608 },
    stats: { "Energy Recharge": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Everlasting Moonglow": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "HP%": 49.6 },
    thresholds: {},
    limits: {},
  },
  
  "Luxurious Sea-Lord": {
    type: "Claymore",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Predator": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "The Catch": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.0
  "Amenoma Kageuchi": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Hakushin Ring": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  "Hamayumi": {
    type: "Bow",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Katsuragikiri Nagamasa": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
    thresholds: {},
    limits: {},
  },
  
  "Kitain Cross Spear": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Elemental Mastery": 110 },
    thresholds: {},
    limits: {},
  },
  
  "Mistsplitter Reforged": {
    type: "Sword",
    base: { ATK: 674 },
    stats: { "CRIT DMG": 44.1 },
    thresholds: {},
    limits: {},
  },
  
  "Thundering Pulse": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.6
  "Dodoco Tales": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Freedom-Sworn": {
    type: "Sword",
    base: { ATK: 608 },
    stats: { "Elemental Mastery": 198 },
    thresholds: {},
    limits: {},
  },
  
  "Mitternachts Waltz": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Physical DMG": 51.7 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.5
  "Song of Broken Pines": {
    type: "Claymore",
    base: { ATK: 741 },
    stats: { "Physical DMG": 20.7 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.4
  "Alley Hunter": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Elegy for the End": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "Energy Recharge": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "The Alley Flash": {
    type: "Sword",
    base: { ATK: 620 },
    stats: { "Elemental Mastery": 55 },
    thresholds: {},
    limits: {},
  },
  
  "Windblume Ode": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  "Wine and Song": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.3
  "Lithic Blade": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Lithic Spear": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6},
    thresholds: {},
    limits: {},
  },
  
  "Primordial Jade Cutter": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "CRIT Rate": 44.1, "HP%": 20 },
    thresholds: {},
    limits: {},
  },
  
  "Staff of Homa": {
    type: "Polearm",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2, "HP%": 20 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.2
  "Dragonspine Spear": {
    type: "Polearm",
    base: { ATK: 454 },
    stats: { "Physical DMG": 69 },
    thresholds: {},
    limits: {},
  },
  
  "Festering Desire": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
    thresholds: {},
    limits: {},
  },
  
  "Frostbearer": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Snow-Tombed Starsilver": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Physical DMG": 34.5 },
    thresholds: {},
    limits: {},
  },
  
  "Summit Shaper": {
    type: "Sword",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.1
  "Memory of Dust": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
    thresholds: {},
    limits: {},
  },
  
  "Royal Spear": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "The Unforged": {
    type: "Claymore",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
    thresholds: {},
    limits: {},
  },
  
  "Vortex Vanquisher": {
    type: "Polearm",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.0
  "Amos' Bow": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
    thresholds: {},
    limits: {},
  },
  
  "Aquila Favonia": {
    type: "Sword",
    base: { ATK: 674 },
    stats: { "Physical DMG": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Black Tassel": {
    type: "Polearm",
    base: { ATK: 354 },
    stats: { hp: 46.9 },
    thresholds: {},
    limits: {},
  },
  
  "Blackcliff Agate": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "CRIT DMG": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Blackcliff Longsword": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "CRIT DMG": 36.8 },
    thresholds: {},
    limits: {},
  },
  
  "Blackcliff Pole": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "CRIT DMG": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Blackcliff Slasher": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "CRIT DMG": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Blackcliff Warbow": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "CRIT DMG": 36.8 },
    thresholds: {},
    limits: {},
  },
  
  "Bloodtainted Greatsword": {
    type: "Claymore",
    base: { ATK: 354 },
    stats: { "Elemental Mastery": 187 },
    thresholds: {},
    limits: {},
  },
  
  "Compound Bow": {
    type: "Bow",
    base: { ATK: 454 },
    stats: { "Physical DMG": 69 },
    thresholds: {},
    limits: {},
  },
  
  "Cool Steel": {
    type: "Sword",
    base: { ATK: 401 },
    stats: { "ATK%": 35.2 },
    thresholds: {},
    limits: {},
  },
  
  "Crescent Pike": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Physical DMG": 34.5 },
    thresholds: {},
    limits: {},
  },
  
  "Dark Iron Sword": {
    type: "Sword",
    base: { ATK: 401 },
    stats: { "Elemental Mastery": 141 },
    thresholds: {},
    limits: {},
  },
  
  "Deathmatch": {
    type: "Polearm",
    base: { ATK: 454 },
    stats: { "CRIT Rate": 36.8 },
    thresholds: {},
    limits: {},
  },
  
  "Debate Club": {
    type: "Claymore",
    base: { ATK: 401 },
    stats: { "ATK%": 35.2 },
    thresholds: {},
    limits: {},
  },
  
  "Dragon's Bane": {
    type: "Polearm",
    base: { ATK: 454 },
    stats: { "Elemental Mastery": 221 },
    thresholds: {},
    limits: {},
  },
  
  "Emerald Orb": {
    type: "Catalyst",
    base: { ATK: 448 },
    stats: { "Elemental Mastery": 94 },
    thresholds: {},
    limits: {},
  },
  
  "Eye of Perception": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Favonius Codex": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
    thresholds: {},
    limits: {},
  },
  
  "Favonius Greatsword": {
    type: "Claymore",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
    thresholds: {},
    limits: {},
  },
  
  "Favonius Lance": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  "Favonius Sword": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
    thresholds: {},
    limits: {},
  },
  
  "Favonius Warbow": {
    type: "Bow",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
    thresholds: {},
    limits: {},
  },
  
  "Ferrous Shadow": {
    type: "Claymore",
    base: { ATK: 401 },
    stats: { "HP%": 35.2 },
    thresholds: {},
    limits: {},
  },
  
  "Fillet Blade": {
    type: "Sword",
    base: { ATK: 401 },
    stats: { "ATK%": 35.2 },
    thresholds: {},
    limits: {},
  },
  
  "Halberd": {
    type: "Polearm",
    base: { ATK: 448 },
    stats: { "ATK%": 23.5 },
    thresholds: {},
    limits: {},
  },
  
  "Harbinger of Dawn": {
    type: "Sword",
    base: { ATK: 401 },
    stats: { "CRIT DMG": 46.9 },
    thresholds: {},
    limits: {},
  },
  
  "Iron Sting": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  "Lion's Roar": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Lost Prayer to the Sacred Winds": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
    thresholds: {},
    limits: {},
  },
  
  "Magic Guide": {
    type: "Catalyst",
    base: { ATK: 354 },
    stats: { "Elemental Mastery": 187 },
    thresholds: {},
    limits: {},
  },
  
  "Mappa Mare": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "Elemental Mastery": 110 },
    thresholds: {},
    limits: {},
  },
  
  "Messenger": {
    type: "Bow",
    base: { ATK: 448 },
    stats: { "CRIT Rate": 31.2 },
    thresholds: {},
    limits: {},
  },
  
  "Otherworldly Story": {
    type: "Catalyst",
    base: { ATK: 401 },
    stats: { "Energy Recharge": 39 },
    thresholds: {},
    limits: {},
  },
  
  "Primordial Jade Winged-Spear": {
    type: "Polearm",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
    thresholds: {},
    limits: {},
  },
  
  "Prototype Amber": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Prototype Archaic": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Prototype Crescent": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Prototype Rancour": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "Physical DMG": 34.5 },
    thresholds: {},
    limits: {},
  },
  
  "Prototype Starglitter": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
    thresholds: {},
    limits: {},
  },
  
  "Rainslasher": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  "Raven Bow": {
    type: "Bow",
    base: { ATK: 448 },
    stats: { "Elemental Mastery": 94 },
    thresholds: {},
    limits: {},
  },
  
  "Recurve Bow": {
    type: "Bow",
    base: { ATK: 354 },
    stats: { "HP%": 46.9 },
    thresholds: {},
    limits: {},
  },
  
  "Royal Bow": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Royal Greatsword": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Royal Grimoire": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Royal Longsword": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Rust": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "Sacrificial Bow": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  "Sacrificial Fragments": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "Elemental Mastery": 221 },
    thresholds: {},
    limits: {},
  },
  
  "Sacrificial Greatsword": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
    thresholds: {},
    limits: {},
  },
  
  "Sacrificial Sword": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
    thresholds: {},
    limits: {},
  },
  
  "Serpent Spine": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Sharpshooter's Oath": {
    type: "Bow",
    base: { ATK: 401 },
    stats: { "CRIT DMG": 46.9 },
    thresholds: {},
    limits: {},
  },
  
  "Skyrider Greatsword": {
    type: "Claymore",
    base: { ATK: 401 },
    stats: { "Physical DMG": 43.9 },
    thresholds: {},
    limits: {},
  },
  
  "Skyrider Sword": {
    type: "Sword",
    base: { ATK: 354 },
    stats: { "Energy Recharge": 52.1 },
    thresholds: {},
    limits: {},
  },
  
  "Skyward Atlas": {
    type: "Catalyst",
    base: { ATK: 674 },
    stats: { "ATK%": 33.1 },
    thresholds: {},
    limits: {},
  },
  
  "Skyward Blade": {
    type: "Sword",
    base: { ATK: 608 },
    stats: { "Energy Recharge": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Skyward Harp": {
    type: "Bow",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
    thresholds: {},
    limits: {},
  },
  
  "Skyward Pride": {
    type: "Claymore",
    base: { ATK: 674 },
    stats: { "Energy Recharge": 36.8 },
    thresholds: {},
    limits: {},
  },
  
  "Skyward Spine": {
    type: "Polearm",
    base: { ATK: 674 },
    stats: { "Energy Recharge": 36.8 },
    thresholds: {},
    limits: {},
  },
  
  "Slingshot": {
    type: "Bow",
    base: { ATK: 354 },
    stats: { "CRIT Rate": 31.2 },
    thresholds: {},
    limits: {},
  },
  
  "Solar Pearl": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "Sword of Descension": {
    type: "Sword",
    base: { ATK: 440 },
    stats: { "ATK%": 35.2 },
    thresholds: {},
    limits: {},
  },
  
  "The Bell": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "The Black Sword": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "The Flute": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
    thresholds: {},
    limits: {},
  },
  
  "The Stringless": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
    thresholds: {},
    limits: {},
  },
  
  "The Viridescent Hunt": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
    thresholds: {},
    limits: {},
  },
  
  "The Widsith": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "CRIT DMG": 55.1 },
    thresholds: {},
    limits: {},
  },
  
  "Thrilling Tales of Dragon Slayers": {
    type: "Catalyst",
    base: { ATK: 401 },
    stats: { "HP%": 35.2 },
    thresholds: {},
    limits: {},
  },
  
  "Traveler's Handy Sword": {
    type: "Sword",
    base: { ATK: 448 },
    stats: { "DEF%": 29.3 },
    thresholds: {},
    limits: {},
  },
  
  "Twin Nephrite": {
    type: "Catalyst",
    base: { ATK: 448 },
    stats: { "CRIT Rate": 15.6 },
    thresholds: {},
    limits: {},
  },
  
  "White Iron Greatsword": {
    type: "Claymore",
    base: { ATK: 401 },
    stats: { "DEF%": 43.9 },
    thresholds: {},
    limits: {},
  },
  
  "White Tassel": {
    type: "Polearm",
    base: { ATK: 401 },
    stats: { "CRIT Rate": 23.4 },
    thresholds: {},
    limits: {},
  },
  
  "Whiteblind": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "DEF%": 51.7 },
    thresholds: {},
    limits: {},
  },
  
  "Wolf's Gravestone": {
    type: "Claymore",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
    thresholds: {},
    limits: {},
  },
};

export default WEAPONS;
