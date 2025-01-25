const CHARACTERS = {
  // Version 5.3
  "Citlali": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Elemental Mastery": 115 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Elemental Mastery": 0.8,
    },
  },

  "Lan Yan": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: {},
    weights: {
      "ATK%": 0.8,
      "Elemental Mastery": 0.5,
    },
  },
  
  "Mavuika": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 38.4 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 5.2
  "Chasca": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Ororon": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 5.1
  "Xilonen": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "DEF%": 36 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Healing Bonus": 1,
      "DEF%": 0.8,
    },
  },
  
  // Version 5.0
  "Kachina": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Geo DMG": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.5,
    },
  },
  
  "Kinich": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Mualani": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  // Version 4.8
  "Emilie": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 4.7
  "Clorinde": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Sethos": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Elemental Mastery": 96 },
    requirements: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.5,
    },
  },
  
  "Sigewinne": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 28.8 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "HP%": 0.8,
    },
  },
  
  // Version 4.6
  "Arlecchino": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 4.5
  "Chiori": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.5,
    },
  },
  
  // Version 4.4
  "Gaming": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Xianyun": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 28.8 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "ATK%": 0.8,
    },
  },
  
  // Version 4.3
  "Chevreuse": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: {},
    weights: {
      "HP%": 0.8,
    },
  },
  
  "Navia": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 4.2
  "Charlotte": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 250 },
    weights: {
      "Healing Bonus": 1,
      "ATK%": 0.8,
    },
  },
  
  "Furina": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Hydro DMG": 0.5,
      "HP%": 0.5,
    },
  },
  
  // Version 4.1
  "Neuvillette": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.5,
    },
  },
  
  "Wriothesley": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  // Version 4.0
  "Freminet": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: {},
    weights: {
      "Physical DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Lynette": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Anemo DMG": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Anemo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Lyney": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 3.8
  
  // Version 3.7
  "Kirara": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: {},
    weights: {
      "HP%": 0.8,
    },
  },
  
  // Version 3.6
  "Baizhu": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 28.8 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "HP%": 0.8,
    },
  },
  
  "Kaveh": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Elemental Mastery": 96 },
    requirements: {},
    weights: {
      "Elemental Mastery": 0.8,
    },
  },
  
  // Version 3.5
  "Dehya": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 28.8 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.5,
    },
  },
  
  "Mika": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.8,
    },
  },
  
  // Version 3.4
  "Alhaitham": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Dendro DMG": 28.8 },
    requirements: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.5,
    },
  },
  
  "Yaoyao": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.8,
    },
  },
  
  // Version 3.3
  "Faruzan": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 250 },
    weights: {
      "Anemo DMG": 0.5,
      "CRIT Rate": 0.5,
      "CRIT DMG": 0.5,
      "ATK%": 0.25
    },
  },
  
  "Wanderer": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Anemo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 3.2
  "Layla": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: {},
    weights: {
      "HP%": 0.8,
    },
  },
  
  "Nahida": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Elemental Mastery": 115 },
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Dendro DMG": 0.5,
      "Elemental Mastery": 0.5,
    },
  },
  
  // Version 3.1
  "Candace": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "HP%": 0.8,
    },
  },
  
  "Cyno": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.4,
      "ATK%": 0.3,
    },
  },
  
  "Nilou": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 28.8 },
    requirements: {},
    weights: {
      "HP%": 0.8,
    },
  },
  
  // Version 3.0
  "Collei": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.4,
      "ATK%": 0.3,
    },
  },
  
  "Dori": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.8,
    },
  },
  
  "Tighnari": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Dendro DMG": 28.8 },
    requirements: {},
    weights: {
      "Dendro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.4,
      "ATK%": 0.3,
    },
  },
  
  // Version 2.8
  "Shikanoin Heizou": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Anemo DMG": 24 },
    requirements: {},
    weights: {
      "Anemo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 2.7
  "Kuki Shinobu": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: {},
    weights: {
      "Elemental Mastery": 0.8,
      "HP%": 0.5,
    },
  },
  
  "Yelan": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.5,
    },
  },
  
  // Version 2.6
  "Kamisato Ayato": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 2.5
  "Yae Miko": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "Elemental Mastery": 0.4,
      "ATK%": 0.3,
    },
  },
  
  // Version 2.4
  "Shenhe": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 28.8 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "ATK%": 0.8,
    },
  },
  
  "Yun Jin": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Energy Recharge": 26.7 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "DEF%": 0.8,
    },
  },
  
  // Version 2.3
  "Arataki Itto": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.5,
    },
  },
  
  "Gorou": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Geo DMG": 24 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Healing Bonus": 1,
      "DEF%": 0.8,
    },
  },
  
  // Version 2.2
  "Thoma": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "HP%": 0.8,
    },
  },
  
  // Version 2.1
  "Aloy": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Cryo DMG": 28.8 },
    requirements: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Kujou Sara": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Raiden Shogun": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Energy Recharge": 32 },
    requirements: { "Energy Recharge": 250 },
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Sangonomiya Kokomi": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Hydro DMG": 28.8 },
    requirements: {},
    weights: {
      "Healing Bonus": 1,
      "Hydro DMG": 1,
      "HP%": 0.8,
    },
  },
  
  // Version 2.0
  "Kamisato Ayaka": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Sayu": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Elemental Mastery": 96 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Healing Bonus": 1,
      "Elemental Mastery": 0.8,
      "ATK%": 0.5,
    },
  },
  
  "Yoimiya": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  // Version 1.6
  "Kaedehara Kazuha": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Elemental Mastery": 115 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Elemental Mastery": 0.8,
    },
  },
  
  // Version 1.5
  "Eula": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Physical DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Yanfei": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Pyro DMG": 24 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  // Version 1.4
  "Rosaria": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  // Version 1.3
  "Hu Tao": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Xiao": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Anemo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  // Version 1.2
  "Albedo": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Geo DMG": 28.8 },
    requirements: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.5,
    },
  },
  
  "Ganyu": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  // Version 1.1
  "Diona": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Cryo DMG": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.8,
    },
  },
  
  "Tartaglia": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Hydro DMG": 28.8 },
    requirements: {},
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Xinyan": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: {},
    weights: {
      "Physical DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Zhongli": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Geo DMG": 28.8 },
    requirements: {},
    weights: {
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "HP%": 0.5,
      "ATK%": 0.2,
    },
  },
  
  // Version 1.0
  "Amber": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Barbara": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "HP%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.8,
    },
  },
  
  "Beidou": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Electro DMG": 24 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Bennett": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Energy Recharge": 26.7 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Healing Bonus": 1,
      "HP%": 0.8,
    },
  },
  
  "Chongyun": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: {},
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Diluc": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT Rate": 19.2 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Fischl": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.4,
      "Elemental Mastery": 0.3,
    },
  },
  
  "Jean": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Healing Bonus": 22.1 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Healing Bonus": 1,
      "ATK%": 0.8,
    },
  },
  
  "Kaeya": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Energy Recharge": 26.7 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Cryo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Keqing": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "CRIT DMG": 38.4 },
    requirements: {},
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.4,
      "Elemental Mastery": 0.3,
    },
  },
  
  "Klee": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Pyro DMG": 28.8 },
    requirements: {},
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Lisa": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Elemental Mastery": 96 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Electro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.4,
      "Elemental Mastery": 0.3,
    },
  },
  
  "Mona": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Energy Recharge": 32 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Ningguang": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Geo DMG": 24 },
    requirements: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Noelle": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "DEF%": 30 },
    requirements: {},
    weights: {
      "Geo DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "DEF%": 0.5,
    },
  },
  
  "Qiqi": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Healing Bonus": 22.1 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Healing Bonus": 1,
      "ATK%": 0.8,
    },
  },
  
  "Razor": {
    type: "Claymore",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Physical DMG": 30 },
    requirements: {},
    weights: {
      "Physical DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
  
  "Sucrose": {
    type: "Catalyst",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Anemo DMG": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Elemental Mastery": 0.8,
    },
  },
  
  "Venti": {
    type: "Bow",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Energy Recharge": 32 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Elemental Mastery": 0.8,
    },
  },
  
  "Xiangling": {
    type: "Polearm",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "Elemental Mastery": 96 },
    requirements: { "Energy Recharge": 200 },
    weights: {
      "Pyro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
      "Elemental Mastery": 0.2,
    },
  },
  
  "Xingqiu": {
    type: "Sword",
    base: { HP: 0, ATK: 0, DEF: 0 },
    stats: { "ATK%": 24 },
    requirements: { "Energy Recharge": 150 },
    weights: {
      "Hydro DMG": 1,
      "CRIT Rate": 1,
      "CRIT DMG": 1,
      "ATK%": 0.5,
    },
  },
};

export default CHARACTERS;
