const characterdb = {
  // Version 1.0
  Amber: {
    quality: 0,
    element: "pyro",
    weapon: "bow",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Barbara: {
    quality: 0,
    element: "hydro",
    weapon: "catalyst",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "Healing Bonus"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },
  Beidou: {
    quality: 0,
    element: "electro",
    weapon: "claymore",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge%", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Bennett: {
    quality: 0,
    element: "pyro",
    weapon: "sword",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "Healing Bonus"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },
  Chongyun: {
    quality: 0,
    element: "cryo",
    weapon: "claymore",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Diluc: {
    quality: 1,
    element: "pyro",
    weapon: "claymore",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Fischl: {
    quality: 0,
    element: "electro",
    weapon: "bow",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Jean: {
    quality: 1,
    element: "anemo",
    weapon: "sword",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "ATK%", "Healing Bonus"],
    substats: ["Energy Recharge", "ATK%", "ATK"],
  },
  Kaeya: {
    quality: 0,
    element: "cryo",
    weapon: "sword",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "Cryo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Keqing: {
    quality: 1,
    element: "electro",
    weapon: "sword",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Klee: {
    quality: 1,
    element: "pyro",
    weapon: "catalyst",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lisa: {
    quality: 0,
    element: "electro",
    weapon: "catalyst",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Mona: {
    quality: 1,
    element: "hydro",
    weapon: "catalyst",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "Hydro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Ningguang: {
    quality: 0,
    element: "geo",
    weapon: "catalyst",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "Geo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Noelle: {
    quality: 0,
    element: "geo",
    weapon: "claymore",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Qiqi: {
    quality: 1,
    element: "cryo",
    weapon: "sword",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge", "ATK%", "Healing Bonus"],
    substats: ["Energy Recharge", "ATK%", "ATK"],
  },
  Razor: {
    quality: 0,
    element: "electro",
    weapon: "claymore",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sucrose: {
    quality: 0,
    element: "anemo",
    weapon: "catalyst",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Elemental Mastery", "Elemental Mastery"],
    substats: ["Energy Recharge", "Elemental Mastery", "ATK%"],
  },
  Venti: {
    quality: 1,
    element: "anemo",
    weapon: "bow",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Elemental Mastery", "Elemental Mastery"],
    substats: ["Energy Recharge", "Elemental Mastery", "ATK%"],
  },
  Xiangling: {
    quality: 0,
    element: "pyro",
    weapon: "polearm",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xingqiu: {
    quality: 0,
    element: "hydro",
    weapon: "sword",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge%", "Hydro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.1
  Diona: {
    quality: 0,
    element: "cryo",
    weapon: "bow",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "Healing Bonus"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },
  Tartaglia: {
    quality: 1,
    element: "hydro",
    weapon: "bow",
    region: "Snezhnaya",
    mainstats: ["HP", "ATK", "ATK%", "Hydro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xinyan: {
    quality: 0,
    element: "pyro",
    weapon: "claymore",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG%", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Zhongli: {
    quality: 1,
    element: "geo",
    weapon: "polearm",
    region: "Liyue",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },

  // Version 1.2
  Albedo: {
    quality: 1,
    element: "geo",
    weapon: "sword",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Ganyu: {
    quality: 1,
    element: "cryo",
    weapon: "bow",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.3
  HuTao: {
    quality: 1,
    element: "pyro",
    weapon: "polearm",
    region: "Liyue",
    mainstats: ["HP", "ATK", "HP%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },
  Xiao: {
    quality: 1,
    element: "anemo",
    weapon: "polearm",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.4
  Rosaria: {
    quality: 0,
    element: "cryo",
    weapon: "polearm",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "Cryo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.5
  Eula: {
    quality: 1,
    element: "cryo",
    weapon: "claymore",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Yanfei: {
    quality: 0,
    element: "pyro",
    weapon: "catalyst",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.6
  KaedeharaKazuha: {
    quality: 1,
    element: "anemo",
    weapon: "sword",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Elemental Mastery", "Elemental Mastery"],
    substats: ["Energy Recharge", "Elemental Mastery", "ATK%"],
  },

  // Version 2.0
  KamisatoAyaka: {
    quality: 1,
    element: "cryo",
    weapon: "sword",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sayu: {
    quality: 0,
    element: "anemo",
    weapon: "claymore",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "Energy Recharge", "ATK%", "Healing Bonus"],
    substats: ["Energy Recharge", "ATK%", "ATK"],
  },
  Yoimiya: {
    quality: 1,
    element: "pyro",
    weapon: "bow",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.1
  Aloy: {
    quality: 1,
    element: "cryo",
    weapon: "bow",
    region: "none",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  KujouSara: {
    quality: 0,
    element: "electro",
    weapon: "bow",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "Energy Recharge", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "Energy Recharge"],
  },
  RaidenShogun: {
    quality: 1,
    element: "electro",
    weapon: "polearm",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "Energy Recharge", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "Energy Recharge"],
  },
  SangonomiyaKokomi: {
    quality: 1,
    element: "hydro",
    weapon: "catalyst",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "Healing Bonus"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },

  // Version 2.2
  Thoma: {
    quality: 0,
    element: "pyro",
    weapon: "polearm",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },

  // Version 2.3
  AratakiItto: {
    quality: 1,
    element: "geo",
    weapon: "claymore",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Gorou: {
    quality: 0,
    element: "geo",
    weapon: "bow",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "Energy Recharge", "DEF%", "Healing Bonus"],
    substats: ["Energy Recharge", "DEF%", "DEF"],
  },

  // Version 2.4
  Shenhe: {
    quality: 1,
    element: "cryo",
    weapon: "polearm",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "ATK%"],
    substats: ["Energy Recharge", "ATK%", "ATK"],
  },
  YunJin: {
    quality: 0,
    element: "geo",
    weapon: "polearm",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge", "DEF%", "DEF%"],
    substats: ["Energy Recharge", "DEF%", "DEF"],
  },

  // Version 2.5
  YaeMiko: {
    quality: 1,
    element: "electro",
    weapon: "catalyst",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.6
  KamisatoAyato: {
    quality: 1,
    element: "hydro",
    weapon: "sword",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "ATK%", "Hydro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.7
  KukiShinobu: {
    quality: 0,
    element: "electro",
    weapon: "sword",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Elemental Mastery", "Elemental Mastery"],
    substats: ["Energy Recharge", "Elemental Mastery", "HP%"],
  },
  Yelan: {
    quality: 1,
    element: "hydro",
    weapon: "bow",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge", "Hydro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 2.8
  ShikanoinHeizou: {
    quality: 0,
    element: "anemo",
    weapon: "catalyst",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 3.0
  Collei: {
    quality: 0,
    element: "dendro",
    weapon: "bow",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Energy Recharge", "Dendro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Dori: {
    quality: 0,
    element: "electro",
    weapon: "claymore",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "Healing Bonus"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },
  Tighnari: {
    quality: 1,
    element: "dendro",
    weapon: "bow",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Dendro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "Elemental Mastery"],
  },

  // Version 3.1
  Candace: {
    quality: 0,
    element: "hydro",
    weapon: "polearm",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Energy Rechage", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },
  Cyno: {
    quality: 1,
    element: "electro",
    weapon: "polearm",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Electro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "Elemental Mastery"],
  },
  Nilou: {
    quality: 1,
    element: "hydro",
    weapon: "sword",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },

  // Version 3.2
  Layla: {
    quality: 0,
    element: "cryo",
    weapon: "sword",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },
  Nahida: {
    quality: 1,
    element: "dendro",
    weapon: "catalyst",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Dendro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "Elemental Mastery"],
  },

  // Version 3.3
  Faruzan: {
    quality: 0,
    element: "anemo",
    weapon: "bow",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Energy Recharge", "Anemo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "Energy Recharge"],
  },
  Wanderer: {
    quality: 1,
    element: "anemo",
    weapon: "catalyst",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 3.4
  Alhaitham: {
    quality: 1,
    element: "dendro",
    weapon: "sword",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Dendro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "Elemental Mastery"],
  },
  Yaoyao: {
    quality: 0,
    element: "dendro",
    weapon: "polearm",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "Healing Bonus"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },

  // Version 3.5
  Dehya: {
    quality: 1,
    element: "pyro",
    weapon: "claymore",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Energy Recharge", "Pyro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "Energy Recharge"],
  },
  Mika: {
    quality: 0,
    element: "cryo",
    weapon: "polearm",
    region: "Mondstadt",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "Healing Bonus"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },

  // Version 3.6
  Baizhu: {
    quality: 1,
    element: "dendro",
    weapon: "catalyst",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },
  Kaveh: {
    quality: 0,
    element: "dendro",
    weapon: "claymore",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Energy Recharge", "Elemental Mastery", "Elemental Mastery"],
    substats: ["Energy Recharge", "Elemental Mastery", "ATK%"],
  },

  // Version 3.7
  Kirara: {
    quality: 0,
    element: "dendro",
    weapon: "sword",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },

  // Version 4.0
  Freminet: {
    quality: 0,
    element: "cryo",
    weapon: "claymore",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lynette: {
    quality: 0,
    element: "anemo",
    weapon: "sword",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "Energy Recharge", "Anemo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "Energy Recharge"],
  },
  Lyney: {
    quality: 1,
    element: "pyro",
    weapon: "bow",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.1
  Neuvillette: {
    quality: 1,
    element: "hydro",
    weapon: "catalyst",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },
  Wriothesley: {
    quality: 1,
    element: "cryo",
    weapon: "catalyst",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.2
  Charlotte: {
    quality: 0,
    element: "cryo",
    weapon: "catalyst",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "Energy Recharge", "ATK%", "Healing Bonus"],
    substats: ["Energy Recharge", "ATK%", "ATK"],
  },
  Furina: {
    quality: 1,
    element: "hydro",
    weapon: "sword",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "Energy Recharge", "HP%", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 4.3
  Chevreuse: {
    quality: 0,
    element: "pyro",
    weapon: "polearm",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },
  Navia: {
    quality: 1,
    element: "geo",
    weapon: "claymore",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "ATK%", "Geo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.4
  Gaming: {
    quality: 0,
    element: "pyro",
    weapon: "claymore",
    region: "Liyue",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xianyun: {
    quality: 1,
    element: "anemo",
    weapon: "catalyst",
    region: "Liyue",
    mainstats: ["HP", "ATK", "Energy Recharge", "ATK%", "ATK%"],
    substats: ["Energy Recharge", "ATK%", "ATK"],
  },

  // Version 4.5
  Chiori: {
    quality: 1,
    element: "geo",
    weapon: "sword",
    region: "Inazuma",
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },

  // Version 4.6
  Arlecchino: {
    quality: 1,
    element: "pyro",
    weapon: "polearm",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.7
  Clorinde: {
    quality: 1,
    element: "electro",
    weapon: "sword",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sethos: {
    quality: 0,
    element: "electro",
    weapon: "bow",
    region: "Sumeru",
    mainstats: ["HP", "ATK", "Elemental Mastery", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "Energy Recharge"],
  },
  Sigewinne: {
    quality: 1,
    element: "hydro",
    weapon: "bow",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["Energy Recharge", "HP%", "HP"],
  },

  // Version 4.8
  Emilie: {
    quality: 1,
    element: "dendro",
    weapon: "polearm",
    region: "Fontaine",
    mainstats: ["HP", "ATK", "ATK%", "Dendro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 5.0
  Kachina: {
    quality: 0,
    element: "geo",
    weapon: "polearm",
    region: "Natlan",
    mainstats: ["HP", "ATK", "Energy Recharge", "Geo DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Kinich: {
    quality: 1,
    element: "dendro",
    weapon: "claymore",
    region: "Natlan",
    mainstats: ["HP", "ATK", "ATK%", "Dendro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Mualani: {
    quality: 1,
    element: "hydro",
    weapon: "catalyst",
    region: "Natlan",
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "CRIT DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 5.1
  Xilonen: {
    quality: 1,
    element: "geo",
    weapon: "sword",
    region: "Natlan",
    mainstats: ["HP", "ATK", "Energy Recharge", "DEF%", "Healing Bonus"],
    substats: ["Energy Recharge", "DEF%", "DEF"],
  },

  // Version 5.2
  Chasca: {
    quality: 1,
    element: "anemo",
    weapon: "bow",
    region: "Natlan",
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Ororon: {
    quality: 0,
    element: "electro",
    weapon: "bow",
    region: "Natlan",
    mainstats: ["HP", "ATK", "Energy Recharge", "Electro DMG", "CRIT Rate"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
};

export default characterdb;
