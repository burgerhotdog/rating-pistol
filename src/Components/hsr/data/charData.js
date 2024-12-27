const charData = {
  // Version 2.7
  Sunday: {
    name: "Sunday",
    rarity: "5 Star",
    weapon: "Harmony",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "CRIT DMG", "SPD", "HP% / DEF%", "ERR"],
    substats: ["CRIT DMG", "SPD", "EFF RES%"],
  },
  Fugue: {
    name: "Fugue",
    rarity: "5 Star",
    weapon: "Nihility",
    element: "Fire",
    mainstats: ["HP", "ATK", "EHR%", "SPD", "HP% / DEF%", "BE / ERR"],
    substats: ["EHR%", "BE", "SPD"],
  },
  
  // Version 2.6
  Rappa: {
    name: "Rappa",
    rarity: "5 Star",
    weapon: "Erudition",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "ATK%", "SPD", "ATK%", "BE"],
    substats: ["BE", "SPD", "ATK%"],
  },
  
  // Version 2.5
  Feixiao: {
    name: "Feixiao",
    rarity: "5 Star",
    weapon: "Hunt",
    element: "Wind",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD", "Wind DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Lingsha: {
    name: "Lingsha",
    rarity: "5 Star",
    weapon: "Abundance",
    element: "Fire",
    mainstats: ["HP", "ATK", "OHB", "SPD", "ATK%", "ERR"],
    substats: ["BE", "SPD", "ATK%"],
  },
  
  // Version 2.4
  Jiaoqiu: {
    name: "Jiaoqiu",
    rarity: "5 Star",
    weapon: "Nihility",
    element: "Fire",
    mainstats: ["HP", "ATK", "EHR%", "SPD", "Fire DMG", "ERR"],
    substats: ["EHR%", "SPD", "ATK%"],
  },
  Yunli: {
    name: "Yunli",
    rarity: "5 Star",
    weapon: "Destruction",
    element: "Physical",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Physical DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 2.3
  Firefly: {
    name: "Firefly",
    rarity: "5 Star",
    weapon: "Destruction",
    element: "Fire",
    mainstats: ["HP", "ATK", "ATK%", "SPD", "ATK%", "BE"],
    substats: ["BE", "ATK%", "SPD"],
  },
  Jade: {
    name: "Jade",
    rarity: "5 Star",
    weapon: "Erudition",
    element: "Quantum",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Quantum DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 2.2
  Boothill: {
    name: "Boothill",
    rarity: "5 Star",
    weapon: "Hunt",
    element: "Physical",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD", "Physical DMG", "BE"],
    substats: ["BE", "SPD", "EFF RES%"],
  },
  Robin: {
    name: "Robin",
    rarity: "5 Star",
    weapon: "Harmony",
    element: "Physical",
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "ATK%", "ERR"],
    substats: ["ATK%", "SPD", "EFF RES%"],
  },
  
  // Version 2.1
  Acheron: {
    name: "Acheron",
    rarity: "5 Star",
    weapon: "Nihility",
    element: "Lightning",
    mainstats: ["HP", "ATK", "CRIT Rate / DMG", "ATK%", "Lightning DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Aventurine: {
    name: "Aventurine",
    rarity: "5 Star",
    weapon: "Preservation",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "CRIT DMG", "SPD", "DEF%", "DEF%"],
    substats: ["CRIT Rate", "CRIT DMG", "DEF%"],
  },
  
  // Version 2.0
  BlackSwan: {
    name: "Black Swan",
    rarity: "5 Star",
    weapon: "Nihility",
    element: "Wind",
    mainstats: ["HP", "ATK", "EHR%", "SPD", "Wind DMG", "ATK%"],
    substats: ["EHR%", "SPD", "ATK%"],
  },
  Sparkle: {
    name: "Sparkle",
    rarity: "5 Star",
    weapon: "Harmony",
    element: "Quantum",
    mainstats: ["HP", "ATK", "CRIT DMG", "SPD", "HP% / DEF%", "ERR"],
    substats: ["CRIT DMG", "SPD", "EFF RES%"],
  },
  
  // Version 1.6
  DrRatio: {
    name: "Dr. Ratio",
    rarity: "5 Star",
    weapon: "Hunt",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "CRIT DMG", "SPD", "Imaginary DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  RuanMei: {
    name: "Ruan Mei",
    rarity: "5 Star",
    weapon: "Harmony",
    element: "Ice",
    mainstats: ["HP", "ATK", "HP% / DEF%", "SPD", "HP% / DEF%", "ERR"],
    substats: ["BE", "SPD", "EFF RES%"],
  },
  
  // Version 1.5
  Argenti: {
    name: "Argenti",
    rarity: "5 Star",
    weapon: "Erudition",
    element: "Physical",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Physical DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Huohuo: {
    name: "Huohuo",
    rarity: "5 Star",
    weapon: "Abundance",
    element: "Wind",
    mainstats: ["HP", "ATK", "OHB", "SPD", "HP%", "ERR"],
    substats: ["HP%", "SPD", "EFF RES%"],
  },
  
  // Version 1.4
  Jingliu: {
    name: "Jingliu",
    rarity: "5 Star",
    weapon: "Destruction",
    element: "Ice",
    mainstats: ["HP", "ATK", "CRIT DMG", "SPD", "Ice DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  TopazNumby: {
    name: "Topaz & Numby",
    rarity: "5 Star",
    weapon: "Hunt",
    element: "Fire",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD", "Fire DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.3
  DanHengImbibitorLunae: {
    name: "Dan Heng • Imbibitor Lunae",
    rarity: "5 Star",
    weapon: "Destruction",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Imaginary DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  FuXuan: {
    name: "Fu Xuan",
    rarity: "5 Star",
    weapon: "Preservation",
    element: "Quantum",
    mainstats: ["HP", "ATK", "HP%", "SPD", "HP%", "ERR"],
    substats: ["HP%", "SPD", "DEF%"],
  },
  
  // Version 1.2
  Blade: {
    name: "Blade",
    rarity: "5 Star",
    weapon: "Destruction",
    element: "Wind",
    mainstats: ["HP", "ATK", "CRIT Rate / DMG", "HP%", "Wind DMG", "HP%"],
    substats: ["CRIT Rate", "CRIT DMG", "HP%"],
  },
  Kafka: {
    name: "Kafka",
    rarity: "5 Star",
    weapon: "Nihility",
    element: "Lightning",
    mainstats: ["HP", "ATK", "ATK%", "ATK%", "Lightning DMG", "ATK%"],
    substats: ["ATK%", "SPD", "EHR%"],
  },
  
  // Version 1.1
  Luocha: {
    name: "Luocha",
    rarity: "5 Star",
    weapon: "Abundance",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "OHB", "SPD", "ATK%", "ERR"],
    substats: ["ATK%", "SPD", "EFF RES%"],
  },
  SilverWolf: {
    name: "Silver Wolf",
    rarity: "5 Star",
    weapon: "Nihility",
    element: "Quantum",
    mainstats: ["HP", "ATK", "EHR%", "SPD", "HP% / DEF%", "ERR"],
    substats: ["EHR%", "SPD", "EFF RES%"],
  },

  // Version 1.0
  Bailu: {
    name: "Bailu",
    rarity: "5 Star",
    weapon: "Abundance",
    element: "Lightning",
    mainstats: ["HP", "ATK", "OHB", "SPD", "HP%", "ERR"],
    substats: ["HP%", "SPD", "EFF RES%"],
  },
  Bronya: {
    name: "Bronya",
    rarity: "5 Star",
    weapon: "Harmony",
    element: "Wind",
    mainstats: ["HP", "ATK", "CRIT DMG", "SPD", "HP% / DEF%", "ERR"],
    substats: ["CRIT DMG", "SPD", "EFF RES%"],
  },
  Clara: {
    name: "Clara",
    rarity: "5 Star",
    weapon: "Destruction",
    element: "Physical",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Physical DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Gepard: {
    name: "Gepard",
    rarity: "5 Star",
    weapon: "Preservation",
    element: "Ice",
    mainstats: ["HP", "ATK", "DEF%", "SPD", "DEF%", "ERR"],
    substats: ["DEF%", "SPD", "EFF RES%"],
  },
  Himeko: {
    name: "Himeko",
    rarity: "5 Star",
    weapon: "Erudition",
    element: "Fire",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD / ATK%", "Fire DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  JingYuan: {
    name: "Jing Yuan",
    rarity: "5 Star",
    weapon: "Erudition",
    element: "Lightning",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Lightning DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Seele: {
    name: "Seele",
    rarity: "5 Star",
    weapon: "Hunt",
    element: "Quantum",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Quantum DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  Welt: {
    name: "Welt",
    rarity: "5 Star",
    weapon: "Nihility",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD / ATK%", "Imaginary DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "EHR%"],
  },
  Yanqing: {
    name: "Yanqing",
    rarity: "5 Star",
    weapon: "Hunt",
    element: "Ice",
    mainstats: ["HP", "ATK", "CRIT DMG", "SPD", "Ice DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
};

export default charData;
