const SETS = {
  // Version 3.0
  "Hero of Triumphant Song": {
    type: "Relic",
    stats: { "ATK%": 12, "SPD%": 6 },
    thresholds: {},
    limits: {},
  },

  "Poet of Mourning Collapse": {
    type: "Relic",
    stats: { "Quantum DMG": 10, "SPD%": -8, "CRIT Rate": 32 },
    thresholds: {},
    limits: {},
  },

  // Version 2.7
  
  // Version 2.6
  "Sacerdos' Relived Ordeal": {
    type: "Relic",
    stats: { "SPD%": 6 },
    thresholds: {},
    limits: {},
  },
  
  "Scholar Lost in Erudition": {
    type: "Relic",
    stats: { "CRIT Rate": 8 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.5
  "Lushaka, the Sunken Seas": {
    type: "Planar",
    stats: { "Energy Regeneration Rate": 5 },
    thresholds: {},
    limits: {},
  },
  
  "The Wondrous BananAmusement Park": {
    type: "Planar",
    stats: { "CRIT DMG": 48 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.4
  
  // Version 2.3
  "Duran, Dynasty of Running Wolves": {
    type: "Planar",
    stats: { "CRIT DMG": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Forge of the Kalpagni Lantern": {
    type: "Planar",
    stats: { "SPD%": 6, "Break Effect": 40 },
    thresholds: {},
    limits: {},
  },
  
  "Iron Cavalry Against the Scourge": {
    type: "Relic",
    stats: { "Break Effect": 16 },
    thresholds: {},
    limits: {},
  },
  
  "The Wind-Soaring Valorous": {
    type: "Relic",
    stats: { "ATK%": 12, "CRIT Rate": 6 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.2
  
  // Version 2.1
  "Izumo Gensei and Takama Divine Realm": {
    type: "Planar",
    stats: { "ATK%": 12, "CRIT Rate": 12 },
    thresholds: {},
    limits: {},
  },
  
  "Sigonia, the Unclaimed Desolation": {
    type: "Planar",
    stats: { "CRIT Rate": 4, "CRIT DMG": 40 },
    thresholds: {},
    limits: {},
  },
  
  // Version 2.0
  "Pioneer Diver of Dead Waters": {
    type: "Relic",
    stats: { "CRIT Rate": 8, "CRIT DMG": 24 },
    thresholds: {},
    limits: {},
  },
  
  "Watchmaker, Master of Dream Machinations": {
    type: "Relic",
    stats: { "Break Effect": 16 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.6
  
  // Version 1.5
  "Firmament Frontline: Glamoth": {
    type: "Planar",
    conditions: { SPD: 160 },
    stats: { "ATK%": 12 },
    thresholds: {},
    limits: {},
  },
  
  "Penacony, Land of the Dreams": {
    type: "Planar",
    stats: { "Energy Regeneration Rate": 5 },
    thresholds: {},
    limits: {},
  },
  
  "Prisoner in Deep Confinement": {
    type: "Relic",
    stats: { "ATK%": 12 },
    thresholds: {},
    limits: {},
  },
  
  "The Ashblazing Grand Duke": {
    type: "Relic",
    stats: { "ATK%": 48 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.4
  
  // Version 1.3
  
  // Version 1.2
  "Broken Keel": {
    type: "Planar",
    conditions: { "Effect RES": 30 },
    stats: { "Effect RES": 10, "CRIT DMG": 10 },
    thresholds: {},
    limits: {},
  },
  
  "Longevous Disciple": {
    type: "Relic",
    stats: { "HP%": 12, "CRIT Rate": 16 },
    thresholds: {},
    limits: {},
  },
  
  "Messenger Traversing Hackerspace": {
    type: "Relic",
    stats: { "SPD%": 6 },
    thresholds: {},
    limits: {},
  },
  
  "Rutilant Arena": {
    type: "Planar",
    conditions: { "CRIT Rate": 70 },
    stats: { "CRIT Rate": 8 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.1
  
  // Version 1.0
  "Band of Sizzling Thunder": {
    type: "Relic",
    stats: { "Lightning DMG": 10 },
    thresholds: {},
    limits: {},
  },
  
  "Belobog of the Architects": {
    type: "Planar",
    conditions: { "Effect Hit Rate": 50 },
    stats: { "DEF%": 30 },
    thresholds: {},
    limits: {},
  },
  
  "Celestial Differentiator": {
    type: "Planar",
    conditions: { "CRIT DMG": 120 },
    stats: { "CRIT DMG": 16 },
    thresholds: {},
    limits: {},
  },
  
  "Champion of Streetwise Boxing": {
    type: "Relic",
    stats: { "Physical DMG": 10, "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Eagle of Twilight Line": {
    type: "Relic",
    stats: { "Wind DMG": 10 },
    thresholds: {},
    limits: {},
  },
  
  "Firesmith of Lava-Forging": {
    type: "Relic",
    stats: { "Fire DMG": 10 },
    thresholds: {},
    limits: {},
  },
  
  "Fleet of the Ageless": {
    type: "Planar",
    conditions: { SPD: 120 },
    stats: { "HP%": 12, "ATK%": 8 },
    thresholds: {},
    limits: {},
  },
  
  "Genius of Brilliant Stars": {
    type: "Relic",
    stats: { "Quantum DMG": 10 },
    thresholds: {},
    limits: {},
  },
  
  "Guard of Wuthering Snow": {
    type: "Relic",
    stats: {},
    thresholds: {},
    limits: {},
  },
  
  "Hunter of Glacial Forest": {
    type: "Relic",
    stats: { "Ice DMG": 10 },
    thresholds: {},
    limits: {},
  },
  
  "Inert Salsotto": {
    type: "Planar",
    conditions: { "CRIT Rate": 50 },
    stats: { "CRIT Rate": 8 },
    thresholds: {},
    limits: {},
  },
  
  "Knight of Purity Palace": {
    type: "Relic",
    stats: { "DEF%": 15 },
    thresholds: {},
    limits: {},
  },
  
  "Musketeer of Wild Wheat": {
    type: "Relic",
    stats: { "ATK%": 12, "SPD%": 6 },
    thresholds: {},
    limits: {},
  },
  
  "Pan-Cosmic Commercial Enterprise": {
    type: "Planar",
    conditions: { "Effect Hit Rate": 100 },
    stats: { "Effect Hit Rate": 10, "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Passerby of Wandering Cloud": {
    type: "Relic",
    stats: { "Outgoing Healing Boost": 10 },
    thresholds: {},
    limits: {},
  },
  
  "Space Sealing Station": {
    type: "Planar",
    conditions: { SPD: 120 },
    stats: { "ATK%": 24 },
    thresholds: {},
    limits: {},
  },
  
  "Sprightly Vonwacq": {
    type: "Planar",
    conditions: { SPD: 120 },
    stats: { "Energy Regeneration Rate": 5 },
    thresholds: {},
    limits: {},
  },
  
  "Talia: Kingdom of Banditry": {
    type: "Planar",
    conditions: { SPD: 145 },
    stats: { "Break Effect": 36 },
    thresholds: {},
    limits: {},
  },
  
  "Thief of Shooting Meteor": {
    type: "Relic",
    stats: { "Break Effect": 32 },
    thresholds: {},
    limits: {},
  },
  
  "Wastelander of Banditry Desert": {
    type: "Relic",
    stats: { "Imaginary DMG": 10, "CRIT Rate": 10, "CRIT DMG": 20 },
    thresholds: {},
    limits: {},
  },
}

export default SETS;
