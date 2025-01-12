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
    mainstats: ["HP", "ATK", "EHR%", "SPD", "HP% / DEF%", "ERR"],
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
  
  Moze: {
    name: "Moze",
    rarity: "4 Star",
    weapon: "Hunt",
    element: "Lightning",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Lightning DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
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
  
  March7thTheHunt: {
    name: "March 7th • The Hunt",
    rarity: "4 Star",
    weapon: "Hunt",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD", "Imaginary DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
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
  
  Gallagher: {
    name: "Gallagher",
    rarity: "4 Star",
    weapon: "Abundance",
    element: "Fire",
    mainstats: ["HP", "ATK", "OHB", "SPD", "HP% / DEF%", "ERR"],
    substats: ["BE", "SPD", "EFF RES%"],
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
  
  Misha: {
    name: "Misha",
    rarity: "4 Star",
    weapon: "Destruction",
    element: "Ice",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD", "Ice DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
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
  
  Xueyi: {
    name: "Xueyi",
    rarity: "4 Star",
    weapon: "Destruction",
    element: "Quantum",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD", "ATK%", "BE"],
    substats: ["CRIT Rate", "CRIT DMG", "BE"],
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
  
  Hanya: {
    name: "Hanya",
    rarity: "4 Star",
    weapon: "Harmony",
    element: "Physical",
    mainstats: ["HP", "ATK", "HP% / DEF%", "SPD", "HP% / DEF%", "ERR"],
    substats: ["HP%", "SPD", "EFF RES%"],
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
  Guinaifen: {
    name: "Guinaifen",
    rarity: "4 Star",
    weapon: "Nihility",
    element: "Fire",
    mainstats: ["HP", "ATK", "ATK%", "SPD", "Fire DMG", "ATK%"],
    substats: ["EHR%", "SPD", "ATK%"],
  },
  
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
  
  Lynx: {
    name: "Lynx",
    rarity: "4 Star",
    weapon: "Abundance",
    element: "Quantum",
    mainstats: ["HP", "ATK", "OHB", "SPD", "HP%", "ERR"],
    substats: ["HP%", "SPD", "EFF RES%"],
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
  
  Luka: {
    name: "Luka",
    rarity: "4 Star",
    weapon: "Nihility",
    element: "Physical",
    mainstats: ["HP", "ATK", "EHR%", "SPD", "Physical DMG", "BE"],
    substats: ["BE", "SPD", "EHR%"],
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
  
  Yukong: {
    name: "Yukong",
    rarity: "4 Star",
    weapon: "Harmony",
    element: "Imaginary",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD", "Imaginary DMG", "ERR"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  // Version 1.0
  Arlan: {
    name: "Arlan",
    rarity: "4 Star",
    weapon: "Destruction",
    element: "Lightning",
    mainstats: ["HP", "ATK", "CRIT Rate / DMG", "SPD", "Lightning DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Asta: {
    name: "Asta",
    rarity: "4 Star",
    weapon: "Harmony",
    element: "Fire",
    mainstats: ["HP", "ATK", "HP% / DEF%", "SPD", "HP% / DEF%", "ERR"],
    substats: ["HP%", "SPD", "EFF RES%"],
  },
  
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
  
  DanHeng: {
    name: "Dan Heng",
    rarity: "4 Star",
    weapon: "Hunt",
    element: "Wind",
    mainstats: ["HP", "ATK", "CRIT Rate / DMG", "SPD", "Wind DMG", "ATK%"],
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
  
  Herta: {
    name: "Herta",
    rarity: "4 Star",
    weapon: "Erudition",
    element: "Ice",
    mainstats: ["HP", "ATK", "CRIT Rate / DMG", "ATK%", "Ice DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Himeko: {
    name: "Himeko",
    rarity: "5 Star",
    weapon: "Erudition",
    element: "Fire",
    mainstats: ["HP", "ATK", "CRIT Rate", "SPD / ATK%", "Fire DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Hook: {
    name: "Hook",
    rarity: "4 Star",
    weapon: "Destruction",
    element: "Fire",
    mainstats: ["HP", "ATK", "CRIT Rate / DMG", "SPD", "Fire DMG", "ATK%"],
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
  
  March7th: {
    name: "March 7th",
    rarity: "4 Star",
    weapon: "Preservation",
    element: "Ice",
    mainstats: ["HP", "ATK", "EHR%", "SPD", "DEF%", "ERR"],
    substats: ["EHR%", "SPD", "DEF%"],
  },
  
  Natasha: {
    name: "Natasha",
    rarity: "4 Star",
    weapon: "Abundance",
    element: "Physical",
    mainstats: ["HP", "ATK", "OHB", "SPD", "HP%", "ERR"],
    substats: ["HP%", "SPD", "EFF RES%"],
  },
  
  Pela: {
    name: "Pela",
    rarity: "4 Star",
    weapon: "Nihility",
    element: "Ice",
    mainstats: ["HP", "ATK", "EHR%", "SPD", "HP% / DEF%", "ERR"],
    substats: ["EHR%", "SPD", "EFF RES%"],
  },
  
  Qingque: {
    name: "Qingque",
    rarity: "4 Star",
    weapon: "Erudition",
    element: "Quantum",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Quantum DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Sampo: {
    name: "Sampo",
    rarity: "4 Star",
    weapon: "Nihility",
    element: "Wind",
    mainstats: ["HP", "ATK", "EHR%", "SPD", "Wind DMG", "ATK%"],
    substats: ["EHR%", "SPD", "ATK%"],
  },
  
  Seele: {
    name: "Seele",
    rarity: "5 Star",
    weapon: "Hunt",
    element: "Quantum",
    mainstats: ["HP", "ATK", "CRIT Rate", "ATK%", "Quantum DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Serval: {
    name: "Serval",
    rarity: "4 Star",
    weapon: "Erudition",
    element: "Lightning",
    mainstats: ["HP", "ATK", "CRIT Rate / DMG", "SPD", "Lightning DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Sushang: {
    name: "Sushang",
    rarity: "4 Star",
    weapon: "Hunt",
    element: "Physical",
    mainstats: ["HP", "ATK", "CRIT Rate / DMG", "SPD", "Physical DMG", "ATK%"],
    substats: ["CRIT Rate", "CRIT DMG", "ATK%"],
  },
  
  Tingyun: {
    name: "Tingyun",
    rarity: "4 Star",
    weapon: "Harmony",
    element: "Lightning",
    mainstats: ["HP", "ATK", "ATK%", "SPD", "ATK%", "ERR"],
    substats: ["ATK%", "SPD", "EFF RES%"],
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
