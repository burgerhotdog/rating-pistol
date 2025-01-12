const charData = {
  // Version 2.0
  Carlotta: {
    name: "Carlotta",
    rarity: "5 Star",
    weapon: "Pistols",
    element: "Glacio",
    mainstats: ["CRIT Rate / DMG", "Glacio DMG", "Glacio DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.4
  Camellya: {
    name: "Camellya",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Havoc",
    mainstats: ["CRIT Rate / DMG", "Havoc DMG", "Havoc DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Lumi: {
    name: "Lumi",
    rarity: "4 Star",
    weapon: "Broadblade",
    element: "Electro",
    mainstats: ["CRIT Rate / DMG", "Electro DMG", "Electro DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.3
  Shorekeeper: {
    name: "Shorekeeper",
    rarity: "5 Star",
    weapon: "Rectifier",
    element: "Spectro",
    mainstats: ["CRIT DMG", "Spectro DMG", "Spectro DMG", "HP%", "HP%"],
    substats: ["CRIT DMG", "ER", "HP%"],
  },
  
  Youhu: {
    name: "Youhu",
    rarity: "4 Star",
    weapon: "Gauntlets",
    element: "Glacio",
    mainstats: ["Healing Bonus", "ER", "ER", "ATK%", "ATK%"],
    substats: ["ER", "ATK%", "ATK"],
  },
  
  // Version 1.2
  XiangliYao: {
    name: "Xiangli Yao",
    rarity: "5 Star",
    weapon: "Gauntlets",
    element: "Electro",
    mainstats: ["CRIT Rate / DMG", "Electro DMG", "Electro DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Zhezhi: {
    name: "Zhezhi",
    rarity: "5 Star",
    weapon: "Rectifier",
    element: "Glacio",
    mainstats: ["CRIT Rate / DMG", "Glacio DMG", "Glacio DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.1
  Changli: {
    name: "Changli",
    rarity: "5 Star",
    weapon: "Sword",
    element: "Fusion",
    mainstats: ["CRIT Rate / DMG", "Fusion DMG", "Fusion DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Jinhsi: {
    name: "Jinhsi",
    rarity: "5 Star",
    weapon: "Broadblade",
    element: "Spectro",
    mainstats: ["CRIT Rate / DMG", "Spectro DMG", "Spectro DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.0
  Aalto: {
    name: "Aalto",
    rarity: "4 Star",
    weapon: "Pistols",
    element: "Aero",
    mainstats: ["CRIT Rate / DMG", "Aero DMG", "Aero DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Baizhi: {
    name: "Baizhi",
    rarity: "4 Star",
    weapon: "Rectifier",
    element: "Glacio",
    mainstats: ["Healing Bonus", "ER", "ER", "HP%", "HP%"],
    substats: ["ER", "HP%", "HP"],
  },
  
  Calcharo: {
    name: "Calcharo",
    rarity: "5 Star",
    weapon: "Broadblade",
    element: "Electro",
    mainstats: ["CRIT Rate / DMG", "Electro DMG", "Electro DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Chixia: {
    name: "Chixia",
    rarity: "4 Star",
    weapon: "Pistols",
    element: "Fusion",
    mainstats: ["CRIT Rate / DMG", "Fusion DMG", "Fusion DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Danjin: {
    name: "Danjin",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Havoc",
    mainstats: ["CRIT Rate / DMG", "Havoc DMG", "Havoc DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Encore: {
    name: "Encore",
    rarity: "5 Star",
    weapon: "Rectifier",
    element: "Fusion",
    mainstats: ["CRIT Rate / DMG", "Fusion DMG", "Fusion DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Jianxin: {
    name: "Jianxin",
    rarity: "5 Star",
    weapon: "Gauntlets",
    element: "Aero",
    mainstats: ["CRIT Rate / DMG", "Aero DMG", "Aero DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Jiyan: {
    name: "Jiyan",
    rarity: "5 Star",
    weapon: "Broadblade",
    element: "Aero",
    mainstats: ["CRIT Rate / DMG", "Aero DMG", "Aero DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Lingyang: {
    name: "Lingyang",
    rarity: "5 Star",
    weapon: "Gauntlets",
    element: "Glacio",
    mainstats: ["CRIT Rate / DMG", "Glacio DMG", "Glacio DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Mortefi: {
    name: "Mortefi",
    rarity: "4 Star",
    weapon: "Pistols",
    element: "Fusion",
    mainstats: ["CRIT Rate / DMG", "Fusion DMG", "Fusion DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Sanhua: {
    name: "Sanhua",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Glacio",
    mainstats: ["CRIT Rate / DMG", "Glacio DMG", "Glacio DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Taoqi: {
    name: "Taoqi",
    rarity: "4 Star",
    weapon: "Broadblade",
    element: "Havoc",
    mainstats: ["DEF%", "ER", "ER", "DEF%", "DEF%"],
    substats: ["ER", "DEF%", "DEF"],
  },
  
  Verina: {
    name: "Verina",
    rarity: "5 Star",
    weapon: "Rectifier",
    element: "Spectro",
    mainstats: ["Healing Bonus", "ER", "ER", "ATK%", "ATK%"],
    substats: ["ER", "ATK%", "ATK"],
  },
  
  Yangyang: {
    name: "Yangyang",
    rarity: "4 Star",
    weapon: "Sword",
    element: "Aero",
    mainstats: ["CRIT Rate / DMG", "Aero DMG", "Aero DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Yinlin: {
    name: "Yinlin",
    rarity: "5 Star",
    weapon: "Rectifier",
    element: "Electro",
    mainstats: ["CRIT Rate / DMG", "Electro DMG", "Electro DMG", "ATK%", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Yuanwu: {
    name: "Yuanwu",
    rarity: "4 Star",
    weapon: "Gauntlets",
    element: "Electro",
    mainstats: ["CRIT Rate / DMG", "Electro DMG", "Electro DMG", "DEF%", "DEF%"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
};

export default charData;
