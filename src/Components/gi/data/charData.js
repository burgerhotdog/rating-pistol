const charData = {
  // Version 5.2
  Chasca: {
    name: "Chasca",
    rarity: "5 Star",
    weapType: "bow",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Ororon: {
    name: "Ororon",
    rarity: "4 Star",
    weapType: "bow",
    vision: "electro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 5.1
  Xilonen: {
    name: "Xilonen",
    rarity: "5 Star",
    weapType: "sword",
    vision: "geo",
    mainstats: ["HP", "ATK", "ER%", "DEF%", "Healing Bonus"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 5.0
  Kachina: {
    name: "Kachina",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "geo",
    mainstats: ["HP", "ATK", "ER%", "Geo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Kinich: {
    name: "Kinich",
    rarity: "5 Star",
    weapType: "claymore",
    vision: "dendro",
    mainstats: ["HP", "ATK", "ATK%", "Dendro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Mualani: {
    name: "Mualani",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "hydro",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 4.8
  Emilie: {
    name: "Emilie",
    rarity: "5 Star",
    weapType: "polearm",
    vision: "dendro",
    mainstats: ["HP", "ATK", "ATK%", "Dendro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.7
  Clorinde: {
    name: "Clorinde",
    rarity: "5 Star",
    weapType: "sword",
    vision: "electro",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sethos: {
    name: "Sethos",
    rarity: "4 Star",
    weapType: "bow",
    vision: "electro",
    mainstats: ["HP", "ATK", "EM", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },
  Sigewinne: {
    name: "Sigewinne",
    rarity: "5 Star",
    weapType: "bow",
    vision: "hydro",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 4.6
  Arlecchino: {
    name: "Arlecchino",
    rarity: "5 Star",
    weapType: "polearm",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.5
  Chiori: {
    name: "Chiori",
    rarity: "5 Star",
    weapType: "sword",
    vision: "geo",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },

  // Version 4.4
  Gaming: {
    name: "Gaming",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xianyun: {
    name: "Xianyun",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ATK%/ER%", "ATK%", "ATK%"],
    substats: ["ER%", "ATK%", "ATK"],
  },

  // Version 4.3
  Chevreuse: {
    name: "Chevreuse",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "pyro",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },
  Navia: {
    name: "Navia",
    rarity: "5 Star",
    weapType: "claymore",
    vision: "geo",
    mainstats: ["HP", "ATK", "ATK%", "Geo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.2
  Charlotte: {
    name: "Charlotte",
    rarity: "4 Star",
    weapType: "catalyst",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  Furina: {
    name: "Furina",
    rarity: "5 Star",
    weapType: "sword",
    vision: "hydro",
    mainstats: ["HP", "ATK", "HP%/ER%", "Hydro DMG/HP%", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 4.1
  Neuvillette: {
    name: "Neuvillette",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "hydro",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },
  Wriothesley: {
    name: "Wriothesley",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.0
  Freminet: {
    name: "Freminet",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lynette: {
    name: "Lynette",
    rarity: "4 Star",
    weapType: "sword",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Anemo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lyney: {
    name: "Lyney",
    rarity: "5 Star",
    weapType: "bow",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 3.7
  Kirara: {
    name: "Kirara",
    rarity: "4 Star",
    weapType: "sword",
    vision: "dendro",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.6
  Baizhu: {
    name: "Baizhu",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "dendro",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },
  Kaveh: {
    name: "Kaveh",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "dendro",
    mainstats: ["HP", "ATK", "EM/ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },

  // Version 3.5
  Dehya: {
    name: "Dehya",
    rarity: "5 Star",
    weapType: "claymore",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Mika: {
    name: "Mika",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "cryo",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.4
  Alhaitham: {
    name: "Alhaitham",
    rarity: "5 Star",
    weapType: "sword",
    vision: "dendro",
    mainstats: ["HP", "ATK", "EM", "Dendro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },
  Yaoyao: {
    name: "Yaoyao",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "dendro",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.3
  Faruzan: {
    name: "Faruzan",
    rarity: "4 Star",
    weapType: "bow",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ER%", "Anemo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },
  Wanderer: {
    name: "Wanderer",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 3.2
  Layla: {
    name: "Layla",
    rarity: "4 Star",
    weapType: "sword",
    vision: "cryo",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },
  Nahida: {
    name: "Nahida",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "dendro",
    mainstats: ["HP", "ATK", "EM", "Dendro DMG/EM", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  // Version 3.1
  Candace: {
    name: "Candace",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "hydro",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },
  Cyno: {
    name: "Cyno",
    rarity: "5 Star",
    weapType: "polearm",
    vision: "electro",
    mainstats: ["HP", "ATK", "EM", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },
  Nilou: {
    name: "Nilou",
    rarity: "5 Star",
    weapType: "sword",
    vision: "hydro",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.0
  Collei: {
    name: "Collei",
    rarity: "4 Star",
    weapType: "bow",
    vision: "dendro",
    mainstats: ["HP", "ATK", "ER%", "Dendro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },
  Dori: {
    name: "Dori",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "electro",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },
  Tighnari: {
    name: "Tighnari",
    rarity: "5 Star",
    weapType: "bow",
    vision: "dendro",
    mainstats: ["HP", "ATK", "EM", "Dendro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  // Version 2.8
  ShikanoinHeizou: {
    name: "Shikanoin Heizou",
    rarity: "4 Star",
    weapType: "catalyst",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.7
  KukiShinobu: {
    name: "Kuki Shinobu",
    rarity: "4 Star",
    weapType: "sword",
    vision: "electro",
    mainstats: ["HP", "ATK", "EM", "EM", "EM"],
    substats: ["ER%", "EM", "HP%"],
  },
  Yelan: {
    name: "Yelan",
    rarity: "5 Star",
    weapType: "bow",
    vision: "hydro",
    mainstats: ["HP", "ATK", "HP%/ER%", "Hydro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 2.6
  KamisatoAyato: {
    name: "Kamisato Ayato",
    rarity: "5 Star",
    weapType: "sword",
    vision: "hydro",
    mainstats: ["HP", "ATK", "ATK%", "Hydro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.5
  YaeMiko: {
    name: "Yae Miko",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "electro",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.4
  Shenhe: {
    name: "Shenhe",
    rarity: "5 Star",
    weapType: "polearm",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%/ER%", "ATK%", "ATK%"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  YunJin: {
    name: "Yun Jin",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "geo",
    mainstats: ["HP", "ATK", "DEF%/ER%", "DEF%", "DEF%"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 2.3
  AratakiItto: {
    name: "Arataki Itto",
    rarity: "5 Star",
    weapType: "claymore",
    vision: "geo",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Gorou: {
    name: "Gorou",
    rarity: "4 Star",
    weapType: "bow",
    vision: "geo",
    mainstats: ["HP", "ATK", "ER%", "DEF%", "Healing Bonus"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 2.2
  Thoma: {
    name: "Thoma",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "pyro",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 2.1
  Aloy: {
    name: "Aloy",
    rarity: "5 Star",
    weapType: "bow",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  KujouSara: {
    name: "Kujou Sara",
    rarity: "4 Star",
    weapType: "bow",
    vision: "electro",
    mainstats: ["HP", "ATK", "ER%", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },
  RaidenShogun: {
    name: "Raiden Shogun",
    rarity: "5 Star",
    weapType: "polearm",
    vision: "electro",
    mainstats: ["HP", "ATK", "ER%", "Electro DMG/ATK%", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },
  SangonomiyaKokomi: {
    name: "Sangonomiya Kokomi",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "hydro",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 2.0
  KamisatoAyaka: {
    name: "Kamisato Ayaka",
    rarity: "5 Star",
    weapType: "sword",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sayu: {
    name: "Sayu",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  Yoimiya: {
    name: "Yoimiya",
    rarity: "5 Star",
    weapType: "bow",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.6
  KaedeharaKazuha: {
    name: "Kaedehara Kazuha",
    rarity: "5 Star",
    weapType: "sword",
    vision: "anemo",
    mainstats: ["HP", "ATK", "EM/ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },

  // Version 1.5
  Eula: {
    name: "Eula",
    rarity: "5 Star",
    weapType: "claymore",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Yanfei: {
    name: "Yanfei",
    rarity: "4 Star",
    weapType: "catalyst",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.4
  Rosaria: {
    name: "Rosaria",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Cryo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.3
  HuTao: {
    name: "Hu Tao",
    rarity: "5 Star",
    weapType: "polearm",
    vision: "pyro",
    mainstats: ["HP", "ATK", "HP%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },
  Xiao: {
    name: "Xiao",
    rarity: "5 Star",
    weapType: "polearm",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.2
  Albedo: {
    name: "Albedo",
    rarity: "5 Star",
    weapType: "sword",
    vision: "geo",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Ganyu: {
    name: "Ganyu",
    rarity: "5 Star",
    weapType: "bow",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.1
  Diona: {
    name: "Diona",
    rarity: "4 Star",
    weapType: "bow",
    vision: "cryo",
    mainstats: ["HP", "ATK", "HP%/ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },
  Tartaglia: {
    name: "Tartaglia",
    rarity: "5 Star",
    weapType: "bow",
    vision: "hydro",
    mainstats: ["HP", "ATK", "ATK%", "Hydro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xinyan: {
    name: "Xinyan",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Physical DMG%", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Zhongli: {
    name: "Zhongli",
    rarity: "5 Star",
    weapType: "polearm",
    vision: "geo",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 1.0
  Amber: {
    name: "Amber",
    rarity: "4 Star",
    weapType: "bow",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Barbara: {
    name: "Barbara",
    rarity: "4 Star",
    weapType: "catalyst",
    vision: "hydro",
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },
  Beidou: {
    name: "Beidou",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "electro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Bennett: {
    name: "Bennett",
    rarity: "4 Star",
    weapType: "sword",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },
  Chongyun: {
    name: "Chongyun",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Cryo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Diluc: {
    name: "Diluc",
    rarity: "5 Star",
    weapType: "claymore",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Fischl: {
    name: "Fischl",
    rarity: "4 Star",
    weapType: "bow",
    vision: "electro",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Jean: {
    name: "Jean",
    rarity: "5 Star",
    weapType: "sword",
    vision: "anemo",
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  Kaeya: {
    name: "Kaeya",
    rarity: "4 Star",
    weapType: "sword",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Cryo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Keqing: {
    name: "Keqing",
    rarity: "5 Star",
    weapType: "sword",
    vision: "electro",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Klee: {
    name: "Klee",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lisa: {
    name: "Lisa",
    rarity: "4 Star",
    weapType: "catalyst",
    vision: "electro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Electro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Mona: {
    name: "Mona",
    rarity: "5 Star",
    weapType: "catalyst",
    vision: "hydro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Hydro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Ningguang: {
    name: "Ningguang",
    rarity: "4 Star",
    weapType: "catalyst",
    vision: "geo",
    mainstats: ["HP", "ATK", "ATK%", "Geo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Noelle: {
    name: "Noelle",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "geo",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Qiqi: {
    name: "Qiqi",
    rarity: "5 Star",
    weapType: "sword",
    vision: "cryo",
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  Razor: {
    name: "Razor",
    rarity: "4 Star",
    weapType: "claymore",
    vision: "electro",
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sucrose: {
    name: "Sucrose",
    rarity: "4 Star",
    weapType: "catalyst",
    vision: "anemo",
    mainstats: ["HP", "ATK", "EM/ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },
  Venti: {
    name: "Venti",
    rarity: "5 Star",
    weapType: "bow",
    vision: "anemo",
    mainstats: ["HP", "ATK", "EM/ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },
  Xiangling: {
    name: "Xiangling",
    rarity: "4 Star",
    weapType: "polearm",
    vision: "pyro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Pyro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xingqiu: {
    name: "Xingqiu",
    rarity: "4 Star",
    weapType: "sword",
    vision: "hydro",
    mainstats: ["HP", "ATK", "ATK%/ER%", "Hydro DMG", "CRIT Rate/DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
};

export default charData;
