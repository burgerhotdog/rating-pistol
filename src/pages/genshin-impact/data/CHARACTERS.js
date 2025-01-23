const CHARACTERS = {
  // Version 5.3
  "Citlali": {
    weapon: "Catalyst",
    ascension: { "Elemental Mastery": 115 },
    passive: {},
    weights: {
      "Elemental Mastery": 1,
    },
  },

  "Lan Yan": {
    weapon: "Catalyst",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "ATK%": 1,
      "Elemental Mastery": 0.6,
    },
  },
  
  "Mavuika": {
    weapon: "Claymore",
    ascension: { "CRIT Rate": 38.4 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 5.2
  "Chasca": {
    weapon: "Bow",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Ororon": {
    weapon: "Bow",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 5.1
  "Xilonen": {
    weapon: "Sword",
    ascension: { "DEF%": 36 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "DEF%": 0.75,
    },
  },
  
  // Version 5.0
  "Kachina": {
    weapon: "Polearm",
    ascension: {},
    passive: { "Geo DMG": 24 },
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.75,
    },
  },
  
  "Kinich": {
    weapon: "Claymore",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Mualani": {
    weapon: "Catalyst",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.75,
    },
  },
  
  // Version 4.8
  "Emilie": {
    weapon: "Polearm",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 4.7
  "Clorinde": {
    weapon: "Sword",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Sethos": {
    weapon: "Bow",
    ascension: { "Elemental Mastery": 96 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.75,
    },
  },
  
  "Sigewinne": {
    weapon: "Bow",
    ascension: { "HP%": 28.8 },
    passive: {},
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 4.6
  "Arlecchino": {
    weapon: "Polearm",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 4.5
  "Chiori": {
    weapon: "Sword",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.75,
    },
  },
  
  // Version 4.4
  "Gaming": {
    weapon: "Claymore",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Xianyun": {
    weapon: "Catalyst",
    ascension: { "ATK%": 28.8 },
    passive: {},
    weights: {
      "ATK%": 1,
    },
  },
  
  // Version 4.3
  "Chevreuse": {
    weapon: "Polearm",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "HP%": 1,
    },
  },
  
  "Navia": {
    weapon: "Claymore",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 4.2
  "Charlotte": {
    weapon: "Catalyst",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "ATK%": 0.75,
    },
  },
  
  "Furina": {
    weapon: "Sword",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Hydro DMG": 0.75,
      "HP%": 0.75,
    },
  },
  
  // Version 4.1
  "Neuvillette": {
    weapon: "Catalyst",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.75,
    },
  },
  
  "Wriothesley": {
    weapon: "Catalyst",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 4.0
  "Freminet": {
    weapon: "Claymore",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Physical DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Lynette": {
    weapon: "Sword",
    ascension: { "Anemo DMG": 24 },
    passive: {},
    weights: {
      "Anemo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Lyney": {
    weapon: "Bow",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 3.8
  
  // Version 3.7
  "Kirara": {
    weapon: "Sword",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 3.6
  "Baizhu": {
    weapon: "Catalyst",
    ascension: { "HP%": 28.8 },
    passive: {},
    weights: {
      "HP%": 1,
    },
  },
  
  "Kaveh": {
    weapon: "Claymore",
    ascension: { "Elemental Mastery": 96 },
    passive: {},
    weights: {
      "Elemental Mastery": 1,
    },
  },
  
  // Version 3.5
  "Dehya": {
    weapon: "Claymore",
    ascension: { "HP%": 28.8 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.75,
    },
  },
  
  "Mika": {
    weapon: "Polearm",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.75,
    },
  },
  
  // Version 3.4
  "Alhaitham": {
    weapon: "Sword",
    ascension: { "Dendro DMG": 28.8 },
    passive: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.75,
    },
  },
  
  "Yaoyao": {
    weapon: "Polearm",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.75,
    },
  },
  
  // Version 3.3
  "Faruzan": {
    weapon: "Bow",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Energy Recharge": 1,
    },
  },
  
  "Wanderer": {
    weapon: "Catalyst",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Anemo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 3.2
  "Layla": {
    weapon: "Sword",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "HP%": 1,
    },
  },
  
  "Nahida": {
    weapon: "Catalyst",
    ascension: { "Elemental Mastery": 115 },
    passive: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.75,
    },
  },
  
  // Version 3.1
  "Candace": {
    weapon: "Polearm",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "HP%": 0.75,
    },
  },
  
  "Cyno": {
    weapon: "Polearm",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.75,
    },
  },
  
  "Nilou": {
    weapon: "Sword",
    ascension: { "HP%": 28.8 },
    passive: {},
    weights: {
      "HP%": 1,
    },
  },
  
  // Version 3.0
  "Collei": {
    weapon: "Bow",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.75,
    },
  },
  
  "Dori": {
    weapon: "Claymore",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.75,
    },
  },
  
  "Tighnari": {
    weapon: "Bow",
    ascension: { "Dendro DMG": 28.8 },
    passive: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.75,
    },
  },
  
  // Version 2.8
  "Shikanoin Heizou": {
    weapon: "Catalyst",
    ascension: { "Anemo DMG": 24 },
    passive: {},
    weights: {
      "Anemo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 2.7
  "Kuki Shinobu": {
    weapon: "Sword",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "Elemental Mastery": 1,
      "HP%": 0.75,
    },
  },
  
  "Yelan": {
    weapon: "Bow",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.75,
    },
  },
  
  // Version 2.6
  "Kamisato Ayato": {
    weapon: "Sword",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 2.5
  "Yae Miko": {
    weapon: "Catalyst",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
      "Elemental Mastery": 0.75,
    },
  },
  
  // Version 2.4
  "Shenhe": {
    weapon: "Polearm",
    ascension: { "ATK%": 28.8 },
    passive: {},
    weights: {
      "ATK%": 1,
    },
  },
  
  "Yun Jin": {
    weapon: "Polearm",
    ascension: { "Energy Recharge": 26.7 },
    passive: {},
    weights: {
      "DEF%": 1,
    },
  },
  
  // Version 2.3
  "Arataki Itto": {
    weapon: "Claymore",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.75,
    },
  },
  
  "Gorou": {
    weapon: "Bow",
    ascension: { "Geo DMG": 24 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "DEF%": 0.75,
    },
  },
  
  // Version 2.2
  "Thoma": {
    weapon: "Polearm",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "HP%": 0.75,
    },
  },
  
  // Version 2.1
  "Aloy": {
    weapon: "Bow",
    ascension: { "Cryo DMG": 28.8 },
    passive: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Kujou Sara": {
    weapon: "Bow",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Raiden Shogun": {
    weapon: "Polearm",
    ascension: { "Energy Recharge": 32 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Sangonomiya Kokomi": {
    weapon: "Catalyst",
    ascension: { "Hydro DMG": 28.8 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "Hydro DMG": 1,
      "HP%": 0.75,
    },
  },
  
  // Version 2.0
  "Kamisato Ayaka": {
    weapon: "Sword",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Sayu": {
    weapon: "Claymore",
    ascension: { "Elemental Mastery": 96 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "ATK%": 0.75,
      "Elemental Mastery": 0.75,
    },
  },
  
  "Yoimiya": {
    weapon: "Bow",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 1.6
  "Kaedehara Kazuha": {
    weapon: "Sword",
    ascension: { "Elemental Mastery": 115 },
    passive: {},
    weights: {
      "Elemental Mastery": 1,
    },
  },
  
  // Version 1.5
  "Eula": {
    weapon: "Claymore",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Physical DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Yanfei": {
    weapon: "Catalyst",
    ascension: { "Pyro DMG": 24 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
      "Elemental Mastery": 0.6,
    },
  },
  
  // Version 1.4
  "Rosaria": {
    weapon: "Polearm",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 1.3
  "Hu Tao": {
    weapon: "Polearm",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.75,
      "Elemental Mastery": 0.6,
    },
  },
  
  "Xiao": {
    weapon: "Polearm",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Anemo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 1.2
  "Albedo": {
    weapon: "Sword",
    ascension: { "Geo DMG": 28.8 },
    passive: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.75,
    },
  },
  
  "Ganyu": {
    weapon: "Bow",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  // Version 1.1
  "Diona": {
    weapon: "Bow",
    ascension: { "Cryo DMG": 24 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.75,
    },
  },
  
  "Tartaglia": {
    weapon: "Bow",
    ascension: { "Hydro DMG": 28.8 },
    passive: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Xinyan": {
    weapon: "Claymore",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Physical DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Zhongli": {
    weapon: "Polearm",
    ascension: { "Geo DMG": 28.8 },
    passive: {},
    weights: {
      "HP%": 0.75,
    },
  },
  
  // Version 1.0
  "Amber": {
    weapon: "Bow",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Barbara": {
    weapon: "Catalyst",
    ascension: { "HP%": 24 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.75,
    },
  },
  
  "Beidou": {
    weapon: "Claymore",
    ascension: { "Electro DMG": 24 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Bennett": {
    weapon: "Sword",
    ascension: { "Energy Recharge": 26.7 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.75,
    },
  },
  
  "Chongyun": {
    weapon: "Claymore",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Diluc": {
    weapon: "Claymore",
    ascension: { "CRIT Rate": 19.2 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Fischl": {
    weapon: "Bow",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Jean": {
    weapon: "Sword",
    ascension: { "Healing Bonus": 22.1 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "ATK%": 0.75,
    },
  },
  
  "Kaeya": {
    weapon: "Sword",
    ascension: { "Energy Recharge": 26.7 },
    passive: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Keqing": {
    weapon: "Sword",
    ascension: { "CRIT DMG": 38.4 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Klee": {
    weapon: "Catalyst",
    ascension: { "Pyro DMG": 28.8 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Lisa": {
    weapon: "Catalyst",
    ascension: { "Elemental Mastery": 96 },
    passive: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
      "Elemental Mastery": 0.6,
    },
  },
  
  "Mona": {
    weapon: "Catalyst",
    ascension: { "Energy Recharge": 32 },
    passive: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Ningguang": {
    weapon: "Catalyst",
    ascension: { "Geo DMG": 24 },
    passive: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Noelle": {
    weapon: "Claymore",
    ascension: { "DEF%": 30 },
    passive: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.75,
    },
  },
  
  "Qiqi": {
    weapon: "Sword",
    ascension: { "Healing Bonus": 22.1 },
    passive: {},
    weights: {
      "Healing Bonus": 1,
      "ATK%": 0.75,
      "HP%": 0.3,
      "DEF%": 0.3,
    },
  },
  
  "Razor": {
    weapon: "Claymore",
    ascension: { "Physical DMG": 30 },
    passive: {},
    weights: {
      "Physical DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
  
  "Sucrose": {
    weapon: "Catalyst",
    ascension: { "Anemo DMG": 24 },
    passive: {},
    weights: {
      "Elemental Mastery": 1,
    },
  },
  
  "Venti": {
    weapon: "Bow",
    ascension: { "Energy Recharge": 32 },
    passive: {},
    weights: {
      "Elemental Mastery": 1,
    },
  },
  
  "Xiangling": {
    weapon: "Polearm",
    ascension: { "Elemental Mastery": 96 },
    passive: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
      "Elemental Mastery": 0.6,
    },
  },
  
  "Xingqiu": {
    weapon: "Sword",
    ascension: { "ATK%": 24 },
    passive: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.75,
    },
  },
};

export default CHARACTERS;
