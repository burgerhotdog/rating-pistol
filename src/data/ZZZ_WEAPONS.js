const ZZZ_WEAPONS = {
  // Version 1.5
  "14131": {
    name: "Elegant Vanity",
    type: "Support",
    base: { ATK: 713 },
    substat: "ATK: 30%",
    subtitle: "Untold Beauty",
    desc: "When any squad member enters the field through a Quick Assist, Chain Attack, Defensive Assist, or Evasive Assist, the equipper gains 5 Energy. This effect can trigger once every 5s. When the equipper consumes 25 or more Energy, the DMG dealt by all squad members increases by 10%, stacking up to 2 times, and lasting 20s. Repeated triggers reset the duration. Only one instance of this effect can exist in the same squad.",
  },

  "14132": {
    name: "Heartstring Nocturne",
    type: "Attack",
    base: { ATK: 713 },
    substat: "CRIT Rate: 24%",
    subtitle: "String & Melody",
    desc: "CRIT DMG increases by 50%. When the equipper enters the battlefield, or activates a Chain Attack or Ultimate, they gain 1 stack of Heartstring. Each stack of Heartstring allows the equipper's Chain Attack and Ultimate to ignore 12.5% of the target's Fire RES, stacking up to 2 times and lasting 30s. Repeated triggers reset the duration.",
  },

  // Version 1.4
  "14109": {
    name: "Hailstorm Shrine",
    type: "Anomaly",
    base: { ATK: 743 },
    substat: "CRIT Rate: 24%",
    subtitle: "Frost-Stained Star",
    desc: "CRIT DMG increases by 50%. When using an EX Special Attack or when any squad member applies an Attribute Anomaly to an enemy, the equipper's Ice DMG increases by 20%, stacking up to 2 times and lasting 15s. The duration of each stack is calculated separately.",
  },
  
  "13015": {
    name: "Marcato Desire",
    type: "Attack",
    base: { ATK: 594 },
    substat: "CRIT Rate: 20%",
    subtitle: "Get Everyone Fired Up",
    desc: "When an EX Special Attack or Chain Attack hits an enemy, the equipper's ATK increases by 6% for 8s. While the target is under an Attribute Anomaly, this effect is increased by an additional 6%.",
  },
  
  "14120": {
    name: "Zanshin Herb Case",
    type: "Attack",
    base: { ATK: 713 },
    substat: "CRIT DMG: 48%",
    subtitle: "Growth Through Adversity",
    desc: "CRIT Rate increases by 10%. Dash Attack Electric DMG increases by 40%. When any squad member applies an Attribute Anomaly or Stuns an enemy, the equipper's CRIT Rate increases by an additional 10% for 15s.",
  },
  
  // Version 1.3
  "14116": {
    name: "Blazing Laurel",
    type: "Stun",
    base: { ATK: 713 },
    substat: "Impact: 18%",
    subtitle: "Flowing Flame",
    desc: "Upon launching a Quick Assist or Perfect Assist, the equipper's Impact increases by 25% for 8s. When the equipper launches and hits an enemy with a Basic Attack, apply Wilt to the target for 30s, stacking up to 20 times, repeated triggers reset the duration. When any squad member hits an enemy, for every stack of Wilt applied to the target, the CRIT DMG of the Ice DMG and Fire DMG dealt by that attack increases by 1.5%. Only one instance of this effect can exist in the same squad.",
  },
  
  "14122": {
    name: "Timeweaver",
    type: "Anomaly",
    base: { ATK: 713 },
    substat: "ATK: 30%",
    subtitle: "Time-Devouring Stratagem",
    desc: "The equipper's Electric Anomaly Buildup Rate increases by 30%. When Special Attacks or EX Special Attacks hit enemies suffering an Attribute Anomaly, the equipper's Anomaly Proficiency increases by 75 for 15s.\nWhen the equipper's Anomaly Proficiency is greater than or equal to 375, Disorder DMG inflicted by the equipper increases by 25%.",
  },
  
  // Version 1.2
  "14117": {
    name: "Flamemaker Shaker",
    type: "Anomaly",
    base: { ATK: 713 },
    substat: "ATK: 30%",
    subtitle: "Fuel on the Rocks",
    desc: "While off-field, the equipper's Energy Regen increases by 0.6/s. When hitting an enemy with an EX Special Attack or Assist Attack, the equipper's DMG increases by 3.5%, stacking up to 10 times and lasting for 6s. This effect can trigger once every 0.3s. While off-field, the stack effect is doubled. Repeated triggers reset the duration. Upon obtaining the DMG increase effect, if the number of current stacks is greater than or equal to 5, then the equipper's Anomaly Proficiency increases by 50. This Anomaly Proficiency increase does not stack and lasts for 6s.",
  },
  
  "14107": {
    name: "Tusks of Fury",
    type: "Defense",
    base: { ATK: 713 },
    substat: "Impact: 18%",
    subtitle: "Invincible Rider",
    desc: "The Shield value provided by the equipper increases by 30%. When any squad member triggers Interrupt or Perfect Dodge, all squad members' DMG increases by 18% and Daze dealt increases by 12% for 20s. Passive effects of the same name do not stack.",
  },
  
  // Version 1.1
  "13013": {
    name: "Gilded Blossom",
    type: "Attack",
    base: { ATK: 594 },
    substat: "ATK: 25%",
    subtitle: "Extraordinary Anti-Theft Measures",
    desc: "ATK increases by 6%, and DMG dealt by EX Special Attacks increases by 15%.",
  },
  
  "14125": {
    name: "Ice-Jade Teapot",
    type: "Stun",
    base: { ATK: 713 },
    substat: "Impact: 18%",
    subtitle: "Ringing Melody",
    desc: "When a Basic Attack hits an enemy, gain 1 stack of Tea-riffic. Each stack of Tea-riffic increases the user's Impact by 0.7%, stacking up to 30 times, and lasting for 8s. The duration of each stack is calculated separately. Upon acquiring Tea-riffic, if the equipper possesses stacks of Tea-riffic greater than or equal to 15, all squad members' DMG is increased by 20% for 10s. Passive effects of the same name do not stack.",
  },
  
  "13127": {
    name: "Peacekeeper - Specialized",
    type: "Defense",
    base: { ATK: 624 },
    substat: "ATK: 25%",
    subtitle: "Standard Blocking Technique",
    desc: "While Shielded, the equipper's Energy Regen increases by 0.4/s. The Anomaly Buildup of EX Special Attacks and Assist Follow-Ups increase by 36%.",
  },
  
  "14126": {
    name: "Sharpened Stinger",
    type: "Anomaly",
    base: { ATK: 713 },
    substat: "Anomaly Proficiency: 90",
    subtitle: "Indulge in the Hunt",
    desc: "Upon activating a Dash Attack, gain 1 stack of Predatory Instinct. Each stack of Predatory Instinct increases the equipper's Physical DMG by 12% for 10s, stacking up to 3 times. This effect can trigger once every 0.5s and repeated triggers reset the duration. When entering combat or triggering Perfect Dodge, gain 3 stacks of Predatory Instinct. While Predatory Instinct is at maximum stacks, the equipper's Anomaly Buildup Rate increases by 40%.",
  },
  
  // Version 1.0
  "13113": {
    name: "Bashful Demon",
    type: "Support",
    base: { ATK: 624 },
    substat: "ATK: 25%",
    subtitle: "Visage of Greed",
    desc: "Increases Ice DMG by 15%. When launching an EX Special Attack, all squad members' ATK increases by 2% for 12s, stacking up to 4 times. Repeated triggers reset the duration. Passive effects of the same name do not stack.",
  },
  
  "13112": {
    name: "Big Cylinder",
    type: "Defense",
    base: { ATK: 624 },
    substat: "DEF: 40%",
    subtitle: "Ten Ton Top",
    desc: "Reduces DMG taken by 7.5%. After being attacked, the next attack to hit an enemy will trigger a critical hit and deal 600% of the equipper's DEF as additional DMG. This effect can be triggered once every 7.5s.",
  },
  
  "13010": {
    name: "Bunny Band",
    type: "Defense",
    base: { ATK: 594 },
    substat: "DEF: 40%",
    subtitle: "Pet the Bunny",
    desc: "Increases Max HP by 8%. Increases the equipper's ATK by 10% when they are shielded.",
  },
  
  "14001": {
    name: "Cannon Rotor",
    type: "Attack",
    base: { ATK: 594 },
    substat: "CRIT Rate: 20%",
    subtitle: "Oversized Barrel",
    desc: "Increases ATK by 7.5%. Landing a critical hit on an enemy will inflict an additional 200% of ATK as DMG. This effect can trigger once every 8s.",
  },
  
  "14119": {
    name: "Deep Sea Visitor",
    type: "Attack",
    base: { ATK: 713 },
    substat: "CRIT Rate: 24%",
    subtitle: "Lord of Seas",
    desc: "Increases Ice DMG by 25%. Upon hitting an enemy with a Basic Attack, the equipper's CRIT Rate increases by 10% for 8s. When dealing Ice DMG with a Dash Attack, the equipper's CRIT Rate increases by an additional 10% for 15s. The duration of each effect is calculated separately.",
  },
  
  "13101": {
    name: "Demara Battery Mark II",
    type: "Stun",
    base: { ATK: 624 },
    substat: "Impact: 15%",
    subtitle: "In a Flash of Light",
    desc: "Increases Electric DMG by 15%. When the equipper hits an enemy with a Dodge Counter or Assist Attack, their Energy Generation Rate increases by 18% for 8s.",
  },
  
  "13111": {
    name: "Drill Rig - Red Axis",
    type: "Attack",
    base: { ATK: 624 },
    substat: "Energy Regen: 50%",
    subtitle: "Hell's Generator",
    desc: "When launching an EX Special Attack or Chain Attack, Electric DMG from Basic Attacks and Dash Attacks increases by 50% for 10s. This effect can trigger once every 15s.",
  },
  
  "13009": {
    name: "Electro-Lip Gloss",
    type: "Anomaly",
    base: { ATK: 594 },
    substat: "Anomaly Proficiency: 75",
    subtitle: "Kiss of Death",
    desc: "When there are enemies inflicted with Attribute Anomaly on the field, the equipper's ATK increases by 10% and they deal an additional 15% more DMG to the target.",
  },
  
  "14118": {
    name: "Fusion Compiler",
    type: "Anomaly",
    base: { ATK: 684 },
    substat: "PEN Ratio: 24%",
    subtitle: "Data Flood",
    desc: "Increases ATK by 12%.\nWhen using a Special Attack or EX Special Attack, the equipper's Anomaly Proficiency is increased by 25 for 8s, stacking up to 3 times. The duration of each stack is calculated separately.",
  },
  
  "14110": {
    name: "Hellfire Gears",
    type: "Stun",
    base: { ATK: 684 },
    substat: "Impact: 18%",
    subtitle: "Passionate Construction",
    desc: "While off-field, the equipper's Energy Regen increases by 0.6/s.\nWhen using an EX Special Attack, the equipper's Impact is increased by 10% for 10s, stacking up to 2 times. The duration of each stack is calculated separately.",
  },
  
  "13106": {
    name: "Housekeeper",
    type: "Attack",
    base: { ATK: 624 },
    substat: "ATK: 25%",
    subtitle: "Safe Household Saw",
    desc: "While off-field, the equipper's Energy Regen increases by 0.45/s. When an EX Special Attack hits an enemy, the equipper's Physical DMG increases by 3%, stacking up to 15 times and lasting 1s. Repeated triggers reset the duration.",
  },
  
  "12013": {
    name: "[Identity] Base",
    type: "Defense",
    base: { ATK: 475 },
    substat: "DEF: 32%",
    subtitle: "Sinking Strike",
    desc: "When attacked, the equipper's DEF increases by 20% for 8s.",
  },
  
  "12014": {
    name: "[Identity] Inflection",
    type: "Defense",
    base: { ATK: 475 },
    substat: "DEF: 32%",
    subtitle: "Dazzle",
    desc: "When attacked, reduces the attacker's DMG by 6% for 12s.",
  },
  
  "13115": {
    name: "Kaboom the Cannon",
    type: "Support",
    base: { ATK: 624 },
    substat: "Energy Regen: 50%",
    subtitle: "Stampede Accident",
    desc: "When any friendly unit in the squad attacks and hits an enemy, all friendly units' ATK increases by 2.5% for 8s, stacking up to 4 times. The duration of each stack is calculated separately, and each friendly unit can provide 1 stack of the buff. Passive effects of the same name do not stack.",
  },
  
  "12002": {
    name: "[Lunar] Decrescent",
    type: "Attack",
    base: { ATK: 475 },
    substat: "ATK: 20%",
    subtitle: "Waning Moon",
    desc: "Launching a Chain Attack or Ultimate increases the equipper's DMG by 15% for 6s.",
  },
  
  "12003": {
    name: "[Lunar] Noviluna",
    type: "Attack",
    base: { ATK: 475 },
    substat: "CRIT Rate: 16%",
    subtitle: "New Moon",
    desc: "Launching an EX Special Attack generates 3 Energy for the equipper. This effect can trigger once every 12s.",
  },
  
  "12001": {
    name: "[Lunar] Pleniluna",
    type: "Attack",
    base: { ATK: 475 },
    substat: "ATK: 20%",
    subtitle: "Full Moon",
    desc: "Basic Attack, Dash Attack, and Dodge Counter DMG increases by 12%.",
  },
  
  "12010": {
    name: "[Magnetic Storm] Alpha",
    type: "Anomaly",
    base: { ATK: 475 },
    substat: "ATK: 20%",
    subtitle: "Disordered Current",
    desc: "Accumulating Anomaly Buildup increases the equipper's Anomaly Mastery by 25 for 10s. This effect can trigger once every 20s.",
  },
  
  "12011": {
    name: "[Magnetic Storm] Bravo",
    type: "Anomaly",
    base: { ATK: 475 },
    substat: "Anomaly Proficiency: 60",
    subtitle: "High-Voltage Surge",
    desc: "Accumulating Anomaly Buildup increases the equipper's Anomaly Proficiency by 25 for 10s. This effect can trigger once every 20s.",
  },
  
  "12012": {
    name: "[Magnetic Storm] Charlie",
    type: "Anomaly",
    base: { ATK: 475 },
    substat: "PEN Ratio: 16%",
    subtitle: "Charge Overload",
    desc: "Whenever a squad member inflicts an Attribute Anomaly on an enemy, the equipper generates 3.5 Energy. This effect can trigger once every 12s.",
  },
  
  "13007": {
    name: "Original Transmorpher",
    type: "Defense",
    base: { ATK: 594 },
    substat: "HP: 25%",
    subtitle: "Starlight Knight Flying Kick",
    desc: "Increases Max HP by 8%. When attacked, the equipper's Impact is increased by 10% for 12s.",
  },
  
  "13006": {
    name: "Precious Fossilized Core",
    type: "Stun",
    base: { ATK: 594 },
    substat: "Impact: 15%",
    subtitle: "Behemoth Hunter",
    desc: "When the target's HP is no lower than 50%, the equipper inflicts 10% more Daze to the target. When the target's HP is no lower than 75%, this bonus is further increased by 10%.",
  },
  
  "13003": {
    name: "Rainforest Gourmet",
    type: "Anomaly",
    base: { ATK: 594 },
    substat: "Anomaly Proficiency: 75",
    subtitle: "Dinner's Ready!",
    desc: "For every 10 Energy consumed, the equipper gains a buff that increases ATK by 2.5% for 10s, stacking up to 10 times. The duration of each stack is calculated separately.",
  },
  
  "12004": {
    name: "[Reverb] Mark I",
    type: "Support",
    base: { ATK: 475 },
    substat: "ATK: 20%",
    subtitle: "Changing Tides",
    desc: "Launching an EX Special Attack increases all squad members' Impact by 8% for 10s. This effect can trigger once every 20s. Passive effects of the same name do not stack.",
  },
  
  "12005": {
    name: "[Reverb] Mark II",
    type: "Support",
    base: { ATK: 475 },
    substat: "Energy Regen: 40%",
    subtitle: "Roaring Waves",
    desc: "Launching an EX Special Attack or Chain Attack increases all squad members' Anomaly Mastery and Anomaly Proficiency by 10 for 10s. This effect can trigger once every 20s. Passive effects of the same name do not stack.",
  },
  
  "12006": {
    name: "[Reverb] Mark III",
    type: "Support",
    base: { ATK: 475 },
    substat: "HP: 20%",
    subtitle: "Booming Sound",
    desc: "Launching a Chain Attack or Ultimate increases all squad members' ATK by 8% for 10s. This effect can trigger once every 20s. Passive effects of the same name do not stack.",
  },
  
  "14124": {
    name: "Riot Suppressor Mark VI",
    type: "Attack",
    base: { ATK: 713 },
    substat: "CRIT DMG: 48%",
    subtitle: "Security Patrol",
    desc: "Increases CRIT Rate by 15%. Launching an EX Special Attack grants the equipper 8 Charge stacks, up to a maximum of 8 stacks. Whenever the equipper's Basic Attack deals Ether DMG, consumes a Charge stack and increases the skill's DMG by 35%.",
  },
  
  "13128": {
    name: "Roaring Ride",
    type: "Anomaly",
    base: { ATK: 624 },
    substat: "ATK: 25%",
    subtitle: "Collision Potential",
    desc: "When EX Special Attack hits an enemy, one of three possible effects is randomly triggered for 5 seconds. This effect can trigger once every 0.3s. The same types of effects cannot stack. Repeated triggers reset the duration, allowing several effects to be active at once:\nIncreases the equipper's ATK by 8%, increases the equipper's Anomaly Proficiency by 40, or increases the equipper's Anomaly Buildup Rate by 25%.",
  },
  
  "14003": {
    name: "Six Shooter",
    type: "Stun",
    base: { ATK: 594 },
    substat: "Impact: 15%",
    subtitle: "Fire!",
    desc: "The equipper gains 1 Charge stack every 3s, stacking up to 6 times. When launching an EX Special Attack, consumes all Charge stacks and each stack consumed increases the skill's Daze inflicted by 4%.",
  },
  
  "13002": {
    name: "Slice of Time",
    type: "Support",
    base: { ATK: 594 },
    substat: "PEN Ratio: 20%",
    subtitle: "Say Cheese",
    desc: "Any squad members' Dodge Counter, EX Special Attack, Assist Attack, or Chain Attack respectively generates 20/25/30/35 more Decibels and generates 0.7 Energy for the equipper. This effect can trigger once every 12s. The cooldown for each type of attack is independent of others. Passive effects of the same name do not stack.",
  },
  
  "13011": {
    name: "Spring Embrace",
    type: "Defense",
    base: { ATK: 594 },
    substat: "ATK: 25%",
    subtitle: "Hot Spring Soup",
    desc: "Reduces DMG taken by 7.5%. When attacked, the equipper's Energy Generation Rate increases by 10% for 12s. When the equipper switches off-field, this buff will be transferred to the new on-field character with its duration refreshed. Passive effects of the same name do not stack.",
  },
  
  "13004": {
    name: "Starlight Engine",
    type: "Attack",
    base: { ATK: 594 },
    substat: "ATK: 25%",
    subtitle: "Knight's Combo",
    desc: "Launching a Dodge Counter or Quick Assist increases the equipper's ATK by 12% for 12s.",
  },
  
  "13108": {
    name: "Starlight Engine Replica",
    type: "Attack",
    base: { ATK: 624 },
    substat: "ATK: 25%",
    subtitle: "Knight Beam: Change",
    desc: "Increases the equipper's Physical DMG against the target by 36% for 8s upon hitting an enemy at least 6 meters away with a Basic Attack or Dash Attack.",
  },
  
  "13005": {
    name: "Steam Oven",
    type: "Stun",
    base: { ATK: 594 },
    substat: "Energy Regen: 50%",
    subtitle: "Thick Broth",
    desc: "For every 10 Energy accumulated, the equipper's Impact is increased by 2%, stacking up to 8 times. After Energy is consumed, this bonus remains for 8 more seconds. The duration of each stack is calculated separately.",
  },
  
  "14102": {
    name: "Steel Cushion",
    type: "Attack",
    base: { ATK: 684 },
    substat: "CRIT Rate: 24%",
    subtitle: "Metal Cat Claws",
    desc: "Increases Physical DMG by 20%. The equipper's DMG increases by 25% when hitting the enemy from behind.",
  },
  
  "13001": {
    name: "Street Superstar",
    type: "Attack",
    base: { ATK: 594 },
    substat: "ATK: 25%",
    subtitle: "Flaming Bars",
    desc: "Whenever a squad member launches a Chain Attack, the equipper gains 1 Charge stack, stacking up to 3 times. Upon activating their own Ultimate, the equipper consumes all Charge stacks, and each stack increases the skill's DMG by 15%.",
  },
  
  "14104": {
    name: "The Brimstone",
    type: "Attack",
    base: { ATK: 684 },
    substat: "ATK: 30%",
    subtitle: "Scorching Breath",
    desc: "Upon hitting an enemy with a Basic Attack, Dash Attack, or Dodge Counter, the equipper's ATK increases by 3.5% for 8s, stacking up to 8 times. This effect can trigger once every 0.5s. The duration of each stack is calculated separately.",
  },
  
  "14114": {
    name: "The Restrained",
    type: "Stun",
    base: { ATK: 684 },
    substat: "Impact: 18%",
    subtitle: "Binding Chains",
    desc: "When an attack hits an enemy, DMG and Daze from Basic Attacks increase by 6% for 8s, stacking up to 5 times. This effect can trigger at most once during each skill. The duration of each stack is calculated separately.",
  },
  
  "13103": {
    name: "The Vault",
    type: "Support",
    base: { ATK: 624 },
    substat: "Energy Regen: 50%",
    subtitle: "Money-Lover",
    desc: "Dealing Ether DMG using an EX Special Attack, Chain Attack, or Ultimate increases all squad members' DMG against the target by 15% and increases the equipper's Energy Regen by 0.5/s for 2s. Passive effects of the same name do not stack.",
  },
  
  "14002": {
    name: "Unfettered Game Ball",
    type: "Support",
    base: { ATK: 594 },
    substat: "Energy Regen: 50%",
    subtitle: "Game Start!",
    desc: "Whenever the equipper's attack triggers an Attribute Counter effect, all squad members' CRIT Rate against the struck enemy increases by 12% for 12s. Passive effects of the same name do not stack.",
  },
  
  "12008": {
    name: "[Vortex] Arrow",
    type: "Stun",
    base: { ATK: 475 },
    substat: "Impact: 12%",
    subtitle: "Tsunami",
    desc: "The equipper's attacks inflict 8% more Daze on their main target.",
  },
  
  "12009": {
    name: "[Vortex] Hatchet",
    type: "Stun",
    base: { ATK: 475 },
    substat: "Energy Regen: 40%",
    subtitle: "Riptide",
    desc: "Upon entering combat or switching in, the equipper's Impact increases by 9% for 10s. This effect can trigger once every 20s.",
  },
  
  "12007": {
    name: "[Vortex] Revolver",
    type: "Stun",
    base: { ATK: 475 },
    substat: "ATK: 20%",
    subtitle: "Undercurrent",
    desc: "EX Special Attacks inflict 10% more Daze.",
  },
  
  "14121": {
    name: "Weeping Cradle",
    type: "Support",
    base: { ATK: 684 },
    substat: "PEN Ratio: 24%",
    subtitle: "Punishment",
    desc: "While off-field, the equipper's Energy Regen increases by 0.6/s. Attacks from the equipper enhance the squad's DMG against a struck target by 10% for 3 seconds. During this period, this effect is further increased by 1.7% every 0.5s, up to a maximum additional increase of 10.2%. Repeated triggers only refresh its duration without refreshing the DMG increase effect. Passive effects of the same name do not stack.",
  },
  
  "13008": {
    name: "Weeping Gemini",
    type: "Anomaly",
    base: { ATK: 594 },
    substat: "ATK: 25%",
    subtitle: "Lingering Cries",
    desc: "Whenever a squad member inflicts an Attribute Anomaly on an enemy, the equipper gains a buff that increases Anomaly Proficiency by 30, stacking up to 4 times. This effect expires when the target recovers from Stun or is defeated. The duration of each stack is calculated separately.",
  },
};

export default ZZZ_WEAPONS;
