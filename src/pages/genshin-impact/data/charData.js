const charData = {
  // Version 5.3
  Citlali: {
    name: "Citlali",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },

  Mavuika: {
    name: "Mavuika",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 5.2
  Chasca: {
    name: "Chasca",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Anemo",
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Ororon: {
    name: "Ororon",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Electro",
    mainstats: ["HP", "ATK", "ATK% / ER%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 5.1
  Xilonen: {
    name: "Xilonen",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Geo",
    mainstats: ["HP", "ATK", "ER%", "DEF%", "Healing Bonus"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 5.0
  Kachina: {
    name: "Kachina",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Geo",
    mainstats: ["HP", "ATK", "ER%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },

  Kinich: {
    name: "Kinich",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Dendro",
    mainstats: ["HP", "ATK", "ATK%", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Mualani: {
    name: "Mualani",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Hydro",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 4.8
  Emilie: {
    name: "Emilie",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Dendro",
    mainstats: ["HP", "ATK", "ATK%", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.7
  Clorinde: {
    name: "Clorinde",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Electro",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Sethos: {
    name: "Sethos",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Electro",
    mainstats: ["HP", "ATK", "EM", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  Sigewinne: {
    name: "Sigewinne",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Hydro",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 4.6
  Arlecchino: {
    name: "Arlecchino",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.5
  Chiori: {
    name: "Chiori",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Geo",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },

  // Version 4.4
  Gaming: {
    name: "Gaming",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Xianyun: {
    name: "Xianyun",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Anemo",
    mainstats: ["HP", "ATK", "ATK% / ER%", "ATK%", "ATK%"],
    substats: ["ER%", "ATK%", "ATK"],
  },

  // Version 4.3
  Chevreuse: {
    name: "Chevreuse",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Pyro",
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  Navia: {
    name: "Navia",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Geo",
    mainstats: ["HP", "ATK", "ATK%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.2
  Charlotte: {
    name: "Charlotte",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },

  Furina: {
    name: "Furina",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Hydro",
    mainstats: ["HP", "ATK", "HP% / ER%", "Hydro DMG / HP%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 4.1
  Neuvillette: {
    name: "Neuvillette",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Hydro",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  Wriothesley: {
    name: "Wriothesley",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.0
  Freminet: {
    name: "Freminet",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Lynette: {
    name: "Lynette",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Anemo",
    mainstats: ["HP", "ATK", "ATK% / ER%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Lyney: {
    name: "Lyney",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 3.8

  // Version 3.7
  Kirara: {
    name: "Kirara",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Dendro",
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.6
  Baizhu: {
    name: "Baizhu",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Dendro",
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  Kaveh: {
    name: "Kaveh",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Dendro",
    mainstats: ["HP", "ATK", "EM / ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },

  // Version 3.5
  Dehya: {
    name: "Dehya",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Pyro",
    mainstats: ["HP", "ATK", "ATK% / ER%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Mika: {
    name: "Mika",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.4
  Alhaitham: {
    name: "Alhaitham",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Dendro",
    mainstats: ["HP", "ATK", "EM", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  Yaoyao: {
    name: "Yaoyao",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Dendro",
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.3
  Faruzan: {
    name: "Faruzan",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Anemo",
    mainstats: ["HP", "ATK", "ER%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },

  Wanderer: {
    name: "Wanderer",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Anemo",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 3.2
  Layla: {
    name: "Layla",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Cryo",
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  Nahida: {
    name: "Nahida",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Dendro",
    mainstats: ["HP", "ATK", "EM", "Dendro DMG / EM", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  // Version 3.1
  Candace: {
    name: "Candace",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Hydro",
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  Cyno: {
    name: "Cyno",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Electro",
    mainstats: ["HP", "ATK", "EM", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  Nilou: {
    name: "Nilou",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Hydro",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.0
  Collei: {
    name: "Collei",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Dendro",
    mainstats: ["HP", "ATK", "ER%", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },

  Dori: {
    name: "Dori",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Electro",
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  Tighnari: {
    name: "Tighnari",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Dendro",
    mainstats: ["HP", "ATK", "EM", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  // Version 2.8
  ShikanoinHeizou: {
    name: "Shikanoin Heizou",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Anemo",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.7
  KukiShinobu: {
    name: "Kuki Shinobu",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Electro",
    mainstats: ["HP", "ATK", "EM", "EM", "EM"],
    substats: ["ER%", "EM", "HP%"],
  },

  Yelan: {
    name: "Yelan",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Hydro",
    mainstats: ["HP", "ATK", "HP% / ER%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 2.6
  KamisatoAyato: {
    name: "Kamisato Ayato",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Hydro",
    mainstats: ["HP", "ATK", "ATK%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.5
  YaeMiko: {
    name: "Yae Miko",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Electro",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.4
  Shenhe: {
    name: "Shenhe",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ATK% / ER%", "ATK%", "ATK%"],
    substats: ["ER%", "ATK%", "ATK"],
  },

  YunJin: {
    name: "Yun Jin",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Geo",
    mainstats: ["HP", "ATK", "DEF% / ER%", "DEF%", "DEF%"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 2.3
  AratakiItto: {
    name: "Arataki Itto",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Geo",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },

  Gorou: {
    name: "Gorou",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Geo",
    mainstats: ["HP", "ATK", "ER%", "DEF%", "Healing Bonus"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 2.2
  Thoma: {
    name: "Thoma",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Pyro",
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 2.1
  Aloy: {
    name: "Aloy",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  KujouSara: {
    name: "Kujou Sara",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Electro",
    mainstats: ["HP", "ATK", "ER%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },

  RaidenShogun: {
    name: "Raiden Shogun",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Electro",
    mainstats: ["HP", "ATK", "ER%", "Electro DMG / ATK%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },

  SangonomiyaKokomi: {
    name: "Sangonomiya Kokomi",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Hydro",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 2.0
  KamisatoAyaka: {
    name: "Kamisato Ayaka",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Sayu: {
    name: "Sayu",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Anemo",
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },

  Yoimiya: {
    name: "Yoimiya",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.6
  KaedeharaKazuha: {
    name: "Kaedehara Kazuha",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Anemo",
    mainstats: ["HP", "ATK", "EM / ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },

  // Version 1.5
  Eula: {
    name: "Eula",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Yanfei: {
    name: "Yanfei",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.4
  Rosaria: {
    name: "Rosaria",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ATK% / ER%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.3
  HuTao: {
    name: "Hu Tao",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Pyro",
    mainstats: ["HP", "ATK", "HP%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  Xiao: {
    name: "Xiao",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Anemo",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.2
  Albedo: {
    name: "Albedo",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Geo",
    basestats: {
      hp: 13226,
      atk: 251,
      def: 876,
    },
    ascensionstat: { geo: 28.8 },
    energyReq: 100,
    weights: {
      cr: 1,
      cd: 1,
      geo: 1,
      defp: 0.6,
    },
  },

  Ganyu: {
    name: "Ganyu",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.1
  Diona: {
    name: "Diona",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Cryo",
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  Tartaglia: {
    name: "Tartaglia",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Hydro",
    mainstats: ["HP", "ATK", "ATK%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Xinyan: {
    name: "Xinyan",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Pyro",
    mainstats: ["HP", "ATK", "ATK% / ER%", "Physical DMG%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  Zhongli: {
    name: "Zhongli",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Geo",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 1.0
  Amber: {
    name: "Amber",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Pyro",
    basestats: {
      hp: 9461,
      atk: 223,
      def: 601,
    },
    ascensionstat: { atkp: 24 },
    energyReq: 120,
    weights: {
      cr: 1,
      cd: 1,
      pyro: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },

  Barbara: {
    name: "Barbara",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Hydro",
    basestats: {
      hp: 9787,
      atk: 159,
      def: 669,
    },
    ascensionstat: { hpp: 24 },
    energyReq: 120,
    weights: {
      hb: 1,
      er: 1,
      hpp: 1,
    },
  },

  Beidou: {
    name: "Beidou",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Electro",
    basestats: {
      hp: 13050,
      atk: 225,
      def: 648,
    },
    ascensionstat: { electro: 24 },
    energyReq: 180,
    weights: {
      cr: 1,
      cd: 1,
      electro: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },

  Bennett: {
    name: "Bennett",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Pyro",
    basestats: {
      hp: 12397,
      atk: 191,
      def: 771,
    },
    ascensionstat: { er: 26.7 },
    energyReq: 220,
    weights: {
      hb: 1,
      er: 1,
      hpp: 1,
    },
  },

  Chongyun: {
    name: "Chongyun",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Cryo",
    basestats: {
      hp: 10984,
      atk: 223,
      def: 648,
    },
    ascensionstat: { atkp: 24 },
    energyReq: 180,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },

  Diluc: {
    name: "Diluc",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Pyro",
    basestats: {
      hp: 12981,
      atk: 335,
      def: 784,
    },
    ascensionstat: { cr: 19.2 },
    energyReq: 120,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
      em: 0.6,
    },
  },

  Fischl: {
    name: "Fischl",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Electro",
    basestats: {
      hp: 9189,
      atk: 244,
      def: 594,
    },
    ascensionstat: { atkp: 24 },
    energyReq: 120,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
      em: 0.6,
    },
  },

  Jean: {
    name: "Jean",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Anemo",
    basestats: {
      hp: 14695,
      atk: 239,
      def: 769,
    },
    ascensionstat: { hb: 22.1 },
    energyReq: 180,
    weights: {
      hb: 1,
      er: 1,
      atkp: 1,
    },
  },

  Kaeya: {
    name: "Kaeya",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Cryo",
    basestats: {
      hp: 11636,
      atk: 223,
      def: 792,
    },
    ascensionstat: { er: 26.7 },
    energyReq: 180,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },

  Keqing: {
    name: "Keqing",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Electro",
    basestats: {
      hp: 13103,
      atk: 323,
      def: 799,
    },
    ascensionstat: { cd: 38.4 },
    energyReq: 120,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
      em: 0.6,
    },
  },

  Klee: {
    name: "Klee",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Pyro",
    basestats: {
      hp: 10287,
      atk: 311,
      def: 615,
    },
    ascensionstat: { pyro: 28.8 },
    energyReq: 120,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },

  Lisa: {
    name: "Lisa",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Electro",
    basestats: {
      hp: 9570,
      atk: 232,
      def: 573,
    },
    ascensionstat: { em: 96 },
    energyReq: 180,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
      em: 0.6,
    },
  },

  Mona: {
    name: "Mona",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Hydro",
    basestats: {
      hp: 10409,
      atk: 287,
      def: 653,
    },
    ascensionstat: { er: 32 },
    energyReq: 180,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },

  Ningguang: {
    name: "Ningguang",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Geo",
    basestats: {
      hp: 9787,
      atk: 212,
      def: 573,
    },
    ascensionstat: { geo: 24 },
    energyReq: 120,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },

  Noelle: {
    name: "Noelle",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Geo",
    basestats: {
      hp: 12071,
      atk: 191,
      def: 799,
    },
    ascensionstat: { def: 30 },
    energyReq: 140,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      defp: 0.6,
    },
  },

  Qiqi: {
    name: "Qiqi",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Cryo",
    basestats: {
      hp: 12368,
      atk: 287,
      def: 922,
    },
    ascensionstat: { hb: 22.1 },
    energyReq: 180,
    weights: {
      hb: 1,
      er: 1,
      atkp: 1,
    },
  },

  Razor: {
    name: "Razor",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Electro",
    basestats: {
      hp: 11962,
      atk: 234,
      def: 751,
    },
    ascensionstat: { physical: 30 },
    energyReq: 140,
    weights: {
      physical: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },

  Sucrose: {
    name: "Sucrose",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Anemo",
    basestats: {
      hp: 9244,
      atk: 174,
      def: 703,
    },
    ascensionstat: { anemo: 24 },
    energyReq: 140,
    weights: {
      em: 1,
      er: 1,
    },
  },

  Venti: {
    name: "Venti",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Anemo",
    basestats: {
      hp: 10531,
      atk: 263,
      def: 669,
    },
    ascensionstat: { er: 32 },
    energyReq: 160,
    weights: {
      em: 1,
      er: 1,
    },
  },

  Xiangling: {
    name: "Xiangling",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Pyro",
    basestats: {
      hp: 10875,
      atk: 225,
      def: 669,
    },
    ascensionstat: { em: 96 },
    energyReq: 200,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
      em: 0.6,
    },
  },

  Xingqiu: {
    name: "Xingqiu",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Hydro",
    basestats: {
      hp: 10222,
      atk: 202,
      def: 758,
    },
    ascensionstat: { atkp: 24 },
    energyReq: 200,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      er: 0.6,
      atkp: 0.6,
    },
  },
};

export default charData;
