const WEAPONS = {
  // Version 5.3
  "A Thousand Blazing Suns": {
    type: "Claymore",
    stats: { "CRIT Rate": 11 },
  },
  
  "Starcaller's Watch": {
    type: "Catalyst",
    stats: { "Elemental Mastery": 265 },
  },
  
  // Version 5.2
  "Astral Vulture's Crimson Plumage": {
    type: "Bow",
    stats: { "CRIT DMG": 66.2 },
  },
  
  "Calamity of Eshu": {
    type: "Sword",
    stats: {},
  },
  
  "Flower-Wreathed Feathers": {
    type: "Bow",
    stats: {},
  },
  
  "Waveriding Whirl": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 5.1
  "Fruitful Hook": {
    type: "Claymore",
    stats: { "ATK%": 27.6 },
  },
  
  "Mountain-Bracing Bolt": {
    type: "Polearm",
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Peak Patrol Song": {
    type: "Sword",
    stats: { "DEF%": 82.7 },
  },
  
  "Sturdy Bone": {
    type: "Sword",
    stats: {},
  },
  
  // Version 5.0
  "Ash-Graven Drinking Horn": {
    type: "Catalyst",
    stats: {},
  },
  
  "Chain Breaker": {
    type: "Bow",
    stats: {},
  },
  
  "Earth Shaker": {
    type: "Claymore",
    stats: {},
  },
  
  "Fang of the Mountain King": {
    type: "Claymore",
    stats: {},
  },
  
  "Flute of Ezpitzal": {
    type: "Sword",
    stats: {},
  },
  
  "Footprint of the Rainbow": {
    type: "Polearm",
    stats: {},
  },
  
  "Ring of Yaxche": {
    type: "Catalyst",
    stats: {},
  },
  
  "Surf's Up": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 4.8
  "Lumidouce Elegy": {
    type: "Polearm",
    stats: {},
  },
  
  // Version 4.7
  "Absolution": {
    type: "Sword",
    stats: {},
  },
  
  "Cloudforged": {
    type: "Bow",
    stats: {},
  },
  
  "Silvershower Heartstrings": {
    type: "Bow",
    stats: {},
  },
  
  // Version 4.6
  "Crimson Moon's Semblance": {
    type: "Polearm",
    stats: {},
  },
  
  // Version 4.5
  "Dialogues of the Desert Sages": {
    type: "Polearm",
    stats: {},
  },
  
  "Uraku Misugiri": {
    type: "Sword",
    stats: {},
  },
  
  // Version 4.4
  "Crane's Echoing Call": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 4.3
  "Ultimate Overlord's Mega Magic Sword": {
    type: "Claymore",
    stats: {},
  },
  
  "Verdict": {
    type: "Claymore",
    stats: {},
  },
  
  // Version 4.2
  "Splendor of Tranquil Waters": {
    type: "Sword",
    stats: {},
  },
  
  "Sword of Narzissenkreuz": {
    type: "Sword",
    stats: {},
  },
  
  // Version 4.1
  "Ballad of the Boundless Blue": {
    type: "Catalyst",
    stats: {},
  },
  
  "Cashflow Supervision": {
    type: "Catalyst",
    stats: {},
  },
  
  "Portable Power Saw": {
    type: "Claymore",
    stats: {},
  },
  
  "Prospector's Drill": {
    type: "Polearm",
    stats: {},
  },
  
  "Range Gauge": {
    type: "Bow",
    stats: {},
  },
  
  "The Dockhand's Assistant": {
    type: "Sword",
    stats: {},
  },
  
  "Tome of the Eternal Flow": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 4.0
  "Ballad of the Fjords": {
    type: "Polearm",
    stats: {},
  },
  
  "Finale of the Deep": {
    type: "Sword",
    stats: {},
  },
  
  "Fleuve Cendre Ferryman": {
    type: "Sword",
    stats: {},
  },
  
  "Flowing Purity": {
    type: "Catalyst",
    stats: {},
  },
  
  "Rightful Reward": {
    type: "Polearm",
    stats: {},
  },
  
  "Sacrificial Jade": {
    type: "Catalyst",
    stats: {},
  },
  
  "Scion of the Blazing Sun": {
    type: "Bow",
    stats: {},
  },
  
  "Song of Stillness": {
    type: "Bow",
    stats: {},
  },
  
  "Talking Stick": {
    type: "Claymore",
    stats: {},
  },
  
  "The First Great Magic": {
    type: "Bow",
    stats: {},
  },
  
  "Tidal Shadow": {
    type: "Claymore",
    stats: {},
  },
  
  "Wolf-Fang": {
    type: "Sword",
    stats: {},
  },
  
  
  // Version 3.8
  
  // Version 3.7
  "Ibis Piercer": {
    type: "Bow",
    stats: {},
  },
  
  // Version 3.6
  "Jadefall's Splendor": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 3.5
  "Beacon of the Reed Sea": {
    type: "Claymore",
    stats: {},
  },
  
  "Mailed Flower": {
    type: "Claymore",
    stats: {},
  },
  
  // Version 3.4
  "Light of Foliar Incision": {
    type: "Sword",
    stats: {},
  },
  
  // Version 3.3
  "Toukabou Shigure": {
    type: "Sword",
    stats: {},
  },
  
  "Tulaytullah's Remembrance": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 3.2
  "A Thousand Floating Dreams": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 3.1
  "Key of Khaj-Nisut": {
    type: "Sword",
    stats: {},
  },
  
  "Makhaira Aquamarine": {
    type: "Claymore",
    stats: {},
  },
  
  "Missive Windspear": {
    type: "Polearm",
    stats: {},
  },
  
  "Staff of the Scarlet Sands": {
    type: "Polearm",
    stats: {},
  },
  
  "Wandering Evenstar": {
    type: "Catalyst",
    stats: {},
  },
  
  "Xiphos' Moonlight": {
    type: "Sword",
    stats: {},
  },
  
  // Version 3.0
  "End of the Line": {
    type: "Bow",
    stats: {},
  },
  
  "Forest Regalia": {
    type: "Claymore",
    stats: {},
  },
  
  "Fruit of Fulfillment": {
    type: "Catalyst",
    stats: {},
  },
  
  "Hunter's Path": {
    type: "Bow",
    stats: {},
  },
  
  "King's Squire": {
    type: "Bow",
    stats: {},
  },
  
  "Moonpiercer": {
    type: "Polearm",
    stats: {},
  },
  
  "Sapwood Blade": {
    type: "Sword",
    stats: {},
  },
  
  // Version 2.8
  "Kagotsurube Isshin": {
    type: "Sword",
    stats: {},
  },
  
  // Version 2.7
  "Aqua Simulacra": {
    type: "Bow",
    stats: {},
  },
  
  "Fading Twilight": {
    type: "Bow",
    stats: {},
  },
  
  // Version 2.6
  "Haran Geppaku Futsu": {
    type: "Sword",
    stats: {},
  },
  
  // Version 2.5
  "Kagura's Verity": {
    type: "Catalyst",
    stats: {},
  },
  
  "Oathsworn Eye": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 2.4
  "Calamity Queller": {
    type: "Polearm",
    stats: {},
  },
  
  // Version 2.3
  "Cinnabar Spindle": {
    type: "Sword",
    stats: {},
  },
  
  "Redhorn Stonethresher": {
    type: "Claymore",
    stats: {},
  },
  
  // Version 2.2
  "Akuoumaru": {
    type: "Claymore",
    stats: {},
  },
  
  "Mouun's Moon": {
    type: "Bow",
    stats: {},
  },
  
  "Polar Star": {
    type: "Bow",
    stats: {},
  },
  
  "Wavebreaker's Fin": {
    type: "Polearm",
    stats: {},
  },
  
  // Version 2.1
  "Engulfing Lightning": {
    type: "Polearm",
    stats: {},
  },
  
  "Everlasting Moonglow": {
    type: "Catalyst",
    stats: {},
  },
  
  "Luxurious Sea-Lord": {
    type: "Claymore",
    stats: {},
  },
  
  "Predator": {
    type: "Bow",
    stats: {},
  },
  
  "The Catch": {
    type: "Polearm",
    stats: {},
  },
  
  // Version 2.0
  "Amenoma Kageuchi": {
    type: "Sword",
    stats: {},
  },
  
  "Hakushin Ring": {
    type: "Catalyst",
    stats: {},
  },
  
  "Hamayumi": {
    type: "Bow",
    stats: {},
  },
  
  "Katsuragikiri Nagamasa": {
    type: "Claymore",
    stats: {},
  },
  
  "Kitain Cross Spear": {
    type: "Polearm",
    stats: {},
  },
  
  "Mistsplitter Reforged": {
    type: "Sword",
    stats: {},
  },
  
  "Thundering Pulse": {
    type: "Bow",
    stats: {},
  },
  
  // Version 1.6
  "Dodoco Tales": {
    type: "Catalyst",
    stats: {},
  },
  
  "Freedom-Sworn": {
    type: "Sword",
    stats: {},
  },
  
  "Mitternachts Waltz": {
    type: "Bow",
    stats: {},
  },
  
  // Version 1.5
  "Song of Broken Pines": {
    type: "Claymore",
    stats: {},
  },
  
  // Version 1.4
  "Alley Hunter": {
    type: "Bow",
    stats: {},
  },
  
  "Elegy for the End": {
    type: "Bow",
    stats: {},
  },
  
  "The Alley Flash": {
    type: "Sword",
    stats: {},
  },
  
  "Windblume Ode": {
    type: "Bow",
    stats: {},
  },
  
  "Wine and Song": {
    type: "Catalyst",
    stats: {},
  },
  
  // Version 1.3
  "Lithic Blade": {
    type: "Sword",
    stats: {},
  },
  
  "Lithic Spear": {
    type: "Polearm",
    stats: {},
  },
  
  "Primordial Jade Cutter": {
    type: "Sword",
    stats: {},
  },
  
  "Staff of Homa": {
    type: "Polearm",
    stats: {},
  },
  
  // Version 1.2
  "Dragonspine Spear": {
    type: "Polearm",
    stats: {},
  },
  
  "Festering Desire": {
    type: "Sword",
    stats: {},
  },
  
  "Frostbearer": {
    type: "Catalyst",
    stats: {},
  },
  
  "Snow-Tombed Starsilver": {
    type: "Claymore",
    stats: {},
  },
  
  "Summit Shaper": {
    type: "Sword",
    stats: {},
  },
  
  // Version 1.1
  "Memory of Dust": {
    type: "Catalyst",
    stats: {},
  },
  
  "Royal Spear": {
    type: "Polearm",
    stats: {},
  },
  
  "The Unforged": {
    type: "Claymore",
    stats: {},
  },
  
  "Vortex Vanquisher": {
    type: "Polearm",
    stats: {},
  },
  
  // Version 1.0
  "Amos' Bow": {
    type: "Bow",
    stats: { "ATK%": 49.6 },
  },
  
  "Aquila Favonia": {
    type: "Sword",
    stats: { "Physical DMG": 41.3 },
  },
  
  "Black Tassel": {
    type: "Polearm",
    stats: { hp: 46.9 },
  },
  
  "Blackcliff Agate": {
    type: "Catalyst",
    stats: { "CRIT DMG": 55.1 },
  },
  
  "Blackcliff Longsword": {
    type: "Sword",
    basestats: { atk: 565 },
    stats: { "CRIT DMG": 36.8 },
  },
  
  "Blackcliff Pole": {
    type: "Polearm",
    stats: { "CRIT DMG": 55.1 },
  },
  
  "Blackcliff Slasher": {
    type: "Claymore",
    stats: { "CRIT DMG": 55.1 },
  },
  
  "Blackcliff Warbow": {
    type: "Bow",
    stats: { "CRIT DMG": 36.8 },
  },
  
  "Bloodtainted Greatsword": {
    type: "Claymore",
    stats: { "Elemental Mastery": 187 },
  },
  
  "Compound Bow": {
    type: "Bow",
    basestats: { atk: 454 },
    stats: { "Physical DMG": 69 },
  },
  
  "Cool Steel": {
    type: "Sword",
    basestats: { atk: 401 },
    stats: { "ATK%": 35.2 },
  },
  
  "Crescent Pike": {
    type: "Polearm",
    basestats: { atk: 565 },
    stats: { "Physical DMG": 34.5 },
  },
  
  "Dark Iron Sword": {
    type: "Sword",
    basestats: { atk: 401 },
    stats: { "Elemental Mastery": 141 },
  },
  
  "Deathmatch": {
    type: "Polearm",
    basestats: { atk: 454 },
    stats: { "CRIT Rate": 36.8 },
  },
  
  "Debate Club": {
    type: "Claymore",
    basestats: { atk: 401 },
    stats: { "ATK%": 35.2 },
  },
  
  "Dragon's Bane": {
    type: "Polearm",
    basestats: { atk: 454 },
    stats: { "Elemental Mastery": 221 },
  },
  
  "Emerald Orb": {
    type: "Catalyst",
    basestats: { atk: 448 },
    stats: { "Elemental Mastery": 94 },
  },
  
  "Eye of Perception": {
    type: "Catalyst",
    basestats: { atk: 454 },
    stats: { "ATK%": 55.1 },
  },
  
  "Favonius Codex": {
    type: "Catalyst",
    basestats: { atk: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Favonius Greatsword": {
    type: "Claymore",
    basestats: { atk: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  "Favonius Lance": {
    type: "Polearm",
    basestats: { atk: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Favonius Sword": {
    type: "Sword",
    basestats: { atk: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  "Favonius Warbow": {
    type: "Bow",
    basestats: { atk: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  "Ferrous Shadow": {
    type: "Claymore",
    basestats: { atk: 401 },
    stats: { "HP%": 35.2 },
  },
  
  "Fillet Blade": {
    type: "Sword",
    basestats: { atk: 401 },
    stats: { "ATK%": 35.2 },
  },
  
  "Halberd": {
    type: "Polearm",
    basestats: { atk: 448 },
    stats: { "ATK%": 23.5 },
  },
  
  "Harbinger of Dawn": {
    type: "Sword",
    basestats: { atk: 401 },
    stats: { "CRIT DMG": 46.9 },
  },
  
  "Iron Sting": {
    type: "Sword",
    basestats: { atk: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Lion's Roar": {
    type: "Sword",
    basestats: { atk: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Lost Prayer to the Sacred Winds": {
    type: "Catalyst",
    basestats: { atk: 608 },
    stats: { "CRIT Rate": 33.1 },
  },
  
  "Magic Guide": {
    type: "Catalyst",
    basestats: { atk: 354 },
    stats: { "Elemental Mastery": 187 },
  },
  
  "Mappa Mare": {
    type: "Catalyst",
    basestats: { atk: 565 },
    stats: { "Elemental Mastery": 110 },
  },
  
  "Messenger": {
    type: "Bow",
    basestats: { atk: 448 },
    stats: { "CRIT Rate": 31.2 },
  },
  
  "Otherworldly Story": {
    type: "Catalyst",
    basestats: { atk: 401 },
    stats: { "Energy Recharge": 39 },
  },
  
  "Primordial Jade Winged-Spear": {
    type: "Polearm",
    basestats: { atk: 674 },
    stats: { "CRIT Rate": 22.1 },
  },
  
  "Prototype Amber": {
    type: "Catalyst",
    basestats: { atk: 510 },
    stats: { "HP%": 41.3 },
  },
  
  "Prototype Archaic": {
    type: "Claymore",
    basestats: { atk: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Prototype Crescent": {
    type: "Bow",
    basestats: { atk: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Prototype Rancour": {
    type: "Sword",
    basestats: { atk: 565 },
    stats: { "Physical DMG": 34.5 },
  },
  
  "Prototype Starglitter": {
    type: "Polearm",
    basestats: { atk: 510 },
    stats: { "Energy Recharge": 45.9 },
  },
  
  "Rainslasher": {
    type: "Claymore",
    basestats: { atk: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "Raven Bow": {
    type: "Bow",
    basestats: { atk: 448 },
    stats: { "Elemental Mastery": 94 },
  },
  
  "Recurve Bow": {
    type: "Bow",
    basestats: { atk: 354 },
    stats: { "HP%": 46.9 },
  },
  
  "Royal Bow": {
    type: "Bow",
    basestats: { atk: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Royal Greatsword": {
    type: "Claymore",
    basestats: { atk: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Royal Grimoire": {
    type: "Catalyst",
    basestats: { atk: 565 },
    stats: { "ATK%": 27.6 },
  },
  
  "Royal Longsword": {
    type: "Sword",
    basestats: { atk: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Rust": {
    type: "Bow",
    basestats: { atk: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "Sacrificial Bow": {
    type: "Bow",
    basestats: { atk: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Sacrificial Fragments": {
    type: "Catalyst",
    basestats: { atk: 454 },
    stats: { "Elemental Mastery": 221 },
  },
  
  "Sacrificial Greatsword": {
    type: "Claymore",
    basestats: { atk: 565 },
    stats: { "Energy Recharge": 30.6 },
  },
  
  "Sacrificial Sword": {
    type: "Sword",
    basestats: { atk: 454 },
    stats: { "Energy Recharge": 61.3 },
  },
  
  "Serpent Spine": {
    type: "Claymore",
    basestats: { atk: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  "Sharpshooter's Oath": {
    type: "Bow",
    basestats: { atk: 401 },
    stats: { "CRIT DMG": 46.9 },
  },
  
  "Skyrider Greatsword": {
    type: "Claymore",
    basestats: { atk: 401 },
    stats: { "Physical DMG": 43.9 },
  },
  
  "Skyrider Sword": {
    type: "Sword",
    basestats: { atk: 354 },
    stats: { "Energy Recharge": 52.1 },
  },
  
  "Skyward Atlas": {
    type: "Catalyst",
    basestats: { atk: 674 },
    stats: { "ATK%": 33.1 },
  },
  
  "Skyward Blade": {
    type: "Sword",
    basestats: { atk: 608 },
    stats: { "Energy Recharge": 55.1 },
  },
  
  "Skyward Harp": {
    type: "Bow",
    basestats: { atk: 674 },
    stats: { "CRIT Rate": 22.1 },
  },
  
  "Skyward Pride": {
    type: "Claymore",
    basestats: { atk: 674 },
    stats: { "Energy Recharge": 36.8 },
  },
  
  "Skyward Spine": {
    type: "Polearm",
    basestats: { atk: 674 },
    stats: { "Energy Recharge": 36.8 },
  },
  
  "Slingshot": {
    type: "Bow",
    basestats: { atk: 354 },
    stats: { "CRIT Rate": 31.2 },
  },
  
  "Solar Pearl": {
    type: "Catalyst",
    basestats: { atk: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  "Sword of Descension": {
    type: "Sword",
    basestats: { atk: 440 },
    stats: { "ATK%": 35.2 },
  },
  
  "The Bell": {
    type: "Claymore",
    basestats: { atk: 510 },
    stats: { "HP%": 41.3 },
  },
  
  "The Black Sword": {
    type: "Sword",
    basestats: { atk: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  "The Flute": {
    type: "Sword",
    basestats: { atk: 510 },
    stats: { "ATK%": 41.3 },
  },
  
  "The Stringless": {
    type: "Bow",
    basestats: { atk: 510 },
    stats: { "Elemental Mastery": 165 },
  },
  
  "The Viridescent Hunt": {
    type: "Bow",
    basestats: { atk: 510 },
    stats: { "CRIT Rate": 27.6 },
  },
  
  "The Widsith": {
    type: "Catalyst",
    basestats: { atk: 510 },
    stats: { "CRIT DMG": 55.1 },
  },
  
  "Thrilling Tales of Dragon Slayers": {
    type: "Catalyst",
    basestats: { atk: 401 },
    stats: { "HP%": 35.2 },
  },
  
  "Traveler's Handy Sword": {
    type: "Sword",
    basestats: { atk: 448 },
    stats: { "DEF%": 29.3 },
  },
  
  "Twin Nephrite": {
    type: "Catalyst",
    basestats: { atk: 448 },
    stats: { "CRIT Rate": 15.6 },
  },
  
  "White Iron Greatsword": {
    type: "Claymore",
    basestats: { atk: 401 },
    stats: { "DEF%": 43.9 },
  },
  
  "White Tassel": {
    type: "Polearm",
    basestats: { atk: 401 },
    stats: { "CRIT Rate": 23.4 },
  },
  
  "Whiteblind": {
    type: "Claymore",
    basestats: { atk: 510 },
    stats: { "DEF%": 51.7 },
  },
  
  "Wolf's Gravestone": {
    type: "Claymore",
    basestats: { atk: 608 },
    stats: { "ATK%": 49.6 },
  },
};

export default WEAPONS;
