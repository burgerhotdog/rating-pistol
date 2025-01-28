const WEAPONS = {
  // Version 5.3
  "A Thousand Blazing Suns": {
    type: "Claymore",
    base: { ATK: 741 },
    stats: { "CRIT Rate": 11 },
  },
  
  "Starcaller's Watch": {
    type: "Catalyst",
    base: { ATK: 542 },
    stats: { "Elemental Mastery": 265 },
  },
  
  // Version 5.2
  "Astral Vulture's Crimson Plumage": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2 },
  },
  
  "Calamity of Eshu": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Flower-Wreathed Feathers": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Waveriding Whirl": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  // Version 5.1
  "Fruitful Hook": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Mountain-Bracing Bolt": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Peak Patrol Song": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "DEF%": 82.7 },
  },
  
  "Sturdy Bone": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  // Version 5.0
  "Ash-Graven Drinking Horn": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
  },
  
  "Chain Breaker": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%%": 27.6 },
  },
  
  "Earth Shaker": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Fang of the Mountain King": {
    type: "Claymore",
    base: { ATK: 741 },
    stats: { "CRIT Rate": 11 },
  },
  
  "Flute of Ezpitzal": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "DEF%": 69 },
  },
  
  "Footprint of the Rainbow": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "DEF%": 51.7 },
  },
  
  "Ring of Yaxche": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
  },
  
  "Surf's Up": {
    type: "Catalyst",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
  },
  
  // Version 4.8
  "Lumidouce Elegy": {
    type: "Polearm",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
  },
  
  // Version 4.7
  "Absolution": {
    type: "Sword",
    base: { ATK: 674 },
    stats: { "CRIT DMG": 44.1 },
  },
  
  "Cloudforged": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Silvershower Heartstrings": {
    type: "Bow",
    base: { ATK: 542 },
    stats: { "HP%": 66.2 },
  },
  
  // Version 4.6
  "Crimson Moon's Semblance": {
    type: "Polearm",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
  },
  
  // Version 4.5
  "Dialogues of the Desert Sages": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
  },
  
  "Uraku Misugiri": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
  },
  
  // Version 4.4
  "Crane's Echoing Call": {
    type: "Catalyst",
    base: { ATK: 741 },
    stats: { "ATK%": 16.5 },
  },
  
  // Version 4.3
  "Ultimate Overlord's Mega Magic Sword": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Verdict": {
    type: "Claymore",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
  },
  
  // Version 4.2
  "Splendor of Tranquil Waters": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
  },
  
  "Sword of Narzissenkreuz": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  // Version 4.1
  "Ballad of the Boundless Blue": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Cashflow Supervision": {
    type: "Catalyst",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
  },
  
  "Portable Power Saw": {
    type: "Claymore",
    base: { ATK: 454 },
    stats: { "HP%": 55.1 },
  },
  
  "Prospector's Drill": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Range Gauge": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "The Dockhand's Assistant": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
  },
  
  "Tome of the Eternal Flow": {
    type: "Catalyst",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
  },
  
  // Version 4.0
  "Ballad of the Fjords": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 27.6 },
  },
  
  "Finale of the Deep": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Fleuve Cendre Ferryman": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Flowing Purity": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Rightful Reward": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "HP%": 27.6 },
  },
  
  "Sacrificial Jade": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "CRIT Rate": 36.8 },
  },
  
  "Scion of the Blazing Sun": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "CRIT Rate": 18.4 },
  },
  
  "Song of Stillness": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Talking Stick": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "CRIT Rate": 18.4 },
  },
  
  "The First Great Magic": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2 },
  },
  
  "Tidal Shadow": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Wolf-Fang": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  
  // Version 3.8
  
  // Version 3.7
  "Ibis Piercer": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  // Version 3.6
  "Jadefall's Splendor": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "HP%": 49.6 },
  },
  
  // Version 3.5
  "Beacon of the Reed Sea": {
    type: "Claymore",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
  },
  
  "Mailed Flower": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Elemental Mastery": 110 },
  },
  
  // Version 3.4
  "Light of Foliar Incision": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
  },
  
  // Version 3.3
  "Toukabou Shigure": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Tulaytullah's Remembrance": {
    type: "Catalyst",
    base: { ATK: 674 },
    stats: { "CRIT DMG": 44.1 },
  },
  
  // Version 3.2
  "A Thousand Floating Dreams": {
    type: "Catalyst",
    base: { ATK: 542 },
    stats: { "Elemental Mastery": 265 },
  },
  
  // Version 3.1
  "Key of Khaj-Nisut": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "HP%": 66.2 },
  },
  
  "Makhaira Aquamarine": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Missive Windspear": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Staff of the Scarlet Sands": {
    type: "Polearm",
    base: { ATK: 542 },
    stats: { "CRIT Rate": 44.1 },
  },
  
  "Wandering Evenstar": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Xiphos' Moonlight": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  // Version 3.0
  "End of the Line": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Forest Regalia": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Fruit of Fulfillment": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Hunter's Path": {
    type: "Bow",
    base: { ATK: 542 },
    stats: { "CRIT Rate": 44.1 },
  },
  
  "King's Squire": {
    type: "Bow",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
  },
  
  "Moonpiercer": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Elemental Mastery": 110 },
  },
  
  "Sapwood Blade": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  // Version 2.8
  "Kagotsurube Isshin": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  // Version 2.7
  "Aqua Simulacra": {
    type: "Bow",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
  },
  
  "Fading Twilight": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  // Version 2.6
  "Haran Geppaku Futsu": {
    type: "Sword",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
  },
  
  // Version 2.5
  "Kagura's Verity": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2 },
  },
  
  "Oathsworn Eye": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  // Version 2.4
  "Calamity Queller": {
    type: "Polearm",
    base: { ATK: 741 },
    stats: { "ATK%": 16.5 },
  },
  
  // Version 2.3
  "Cinnabar Spindle": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "DEF%": 69 },
  },
  
  "Redhorn Stonethresher": {
    type: "Claymore",
    base: { ATK: 542 },
    stats: { "CRIT DMG": 88.2 },
  },
  
  // Version 2.2
  "Akuoumaru": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Mouun's Moon": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Polar Star": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
  },
  
  "Wavebreaker's Fin": {
    type: "Polearm",
    base: { ATK: 620 },
    stats: { "ATK%": 13.8 },
  },
  
  // Version 2.1
  "Engulfing Lightning": {
    type: "Polearm",
    base: { ATK: 608 },
    stats: { "Energy Recharge": 55.1 },
  },
  
  "Everlasting Moonglow": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "HP%": 49.6 },
  },
  
  "Luxurious Sea-Lord": {
    type: "Claymore",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
  },
  
  "Predator": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "The Catch": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  // Version 2.0
  "Amenoma Kageuchi": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
  },
  
  "Hakushin Ring": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Hamayumi": {
    type: "Bow",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
  },
  
  "Katsuragikiri Nagamasa": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Kitain Cross Spear": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Elemental Mastery": 110 },
  },
  
  "Mistsplitter Reforged": {
    type: "Sword",
    base: { ATK: 674 },
    stats: { "CRIT DMG": 44.1 },
  },
  
  "Thundering Pulse": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2 },
  },
  
  // Version 1.6
  "Dodoco Tales": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
  },
  
  "Freedom-Sworn": {
    type: "Sword",
    base: { ATK: 608 },
    stats: { "Elemental Mastery": 198 },
  },
  
  "Mitternachts Waltz": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Physical DMG": 51.7 },
  },
  
  // Version 1.5
  "Song of Broken Pines": {
    type: "Claymore",
    base: { ATK: 741 },
    stats: { "Physical DMG": 20.7 },
  },
  
  // Version 1.4
  "Alley Hunter": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Elegy for the End": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "Energy Recharge": 55.1 },
  },
  
  "The Alley Flash": {
    type: "Sword",
    base: { ATK: 620 },
    stats: { "Elemental Mastery": 55 },
  },
  
  "Windblume Ode": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Wine and Song": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  // Version 1.3
  "Lithic Blade": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Lithic Spear": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6},
  },
  
  "Primordial Jade Cutter": {
    type: "Sword",
    base: { ATK: 542 },
    stats: { "CRIT Rate": 44.1, "HP%": 20 },
  },
  
  "Staff of Homa": {
    type: "Polearm",
    base: { ATK: 608 },
    stats: { "CRIT DMG": 66.2, "HP%": 20 },
  },
  
  // Version 1.2
  "Dragonspine Spear": {
    type: "Polearm",
    base: { ATK: 454 },
    stats: { "Physical DMG": 69 },
  },
  
  "Festering Desire": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Frostbearer": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Snow-Tombed Starsilver": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Physical DMG": 34.5 },
  },
  
  "Summit Shaper": {
    type: "Sword",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
  },
  
  // Version 1.1
  "Memory of Dust": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
  },
  
  "Royal Spear": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "The Unforged": {
    type: "Claymore",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
  },
  
  "Vortex Vanquisher": {
    type: "Polearm",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
  },
  
  // Version 1.0
  "Amos' Bow": {
    type: "Bow",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
  },
  
  "Aquila Favonia": {
    type: "Sword",
    base: { ATK: 674 },
    stats: { "Physical DMG": 41.3 },
  },
  
  "Black Tassel": {
    type: "Polearm",
    base: { ATK: 354 },
    stats: { hp: 46.9 },
  },
  
  "Blackcliff Agate": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "CRIT DMG": 55.1 },
  },
  
  "Blackcliff Longsword": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "CRIT DMG": 36.8 },
  },
  
  "Blackcliff Pole": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "CRIT DMG": 55.1 },
  },
  
  "Blackcliff Slasher": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "CRIT DMG": 55.1 },
  },
  
  "Blackcliff Warbow": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "CRIT DMG": 36.8 },
  },
  
  "Bloodtainted Greatsword": {
    type: "Claymore",
    base: { ATK: 354 },
    stats: { "Elemental Mastery": 187 },
  },
  
  "Compound Bow": {
    type: "Bow",
    base: { ATK: 454 },
    stats: { "Physical DMG": 69 },
  },
  
  "Cool Steel": {
    type: "Sword",
    base: { ATK: 401 },
    stats: { "ATK%": 35.2 },
  },
  
  "Crescent Pike": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Physical DMG": 34.5 },
  },
  
  "Dark Iron Sword": {
    type: "Sword",
    base: { ATK: 401 },
    stats: { "Elemental Mastery": 141 },
  },
  
  "Deathmatch": {
    type: "Polearm",
    base: { ATK: 454 },
    stats: { "CRIT Rate": 36.8 },
  },
  
  "Debate Club": {
    type: "Claymore",
    base: { ATK: 401 },
    stats: { "ATK%": 35.2 },
  },
  
  "Dragon's Bane": {
    type: "Polearm",
    base: { ATK: 454 },
    stats: { "Elemental Mastery": 221 },
  },
  
  "Emerald Orb": {
    type: "Catalyst",
    base: { ATK: 448 },
    stats: { "Elemental Mastery": 94 },
  },
  
  "Eye of Perception": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "ATK%": 55.1 },
  },
  
  "Favonius Codex": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Favonius Greatsword": {
    type: "Claymore",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  "Favonius Lance": {
    type: "Polearm",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Favonius Sword": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  "Favonius Warbow": {
    type: "Bow",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  "Ferrous Shadow": {
    type: "Claymore",
    base: { ATK: 401 },
    stats: { "HP%": 35.2 },
  },
  
  "Fillet Blade": {
    type: "Sword",
    base: { ATK: 401 },
    stats: { "ATK%": 35.2 },
  },
  
  "Halberd": {
    type: "Polearm",
    base: { ATK: 448 },
    stats: { "ATK%": 23.5 },
  },
  
  "Harbinger of Dawn": {
    type: "Sword",
    base: { ATK: 401 },
    stats: { "CRIT DMG": 46.9 },
  },
  
  "Iron Sting": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Lion's Roar": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Lost Prayer to the Sacred Winds": {
    type: "Catalyst",
    base: { ATK: 608 },
    stats: { "CRIT Rate": 33.1 },
  },
  
  "Magic Guide": {
    type: "Catalyst",
    base: { ATK: 354 },
    stats: { "Elemental Mastery": 187 },
  },
  
  "Mappa Mare": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "Elemental Mastery": 110 },
  },
  
  "Messenger": {
    type: "Bow",
    base: { ATK: 448 },
    stats: { "CRIT Rate": 31.2 },
  },
  
  "Otherworldly Story": {
    type: "Catalyst",
    base: { ATK: 401 },
    stats: { "Energy Recharge": 39 },
  },
  
  "Primordial Jade Winged-Spear": {
    type: "Polearm",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
  },
  
  "Prototype Amber": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
  },
  
  "Prototype Archaic": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Prototype Crescent": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Prototype Rancour": {
    type: "Sword",
    base: { ATK: 565 },
    stats: { "Physical DMG": 34.5 },
  },
  
  "Prototype Starglitter": {
    type: "Polearm",
    base: { ATK: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Rainslasher": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Raven Bow": {
    type: "Bow",
    base: { ATK: 448 },
    stats: { "Elemental Mastery": 94 },
  },
  
  "Recurve Bow": {
    type: "Bow",
    base: { ATK: 354 },
    stats: { "HP%": 46.9 },
  },
  
  "Royal Bow": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Royal Greatsword": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Royal Grimoire": {
    type: "Catalyst",
    base: { ATK: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Royal Longsword": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Rust": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Sacrificial Bow": {
    type: "Bow",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Sacrificial Fragments": {
    type: "Catalyst",
    base: { ATK: 454 },
    stats: { "Elemental Mastery": 221 },
  },
  
  "Sacrificial Greatsword": {
    type: "Claymore",
    base: { ATK: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Sacrificial Sword": {
    type: "Sword",
    base: { ATK: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  "Serpent Spine": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  "Sharpshooter's Oath": {
    type: "Bow",
    base: { ATK: 401 },
    stats: { "CRIT DMG": 46.9 },
  },
  
  "Skyrider Greatsword": {
    type: "Claymore",
    base: { ATK: 401 },
    stats: { "Physical DMG": 43.9 },
  },
  
  "Skyrider Sword": {
    type: "Sword",
    base: { ATK: 354 },
    stats: { "Energy Recharge": 52.1 },
  },
  
  "Skyward Atlas": {
    type: "Catalyst",
    base: { ATK: 674 },
    stats: { "ATK%": 33.1 },
  },
  
  "Skyward Blade": {
    type: "Sword",
    base: { ATK: 608 },
    stats: { "Energy Recharge": 55.1 },
  },
  
  "Skyward Harp": {
    type: "Bow",
    base: { ATK: 674 },
    stats: { "CRIT Rate": 22.1 },
  },
  
  "Skyward Pride": {
    type: "Claymore",
    base: { ATK: 674 },
    stats: { "Energy Recharge": 36.8 },
  },
  
  "Skyward Spine": {
    type: "Polearm",
    base: { ATK: 674 },
    stats: { "Energy Recharge": 36.8 },
  },
  
  "Slingshot": {
    type: "Bow",
    base: { ATK: 354 },
    stats: { "CRIT Rate": 31.2 },
  },
  
  "Solar Pearl": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  "Sword of Descension": {
    type: "Sword",
    base: { ATK: 440 },
    stats: { "ATK%": 35.2 },
  },
  
  "The Bell": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "HP%": 41.3 },
  },
  
  "The Black Sword": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  "The Flute": {
    type: "Sword",
    base: { ATK: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "The Stringless": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "The Viridescent Hunt": {
    type: "Bow",
    base: { ATK: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  "The Widsith": {
    type: "Catalyst",
    base: { ATK: 510 },
    stats: { "CRIT DMG": 55.1 },
  },
  
  "Thrilling Tales of Dragon Slayers": {
    type: "Catalyst",
    base: { ATK: 401 },
    stats: { "HP%": 35.2 },
  },
  
  "Traveler's Handy Sword": {
    type: "Sword",
    base: { ATK: 448 },
    stats: { "DEF%": 29.3 },
  },
  
  "Twin Nephrite": {
    type: "Catalyst",
    base: { ATK: 448 },
    stats: { "CRIT Rate": 15.6 },
  },
  
  "White Iron Greatsword": {
    type: "Claymore",
    base: { ATK: 401 },
    stats: { "DEF%": 43.9 },
  },
  
  "White Tassel": {
    type: "Polearm",
    base: { ATK: 401 },
    stats: { "CRIT Rate": 23.4 },
  },
  
  "Whiteblind": {
    type: "Claymore",
    base: { ATK: 510 },
    stats: { "DEF%": 51.7 },
  },
  
  "Wolf's Gravestone": {
    type: "Claymore",
    base: { ATK: 608 },
    stats: { "ATK%": 49.6 },
  },
};

export default WEAPONS;
