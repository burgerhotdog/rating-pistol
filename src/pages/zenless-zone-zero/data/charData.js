const charData = {
  // Version 1.4
  Harumasa: {
    name: "Harumasa",
    rarity: "5 Star",
    weapon: "Attack",
    element: "Electric",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Electric DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Miyabi: {
    name: "Miyabi",
    rarity: "5 Star",
    weapon: "Anomaly",
    element: "Frost",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Ice DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.3
  Lighter: {
    name: "Lighter",
    rarity: "5 Star",
    weapon: "Stun",
    element: "Fire",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Fire DMG", "Impact"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Yanagi: {
    name: "Yanagi",
    rarity: "5 Star",
    weapon: "Anomaly",
    element: "Electric",
    mainstats: ["HP", "ATK", "DEF", "AP", "Electric DMG", "AM"],
    substats: ["AP", "ATK%", "PEN"],
  },
  
  // Version 1.2
  Burnice: {
    name: "Burnice",
    rarity: "5 Star",
    weapon: "Anomaly",
    element: "Fire",
    mainstats: ["HP", "ATK", "DEF", "AP", "Fire DMG", "AM"],
    substats: ["AP", "ATK%", "PEN"],
  },
  
  Caesar: {
    name: "Caesar",
    rarity: "5 Star",
    weapon: "Defense",
    element: "Physical",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Physical DMG", "Impact"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.1
  Jane: {
    name: "Jane",
    rarity: "5 Star",
    weapon: "Anomaly",
    element: "Physical",
    mainstats: ["HP", "ATK", "DEF", "AP", "Physical DMG", "AM"],
    substats: ["AP", "ATK%", "PEN"],
  },
  
  Seth: {
    name: "Seth",
    rarity: "4 Star",
    weapon: "Defense",
    element: "Electric",
    mainstats: ["HP", "ATK", "DEF", "ATK%", "ATK%", "ER"],
    substats: ["AP", "ATK%", "PEN"],
  },
  
  Qingyi: {
    name: "Qingyi",
    rarity: "5 Star",
    weapon: "Stun",
    element: "Electric",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Electric DMG", "Impact"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.0
  Anby: {
    name: "Anby",
    rarity: "4 Star",
    weapon: "Stun",
    element: "Electric",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate", "Electric DMG", "Impact"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Anton: {
    name: "Anton",
    rarity: "4 Star",
    weapon: "Attack",
    element: "Electric",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate", "Electric DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Ben: {
    name: "Ben",
    rarity: "4 Star",
    weapon: "Defense",
    element: "Fire",
    mainstats: ["HP", "ATK", "DEF", "CRIT DMG", "Fire DMG", "DEF%"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  
  Billy: {
    name: "Billy",
    rarity: "4 Star",
    weapon: "Attack",
    element: "Physical",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate", "Physical DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Corin: {
    name: "Corin",
    rarity: "4 Star",
    weapon: "Attack",
    element: "Physical",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate", "Physical DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Ellen: {
    name: "Ellen",
    rarity: "5 Star",
    weapon: "Attack",
    element: "Ice",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Ice DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Grace: {
    name: "Grace",
    rarity: "5 Star",
    weapon: "Anomaly",
    element: "Electric",
    mainstats: ["HP", "ATK", "DEF", "AP", "Electric DMG", "AM"],
    substats: ["AP", "ATK%", "PEN"],
  },
  
  Koleda: {
    name: "Koleda",
    rarity: "5 Star",
    weapon: "Stun",
    element: "Fire",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Fire DMG", "Impact"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Lucy: {
    name: "Lucy",
    rarity: "4 Star",
    weapon: "Support",
    element: "Fire",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate", "Fire DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Lycaon: {
    name: "Lycaon",
    rarity: "5 Star",
    weapon: "Stun",
    element: "Ice",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Ice DMG", "Impact"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Nekomata: {
    name: "Nekomata",
    rarity: "5 Star",
    weapon: "Attack",
    element: "Physical",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Physical DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Nicole: {
    name: "Nicole",
    rarity: "4 Star",
    weapon: "Support",
    element: "Ether",
    mainstats: ["HP", "ATK", "DEF", "AP", "Ether DMG", "AM"],
    substats: ["AP", "ATK%", "PEN"],
  },
  
  Piper: {
    name: "Piper",
    rarity: "4 Star",
    weapon: "Anomaly",
    element: "Physical",
    mainstats: ["HP", "ATK", "DEF", "AP", "Physical DMG", "AM"],
    substats: ["AP", "ATK%", "PEN"],
  },
  
  Rina: {
    name: "Rina",
    rarity: "5 Star",
    weapon: "Support",
    element: "Electric",
    mainstats: ["HP", "ATK", "DEF", "AP", "PEN Ratio", "ER"],
    substats: ["AP", "ATK%", "PEN"],
  },
  
  Soldier11: {
    name: "Soldier 11",
    rarity: "5 Star",
    weapon: "Attack",
    element: "Fire",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Fire DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Soukaku: {
    name: "Soukaku",
    rarity: "4 Star",
    weapon: "Support",
    element: "Ice",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate", "ATK%", "ER"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  ZhuYuan: {
    name: "Zhu Yuan",
    rarity: "5 Star",
    weapon: "Attack",
    element: "Ether",
    mainstats: ["HP", "ATK", "DEF", "CRIT Rate / DMG", "Ether DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
};

export default charData;
