const WEAPONS = {
  // Version 2.0
  "Call of the Abyss": {
    type: "Rectifier",
    base: { ATK: 338 },
    stats: { "Energy Regen": 51.8 },
  },
  
  "Fables of Wisdom": {
    type: "Sword",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },

  "Legend of Drunken Hero": {
    type: "Gauntlets",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },

  "Meditations on Mercy": {
    type: "Broadblade",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },
  
  "Romance in Farewell": {
    type: "Pistols",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },

  "The Last Dance": {
    type: "Pistols",
    base: { ATK: 500 },
    stats: { "CRIT DMG": 72 },
  },

  "Tragicomedy": {
    type: "Gauntlets",
    base: { ATK: 587 },
    stats: { "CRIT Rate": 24.3 },
  },
  
  "Waltz in Masquerade": {
    type: "Rectifier",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },
  
  // Version 1.4
  "Red Spring": {
    type: "Sword",
    base: { ATK: 587 },
    stats: { "CRIT Rate": 24.3 },
  },
  
  "Somnoire Anchor": {
    type: "Sword",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },
  
  // Version 1.3
  "Celestial Spiral": {
    type: "Gauntlets",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },
  
  "Endless Collapse": {
    type: "Sword",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },
  
  "Fusion Accretion": {
    type: "Rectifier",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },
  
  "Relativistic Jet": {
    type: "Pistols",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },
  
  "Stellar Symphony": {
    type: "Rectifier",
    base: { ATK: 412 },
    stats: { "Energy Regen": 77 },
  },
  
  "Waning Redshift": {
    type: "Broadblade",
    base: { ATK: 462 },
    stats: { "ATK%": 18.2 },
  },
  
  // Version 1.2
  "Rime-Draped Sprouts": {
    type: "Rectifier",
    base: { ATK: 500 },
    stats: { "CRIT DMG": 72 },
  },
  
  "Verity's Handle": {
    type: "Gauntlets",
    base: { ATK: 587 },
    stats: { "CRIT Rate": 24.3 },
  },
  
  // Version 1.1
  "Beguiling Melody": {
    type: "Broadblade",
    base: { ATK: 300 },
    stats: { "ATK%": 30.4 },
  },
  
  "Blazing Brilliance": {
    type: "Sword",
    base: { ATK: 587 },
    stats: { "CRIT DMG": 48.6 },
  },
  
  "Ages of Harvest": {
    type: "Broadblade",
    base: { ATK: 587 },
    stats: { "CRIT Rate": 24.3 },
  },
  
  // Version 1.0
  "Abyss Surges": {
    type: "Gauntlets",
    base: { ATK: 587 },
    stats: { "ATK%": 36.4 },
  },
  
  "Amity Accord": {
    type: "Gauntlets",
    base: { ATK: 337 },
    stats: { "DEF%": 61.5 },
  },
  
  "Augment": {
    type: "Rectifier",
    base: { ATK: 412 },
    stats: { "CRIT Rate": 20.2 },
  },
  
  "Autumntrace": {
    type: "Broadblade",
    base: { ATK: 412 },
    stats: { "CRIT Rate": 20.2 },
  },
  
  "Broadblade#41": {
    type: "Broadblade",
    base: { ATK: 412 },
    stats: { "Energy Regen": 32.3 },
  },
  
  "Broadblade of Night": {
    type: "Broadblade",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Broadblade of Voyager": {
    type: "Broadblade",
    base: { ATK: 300 },
    stats: { "Energy Regen": 32.3 },
  },
  
  "Cadenza": {
    type: "Pistols",
    base: { ATK: 337 },
    stats: { "Energy Regen": 51.8 },
  },
  
  "Comet Flare": {
    type: "Rectifier",
    base: { ATK: 412 },
    stats: { "HP%": 30.3 },
  },
  
  "Commando of Conviction": {
    type: "Sword",
    base: { ATK: 412 },
    stats: { "ATK%": 30.3 },
  },
  
  "Cosmic Ripples": {
    type: "Rectifier",
    base: { ATK: 500 },
    stats: { "ATK%": 54 },
  },
  
  "Dauntless Evernight": {
    type: "Broadblade",
    base: { ATK: 337 },
    stats: { "DEF%": 61.5 },
  },
  
  "Discord": {
    type: "Broadblade",
    base: { ATK: 337 },
    stats: { "Energy Regen": 51.8 },
  },
  
  "Emerald of Genesis": {
    type: "Sword",
    base: { ATK: 587 },
    stats: { "CRIT Rate": 24.3 },
  },
  
  "Gauntlets#21D": {
    type: "Gauntlets",
    base: { ATK: 387 },
    stats: { "Energy Regen": 38.8 },
  },
  
  "Gauntlets of Night": {
    type: "Gauntlets",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Gauntlets of Voyager": {
    type: "Gauntlets",
    base: { ATK: 325 },
    stats: { "Energy Regen": 30.7 },
  },
  
  "Guardian Broadblade": {
    type: "Broadblade",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Guardian Gauntlets": {
    type: "Gauntlets",
    base: { ATK: 300 },
    stats: { "DEF%": 38.4 },
  },
  
  "Guardian Pistols": {
    type: "Pistols",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Guardian Rectifier": {
    type: "Rectifier",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Guardian Sword": {
    type: "Sword",
    base: { ATK: 300 },
    stats: { "ATK%": 30.3 },
  },
  
  "Helios Cleaver": {
    type: "Broadblade",
    base: { ATK: 412 },
    stats: { "ATK%": 30.3 },
  },
  
  "Hollow Mirage": {
    type: "Gauntlets",
    base: { ATK: 412 },
    stats: { "ATK%": 30.3 },
  },
  
  "Jinzhou Keeper": {
    type: "Rectifier",
    base: { ATK: 387 },
    stats: { "ATK%": 36.4 },
  },
  
  "Lumingloss": {
    type: "Sword",
    base: { ATK: 387 },
    stats: { "ATK%": 36.4 },
  },
  
  "Lunar Cutter": {
    type: "Sword",
    base: { ATK: 412 },
    stats: { "ATK%": 30.3 },
  },
  
  "Lustrous Razor": {
    type: "Broadblade",
    base: { ATK: 587 },
    stats: { "ATK%": 36.4 },
  },
  
  "Marcato": {
    type: "Gauntlets",
    base: { ATK: 337 },
    stats: { "Energy Regen": 51.8 },
  },
  
  "Novaburst": {
    type: "Pistols",
    base: { ATK: 412 },
    stats: { "ATK%": 30.3 },
  },
  
  "Originite: Type I": {
    type: "Broadblade",
    base: { ATK: 300 },
    stats: { "DEF%": 38.4 },
  },
  
  "Originite: Type II": {
    type: "Sword",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Originite: Type III": {
    type: "Pistols",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Originite: Type IV": {
    type: "Gauntlets",
    base: { ATK: 300 },
    stats: { "CRIT DMG": 40.5 },
  },
  
  "Originite: Type V": {
    type: "Rectifier",
    base: { ATK: 300 },
    stats: { "ATK%": 30.3 },
  },
  
  "Overture": {
    type: "Sword",
    base: { ATK: 337 },
    stats: { "Energy Regen": 51.8 },
  },
  
  "Pistols#26": {
    type: "Pistols",
    base: { ATK: 387 },
    stats: { "ATK%": 36.4 },
  },
  
  "Pistols of Night": {
    type: "Pistols",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Pistols of Voyager": {
    type: "Pistols",
    base: { ATK: 300 },
    stats: { "ATK%": 30.3 },
  },
  
  "Rectifier#25": {
    type: "Rectifier",
    base: { ATK: 337 },
    stats: { "Energy Regen": 51.8 },
  },
  
  "Rectifier of Night": {
    type: "Rectifier",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Rectifier of Voyager": {
    type: "Rectifier",
    base: { ATK: 300 },
    stats: { "Energy Regen": 32.3 },
  },
  
  "Static Mist": {
    type: "Pistols",
    base: { ATK: 587 },
    stats: { "CRIT Rate": 24.3 },
  },
  
  "Stonard": {
    type: "Gauntlets",
    base: { ATK: 412 },
    stats: { "CRIT Rate": 20.2 },
  },
  
  "Stringmaster": {
    type: "Rectifier",
    base: { ATK: 500 },
    stats: { "CRIT Rate": 36 },
  },
  
  "Sword#18": {
    type: "Sword",
    base: { ATK: 387 },
    stats: { "ATK%": 36.4 },
  },
  
  "Sword of Night": {
    type: "Sword",
    base: { ATK: 325 },
    stats: { "ATK%": 24.3 },
  },
  
  "Sword of Voyager": {
    type: "Sword",
    base: { ATK: 300 },
    stats: { "Energy Regen": 32.3 },
  },
  
  "Thunderbolt": {
    type: "Pistols",
    base: { ATK: 387 },
    stats: { "ATK%": 36.4 },
  },
  
  "Undying Flame": {
    type: "Pistols",
    base: { ATK: 412 },
    stats: { "ATK%": 30.3 },
  },
  
  "Variation": {
    type: "Rectifier",
    base: { ATK: 337 },
    stats: { "Energy Regen": 51.8 },
  },
  
  "Verdant Summit": {
    type: "Broadblade",
    base: { ATK: 587 },
    stats: { "CRIT DMG": 48.6 },
  },
};

export default WEAPONS;
