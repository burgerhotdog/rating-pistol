const WEAPONS = {
  // Version 1.5
  "Elegant Vanity": {
    type: "Support",
    base: { ATK: 713 },
    stats: { "ATK%": 30 },
    thresholds: {},
    limits: {},
  },

  "Heartstring Nocturne": {
    type: "Attack",
    base: { ATK: 713 },
    stats: { "CRIT Rate": 24 },
    thresholds: {},
    limits: {},
  },

  // Version 1.4
  "Hailstorm Shrine": {
    type: "Anomaly",
    base: { ATK: 743 },
    stats: { "CRIT Rate": 24 },
    thresholds: {},
    limits: {},
  },
  
  "Marcato Desire": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "CRIT Rate": 20 },
    thresholds: {},
    limits: {},
  },
  
  "Zanshin Herb Case": {
    type: "Attack",
    base: { ATK: 713 },
    stats: { "CRIT DMG": 48 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.3
  "Blazing Laurel": {
    type: "Stun",
    base: { ATK: 713 },
    stats: { "Impact%": 18 },
    thresholds: {},
    limits: {},
  },
  
  "Timeweaver": {
    type: "Anomaly",
    base: { ATK: 713 },
    stats: { "ATK%": 30 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.2
  "Flamemaker Shaker": {
    type: "Anomaly",
    base: { ATK: 713 },
    stats: { "ATK%": 30 },
    thresholds: {},
    limits: {},
  },
  
  "Tusks of Fury": {
    type: "Defense",
    base: { ATK: 713 },
    stats: { "Impact%": 18 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.1
  "Gilded Blossom": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Ice-Jade Teapot": {
    type: "Stun",
    base: { ATK: 713 },
    stats: { "Impact%": 18 },
    thresholds: {},
    limits: {},
  },
  
  "Peacekeeper - Specialized": {
    type: "Defense",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Sharpened Stinger": {
    type: "Anomaly",
    base: { ATK: 713 },
    stats: { "Anomaly Proficiency": 90 },
    thresholds: {},
    limits: {},
  },
  
  // Version 1.0
  "Bashful Demon": {
    type: "Support",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Big Cylinder": {
    type: "Defense",
    base: { ATK: 624 },
    stats: { "DEF%": 40 },
    thresholds: {},
    limits: {},
  },
  
  "Bunny Band": {
    type: "Defense",
    base: { ATK: 594 },
    stats: { "DEF%": 40 },
    thresholds: {},
    limits: {},
  },
  
  "Cannon Rotor": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "CRIT Rate": 20 },
    thresholds: {},
    limits: {},
  },
  
  "Deep Sea Visitor": {
    type: "Attack",
    base: { ATK: 713 },
    stats: { "CRIT Rate": 24 },
    thresholds: {},
    limits: {},
  },
  
  "Demara Battery Mark II": {
    type: "Stun",
    base: { ATK: 624 },
    stats: { "Impact%": 15 },
    thresholds: {},
    limits: {},
  },
  
  "Drill Rig - Red Axis": {
    type: "Attack",
    base: { ATK: 624 },
    stats: { "Energy Regen": 50 },
    thresholds: {},
    limits: {},
  },
  
  "Electro-Lip Gloss": {
    type: "Anomaly",
    base: { ATK: 594 },
    stats: { "Anomaly Proficiency": 75 },
    thresholds: {},
    limits: {},
  },
  
  "Fusion Compiler": {
    type: "Anomaly",
    base: { ATK: 684 },
    stats: { "PEN Ratio": 24 },
    thresholds: {},
    limits: {},
  },
  
  "Hellfire Gears": {
    type: "Stun",
    base: { ATK: 684 },
    stats: { "Impact%": 18 },
    thresholds: {},
    limits: {},
  },
  
  "Housekeeper": {
    type: "Attack",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "[Identity] Base": {
    type: "Defense",
    base: { ATK: 475 },
    stats: { "DEF%": 32 },
    thresholds: {},
    limits: {},
  },
  
  "[Identity] Inflection": {
    type: "Defense",
    base: { ATK: 475 },
    stats: { "DEF%": 32 },
    thresholds: {},
    limits: {},
  },
  
  "Kaboom the Cannon": {
    type: "Support",
    base: { ATK: 624 },
    stats: { "Energy Regen": 50 },
    thresholds: {},
    limits: {},
  },
  
  "[Lunar] Decrescent": {
    type: "Attack",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
    thresholds: {},
    limits: {},
  },
  
  "[Lunar] Noviluna": {
    type: "Attack",
    base: { ATK: 475 },
    stats: { "CRIT Rate": 16 },
    thresholds: {},
    limits: {},
  },
  
  "[Lunar] Pleniluna": {
    type: "Attack",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
    thresholds: {},
    limits: {},
  },
  
  "[Magnetic Storm] Alpha": {
    type: "Anomaly",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
    thresholds: {},
    limits: {},
  },
  
  "[Magnetic Storm] Bravo": {
    type: "Anomaly",
    base: { ATK: 475 },
    stats: { "Anomaly Proficiency": 60 },
    thresholds: {},
    limits: {},
  },
  
  "[Magnetic Storm] Charlie": {
    type: "Anomaly",
    base: { ATK: 475 },
    stats: { "PEN Ratio": 16 },
    thresholds: {},
    limits: {},
  },
  
  "Original Transmorpher": {
    type: "Defense",
    base: { ATK: 594 },
    stats: { "HP%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Precious Fossilized Core": {
    type: "Stun",
    base: { ATK: 594 },
    stats: { "Impact%": 15 },
    thresholds: {},
    limits: {},
  },
  
  "Rainforest Gourmet": {
    type: "Anomaly",
    base: { ATK: 594 },
    stats: { "Anomaly Proficiency": 75 },
    thresholds: {},
    limits: {},
  },
  
  "[Reverb] Mark I": {
    type: "Support",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
    thresholds: {},
    limits: {},
  },
  
  "[Reverb] Mark II": {
    type: "Support",
    base: { ATK: 475 },
    stats: { "Energy Regen": 40 },
    thresholds: {},
    limits: {},
  },
  
  "[Reverb] Mark III": {
    type: "Support",
    base: { ATK: 475 },
    stats: { "HP%": 20 },
    thresholds: {},
    limits: {},
  },
  
  "Riot Suppressor Mark VI": {
    type: "Attack",
    base: { ATK: 713 },
    stats: { "CRIT DMG": 48 },
    thresholds: {},
    limits: {},
  },
  
  "Roaring Ride": {
    type: "Anomaly",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Six Shooter": {
    type: "Stun",
    base: { ATK: 594 },
    stats: { "Impact%": 15 },
    thresholds: {},
    limits: {},
  },
  
  "Slice of Time": {
    type: "Support",
    base: { ATK: 594 },
    stats: { "PEN Ratio": 20 },
    thresholds: {},
    limits: {},
  },
  
  "Spring Embrace": {
    type: "Defense",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Starlight Engine": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Starlight Engine Replica": {
    type: "Attack",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "Steam Oven": {
    type: "Stun",
    base: { ATK: 594 },
    stats: { "Energy Regen": 50 },
    thresholds: {},
    limits: {},
  },
  
  "Steel Cushion": {
    type: "Attack",
    base: { ATK: 684 },
    stats: { "CRIT Rate": 24 },
    thresholds: {},
    limits: {},
  },
  
  "Street Superstar": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
  
  "The Brimstone": {
    type: "Attack",
    base: { ATK: 684 },
    stats: { "ATK%": 30 },
    thresholds: {},
    limits: {},
  },
  
  "The Restrained": {
    type: "Stun",
    base: { ATK: 684 },
    stats: { "Impact%": 18 },
    thresholds: {},
    limits: {},
  },
  
  "The Vault": {
    type: "Support",
    base: { ATK: 624 },
    stats: { "Energy Regen": 50 },
    thresholds: {},
    limits: {},
  },
  
  "Unfettered Game Ball": {
    type: "Support",
    base: { ATK: 594 },
    stats: { "Energy Regen": 50 },
    thresholds: {},
    limits: {},
  },
  
  "[Vortex] Arrow": {
    type: "Stun",
    base: { ATK: 475 },
    stats: { "Impact%": 12 },
    thresholds: {},
    limits: {},
  },
  
  "[Vortex] Hatchet": {
    type: "Stun",
    base: { ATK: 475 },
    stats: { "Energy Regen": 40 },
    thresholds: {},
    limits: {},
  },
  
  "[Vortex] Revolver": {
    type: "Stun",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
    thresholds: {},
    limits: {},
  },
  
  "Weeping Cradle": {
    type: "Support",
    base: { ATK: 684 },
    stats: { "PEN Ratio": 24 },
    thresholds: {},
    limits: {},
  },
  
  "Weeping Gemini": {
    type: "Anomaly",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
    thresholds: {},
    limits: {},
  },
};

export default WEAPONS;
