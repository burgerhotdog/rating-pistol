const WEAPONS = {
  // Version 1.5
  "Elegant Vanity": {
    type: "Support",
    base: { ATK: 713 },
    stats: { "ATK%": 30 },
  },

  "Heartstring Nocturne": {
    type: "Attack",
    base: { ATK: 713 },
    stats: { "CRIT Rate": 24 },
  },

  // Version 1.4
  "Hailstorm Shrine": {
    type: "Anomaly",
    base: { ATK: 743 },
    stats: { "CRIT Rate": 24 },
  },
  
  "Marcato Desire": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "CRIT Rate": 20 },
  },
  
  "Zanshin Herb Case": {
    type: "Attack",
    base: { ATK: 713 },
    stats: { "CRIT DMG": 48 },
  },
  
  // Version 1.3
  "Blazing Laurel": {
    type: "Stun",
    base: { ATK: 713 },
    stats: { "Impact%": 18 },
  },
  
  "Timeweaver": {
    type: "Anomaly",
    base: { ATK: 713 },
    stats: { "ATK%": 30 },
  },
  
  // Version 1.2
  "Flamemaker Shaker": {
    type: "Anomaly",
    base: { ATK: 713 },
    stats: { "ATK%": 30 },
  },
  
  "Tusks of Fury": {
    type: "Defense",
    base: { ATK: 713 },
    stats: { "Impact%": 18 },
  },
  
  // Version 1.1
  "Gilded Blossom": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
  },
  
  "Ice-Jade Teapot": {
    type: "Stun",
    base: { ATK: 713 },
    stats: { "Impact%": 18 },
  },
  
  "Peacekeeper - Specialized": {
    type: "Defense",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
  },
  
  "Sharpened Stinger": {
    type: "Anomaly",
    base: { ATK: 713 },
    stats: { "Anomaly Proficiency": 90 },
  },
  
  // Version 1.0
  "Bashful Demon": {
    type: "Support",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
  },
  
  "Big Cylinder": {
    type: "Defense",
    base: { ATK: 624 },
    stats: { "DEF%": 40 },
  },
  
  "Bunny Band": {
    type: "Defense",
    base: { ATK: 594 },
    stats: { "DEF%": 40 },
  },
  
  "Cannon Rotor": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "CRIT Rate": 20 },
  },
  
  "Deep Sea Visitor": {
    type: "Attack",
    base: { ATK: 713 },
    stats: { "CRIT Rate": 24 },
  },
  
  "Demara Battery Mark II": {
    type: "Stun",
    base: { ATK: 624 },
    stats: { "Impact%": 15 },
  },
  
  "Drill Rig - Red Axis": {
    type: "Attack",
    base: { ATK: 624 },
    stats: { "Energy Regen": 50 },
  },
  
  "Electro-Lip Gloss": {
    type: "Anomaly",
    base: { ATK: 594 },
    stats: { "Anomaly Proficiency": 75 },
  },
  
  "Fusion Compiler": {
    type: "Anomaly",
    base: { ATK: 684 },
    stats: { "PEN Ratio": 24 },
  },
  
  "Hellfire Gears": {
    type: "Stun",
    base: { ATK: 684 },
    stats: { "Impact%": 18 },
  },
  
  "Housekeeper": {
    type: "Attack",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
  },
  
  "[Identity] Base": {
    type: "Defense",
    base: { ATK: 475 },
    stats: { "DEF%": 32 },
  },
  
  "[Identity] Inflection": {
    type: "Defense",
    base: { ATK: 475 },
    stats: { "DEF%": 32 },
  },
  
  "Kaboom the Cannon": {
    type: "Support",
    base: { ATK: 624 },
    stats: { "Energy Regen": 50 },
  },
  
  "[Lunar] Decrescent": {
    type: "Attack",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
  },
  
  "[Lunar] Noviluna": {
    type: "Attack",
    base: { ATK: 475 },
    stats: { "CRIT Rate": 16 },
  },
  
  "[Lunar] Pleniluna": {
    type: "Attack",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
  },
  
  "[Magnetic Storm] Alpha": {
    type: "Anomaly",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
  },
  
  "[Magnetic Storm] Bravo": {
    type: "Anomaly",
    base: { ATK: 475 },
    stats: { "Anomaly Proficiency": 60 },
  },
  
  "[Magnetic Storm] Charlie": {
    type: "Anomaly",
    base: { ATK: 475 },
    stats: { "PEN Ratio": 16 },
  },
  
  "Original Transmorpher": {
    type: "Defense",
    base: { ATK: 594 },
    stats: { "HP%": 25 },
  },
  
  "Precious Fossilized Core": {
    type: "Stun",
    base: { ATK: 594 },
    stats: { "Impact%": 15 },
  },
  
  "Rainforest Gourmet": {
    type: "Anomaly",
    base: { ATK: 594 },
    stats: { "Anomaly Proficiency": 75 },
  },
  
  "[Reverb] Mark I": {
    type: "Support",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
  },
  
  "[Reverb] Mark II": {
    type: "Support",
    base: { ATK: 475 },
    stats: { "Energy Regen": 40 },
  },
  
  "[Reverb] Mark III": {
    type: "Support",
    base: { ATK: 475 },
    stats: { "HP%": 20 },
  },
  
  "Riot Suppressor Mark VI": {
    type: "Attack",
    base: { ATK: 713 },
    stats: { "CRIT DMG": 48 },
  },
  
  "Roaring Ride": {
    type: "Anomaly",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
  },
  
  "Six Shooter": {
    type: "Stun",
    base: { ATK: 594 },
    stats: { "Impact%": 15 },
  },
  
  "Slice of Time": {
    type: "Support",
    base: { ATK: 594 },
    stats: { "PEN Ratio": 20 },
  },
  
  "Spring Embrace": {
    type: "Defense",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
  },
  
  "Starlight Engine": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
  },
  
  "Starlight Engine Replica": {
    type: "Attack",
    base: { ATK: 624 },
    stats: { "ATK%": 25 },
  },
  
  "Steam Oven": {
    type: "Stun",
    base: { ATK: 594 },
    stats: { "Energy Regen": 50 },
  },
  
  "Steel Cushion": {
    type: "Attack",
    base: { ATK: 684 },
    stats: { "CRIT Rate": 24 },
  },
  
  "Street Superstar": {
    type: "Attack",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
  },
  
  "The Brimstone": {
    type: "Attack",
    base: { ATK: 684 },
    stats: { "ATK%": 30 },
  },
  
  "The Restrained": {
    type: "Stun",
    base: { ATK: 684 },
    stats: { "Impact%": 18 },
  },
  
  "The Vault": {
    type: "Support",
    base: { ATK: 624 },
    stats: { "Energy Regen": 50 },
  },
  
  "Unfettered Game Ball": {
    type: "Support",
    base: { ATK: 594 },
    stats: { "Energy Regen": 50 },
  },
  
  "[Vortex] Arrow": {
    type: "Stun",
    base: { ATK: 475 },
    stats: { "Impact%": 12 },
  },
  
  "[Vortex] Hatchet": {
    type: "Stun",
    base: { ATK: 475 },
    stats: { "Energy Regen": 40 },
  },
  
  "[Vortex] Revolver": {
    type: "Stun",
    base: { ATK: 475 },
    stats: { "ATK%": 20 },
  },
  
  "Weeping Cradle": {
    type: "Support",
    base: { ATK: 684 },
    stats: { "PEN Ratio": 24 },
  },
  
  "Weeping Gemini": {
    type: "Anomaly",
    base: { ATK: 594 },
    stats: { "ATK%": 25 },
  },
};

export default WEAPONS;
