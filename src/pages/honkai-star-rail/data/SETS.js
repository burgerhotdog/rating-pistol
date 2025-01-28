const SETS = {
  // Version 3.0
  "Hero of Triumphant Song": {
    type: "Relic",
    requirements: {},
    stats: { "ATK%": 12, "SPD%": 6 },
  },

  "Poet of Mourning Collapse": {
    type: "Relic",
    requirements: {},
    stats: { "Quantum DMG": 10, "SPD%": -8, "CRIT Rate": 32 },
  },

  // Version 2.7
  
  // Version 2.6
  "Sacerdos' Relived Ordeal": {
    type: "Relic",
    requirements: {},
    stats: { "SPD%": 6 },
  },
  
  "Scholar Lost in Erudition": {
    type: "Relic",
    requirements: {},
    stats: { "CRIT Rate": 8 },
  },
  
  // Version 2.5
  "Lushaka, the Sunken Seas": {
    type: "Planar",
    requirements: {},
    stats: { "Energy Regeneration Rate": 5 },
  },
  
  "The Wondrous BananAmusement Park": {
    type: "Planar",
    requirements: {},
    stats: { "CRIT DMG": 48 },
  },
  
  // Version 2.4
  
  // Version 2.3
  "Duran, Dynasty of Running Wolves": {
    type: "Planar",
    requirements: {},
    stats: { "CRIT DMG": 25 },
  },
  
  "Forge of the Kalpagni Lantern": {
    type: "Planar",
    requirements: {},
    stats: { "SPD%": 6, "Break Effect": 40 },
  },
  
  "Iron Cavalry Against the Scourge": {
    type: "Relic",
    requirements: {},
    stats: { "Break Effect": 16 },
  },
  
  "The Wind-Soaring Valorous": {
    type: "Relic",
    requirements: {},
    stats: { "ATK%": 12, "CRIT Rate": 6 },
  },
  
  // Version 2.2
  
  // Version 2.1
  "Izumo Gensei and Takama Divine Realm": {
    type: "Planar",
    requirements: {},
    stats: { "ATK%": 12, "CRIT Rate": 12 },
  },
  
  "Sigonia, the Unclaimed Desolation": {
    type: "Planar",
    requirements: {},
    stats: { "CRIT Rate": 4, "CRIT DMG": 40 },
  },
  
  // Version 2.0
  "Pioneer Diver of Dead Waters": {
    type: "Relic",
    requirements: {},
    stats: { "CRIT Rate": 8, "CRIT DMG": 24 },
  },
  
  "Watchmaker, Master of Dream Machinations": {
    type: "Relic",
    requirements: {},
    stats: { "Break Effect": 16 },
  },
  
  // Version 1.6
  
  // Version 1.5
  "Firmament Frontline: Glamoth": {
    type: "Planar",
    requirements: { SPD: 160 },
    stats: { "ATK%": 12 },
  },
  
  "Penacony, Land of the Dreams": {
    type: "Planar",
    requirements: {},
    stats: { "Energy Regeneration Rate": 5 },
  },
  
  "Prisoner in Deep Confinement": {
    type: "Relic",
    requirements: {},
    stats: { "ATK%": 12 },
  },
  
  "The Ashblazing Grand Duke": {
    type: "Relic",
    requirements: {},
    stats: { "ATK%": 48 },
  },
  
  // Version 1.4
  
  // Version 1.3
  
  // Version 1.2
  "Broken Keel": {
    type: "Planar",
    requirements: { "Effect RES": 30 },
    stats: { "Effect RES": 10, "CRIT DMG": 10 },
  },
  
  "Longevous Disciple": {
    type: "Relic",
    requirements: {},
    stats: { "HP%": 12, "CRIT Rate": 16 },
  },
  
  "Messenger Traversing Hackerspace": {
    type: "Relic",
    requirements: {},
    stats: { "SPD%": 6 },
  },
  
  "Rutilant Arena": {
    type: "Planar",
    requirements: { "CRIT Rate": 70 },
    stats: { "CRIT Rate": 8 },
  },
  
  // Version 1.1
  
  // Version 1.0
  "Band of Sizzling Thunder": {
    type: "Relic",
    requirements: {},
    stats: { "Lightning DMG": 10 },
  },
  
  "Belobog of the Architects": {
    type: "Planar",
    requirements: { "Effect Hit Rate": 50 },
    stats: { "DEF%": 30 },
  },
  
  "Celestial Differentiator": {
    type: "Planar",
    requirements: { "CRIT DMG": 120 },
    stats: { "CRIT DMG": 16 },
  },
  
  "Champion of Streetwise Boxing": {
    type: "Relic",
    requirements: {},
    stats: { "Physical DMG": 10, "ATK%": 25 },
  },
  
  "Eagle of Twilight Line": {
    type: "Relic",
    requirements: {},
    stats: { "Wind DMG": 10 },
  },
  
  "Firesmith of Lava-Forging": {
    type: "Relic",
    requirements: {},
    stats: { "Fire DMG": 10 },
  },
  
  "Fleet of the Ageless": {
    type: "Planar",
    requirements: { SPD: 120 },
    stats: { "HP%": 12, "ATK%": 8 },
  },
  
  "Genius of Brilliant Stars": {
    type: "Relic",
    requirements: {},
    stats: { "Quantum DMG": 10 },
  },
  
  "Guard of Wuthering Snow": {
    type: "Relic",
    requirements: {},
    stats: {},
  },
  
  "Hunter of Glacial Forest": {
    type: "Relic",
    requirements: {},
    stats: { "Ice DMG": 10 },
  },
  
  "Inert Salsotto": {
    type: "Planar",
    requirements: { "CRIT Rate": 50 },
    stats: { "CRIT Rate": 8 },
  },
  
  "Knight of Purity Palace": {
    type: "Relic",
    requirements: {},
    stats: { "DEF%": 15 },
  },
  
  "Musketeer of Wild Wheat": {
    type: "Relic",
    requirements: {},
    stats: { "ATK%": 12, "SPD%": 6 },
  },
  
  "Pan-Cosmic Commercial Enterprise": {
    type: "Planar",
    requirements: { "Effect Hit Rate": 100 },
    stats: { "Effect Hit Rate": 10, "ATK%": 25 },
  },
  
  "Passerby of Wandering Cloud": {
    type: "Relic",
    requirements: {},
    stats: { "Outgoing Healing Boost": 10 },
  },
  
  "Space Sealing Station": {
    type: "Planar",
    requirements: { SPD: 120 },
    stats: { "ATK%": 24 },
  },
  
  "Sprightly Vonwacq": {
    type: "Planar",
    requirements: { SPD: 120 },
    stats: { "Energy Regeneration Rate": 5 },
  },
  
  "Talia: Kingdom of Banditry": {
    type: "Planar",
    requirements: { SPD: 145 },
    stats: { "Break Effect": 36 },
  },
  
  "Thief of Shooting Meteor": {
    type: "Relic",
    requirements: {},
    stats: { "Break Effect": 32 },
  },
  
  "Wastelander of Banditry Desert": {
    type: "Relic",
    requirements: {},
    stats: { "Imaginary DMG": 10, "CRIT Rate": 10, "CRIT DMG": 20 },
  },
}

export default SETS;
