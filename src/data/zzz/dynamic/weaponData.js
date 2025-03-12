export default {
  // Version 1.5
  "14132": {
    name: "Heartstring Nocturne",
    rarity: 5,
    type: "Attack",
    statBase: { _ATK: 713 },
    statSub: { CR: 24 },
    descHead: "String & Melody",
    descBody: "CRIT DMG increases by {0}. When the equipper enters the battlefield, or activates a Chain Attack or Ultimate, they gain 1 stack of Heartstring. Each stack of Heartstring allows the equipper's Chain Attack and Ultimate to ignore {1} of the target's Fire RES, stacking up to 2 times and lasting 30s. Repeated triggers reset the duration.",
    descVar: [
      ["50%"],
      ["12.5%"],
    ],
  },
  "14131": {
    name: "Elegant Vanity",
    rarity: 5,
    type: "Support",
    statBase: { _ATK: 713 },
    statSub: { ATK: 30 },
    descHead: "Untold Beauty",
    descBody: "When any squad member enters the field through a Quick Assist, Chain Attack, Defensive Assist, or Evasive Assist, the equipper gains {0} Energy. This effect can trigger once every 5s. When the equipper consumes 25 or more Energy, the DMG dealt by all squad members increases by {1}, stacking up to 2 times, and lasting 20s. Repeated triggers reset the duration. Only one instance of this effect can exist in the same squad.",
    descVar: [
      ["5"],
      ["10%"],
    ],
  },
  
  // Version 1.4
  "14120": {
    name: "Zanshin Herb Case",
    rarity: 5,
    type: "Attack",
    statBase: { _ATK: 713 },
    statSub: { CD: 48 },
    descHead: "Growth Through Adversity",
    descBody: "CRIT Rate increases by {0}. Dash Attack Electric DMG increases by {1}. When any squad member applies an Attribute Anomaly or Stuns an enemy, the equipper's CRIT Rate increases by an additional {2} for 15s.",
    descVar: [
      ["10%"],
      ["40%"],
      ["10%"],
    ],
  },
  "14109": {
    name: "Hailstorm Shrine",
    rarity: 5,
    type: "Anomaly",
    statBase: { _ATK: 743 },
    statSub: { CR: 24 },
    descHead: "Frost-Stained Star",
    descBody: "CRIT DMG increases by {0}. When using an EX Special Attack or when any squad member applies an Attribute Anomaly to an enemy, the equipper's Ice DMG increases by {1}, stacking up to 2 times and lasting 15s. The duration of each stack is calculated separately.",
    descVar: [
      ["50%"],
      ["20%"],
    ],
  },

  "13015": {
    name: "Marcato Desire",
    rarity: 4,
    type: "Attack",
    statBase: { _ATK: 594 },
    statSub: { CR: 20 },
    descHead: "Get Everyone Fired Up",
    descBody: "When an EX Special Attack or Chain Attack hits an enemy, the equipper's ATK increases by {0} for 8s. While the target is under an Attribute Anomaly, this effect is increased by an additional {1}.",
    descVar: [
      ["6%"],
      ["6%"],
    ],
  },
  
  // Version 1.3
  "14122": {
    name: "Timeweaver",
    rarity: 5,
    type: "Anomaly",
    statBase: { _ATK: 713 },
    statSub: { ATK: 30 },
    descHead: "Time-Devouring Stratagem",
    descBody: "The equipper's Electric Anomaly Buildup Rate increases by 30%. When Special Attacks or EX Special Attacks hit enemies suffering an Attribute Anomaly, the equipper's Anomaly Proficiency increases by 75 for 15s.\nWhen the equipper's Anomaly Proficiency is greater than or equal to 375, Disorder DMG inflicted by the equipper increases by 25%.",
    descVar: [
      ["30%"],
      ["75"],
      ["25%"],
    ],
  },
  "14116": {
    name: "Blazing Laurel",
    rarity: 5,
    type: "Stun",
    statBase: { _ATK: 713 },
    statSub: { Impact: 18 },
    descHead: "Flowing Flame",
    descBody: "Upon launching a Quick Assist or Perfect Assist, the equipper's Impact increases by 25% for 8s. When the equipper launches and hits an enemy with a Basic Attack, apply Wilt to the target for 30s, stacking up to 20 times, repeated triggers reset the duration. When any squad member hits an enemy, for every stack of Wilt applied to the target, the CRIT DMG of the Ice DMG and Fire DMG dealt by that attack increases by 1.5%. Only one instance of this effect can exist in the same squad.",
    descVar: [
      ["25%"],
      ["1.5%"],
    ],
  },
  
  // Version 1.2
  "14117": {
    name: "Flamemaker Shaker",
    rarity: 5,
    type: "Anomaly",
    statBase: { _ATK: 713 },
    statSub: { ATK: 30 },
    descHead: "Fuel on the Rocks",
    descBody: "While off-field, the equipper's Energy Regen increases by 0.6/s. When hitting an enemy with an EX Special Attack or Assist Attack, the equipper's DMG increases by 3.5%, stacking up to 10 times and lasting for 6s. This effect can trigger once every 0.3s. While off-field, the stack effect is doubled. Repeated triggers reset the duration. Upon obtaining the DMG increase effect, if the number of current stacks is greater than or equal to 5, then the equipper's Anomaly Proficiency increases by 50. This Anomaly Proficiency increase does not stack and lasts for 6s.",
    descVar: [
      ["0.6"],
      ["3.5%"],
      ["50"],
    ],
  },
  "14107": {
    name: "Tusks of Fury",
    rarity: 5,
    type: "Defense",
    statBase: { _ATK: 713 },
    statSub: { Impact: 18 },
    descHead: "Invincible Rider",
    descBody: "The Shield value provided by the equipper increases by 30%. When any squad member triggers Interrupt or Perfect Dodge, all squad members' DMG increases by 18% and Daze dealt increases by 12% for 20s. Passive effects of the same name do not stack.",
    descVar: [
      ["30%"],
      ["18%"],
      ["12%"],
    ],
  },
  
  // Version 1.1
  "14126": {
    name: "Sharpened Stinger",
    rarity: 5,
    type: "Anomaly",
    statBase: { _ATK: 713 },
    statSub: { AP: 90 },
    descHead: "Indulge in the Hunt",
    descBody: "Upon activating a Dash Attack, gain 1 stack of Predatory Instinct. Each stack of Predatory Instinct increases the equipper's Physical DMG by 12% for 10s, stacking up to 3 times. This effect can trigger once every 0.5s and repeated triggers reset the duration. When entering combat or triggering Perfect Dodge, gain 3 stacks of Predatory Instinct. While Predatory Instinct is at maximum stacks, the equipper's Anomaly Buildup Rate increases by 40%.",
    descVar: [
      ["12%"],
      ["40%"],
    ],
  },
  "14125": {
    name: "Ice-Jade Teapot",
    rarity: 5,
    type: "Stun",
    statBase: { _ATK: 713 },
    statSub: { Impact: 18 },
    descHead: "Ringing Melody",
    descBody: "When a Basic Attack hits an enemy, gain 1 stack of Tea-riffic. Each stack of Tea-riffic increases the user's Impact by 0.7%, stacking up to 30 times, and lasting for 8s. The duration of each stack is calculated separately. Upon acquiring Tea-riffic, if the equipper possesses stacks of Tea-riffic greater than or equal to 15, all squad members' DMG is increased by 20% for 10s. Passive effects of the same name do not stack.",
    descVar: [
      ["0.7%"],
      ["20%"],
    ],
  },

  "13127": {
    name: "Peacekeeper - Specialized",
    rarity: 4,
    type: "Defense",
    statBase: { _ATK: 624 },
    statSub: { ATK: 25 },
    descHead: "Standard Blocking Technique",
    descBody: "While Shielded, the equipper's Energy Regen increases by 0.4/s. The Anomaly Buildup of EX Special Attacks and Assist Follow-Ups increase by 36%.",
    descVar: [
      ["0.4"],
      ["36%"],
    ],
  },
  "13013": {
    name: "Gilded Blossom",
    rarity: 4,
    type: "Attack",
    statBase: { _ATK: 594 },
    statSub: { ATK: 25 },
    descHead: "Extraordinary Anti-Theft Measures",
    descBody: "ATK increases by 6%, and DMG dealt by EX Special Attacks increases by 15%.",
    descVar: [
      ["6"],
      ["15%"],
    ],
  },
  
  // Version 1.0
  "14124": {
    name: "Riot Suppressor Mark VI",
    rarity: 5,
    type: "Attack",
    statBase: { _ATK: 713 },
    statSub: { CD: 48 },
    descHead: "Security Patrol",
    descBody: "Increases CRIT Rate by 15%. Launching an EX Special Attack grants the equipper 8 Charge stacks, up to a maximum of 8 stacks. Whenever the equipper's Basic Attack deals Ether DMG, consumes a Charge stack and increases the skill's DMG by 35%.",
    descVar: [
      ["15%"],
      ["35%"],
    ],
  },
  "14121": {
    name: "Weeping Cradle",
    rarity: 5,
    type: "Support",
    statBase: { _ATK: 684 },
    statSub: { PR: 24 },
    descHead: "Punishment",
    descBody: "While off-field, the equipper's Energy Regen increases by 0.6/s. Attacks from the equipper enhance the squad's DMG against a struck target by 10% for 3 seconds. During this period, this effect is further increased by 1.7% every 0.5s, up to a maximum additional increase of 10.2%. Repeated triggers only refresh its duration without refreshing the DMG increase effect. Passive effects of the same name do not stack.",
    descVar: [
      ["0.6"],
      ["10%"],
      ["1.7%"],
      ["10.2%"],
    ],
  },
  "14119": {
    name: "Deep Sea Visitor",
    rarity: 5,
    type: "Attack",
    statBase: { _ATK: 713 },
    statSub: { CR: 24 },
    descHead: "Lord of Seas",
    descBody: "Increases Ice DMG by 25%. Upon hitting an enemy with a Basic Attack, the equipper's CRIT Rate increases by 10% for 8s. When dealing Ice DMG with a Dash Attack, the equipper's CRIT Rate increases by an additional 10% for 15s. The duration of each effect is calculated separately.",
    descVar: [
      ["25%"],
      ["10%"],
      ["10%"],
    ],
  },
  "14118": {
    name: "Fusion Compiler",
    rarity: 5,
    type: "Anomaly",
    statBase: { _ATK: 684 },
    statSub: { PR: 24 },
    descHead: "Data Flood",
    descBody: "Increases ATK by 12%.\nWhen using a Special Attack or EX Special Attack, the equipper's Anomaly Proficiency is increased by 25 for 8s, stacking up to 3 times. The duration of each stack is calculated separately.",
    descVar: [
      ["12%"],
      ["25"],
    ],
  },
  "14114": {
    name: "The Restrained",
    rarity: 5,
    type: "Stun",
    statBase: { _ATK: 684 },
    statSub: { Impact: 18 },
    descHead: "Binding Chains",
    descBody: "When an attack hits an enemy, DMG and Daze from Basic Attacks increase by 6% for 8s, stacking up to 5 times. This effect can trigger at most once during each skill. The duration of each stack is calculated separately.",
    descVar: [
      ["6%"],
    ],
  },
  "14110": {
    name: "Hellfire Gears",
    rarity: 5,
    type: "Stun",
    statBase: { _ATK: 684 },
    statSub: { Impact: 18 },
    descHead: "Passionate Construction",
    descBody: "While off-field, the equipper's Energy Regen increases by 0.6/s.\nWhen using an EX Special Attack, the equipper's Impact is increased by 10% for 10s, stacking up to 2 times. The duration of each stack is calculated separately.",
    descVar: [
      ["0.6"],
      ["10%"],
    ],
  },
  "14104": {
    name: "The Brimstone",
    rarity: 5,
    type: "Attack",
    statBase: { _ATK: 684 },
    statSub: { ATK: 30 },
    descHead: "Scorching Breath",
    descBody: "Upon hitting an enemy with a Basic Attack, Dash Attack, or Dodge Counter, the equipper's ATK increases by 3.5% for 8s, stacking up to 8 times. This effect can trigger once every 0.5s. The duration of each stack is calculated separately.",
    descVar: [
      ["3.5%"],
    ],
  },
  "14102": {
    name: "Steel Cushion",
    rarity: 5,
    type: "Attack",
    statBase: { _ATK: 684 },
    statSub: { CR: 24 },
    descHead: "Metal Cat Claws",
    descBody: "Increases Physical DMG by 20%. The equipper's DMG increases by 25% when hitting the enemy from behind.",
    descVar: [
      ["20%"],
      ["25%"],
    ],
  },

  "14003": {
    name: "Six Shooter",
    rarity: 4,
    type: "Stun",
    statBase: { _ATK: 594 },
    statSub: { Impact: 15 },
    descHead: "Fire!",
    descBody: "The equipper gains 1 Charge stack every 3s, stacking up to 6 times. When launching an EX Special Attack, consumes all Charge stacks and each stack consumed increases the skill's Daze inflicted by 4%.",
    descVar: [
      ["4%"],
    ],
  },
  "14002": {
    name: "Unfettered Game Ball",
    rarity: 4,
    type: "Support",
    statBase: { _ATK: 594 },
    statSub: { ER: 50 },
    descHead: "Game Start!",
    descBody: "Whenever the equipper's attack triggers an Attribute Counter effect, all squad members' CRIT Rate against the struck enemy increases by 12% for 12s. Passive effects of the same name do not stack.",
    descVar: [
      ["12%"],
    ],
  },
  "14001": {
    name: "Cannon Rotor",
    rarity: 4,
    type: "Attack",
    statBase: { _ATK: 594 },
    statSub: { CR: 20 },
    descHead: "Oversized Barrel",
    descBody: "Increases ATK by 7.5%. Landing a critical hit on an enemy will inflict an additional 200% of ATK as DMG. This effect can trigger once every 8s.",
    descVar: [
      ["7.5%"],
      ["8"],
    ],
  },
  "13128": {
    name: "Roaring Ride",
    rarity: 4,
    type: "Anomaly",
    statBase: { _ATK: 624 },
    statSub: { ATK: 25 },
    descHead: "Collision Potential",
    descBody: "When EX Special Attack hits an enemy, one of three possible effects is randomly triggered for 5 seconds. This effect can trigger once every 0.3s. The same types of effects cannot stack. Repeated triggers reset the duration, allowing several effects to be active at once:\nIncreases the equipper's ATK by 8%, increases the equipper's Anomaly Proficiency by 40, or increases the equipper's Anomaly Buildup Rate by 25%.",
    descVar: [
      ["8%"],
      ["40"],
      ["25%"],
    ],
  },
  "13115": {
    name: "Kaboom the Cannon",
    rarity: 4,
    type: "Support",
    statBase: { _ATK: 624 },
    statSub: { ER: 50 },
    descHead: "Stampede Accident",
    descBody: "When any friendly unit in the squad attacks and hits an enemy, all friendly units' ATK increases by 2.5% for 8s, stacking up to 4 times. The duration of each stack is calculated separately, and each friendly unit can provide 1 stack of the buff. Passive effects of the same name do not stack.",
    descVar: [
      ["2.5%"],
    ],
  },
  "13113": {
    name: "Bashful Demon",
    rarity: 4,
    type: "Support",
    statBase: { _ATK: 624 },
    statSub: { ATK: 25 },
    descHead: "Visage of Greed",
    descBody: "Increases Ice DMG by 15%. When launching an EX Special Attack, all squad members' ATK increases by 2% for 12s, stacking up to 4 times. Repeated triggers reset the duration. Passive effects of the same name do not stack.",
    descVar: [
      ["15%"],
      ["2%"],
    ],
  },
  "13112": {
    name: "Big Cylinder",
    rarity: 4,
    type: "Defense",
    statBase: { _ATK: 624 },
    statSub: { DEF: 40 },
    descHead: "Ten Ton Top",
    descBody: "Reduces DMG taken by 7.5%. After being attacked, the next attack to hit an enemy will trigger a critical hit and deal 600% of the equipper's DEF as additional DMG. This effect can be triggered once every 7.5s.",
    descVar: [
      ["7.5%"],
      ["600%"],
    ],
  },
  "13111": {
    name: "Drill Rig - Red Axis",
    rarity: 4,
    type: "Attack",
    statBase: { _ATK: 624 },
    statSub: { ER: 50 },
    descHead: "Hell's Generator",
    descBody: "When launching an EX Special Attack or Chain Attack, Electric DMG from Basic Attacks and Dash Attacks increases by 50% for 10s. This effect can trigger once every 15s.",
    descVar: [
      ["50%"],
    ],
  },
  "13108": {
    name: "Starlight Engine Replica",
    rarity: 4,
    type: "Attack",
    statBase: { _ATK: 624 },
    statSub: { ATK: 25 },
    descHead: "Knight Beam: Change",
    descBody: "Increases the equipper's Physical DMG against the target by 36% for 8s upon hitting an enemy at least 6 meters away with a Basic Attack or Dash Attack.",
    descVar: [
      ["36%"],
    ],
  },
  "13106": {
    name: "Housekeeper",
    rarity: 4,
    type: "Attack",
    statBase: { _ATK: 624 },
    statSub: { ATK: 25 },
    descHead: "Safe Household Saw",
    descBody: "While off-field, the equipper's Energy Regen increases by 0.45/s. When an EX Special Attack hits an enemy, the equipper's Physical DMG increases by 3%, stacking up to 15 times and lasting 1s. Repeated triggers reset the duration.",
    descVar: [
      ["0.45"],
      ["3%"],
    ],
  },
  "13103": {
    name: "The Vault",
    rarity: 4,
    type: "Support",
    statBase: { _ATK: 624 },
    statSub: { ER: 50 },
    descHead: "Money-Lover",
    descBody: "Dealing Ether DMG using an EX Special Attack, Chain Attack, or Ultimate increases all squad members' DMG against the target by 15% and increases the equipper's Energy Regen by 0.5/s for 2s. Passive effects of the same name do not stack.",
    descVar: [
      ["15%"],
      ["0.5"],
    ],
  },
  "13101": {
    name: "Demara Battery Mark II",
    rarity: 4,
    type: "Stun",
    statBase: { _ATK: 624 },
    statSub: { Impact: 15 },
    descHead: "In a Flash of Light",
    descBody: "Increases Electric DMG by 15%. When the equipper hits an enemy with a Dodge Counter or Assist Attack, their Energy Generation Rate increases by 18% for 8s.",
    descVar: [
      ["15%"],
      ["18%"],
    ],
  },
  "13011": {
    name: "Spring Embrace",
    rarity: 4,
    type: "Defense",
    statBase: { _ATK: 594 },
    statSub: { ATK: 25 },
    descHead: "Hot Spring Soup",
    descBody: "Reduces DMG taken by 7.5%. When attacked, the equipper's Energy Generation Rate increases by 10% for 12s. When the equipper switches off-field, this buff will be transferred to the new on-field character with its duration refreshed. Passive effects of the same name do not stack.",
    descVar: [
      ["7.5%"],
      ["10%"],
    ],
  },
  "13010": {
    name: "Bunny Band",
    rarity: 4,
    type: "Defense",
    statBase: { _ATK: 594 },
    statSub: { DEF: 40 },
    descHead: "Pet the Bunny",
    descBody: "Increases Max HP by 8%. Increases the equipper's ATK by 10% when they are shielded.",
    descVar: [
      ["8%"],
      ["10%"],
    ],
  },
  "13009": {
    name: "Electro-Lip Gloss",
    rarity: 4,
    type: "Anomaly",
    statBase: { _ATK: 594 },
    statSub: { AP: 75 },
    descHead: "Kiss of Death",
    descBody: "When there are enemies inflicted with Attribute Anomaly on the field, the equipper's ATK increases by 10% and they deal an additional 15% more DMG to the target.",
    descVar: [
      ["10%"],
      ["15%"],
    ],
  },
  "13008": {
    name: "Weeping Gemini",
    rarity: 4,
    type: "Anomaly",
    statBase: { _ATK: 594 },
    statSub: { ATK: 25 },
    descHead: "Lingering Cries",
    descBody: "Whenever a squad member inflicts an Attribute Anomaly on an enemy, the equipper gains a buff that increases Anomaly Proficiency by 30, stacking up to 4 times. This effect expires when the target recovers from Stun or is defeated. The duration of each stack is calculated separately.",
    descVar: [
      ["30"],
    ],
  },
  "13007": {
    name: "Original Transmorpher",
    rarity: 4,
    type: "Defense",
    statBase: { _ATK: 594 },
    statSub: { HP: 25 },
    descHead: "Starlight Knight Flying Kick",
    descBody: "Increases Max HP by 8%. When attacked, the equipper's Impact is increased by 10% for 12s.",
    descVar: [
      ["8%"],
      ["10%"],
    ],
  },
  "13006": {
    name: "Precious Fossilized Core",
    rarity: 4,
    type: "Stun",
    statBase: { _ATK: 594 },
    statSub: { Impact: 15 },
    descHead: "Behemoth Hunter",
    descBody: "When the target's HP is no lower than 50%, the equipper inflicts 10% more Daze to the target. When the target's HP is no lower than 75%, this bonus is further increased by 10%.",
    descVar: [
      ["10%"],
      ["10%"],
    ],
  },
  "13005": {
    name: "Steam Oven",
    rarity: 4,
    type: "Stun",
    statBase: { _ATK: 594 },
    statSub: { ER: 50 },
    descHead: "Thick Broth",
    descBody: "For every 10 Energy accumulated, the equipper's Impact is increased by 2%, stacking up to 8 times. After Energy is consumed, this bonus remains for 8 more seconds. The duration of each stack is calculated separately.",
    descVar: [
      ["2%"],
    ],
  },
  "13004": {
    name: "Starlight Engine",
    rarity: 4,
    type: "Attack",
    statBase: { _ATK: 594 },
    statSub: { ATK: 25 },
    descHead: "Knight's Combo",
    descBody: "Launching a Dodge Counter or Quick Assist increases the equipper's ATK by 12% for 12s.",
    descVar: [
      ["12%"],
    ],
  },
  "13003": {
    name: "Rainforest Gourmet",
    rarity: 4,
    type: "Anomaly",
    statBase: { _ATK: 594 },
    statSub: { AP: 75 },
    descHead: "Dinner's Ready!",
    descBody: "For every 10 Energy consumed, the equipper gains a buff that increases ATK by 2.5% for 10s, stacking up to 10 times. The duration of each stack is calculated separately.",
    descVar: [
      ["2.5%"],
    ],
  },
  "13002": {
    name: "Slice of Time",
    rarity: 4,
    type: "Support",
    statBase: { _ATK: 594 },
    statSub: { PR: 20 },
    descHead: "Say Cheese",
    descBody: "Any squad members' Dodge Counter, EX Special Attack, Assist Attack, or Chain Attack respectively generates 20/25/30/35 more Decibels and generates 0.7 Energy for the equipper. This effect can trigger once every 12s. The cooldown for each type of attack is independent of others. Passive effects of the same name do not stack.",
    descVar: [
      ["20"],
      ["25"],
      ["30"],
      ["35"],
      ["0.7"],
    ],
  },
  "13001": {
    name: "Street Superstar",
    rarity: 4,
    type: "Attack",
    statBase: { _ATK: 594 },
    statSub: { ATK: 25 },
    descHead: "Flaming Bars",
    descBody: "Whenever a squad member launches a Chain Attack, the equipper gains 1 Charge stack, stacking up to 3 times. Upon activating their own Ultimate, the equipper consumes all Charge stacks, and each stack increases the skill's DMG by 15%.",
    descVar: [
      ["15%"],
    ],
  },

  "12014": {
    name: "[Identity] Inflection",
    rarity: 3,
    type: "Defense",
    statBase: { _ATK: 475 },
    statSub: { DEF: 32 },
    descHead: "Dazzle",
    descBody: "When attacked, reduces the attacker's DMG by 6% for 12s.",
    descVar: [
      ["6%"],
    ],
  },
  "12013": {
    name: "[Identity] Base",
    rarity: 3,
    type: "Defense",
    statBase: { _ATK: 475 },
    statSub: { DEF: 32 },
    descHead: "Sinking Strike",
    descBody: "When attacked, the equipper's DEF increases by 20% for 8s.",
    descVar: [
      ["20%"],
    ],
  },
  "12012": {
    name: "[Magnetic Storm] Charlie",
    rarity: 3,
    type: "Anomaly",
    statBase: { _ATK: 475 },
    statSub: { PR: 16 },
    descHead: "Charge Overload",
    descBody: "Whenever a squad member inflicts an Attribute Anomaly on an enemy, the equipper generates 3.5 Energy. This effect can trigger once every 12s.",
    descVar: [
      ["3.5"],
    ],
  },
  "12011": {
    name: "[Magnetic Storm] Bravo",
    rarity: 3,
    type: "Anomaly",
    statBase: { _ATK: 475 },
    statSub: { AP: 60 },
    descHead: "High-Voltage Surge",
    descBody: "Accumulating Anomaly Buildup increases the equipper's Anomaly Proficiency by 25 for 10s. This effect can trigger once every 20s.",
    descVar: [
      ["25"],
    ],
  },
  "12010": {
    name: "[Magnetic Storm] Alpha",
    rarity: 3,
    type: "Anomaly",
    statBase: { _ATK: 475 },
    statSub: { ATK: 20 },
    descHead: "Disordered Current",
    descBody: "Accumulating Anomaly Buildup increases the equipper's Anomaly Mastery by 25 for 10s. This effect can trigger once every 20s.",
    descVar: [
      ["25"],
    ],
  },
  "12009": {
    name: "[Vortex] Hatchet",
    rarity: 3,
    type: "Stun",
    statBase: { _ATK: 475 },
    statSub: { ER: 40 },
    descHead: "Riptide",
    descBody: "Upon entering combat or switching in, the equipper's Impact increases by 9% for 10s. This effect can trigger once every 20s.",
    descVar: [
      ["9%"],
    ],
  },
  "12008": {
    name: "[Vortex] Arrow",
    rarity: 3,
    type: "Stun",
    statBase: { _ATK: 475 },
    statSub: { Impact: 12 },
    descHead: "Tsunami",
    descBody: "The equipper's attacks inflict 8% more Daze on their main target.",
    descVar: [
      ["8%"],
    ],
  },
  "12007": {
    name: "[Vortex] Revolver",
    rarity: 3,
    type: "Stun",
    statBase: { _ATK: 475 },
    statSub: { ATK: 20 },
    descHead: "Undercurrent",
    descBody: "EX Special Attacks inflict 10% more Daze.",
    descVar: [
      ["10%"],
    ],
  },
  "12006": {
    name: "[Reverb] Mark III",
    rarity: 3,
    type: "Support",
    statBase: { _ATK: 475 },
    statSub: { HP: 20 },
    descHead: "Booming Sound",
    descBody: "Launching a Chain Attack or Ultimate increases all squad members' ATK by 8% for 10s. This effect can trigger once every 20s. Passive effects of the same name do not stack.",
    descVar: [
      ["8%"],
    ],
  },
  "12005": {
    name: "[Reverb] Mark II",
    rarity: 3,
    type: "Support",
    statBase: { _ATK: 475 },
    statSub: { ER: 40 },
    descHead: "Roaring Waves",
    descBody: "Launching an EX Special Attack or Chain Attack increases all squad members' Anomaly Mastery and Anomaly Proficiency by 10 for 10s. This effect can trigger once every 20s. Passive effects of the same name do not stack.",
    descVar: [
      ["10"],
    ],
  },
  "12004": {
    name: "[Reverb] Mark I",
    rarity: 3,
    type: "Support",
    statBase: { _ATK: 475 },
    statSub: { ATK: 20 },
    descHead: "Changing Tides",
    descBody: "Launching an EX Special Attack increases all squad members' Impact by 8% for 10s. This effect can trigger once every 20s. Passive effects of the same name do not stack.",
    descVar: [
      ["8%"],
    ],
  },
  "12003": {
    name: "[Lunar] Noviluna",
    rarity: 3,
    type: "Attack",
    statBase: { _ATK: 475 },
    statSub: { CR: 16 },
    descHead: "New Moon",
    descBody: "Launching an EX Special Attack generates 3 Energy for the equipper. This effect can trigger once every 12s.",
    descVar: [
      ["3"],
    ],
  },
  "12002": {
    name: "[Lunar] Decrescent",
    rarity: 3,
    type: "Attack",
    statBase: { _ATK: 475 },
    statSub: { ATK: 20 },
    descHead: "Waning Moon",
    descBody: "Launching a Chain Attack or Ultimate increases the equipper's DMG by 15% for 6s.",
    descVar: [
      ["15%"],
    ],
  },
  "12001": {
    name: "[Lunar] Pleniluna",
    rarity: 3,
    type: "Attack",
    statBase: { _ATK: 475 },
    statSub: { ATK: 20 },
    descHead: "Full Moon",
    descBody: "Basic Attack, Dash Attack, and Dodge Counter DMG increases by 12%.",
    descVar: [
      ["12%"],
    ],
  },
};
