const WEAPONS = {
  // Version 5.3
  "A Thousand Blazing Suns": {
    type: "Claymore",
    base: { ATK: 741 },
  },
  
  "Starcaller's Watch": {
    type: "Catalyst",
    base: { ATK: 542 },
  },
  
  // Version 5.2
  "Astral Vulture's Crimson Plumage": {
    type: "Bow",
    base: { ATK: 608 },
  },
  
  "Calamity of Eshu": {
    type: "Sword",
    base: { ATK: 565 },
  },
  
  "Flower-Wreathed Feathers": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "Waveriding Whirl": {
    type: "Catalyst",
    base: { ATK: 454 },
  },
  
  // Version 5.1
  "Fruitful Hook": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "Mountain-Bracing Bolt": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "Peak Patrol Song": {
    type: "Sword",
    base: { ATK: 542 },
  },
  
  "Sturdy Bone": {
    type: "Sword",
    base: { ATK: 565 },
  },
  
  // Version 5.0
  "Ash-Graven Drinking Horn": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Chain Breaker": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  "Earth Shaker": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "Fang of the Mountain King": {
    type: "Claymore",
    base: { ATK: 741 },
  },
  
  "Flute of Ezpitzal": {
    type: "Sword",
    base: { ATK: 454 },
  },
  
  "Footprint of the Rainbow": {
    type: "Polearm",
    base: { ATK: 510 },
  },
  
  "Ring of Yaxche": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Surf's Up": {
    type: "Catalyst",
    base: { ATK: 542 },
  },
  
  // Version 4.8
  "Lumidouce Elegy": {
    type: "Polearm",
    base: { ATK: 608 },
  },
  
  // Version 4.7
  "Absolution": {
    type: "Sword",
    base: { ATK: 674 },
    stat: { "CRIT DMG": 44.1 },
    subtitle: "Deathly Pact",
    desc: `CRIT DMG increased by 20%. Increasing the value of a Bond of Life increases the DMG the equipping character deals by 16% for 6s. Max 3 stacks.`,
  },
  
  "Cloudforged": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "Silvershower Heartstrings": {
    type: "Bow",
    base: { ATK: 542 },
  },
  
  // Version 4.6
  "Crimson Moon's Semblance": {
    type: "Polearm",
    base: { ATK: 674 },
  },
  
  // Version 4.5
  "Dialogues of the Desert Sages": {
    type: "Polearm",
    base: { ATK: 510 },
  },
  
  "Uraku Misugiri": {
    type: "Sword",
    base: { ATK: 542 },
  },
  
  // Version 4.4
  "Crane's Echoing Call": {
    type: "Catalyst",
    base: { ATK: 741 },
  },
  
  // Version 4.3
  "Ultimate Overlord's Mega Magic Sword": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "Verdict": {
    type: "Claymore",
    base: { ATK: 674 },
  },
  
  // Version 4.2
  "Splendor of Tranquil Waters": {
    type: "Sword",
    base: { ATK: 542 },
  },
  
  "Sword of Narzissenkreuz": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  // Version 4.1
  "Ballad of the Boundless Blue": {
    type: "Catalyst",
    base: { ATK: 565 },
  },
  
  "Cashflow Supervision": {
    type: "Catalyst",
    base: { ATK: 674 },
  },
  
  "Portable Power Saw": {
    type: "Claymore",
    base: { ATK: 454 },
  },
  
  "Prospector's Drill": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "Range Gauge": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  "The Dockhand's Assistant": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "Tome of the Eternal Flow": {
    type: "Catalyst",
    base: { ATK: 542 },
  },
  
  // Version 4.0
  "Ballad of the Fjords": {
    type: "Polearm",
    base: { ATK: 510 },
  },
  
  "Finale of the Deep": {
    type: "Sword",
    base: { ATK: 565 },
  },
  
  "Fleuve Cendre Ferryman": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "Flowing Purity": {
    type: "Catalyst",
    base: { ATK: 565 },
  },
  
  "Rightful Reward": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "Sacrificial Jade": {
    type: "Catalyst",
    base: { ATK: 454 },
  },
  
  "Scion of the Blazing Sun": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  "Song of Stillness": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "Talking Stick": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "The First Great Magic": {
    type: "Bow",
    base: { ATK: 608 },
  },
  
  "Tidal Shadow": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "Wolf-Fang": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  // Version 3.8
  
  // Version 3.7
  "Ibis Piercer": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  // Version 3.6
  "Jadefall's Splendor": {
    type: "Catalyst",
    base: { ATK: 608 },
  },
  
  // Version 3.5
  "Beacon of the Reed Sea": {
    type: "Claymore",
    base: { ATK: 608 },
  },
  
  "Mailed Flower": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  // Version 3.4
  "Light of Foliar Incision": {
    type: "Sword",
    base: { ATK: 542 },
  },
  
  // Version 3.3
  "Toukabou Shigure": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "Tulaytullah's Remembrance": {
    type: "Catalyst",
    base: { ATK: 674 },
  },
  
  // Version 3.2
  "A Thousand Floating Dreams": {
    type: "Catalyst",
    base: { ATK: 542 },
  },
  
  // Version 3.1
  "Key of Khaj-Nisut": {
    type: "Sword",
    base: { ATK: 542 },
  },
  
  "Makhaira Aquamarine": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "Missive Windspear": {
    type: "Polearm",
    base: { ATK: 510 },
  },
  
  "Staff of the Scarlet Sands": {
    type: "Polearm",
    base: { ATK: 542 },
  },
  
  "Wandering Evenstar": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Xiphos' Moonlight": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  // Version 3.0
  "End of the Line": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "Forest Regalia": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "Fruit of Fulfillment": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Hunter's Path": {
    type: "Bow",
    base: { ATK: 542 },
  },
  
  "King's Squire": {
    type: "Bow",
    base: { ATK: 454 },
  },
  
  "Moonpiercer": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "Sapwood Blade": {
    type: "Sword",
    base: { ATK: 565 },
  },
  
  // Version 2.8
  "Kagotsurube Isshin": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  // Version 2.7
  "Aqua Simulacra": {
    type: "Bow",
    base: { ATK: 542 },
  },
  
  "Fading Twilight": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  // Version 2.6
  "Haran Geppaku Futsu": {
    type: "Sword",
    base: { ATK: 608 },
  },
  
  // Version 2.5
  "Kagura's Verity": {
    type: "Catalyst",
    base: { ATK: 608 },
  },
  
  "Oathsworn Eye": {
    type: "Catalyst",
    base: { ATK: 565 },
  },
  
  // Version 2.4
  "Calamity Queller": {
    type: "Polearm",
    base: { ATK: 741 },
  },
  
  // Version 2.3
  "Cinnabar Spindle": {
    type: "Sword",
    base: { ATK: 454 },
  },
  
  "Redhorn Stonethresher": {
    type: "Claymore",
    base: { ATK: 542 },
  },
  
  // Version 2.2
  "Akuoumaru": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "Mouun's Moon": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  "Polar Star": {
    type: "Bow",
    base: { ATK: 608 },
  },
  
  "Wavebreaker's Fin": {
    type: "Polearm",
    base: { ATK: 620 },
  },
  
  // Version 2.1
  "Engulfing Lightning": {
    type: "Polearm",
    base: { ATK: 608 },
  },
  
  "Everlasting Moonglow": {
    type: "Catalyst",
    base: { ATK: 608 },
  },
  
  "Luxurious Sea-Lord": {
    type: "Claymore",
    base: { ATK: 454 },
  },
  
  "Predator": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "The Catch": {
    type: "Polearm",
    base: { ATK: 510 },
  },
  
  // Version 2.0
  "Amenoma Kageuchi": {
    type: "Sword",
    base: { ATK: 454 },
  },
  
  "Hakushin Ring": {
    type: "Catalyst",
    base: { ATK: 565 },
  },
  
  "Hamayumi": {
    type: "Bow",
    base: { ATK: 454 },
  },
  
  "Katsuragikiri Nagamasa": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "Kitain Cross Spear": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "Mistsplitter Reforged": {
    type: "Sword",
    base: { ATK: 674 },
  },
  
  "Thundering Pulse": {
    type: "Bow",
    base: { ATK: 608 },
  },
  
  // Version 1.6
  "Dodoco Tales": {
    type: "Catalyst",
    base: { ATK: 454 },
  },
  
  "Freedom-Sworn": {
    type: "Sword",
    base: { ATK: 608 },
  },
  
  "Mitternachts Waltz": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  // Version 1.5
  "Song of Broken Pines": {
    type: "Claymore",
    base: { ATK: 741 },
  },
  
  // Version 1.4
  "Alley Hunter": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  "Elegy for the End": {
    type: "Bow",
    base: { ATK: 608 },
  },
  
  "The Alley Flash": {
    type: "Sword",
    base: { ATK: 620 },
  },
  
  "Windblume Ode": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "Wine and Song": {
    type: "Catalyst",
    base: { ATK: 565 },
  },
  
  // Version 1.3
  "Lithic Blade": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "Lithic Spear": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "Primordial Jade Cutter": {
    type: "Sword",
    base: { ATK: 542 },
  },
  
  "Staff of Homa": {
    type: "Polearm",
    base: { ATK: 608 },
  },
  
  // Version 1.2
  "Dragonspine Spear": {
    type: "Polearm",
    base: { ATK: 454 },
  },
  
  "Festering Desire": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "Frostbearer": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Snow-Tombed Starsilver": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "Summit Shaper": {
    type: "Sword",
    base: { ATK: 608 },
  },
  
  // Version 1.1
  "Memory of Dust": {
    type: "Catalyst",
    base: { ATK: 608 },
  },
  
  "Royal Spear": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "The Unforged": {
    type: "Claymore",
    base: { ATK: 608 },
  },
  
  "Vortex Vanquisher": {
    type: "Polearm",
    base: { ATK: 608 },
  },
  
  // Version 1.0
  "Amos' Bow": {
    type: "Bow",
    base: { ATK: 608 },
  },
  
  "Aquila Favonia": {
    type: "Sword",
    base: { ATK: 674 },
  },
  
  "Black Tassel": {
    type: "Polearm",
    base: { ATK: 354 },
  },
  
  "Blackcliff Agate": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Blackcliff Longsword": {
    type: "Sword",
    base: { ATK: 565 },
  },
  
  "Blackcliff Pole": {
    type: "Polearm",
    base: { ATK: 510 },
  },
  
  "Blackcliff Slasher": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "Blackcliff Warbow": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  "Bloodtainted Greatsword": {
    type: "Claymore",
    base: { ATK: 354 },
  },
  
  "Compound Bow": {
    type: "Bow",
    base: { ATK: 454 },
  },
  
  "Cool Steel": {
    type: "Sword",
    base: { ATK: 401 },
  },
  
  "Crescent Pike": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "Dark Iron Sword": {
    type: "Sword",
    base: { ATK: 401 },
  },
  
  "Deathmatch": {
    type: "Polearm",
    base: { ATK: 454 },
  },
  
  "Debate Club": {
    type: "Claymore",
    base: { ATK: 401 },
  },
  
  "Dragon's Bane": {
    type: "Polearm",
    base: { ATK: 454 },
  },
  
  "Emerald Orb": {
    type: "Catalyst",
    base: { ATK: 448 },
  },
  
  "Eye of Perception": {
    type: "Catalyst",
    base: { ATK: 454 },
  },
  
  "Favonius Codex": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Favonius Greatsword": {
    type: "Claymore",
    base: { ATK: 454 },
  },
  
  "Favonius Lance": {
    type: "Polearm",
    base: { ATK: 565 },
  },
  
  "Favonius Sword": {
    type: "Sword",
    base: { ATK: 454 },
  },
  
  "Favonius Warbow": {
    type: "Bow",
    base: { ATK: 454 },
  },
  
  "Ferrous Shadow": {
    type: "Claymore",
    base: { ATK: 401 },
  },
  
  "Fillet Blade": {
    type: "Sword",
    base: { ATK: 401 },
  },
  
  "Halberd": {
    type: "Polearm",
    base: { ATK: 448 },
  },
  
  "Harbinger of Dawn": {
    type: "Sword",
    base: { ATK: 401 },
  },
  
  "Iron Sting": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "Lion's Roar": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "Lost Prayer to the Sacred Winds": {
    type: "Catalyst",
    base: { ATK: 608 },
  },
  
  "Magic Guide": {
    type: "Catalyst",
    base: { ATK: 354 },
  },
  
  "Mappa Mare": {
    type: "Catalyst",
    base: { ATK: 565 },
  },
  
  "Messenger": {
    type: "Bow",
    base: { ATK: 448 },
  },
  
  "Otherworldly Story": {
    type: "Catalyst",
    base: { ATK: 401 },
  },
  
  "Primordial Jade Winged-Spear": {
    type: "Polearm",
    base: { ATK: 674 },
  },
  
  "Prototype Amber": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Prototype Archaic": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "Prototype Crescent": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "Prototype Rancour": {
    type: "Sword",
    base: { ATK: 565 },
  },
  
  "Prototype Starglitter": {
    type: "Polearm",
    base: { ATK: 510 },
  },
  
  "Rainslasher": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "Raven Bow": {
    type: "Bow",
    base: { ATK: 448 },
  },
  
  "Recurve Bow": {
    type: "Bow",
    base: { ATK: 354 },
  },
  
  "Royal Bow": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "Royal Greatsword": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "Royal Grimoire": {
    type: "Catalyst",
    base: { ATK: 565 },
  },
  
  "Royal Longsword": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "Rust": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "Sacrificial Bow": {
    type: "Bow",
    base: { ATK: 565 },
  },
  
  "Sacrificial Fragments": {
    type: "Catalyst",
    base: { ATK: 454 },
  },
  
  "Sacrificial Greatsword": {
    type: "Claymore",
    base: { ATK: 565 },
  },
  
  "Sacrificial Sword": {
    type: "Sword",
    base: { ATK: 454 },
  },
  
  "Serpent Spine": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "Sharpshooter's Oath": {
    type: "Bow",
    base: { ATK: 401 },
  },
  
  "Skyrider Greatsword": {
    type: "Claymore",
    base: { ATK: 401 },
  },
  
  "Skyrider Sword": {
    type: "Sword",
    base: { ATK: 354 },
  },
  
  "Skyward Atlas": {
    type: "Catalyst",
    base: { ATK: 674 },
  },
  
  "Skyward Blade": {
    type: "Sword",
    base: { ATK: 608 },
  },
  
  "Skyward Harp": {
    type: "Bow",
    base: { ATK: 674 },
  },
  
  "Skyward Pride": {
    type: "Claymore",
    base: { ATK: 674 },
  },
  
  "Skyward Spine": {
    type: "Polearm",
    base: { ATK: 674 },
  },
  
  "Slingshot": {
    type: "Bow",
    base: { ATK: 354 },
  },
  
  "Solar Pearl": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Sword of Descension": {
    type: "Sword",
    base: { ATK: 440 },
  },
  
  "The Bell": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "The Black Sword": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "The Flute": {
    type: "Sword",
    base: { ATK: 510 },
  },
  
  "The Stringless": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "The Viridescent Hunt": {
    type: "Bow",
    base: { ATK: 510 },
  },
  
  "The Widsith": {
    type: "Catalyst",
    base: { ATK: 510 },
  },
  
  "Thrilling Tales of Dragon Slayers": {
    type: "Catalyst",
    base: { ATK: 401 },
  },
  
  "Traveler's Handy Sword": {
    type: "Sword",
    base: { ATK: 448 },
  },
  
  "Twin Nephrite": {
    type: "Catalyst",
    base: { ATK: 448 },
  },
  
  "White Iron Greatsword": {
    type: "Claymore",
    base: { ATK: 401 },
  },
  
  "White Tassel": {
    type: "Polearm",
    base: { ATK: 401 },
  },
  
  "Whiteblind": {
    type: "Claymore",
    base: { ATK: 510 },
  },
  
  "Wolf's Gravestone": {
    type: "Claymore",
    base: { ATK: 608 },
  },
};

export default WEAPONS;
