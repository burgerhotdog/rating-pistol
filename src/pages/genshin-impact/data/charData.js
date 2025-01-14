const charData = {
  // Version 5.3
  Citlali: {
    name: "Citlali",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Cryo",
    basestats: { hp: 11634, atk: 127, def: 763 },
    ascension: { em: 115 },
    passivestats: {},
    energyReq: 160,
    weights: {
      em: 1,
      hpp: 0.3,
      defp: 0.3,
    },
  },

  LanYan: {
    name: "Lan Yan",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Anemo",
    basestats: { hp: 9244, atk: 251, def: 580 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 160,
    weights: {
      em: 1,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  Mavuika: {
    name: "Mavuika",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Pyro",
    basestats: { hp: 12552, atk: 359, def: 792 },
    ascension: { cr: 38.4 },
    passivestats: {},
    energyReq: 100,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 5.2
  Chasca: {
    name: "Chasca",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Anemo",
    basestats: { hp: 9797, atk: 347, def: 615 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 100,
    weights: {
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Ororon: {
    name: "Ororon",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Electro",
    basestats: { hp: 9244, atk: 244, def: 587 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 160,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 5.1
  Xilonen: {
    name: "Xilonen",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Geo",
    basestats: { hp: 12405, atk: 275, def: 930 },
    ascension: { defp: 36 },
    passivestats: {},
    energyReq: 180,
    weights: {
      hb: 1,
      defp: 0.75,
      hpp: 0.3,
    },
  },
  
  // Version 5.0
  Kachina: {
    name: "Kachina",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Geo",
    basestats: { hp: 11799, atk: 217, def: 792 },
    ascension: {},
    passivestats: { geo: 24 },
    energyReq: 160,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      defp: 0.75,
    },
  },
  
  Kinich: {
    name: "Kinich",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Dendro",
    basestats: { hp: 12858, atk: 332, def: 802 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 100,
    weights: {
      dendro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Mualani: {
    name: "Mualani",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Hydro",
    basestats: { hp: 15185, atk: 182, def: 570 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 100,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      hpp: 0.75,
    },
  },
  
  // Version 4.8
  Emilie: {
    name: "Emilie",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Dendro",
    basestats: { hp: 13568, atk: 335, def: 730 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 100,
    weights: {
      dendro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 4.7
  Clorinde: {
    name: "Clorinde",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Electro",
    basestats: { hp: 12956, atk: 337, def: 784 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 100,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Sethos: {
    name: "Sethos",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Electro",
    basestats: { hp: 9787, atk: 227, def: 560 },
    ascension: { em: 96 },
    passivestats: {},
    energyReq: 100,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      em: 0.75,
    },
  },
  
  Sigewinne: {
    name: "Sigewinne",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Hydro",
    basestats: { hp: 13348, atk: 193, def: 500 },
    ascension: { hpp: 28.8 },
    passivestats: {},
    energyReq: 150,
    weights: {
      hpp: 1,
      defp: 0.3,
    },
  },
  
  // Version 4.6
  Arlecchino: {
    name: "Arlecchino",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Pyro",
    basestats: { hp: 13103, atk: 342, def: 765 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 100,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 4.5
  Chiori: {
    name: "Chiori",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Geo",
    basestats: { hp: 11438, atk: 323, def: 953 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 100,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      defp: 0.75,
      atkp: 0.3,
    },
  },
  
  // Version 4.4
  Gaming: {
    name: "Gaming",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Pyro",
    basestats: { hp: 11419, atk: 302, def: 703 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 130,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.6,
    },
  },
  
  Xianyun: {
    name: "Xianyun",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Anemo",
    basestats: { hp: 10409, atk: 335, def: 573 },
    ascension: { atkp: 28.8 },
    passivestats: {},
    energyReq: 180,
    weights: {
      atkp: 1,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  // Version 4.3
  Chevreuse: {
    name: "Chevreuse",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Pyro",
    basestats: { hp: 11962, atk: 193, def: 605 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 150,
    weights: {
      hpp: 1,
      defp: 0.3,
    },
  },
  
  Navia: {
    name: "Navia",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Geo",
    basestats: { hp: 12650, atk: 352, def: 793 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 110,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 4.2
  Charlotte: {
    name: "Charlotte",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Cryo",
    basestats: { hp: 10766, atk: 173, def: 546 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 220,
    weights: {
      hb: 1,
      atk: 0.75,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  Furina: {
    name: "Furina",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Hydro",
    basestats: { hp: 15307, atk: 244, def: 696 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 160,
    weights: {
      cr: 1,
      cd: 1,
      hydro: 0.75,
      hpp: 0.75,
    },
  },
  
  // Version 4.1
  Neuvillette: {
    name: "Neuvillette",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Hydro",
    basestats: { hp: 14695, atk: 208, def: 576 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 100,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      hpp: 0.75,
    },
  },
  
  Wriothesley: {
    name: "Wriothesley",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Cryo",
    basestats: { hp: 13593, atk: 311, def: 763 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 100,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 4.0
  Freminet: {
    name: "Freminet",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Cryo",
    basestats: { hp: 12071, atk: 255, def: 708 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 110,
    weights: {
      physical: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Lynette: {
    name: "Lynette",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Anemo",
    basestats: { hp: 12397, atk: 232, def: 712 },
    ascension: { anemo: 24 },
    passivestats: {},
    energyReq: 170,
    weights: {
      anemo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Lyney: {
    name: "Lyney",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Pyro",
    basestats: { hp: 11021, atk: 318, def: 538 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 110,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 3.8
  
  // Version 3.7
  Kirara: {
    name: "Kirara",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Dendro",
    basestats: { hp: 12180, atk: 223, def: 546 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 150,
    weights: {
      hpp: 1,
      defp: 0.3,
    },
  },
  
  // Version 3.6
  Baizhu: {
    name: "Baizhu",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Dendro",
    basestats: { hp: 13348, atk: 193, def: 500 },
    ascension: { hpp: 28.8 },
    passivestats: {},
    energyReq: 160,
    weights: {
      hpp: 1,
      defp: 0.3,
    },
  },
  
  Kaveh: {
    name: "Kaveh",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Dendro",
    basestats: { hp: 11962, atk: 234, def: 751 },
    ascension: { em: 96 },
    passivestats: {},
    energyReq: 160,
    weights: {
      em: 1,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  // Version 3.5
  Dehya: {
    name: "Dehya",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Pyro",
    basestats: { hp: 15675, atk: 265, def: 628 },
    ascension: { hpp: 28.8 },
    passivestats: {},
    energyReq: 160,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      hpp: 0.75,
      atkp: 0.6,
    },
  },
  
  Mika: {
    name: "Mika",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Cryo",
    basestats: { hp: 12506, atk: 223, def: 713 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 160,
    weights: {
      hb: 1,
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  // Version 3.4
  Alhaitham: {
    name: "Alhaitham",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Dendro",
    basestats: { hp: 13348, atk: 313, def: 782 },
    ascension: { dendro: 28.8 },
    passivestats: {},
    energyReq: 120,
    weights: {
      dendro: 1,
      cr: 1,
      cd: 1,
      em: 0.75,
    },
  },
  
  Yaoyao: {
    name: "Yaoyao",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Dendro",
    basestats: { hp: 12289, atk: 212, def: 751 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 160,
    weights: {
      hb: 1,
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  // Version 3.3
  Faruzan: {
    name: "Faruzan",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Anemo",
    basestats: { hp: 9570, atk: 196, def: 628 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 230,
    weights: {
      anemo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Wanderer: {
    name: "Wanderer",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Anemo",
    basestats: { hp: 10164, atk: 328, def: 607 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 120,
    weights: {
      anemo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 3.2
  Layla: {
    name: "Layla",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Cryo",
    basestats: { hp: 11092, atk: 217, def: 655 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 140,
    weights: {
      hpp: 1,
      defp: 0.3,
    },
  },
  
  Nahida: {
    name: "Nahida",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Dendro",
    basestats: { hp: 10360, atk: 299, def: 630 },
    ascension: { em: 115 },
    passivestats: {},
    energyReq: 120,
    weights: {
      dendro: 1,
      cr: 1,
      cd: 1,
      em: 0.75,
    },
  },
  
  // Version 3.1
  Candace: {
    name: "Candace",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Hydro",
    basestats: { hp: 10875, atk: 212, def: 683 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 180,
    weights: {
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  Cyno: {
    name: "Cyno",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Electro",
    basestats: { hp: 12491, atk: 318, def: 859 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 130,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      em: 0.75,
      atkp: 0.6,
    },
  },
  
  Nilou: {
    name: "Nilou",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Hydro",
    basestats: { hp: 15185, atk: 230, def: 729 },
    ascension: { hpp: 28.8 },
    passivestats: {},
    energyReq: 120,
    weights: {
      hpp: 1,
      em: 0.6,
      defp: 0.3,
    },
  },
  
  // Version 3.0
  Collei: {
    name: "Collei",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Dendro",
    basestats: { hp: 9787, atk: 200, def: 601 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 160,
    weights: {
      dendro: 1,
      cr: 1,
      cd: 1,
      em: 0.75,
      atkp: 0.6,
    },
  },
  
  Dori: {
    name: "Dori",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Electro",
    basestats: { hp: 12397, atk: 223, def: 723 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 180,
    weights: {
      hb: 1,
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  Tighnari: {
    name: "Tighnari",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Dendro",
    basestats: { hp: 10850, atk: 268, def: 630 },
    ascension: { dendro: 28.8 },
    passivestats: {},
    energyReq: 120,
    weights: {
      dendro: 1,
      cr: 1,
      cd: 1,
      em: 0.75,
      atkp: 0.6,
    },
  },
  
  // Version 2.8
  ShikanoinHeizou: {
    name: "Shikanoin Heizou",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Anemo",
    basestats: { hp: 10657, atk: 225, def: 684 },
    ascension: { anemo: 24 },
    passivestats: {},
    energyReq: 120,
    weights: {
      anemo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 2.7
  KukiShinobu: {
    name: "Kuki Shinobu",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Electro",
    basestats: { hp: 12289, atk: 212, def: 751 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 120,
    weights: {
      em: 1,
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  Yelan: {
    name: "Yelan",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Hydro",
    basestats: { hp: 14450, atk: 244, def: 548 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 180,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      hpp: 0.75,
    },
  },
  
  // Version 2.6
  KamisatoAyato: {
    name: "Kamisato Ayato",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Hydro",
    basestats: { hp: 13715, atk: 299, def: 769 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 130,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 2.5
  YaeMiko: {
    name: "Yae Miko",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Electro",
    basestats: { hp: 10372, atk: 340, def: 569 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 140,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.75,
    },
  },
  
  // Version 2.4
  Shenhe: {
    name: "Shenhe",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Cryo",
    basestats: { hp: 12993, atk: 304, def: 830 },
    ascension: { atkp: 28.8 },
    passivestats: {},
    energyReq: 180,
    weights: {
      atkp: 0.75,
    },
  },
  
  YunJin: {
    name: "Yun Jin",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Geo",
    basestats: { hp: 10657, atk: 191, def: 734 },
    ascension: { er: 26.7 },
    passivestats: {},
    energyReq: 200,
    weights: {
      defp: 0.75,
      hpp: 0.3,
    },
  },
  
  // Version 2.3
  AratakiItto: {
    name: "Arataki Itto",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Geo",
    basestats: { hp: 12858, atk: 227, def: 959 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 140,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      defp: 0.75,
    },
  },
  
  Gorou: {
    name: "Gorou",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Geo",
    basestats: { hp: 9570, atk: 183, def: 648 },
    ascension: { geo: 24 },
    passivestats: {},
    energyReq: 200,
    weights: {
      hb: 1,
      defp: 0.75,
      hpp: 0.3,
    },
  },
  
  // Version 2.2
  Thoma: {
    name: "Thoma",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Pyro",
    basestats: { hp: 10331, atk: 202, def: 751 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 200,
    weights: {
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  // Version 2.1
  Aloy: {
    name: "Aloy",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Cryo",
    basestats: { hp: 10899, atk: 234, def: 676 },
    ascension: { cryo: 28.8 },
    passivestats: {},
    energyReq: 120,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  KujouSara: {
    name: "Kujou Sara",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Electro",
    basestats: { hp: 9570, atk: 195, def: 628 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 200,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  RaidenShogun: {
    name: "Raiden Shogun",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Electro",
    basestats: { hp: 12907, atk: 337, def: 789 },
    ascension: { er: 32 },
    passivestats: {},
    energyReq: 270,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  SangonomiyaKokomi: {
    name: "Sangonomiya Kokomi",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Hydro",
    basestats: { hp: 13471, atk: 234, def: 657 },
    ascension: { hydro: 28.8 },
    passivestats: {},
    energyReq: 140,
    weights: {
      hb: 1,
      hydro: 1,
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  // Version 2.0
  KamisatoAyaka: {
    name: "Kamisato Ayaka",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Cryo",
    basestats: { hp: 12858, atk: 342, def: 784 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 140,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Sayu: {
    name: "Sayu",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Anemo",
    basestats: { hp: 11854, atk: 244, def: 745 },
    ascension: { em: 96 },
    passivestats: {},
    energyReq: 140,
    weights: {
      hb: 1,
      atkp: 0.75,
      em: 0.75,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  Yoimiya: {
    name: "Yoimiya",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Pyro",
    basestats: { hp: 10164, atk: 323, def: 615 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 120,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 1.6
  KaedeharaKazuha: {
    name: "Kaedehara Kazuha",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Anemo",
    basestats: { hp: 13348, atk: 297, def: 807 },
    ascension: { em: 115 },
    passivestats: {},
    energyReq: 160,
    weights: {
      em: 1,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  // Version 1.5
  Eula: {
    name: "Eula",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Cryo",
    basestats: { hp: 13226, atk: 342, def: 751 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 140,
    weights: {
      physical: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Yanfei: {
    name: "Yanfei",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Pyro",
    basestats: { hp: 9352, atk: 240, def: 587 },
    ascension: { pyro: 24 },
    passivestats: {},
    energyReq: 120,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.6,
    },
  },
  
  // Version 1.4
  Rosaria: {
    name: "Rosaria",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Cryo",
    basestats: { hp: 12289, atk: 240, def: 710 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 160,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.6,
    },
  },
  
  // Version 1.3
  HuTao: {
    name: "Hu Tao",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Pyro",
    basestats: { hp: 15552, atk: 106, def: 876 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 120,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      hpp: 0.75,
      em: 0.6,
    },
  },
  
  Xiao: {
    name: "Xiao",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Anemo",
    basestats: { hp: 12736, atk: 349, def: 799 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 130,
    weights: {
      anemo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 1.2
  Albedo: {
    name: "Albedo",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Geo",
    basestats: { hp: 13226, atk: 251, def: 876 },
    ascension: { geo: 28.8 },
    passivestats: {},
    energyReq: 100,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      defp: 0.75,
    },
  },
  
  Ganyu: {
    name: "Ganyu",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Cryo",
    basestats: { hp: 9797, atk: 335, def: 630 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 120,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  // Version 1.1
  Diona: {
    name: "Diona",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Cryo",
    basestats: { hp: 9570, atk: 212, def: 601 },
    ascension: { cryo: 24 },
    passivestats: {},
    energyReq: 180,
    weights: {
      hb: 1,
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  Tartaglia: {
    name: "Tartaglia",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Hydro",
    basestats: { hp: 13103, atk: 301, def: 815 },
    ascension: { hydro: 28.8 },
    passivestats: {},
    energyReq: 120,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Xinyan: {
    name: "Xinyan",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Pyro",
    basestats: { hp: 11201, atk: 249, def: 799 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 150,
    weights: {
      physical: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Zhongli: {
    name: "Zhongli",
    rarity: "5 Star",
    weapon: "Polearm",
    element: "Geo",
    basestats: { hp: 14695, atk: 251, def: 738 },
    ascension: { geo: 28.8 },
    passivestats: {},
    energyReq: 100,
    weights: {
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  // Version 1.0
  Amber: {
    name: "Amber",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Pyro",
    basestats: { hp: 9461, atk: 223, def: 601 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 120,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Barbara: {
    name: "Barbara",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Hydro",
    basestats: { hp: 9787, atk: 159, def: 669 },
    ascension: { hpp: 24 },
    passivestats: {},
    energyReq: 140,
    weights: {
      hb: 1,
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  Beidou: {
    name: "Beidou",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Electro",
    basestats: { hp: 13050, atk: 225, def: 648 },
    ascension: { electro: 24 },
    passivestats: {},
    energyReq: 180,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Bennett: {
    name: "Bennett",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Pyro",
    basestats: { hp: 12397, atk: 191, def: 771 },
    ascension: { er: 26.7 },
    passivestats: {},
    energyReq: 220,
    weights: {
      hb: 1,
      hpp: 0.75,
      defp: 0.3,
    },
  },
  
  Chongyun: {
    name: "Chongyun",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Cryo",
    basestats: { hp: 10984, atk: 223, def: 648 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 140,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Diluc: {
    name: "Diluc",
    rarity: "5 Star",
    weapon: "Claymore",
    element: "Pyro",
    basestats: { hp: 12981, atk: 335, def: 784 },
    ascension: { cr: 19.2 },
    passivestats: {},
    energyReq: 120,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.6,
    },
  },
  
  Fischl: {
    name: "Fischl",
    rarity: "4 Star",
    weapon: "Bow",
    element: "Electro",
    basestats: { hp: 9189, atk: 244, def: 594 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 120,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.6,
    },
  },
  
  Jean: {
    name: "Jean",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Anemo",
    basestats: { hp: 14695, atk: 239, def: 769 },
    ascension: { hb: 22.1 },
    passivestats: {},
    energyReq: 180,
    weights: {
      hb: 1,
      atkp: 0.75,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  Kaeya: {
    name: "Kaeya",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Cryo",
    basestats: { hp: 11636, atk: 223, def: 792 },
    ascension: { er: 26.7 },
    passivestats: {},
    energyReq: 180,
    weights: {
      cryo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Keqing: {
    name: "Keqing",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Electro",
    basestats: { hp: 13103, atk: 323, def: 799 },
    ascension: { cd: 38.4 },
    passivestats: {},
    energyReq: 120,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.6,
    },
  },
  
  Klee: {
    name: "Klee",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Pyro",
    basestats: { hp: 10287, atk: 311, def: 615 },
    ascension: { pyro: 28.8 },
    passivestats: {},
    energyReq: 120,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Lisa: {
    name: "Lisa",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Electro",
    basestats: { hp: 9570, atk: 232, def: 573 },
    ascension: { em: 96 },
    passivestats: {},
    energyReq: 180,
    weights: {
      electro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.6,
    },
  },
  
  Mona: {
    name: "Mona",
    rarity: "5 Star",
    weapon: "Catalyst",
    element: "Hydro",
    basestats: { hp: 10409, atk: 287, def: 653 },
    ascension: { er: 32 },
    passivestats: {},
    energyReq: 180,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Ningguang: {
    name: "Ningguang",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Geo",
    basestats: { hp: 9787, atk: 212, def: 573 },
    ascension: { geo: 24 },
    passivestats: {},
    energyReq: 140,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Noelle: {
    name: "Noelle",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Geo",
    basestats: { hp: 12071, atk: 191, def: 799 },
    ascension: { def: 30 },
    passivestats: {},
    energyReq: 140,
    weights: {
      geo: 1,
      cr: 1,
      cd: 1,
      defp: 0.75,
    },
  },
  
  Qiqi: {
    name: "Qiqi",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Cryo",
    basestats: { hp: 12368, atk: 287, def: 922 },
    ascension: { hb: 22.1 },
    passivestats: {},
    energyReq: 180,
    weights: {
      hb: 1,
      atkp: 0.75,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  Razor: {
    name: "Razor",
    rarity: "4 Star",
    weapon: "Claymore",
    element: "Electro",
    basestats: { hp: 11962, atk: 234, def: 751 },
    ascension: { physical: 30 },
    passivestats: {},
    energyReq: 140,
    weights: {
      physical: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
  
  Sucrose: {
    name: "Sucrose",
    rarity: "4 Star",
    weapon: "Catalyst",
    element: "Anemo",
    basestats: { hp: 9244, atk: 174, def: 703 },
    ascension: { anemo: 24 },
    passivestats: {},
    energyReq: 160,
    weights: {
      em: 1,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  Venti: {
    name: "Venti",
    rarity: "5 Star",
    weapon: "Bow",
    element: "Anemo",
    basestats: { hp: 10531, atk: 263, def: 669 },
    ascension: { er: 32 },
    passivestats: {},
    energyReq: 170,
    weights: {
      em: 1,
      hpp: 0.3,
      defp: 0.3,
    },
  },
  
  Xiangling: {
    name: "Xiangling",
    rarity: "4 Star",
    weapon: "Polearm",
    element: "Pyro",
    basestats: { hp: 10875, atk: 225, def: 669 },
    ascension: { em: 96 },
    passivestats: {},
    energyReq: 220,
    weights: {
      pyro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
      em: 0.6,
    },
  },
  
  Xingqiu: {
    name: "Xingqiu",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Hydro",
    basestats: { hp: 10222, atk: 202, def: 758 },
    ascension: { atkp: 24 },
    passivestats: {},
    energyReq: 200,
    weights: {
      hydro: 1,
      cr: 1,
      cd: 1,
      atkp: 0.75,
    },
  },
};

export default charData;
