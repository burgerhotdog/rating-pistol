const WEAPONS = {
  // Version 1.5
  [`Elegant Vanity`]: {
    type: "Support",
    base: { ATK: 713 },
    substat: "ATK%: 30",
    subtitle: ``,
    desc: [
      ``,
    ],
  },

  [`Heartstring Nocturne`]: {
    type: "Attack",
    base: { ATK: 713 },
    substat: "CRIT Rate: 24",
    subtitle: ``,
    desc: [
      ``,
    ],
  },

  // Version 1.4
  [`Hailstorm Shrine`]: {
    type: "Anomaly",
    base: { ATK: 743 },
    substat: "CRIT Rate: 24",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Marcato Desire`]: {
    type: "Attack",
    base: { ATK: 594 },
    substat: "CRIT Rate: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Zanshin Herb Case`]: {
    type: "Attack",
    base: { ATK: 713 },
    substat: "CRIT DMG: 48",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  // Version 1.3
  [`Blazing Laurel`]: {
    type: "Stun",
    base: { ATK: 713 },
    substat: "Impact%: 18",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Timeweaver`]: {
    type: "Anomaly",
    base: { ATK: 713 },
    substat: "ATK%: 30",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  // Version 1.2
  [`Flamemaker Shaker`]: {
    type: "Anomaly",
    base: { ATK: 713 },
    substat: "ATK%: 30",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Tusks of Fury`]: {
    type: "Defense",
    base: { ATK: 713 },
    substat: "Impact%: 18",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  // Version 1.1
  [`Gilded Blossom`]: {
    type: "Attack",
    base: { ATK: 594 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Ice-Jade Teapot`]: {
    type: "Stun",
    base: { ATK: 713 },
    substat: "Impact%: 18",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Peacekeeper - Specialized`]: {
    type: "Defense",
    base: { ATK: 624 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Sharpened Stinger`]: {
    type: "Anomaly",
    base: { ATK: 713 },
    substat: "Anomaly Proficiency: 90",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  // Version 1.0
  [`Bashful Demon`]: {
    type: "Support",
    base: { ATK: 624 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Big Cylinder`]: {
    type: "Defense",
    base: { ATK: 624 },
    substat: "DEF%: 40",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Bunny Band`]: {
    type: "Defense",
    base: { ATK: 594 },
    substat: "DEF%: 40",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Cannon Rotor`]: {
    type: "Attack",
    base: { ATK: 594 },
    substat: "CRIT Rate: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Deep Sea Visitor`]: {
    type: "Attack",
    base: { ATK: 713 },
    substat: "CRIT Rate: 24",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Demara Battery Mark II`]: {
    type: "Stun",
    base: { ATK: 624 },
    substat: "Impact%: 15",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Drill Rig - Red Axis`]: {
    type: "Attack",
    base: { ATK: 624 },
    substat: "Energy Regen: 50",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Electro-Lip Gloss`]: {
    type: "Anomaly",
    base: { ATK: 594 },
    substat: "Anomaly Proficiency: 75",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Fusion Compiler`]: {
    type: "Anomaly",
    base: { ATK: 684 },
    substat: "PEN Ratio: 24",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Hellfire Gears`]: {
    type: "Stun",
    base: { ATK: 684 },
    substat: "Impact%: 18",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Housekeeper`]: {
    type: "Attack",
    base: { ATK: 624 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Identity] Base`]: {
    type: "Defense",
    base: { ATK: 475 },
    substat: "DEF%: 32",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Identity] Inflection`]: {
    type: "Defense",
    base: { ATK: 475 },
    substat: "DEF%: 32",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Kaboom the Cannon`]: {
    type: "Support",
    base: { ATK: 624 },
    substat: "Energy Regen: 50",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Lunar] Decrescent`]: {
    type: "Attack",
    base: { ATK: 475 },
    substat: "ATK%: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Lunar] Noviluna`]: {
    type: "Attack",
    base: { ATK: 475 },
    substat: "CRIT Rate: 16",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Lunar] Pleniluna`]: {
    type: "Attack",
    base: { ATK: 475 },
    substat: "ATK%: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Magnetic Storm] Alpha`]: {
    type: "Anomaly",
    base: { ATK: 475 },
    substat: "ATK%: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Magnetic Storm] Bravo`]: {
    type: "Anomaly",
    base: { ATK: 475 },
    substat: "Anomaly Proficiency: 60",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Magnetic Storm] Charlie`]: {
    type: "Anomaly",
    base: { ATK: 475 },
    substat: "PEN Ratio: 16",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Original Transmorpher`]: {
    type: "Defense",
    base: { ATK: 594 },
    substat: "HP%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Precious Fossilized Core`]: {
    type: "Stun",
    base: { ATK: 594 },
    substat: "Impact%: 15",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Rainforest Gourmet`]: {
    type: "Anomaly",
    base: { ATK: 594 },
    substat: "Anomaly Proficiency: 75",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Reverb] Mark I`]: {
    type: "Support",
    base: { ATK: 475 },
    substat: "ATK%: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Reverb] Mark II`]: {
    type: "Support",
    base: { ATK: 475 },
    substat: "Energy Regen: 40",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Reverb] Mark III`]: {
    type: "Support",
    base: { ATK: 475 },
    substat: "HP%: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Riot Suppressor Mark VI`]: {
    type: "Attack",
    base: { ATK: 713 },
    substat: "CRIT DMG: 48",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Roaring Ride`]: {
    type: "Anomaly",
    base: { ATK: 624 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Six Shooter`]: {
    type: "Stun",
    base: { ATK: 594 },
    substat: "Impact%: 15",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Slice of Time`]: {
    type: "Support",
    base: { ATK: 594 },
    substat: "PEN Ratio: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Spring Embrace`]: {
    type: "Defense",
    base: { ATK: 594 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Starlight Engine`]: {
    type: "Attack",
    base: { ATK: 594 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Starlight Engine Replica`]: {
    type: "Attack",
    base: { ATK: 624 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Steam Oven`]: {
    type: "Stun",
    base: { ATK: 594 },
    substat: "Energy Regen: 50",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Steel Cushion`]: {
    type: "Attack",
    base: { ATK: 684 },
    substat: "CRIT Rate: 24",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Street Superstar`]: {
    type: "Attack",
    base: { ATK: 594 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`The Brimstone`]: {
    type: "Attack",
    base: { ATK: 684 },
    substat: "ATK%: 30",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`The Restrained`]: {
    type: "Stun",
    base: { ATK: 684 },
    substat: "Impact%: 18",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`The Vault`]: {
    type: "Support",
    base: { ATK: 624 },
    substat: "Energy Regen: 50",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Unfettered Game Ball`]: {
    type: "Support",
    base: { ATK: 594 },
    substat: "Energy Regen: 50",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Vortex] Arrow`]: {
    type: "Stun",
    base: { ATK: 475 },
    substat: "Impact%: 12",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Vortex] Hatchet`]: {
    type: "Stun",
    base: { ATK: 475 },
    substat: "Energy Regen: 40",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`[Vortex] Revolver`]: {
    type: "Stun",
    base: { ATK: 475 },
    substat: "ATK%: 20",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Weeping Cradle`]: {
    type: "Support",
    base: { ATK: 684 },
    substat: "PEN Ratio: 24",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Weeping Gemini`]: {
    type: "Anomaly",
    base: { ATK: 594 },
    substat: "ATK%: 25",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
};

export default WEAPONS;