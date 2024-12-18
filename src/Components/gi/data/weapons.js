const weapondb = [
  // Version 5.2
  "Astral Vulture's Crimson Plumage",
  "Calamity of Eshu",
  "Flower-Wreathed Feathers",
  "Waveriding Whirl",

  // Version 5.1
  "Fruitful Hook",
  "Mountain-Bracing Bolt",
  "Peak Patrol Song",
  "Sturdy Bone",

  // Version 5.0
  "Ash-Graven Drinking Horn",
  "Chain Breaker",
  "Earth Shaker",
  "Fang of the Mountain King",
  "Flute of Ezpitzal",
  "Footprint of the Rainbow",
  "Ring of Yaxche",
  "Surf's Up",

  // Version 4.8
  "Lumidouce Elegy",

  // Version 4.7
  "Absolution",
  "Cloudforged",
  "Silvershower Heartstrings",

  // Version 4.6
  "Crimson Moon's Semblance",

  // Version 4.5
  "Dialogues of the Desert Sages",
  "Uraku Misugiri",

  // Version 4.4
  "Crane's Echoing Call",

  // Version 4.3
  "Ultimate Overlord's Mega Magic Sword",
  "Verdict",

  // Version 4.2
  "Splendor of Tranquil Waters",
  "Sword of Narzissenkreuz",

  // Version 4.1
  "Ballad of the Boundless Blue",
  "Cashflow Supervision",
  "Portable Power Saw",
  "Prospector's Drill",
  "Range Gauge",
  "The Dockhand's Assistant",
  "Tome of the Eternal Flow",

  // Version 4.0
  "Ballad of the Fjords",
  "Finale of the Deep",
  "Fleuve Cendre Ferryman",
  "Flowing Purity",
  "Rightful Reward",
  "Sacrificial Jade",
  "Scion of the Blazing Sun",
  "Song of Stillness",
  "Talking Stick",
  "The First Great Magic",
  "Tidal Shadow",
  "Wolf-Fang",

  // Version 3.7
  "Ibis Piercer",

  // Version 3.6
  "Jadefall's Splendor",

  // Version 3.5
  "Beacon of the Reed Sea",
  "Mailed Flower",

  // Version 3.4
  "Light of Foliar Incision",

  // Version 3.3
  "Toukabou Shigure",
  "Tulaytullah's Remembrance",

  // Version 3.2
  "A Thousand Floating Dreams",

  // Version 3.1
  "Key of Khaj-Nisut",
  "Makhaira Aquamarine",
  "Missive Windspear",
  "Staff of the Scarlet Sands",
  "Wandering Evenstar",
  "Xiphos' Moonlight",

  // Version 3.0
  "End of the Line",
  "Forest Regalia",
  "Fruit of Fulfillment",
  "Hunter's Path",
  "King's Squire",
  "Moonpiercer",
  "Sapwood Blade",

  // Version 2.8
  "Kagotsurube Isshin",

  // Version 2.7
  "Aqua Simulacra",
  "Fading Twilight",

  // Version 2.6
  "Haran Geppaku Futsu",

  // Version 2.5
  "Kagura's Verity",
  "Oathsworn Eye",

  // Version 2.4
  "Calamity Queller",

  // Version 2.3
  "Cinnabar Spindle",
  "Redhorn Stonethresher",

  // Version 2.2
  "Akuoumaru",
  "Mouun's Moon",
  "Polar Star",
  "Wavebreaker's Fin",

  // Version 2.1
  "Engulfing Lightning",
  "Everlasting Moonglow",
  "Luxurious Sea-Lord",
  "Predator",
  "The Catch",

  // Version 2.0
  "Amenoma Kageuchi",
  "Hakushin Ring",
  "Hamayumi",
  "Katsuragikiri Nagamasa",
  "Kitain Cross Spear",
  "Mistsplitter Reforged",
  "Thundering Pulse",

  // Version 1.6
  "Dodoco Tales",
  "Freedom-Sworn",
  "Mitternachts Waltz",

  // Version 1.5
  "Song of Broken Pines",

  // Version 1.4
  "Alley Hunter",
  "Elegy for the End",
  "The Alley Flash",
  "Windblume Ode",
  "Wine and Song",

  // Version 1.3
  "Lithic Blade",
  "Lithic Spear",
  "Primordial Jade Cutter",
  "Staff of Homa",

  // Version 1.2
  "Dragonspine Spear",
  "Festering Desire",
  "Frostbearer",
  "Snow-Tombed Starsilver",
  "Summit Shaper",

  // Version 1.1
  "Memory of Dust",
  "Royal Spear",
  "The Unforged",
  "Vortex Vanquisher",

  // Version 1.0
  "Amos' Bow",
  "Aquila Favonia",
  "Black Tassel",
  "Blackcliff Agate",
  "Blackcliff Longsword",
  "Blackcliff Pole",
  "Blackcliff Slasher",
  "Blackcliff Warbow",
  "Bloodtainted Greatsword",
  "Compound Bow",
  "Cool Steel",
  "Crescent Pike",
  "Dark Iron Sword",
  "Deathmatch",
  "Debate Club",
  "Dragon's Bane",
  "Emerald Orb",
  "Eye of Perception",
  "Favonius Codex",
  "Favonius Greatsword",
  "Favonius Lance",
  "Favonius Sword",
  "Favonius Warbow",
  "Ferrous Shadow",
  "Fillet Blade",
  "Halberd",
  "Harbinger of Dawn",
  "Iron Sting",
  "Lion's Roar",
  "Lost Prayer to the Sacred Winds",
  "Magic Guide",
  "Mappa Mare",
  "Messenger",
  "Otherworldly Story",
  "Primordial Jade Winged-Spear",
  "Prototype Amber",
  "Prototype Archaic",
  "Prototype Crescent",
  "Prototype Rancour",
  "Prototype Starglitter",
  "Quantum Catalyst",
  "Rainslasher",
  "Raven Bow",
  "Recurve Bow",
  "Royal Bow",
  "Royal Greatsword",
  "Royal Grimoire",
  "Royal Longsword",
  "Rust",
  "Sacrificial Bow",
  "Sacrificial Fragments",
  "Sacrificial Greatsword",
  "Sacrificial Sword",
  "Serpent Spine",
  "Sharpshooter's Oath",
  "Skyrider Greatsword",
  "Skyrider Sword",
  "Skyward Atlas",
  "Skyward Blade",
  "Skyward Harp",
  "Skyward Pride",
  "Skyward Spine",
  "Slingshot",
  "Solar Pearl",
  "Sword of Descension",
  "The Bell",
  "The Black Sword",
  "The Flute",
  "The Stringless",
  "The Viridescent Hunt",
  "The Widsith",
  "Thrilling Tales of Dragon Slayers",
  "Traveler's Handy Sword",
  "Twin Nephrite",
  "White Iron Greatsword",
  "White Tassel",
  "Whiteblind",
  "Wolf's Gravestone",
];

export default weapondb;
