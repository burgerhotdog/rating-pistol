const charData = {
  // Version 5.3
  Citlali: {
    mainstats: ["HP", "ATK", "ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },
  Mavuika: {
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 5.2
  Chasca: {
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Ororon: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 5.1
  Xilonen: {
    mainstats: ["HP", "ATK", "ER%", "DEF%", "Healing Bonus"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 5.0
  Kachina: {
    mainstats: ["HP", "ATK", "ER%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Kinich: {
    mainstats: ["HP", "ATK", "ATK%", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Mualani: {
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 4.8
  Emilie: {
    mainstats: ["HP", "ATK", "ATK%", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.7
  Clorinde: {
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sethos: {
    mainstats: ["HP", "ATK", "EM", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },
  Sigewinne: {
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 4.6
  Arlecchino: {
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.5
  Chiori: {
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },

  // Version 4.4
  Gaming: {
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xianyun: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "ATK%", "ATK%"],
    substats: ["ER%", "ATK%", "ATK"],
  },

  // Version 4.3
  Chevreuse: {
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },
  Navia: {
    mainstats: ["HP", "ATK", "ATK%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.2
  Charlotte: {
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  Furina: {
    mainstats: ["HP", "ATK", "HP% / ER%", "Hydro DMG / HP%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 4.1
  Neuvillette: {
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },
  Wriothesley: {
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 4.0
  Freminet: {
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lynette: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lyney: {
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 3.8

  // Version 3.7
  Kirara: {
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.6
  Baizhu: {
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },
  Kaveh: {
    mainstats: ["HP", "ATK", "EM / ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },

  // Version 3.5
  Dehya: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Mika: {
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.4
  Alhaitham: {
    mainstats: ["HP", "ATK", "EM", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },
  Yaoyao: {
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.3
  Faruzan: {
    mainstats: ["HP", "ATK", "ER%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },
  Wanderer: {
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 3.2
  Layla: {
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },
  Nahida: {
    mainstats: ["HP", "ATK", "EM", "Dendro DMG / EM", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  // Version 3.1
  Candace: {
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },
  Cyno: {
    mainstats: ["HP", "ATK", "EM", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },
  Nilou: {
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 3.0
  Collei: {
    mainstats: ["HP", "ATK", "ER%", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },
  Dori: {
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },
  Tighnari: {
    mainstats: ["HP", "ATK", "EM", "Dendro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "EM"],
  },

  // Version 2.8
  ShikanoinHeizou: {
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.7
  KukiShinobu: {
    mainstats: ["HP", "ATK", "EM", "EM", "EM"],
    substats: ["ER%", "EM", "HP%"],
  },
  Yelan: {
    mainstats: ["HP", "ATK", "HP% / ER%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },

  // Version 2.6
  KamisatoAyato: {
    mainstats: ["HP", "ATK", "ATK%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.5
  YaeMiko: {
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 2.4
  Shenhe: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "ATK%", "ATK%"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  YunJin: {
    mainstats: ["HP", "ATK", "DEF% / ER%", "DEF%", "DEF%"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 2.3
  AratakiItto: {
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Gorou: {
    mainstats: ["HP", "ATK", "ER%", "DEF%", "Healing Bonus"],
    substats: ["ER%", "DEF%", "DEF"],
  },

  // Version 2.2
  Thoma: {
    mainstats: ["HP", "ATK", "HP% / ER%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 2.1
  Aloy: {
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  KujouSara: {
    mainstats: ["HP", "ATK", "ER%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },
  RaidenShogun: {
    mainstats: ["HP", "ATK", "ER%", "Electro DMG / ATK%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ER%"],
  },
  SangonomiyaKokomi: {
    mainstats: ["HP", "ATK", "HP%", "Hydro DMG", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 2.0
  KamisatoAyaka: {
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sayu: {
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  Yoimiya: {
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.6
  KaedeharaKazuha: {
    mainstats: ["HP", "ATK", "EM / ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },

  // Version 1.5
  Eula: {
    mainstats: ["HP", "ATK", "ATK%", "Physical DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Yanfei: {
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.4
  Rosaria: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.3
  HuTao: {
    mainstats: ["HP", "ATK", "HP%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },
  Xiao: {
    mainstats: ["HP", "ATK", "ATK%", "Anemo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.2
  Albedo: {
    usesCrit: true,
    energyReq: 100,
    weights: {
      def: 0.3,
      defp: 0.6,
      cr: 1,
      cd: 1,
    },
  },
  Ganyu: {
    mainstats: ["HP", "ATK", "ATK%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },

  // Version 1.1
  Diona: {
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },
  Tartaglia: {
    mainstats: ["HP", "ATK", "ATK%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xinyan: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Physical DMG%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Zhongli: {
    mainstats: ["HP", "ATK", "HP%", "HP%", "HP%"],
    substats: ["ER%", "HP%", "HP"],
  },

  // Version 1.0
  Amber: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Barbara: {
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },
  Beidou: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Bennett: {
    mainstats: ["HP", "ATK", "ER%", "HP%", "Healing Bonus"],
    substats: ["ER%", "HP%", "HP"],
  },
  Chongyun: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Diluc: {
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Fischl: {
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Jean: {
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  Kaeya: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Cryo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Keqing: {
    mainstats: ["HP", "ATK", "ATK%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Klee: {
    mainstats: ["HP", "ATK", "ATK%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lisa: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Electro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Mona: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Ningguang: {
    mainstats: ["HP", "ATK", "ATK%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Noelle: {
    mainstats: ["HP", "ATK", "DEF%", "Geo DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  Qiqi: {
    mainstats: ["HP", "ATK", "ER%", "ATK%", "Healing Bonus"],
    substats: ["ER%", "ATK%", "ATK"],
  },
  Razor: {
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Sucrose: {
    mainstats: ["HP", "ATK", "EM / ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },
  Venti: {
    mainstats: ["HP", "ATK", "EM / ER%", "EM", "EM"],
    substats: ["ER%", "EM", "ATK%"],
  },
  Xiangling: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Pyro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Xingqiu: {
    mainstats: ["HP", "ATK", "ATK% / ER%", "Hydro DMG", "CRIT Rate / DMG"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
};

export default charData;
