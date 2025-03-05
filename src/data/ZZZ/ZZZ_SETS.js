const SETS = {
  // Version 1.4
  "32800": {
    name: "Astral Voice",
    rarity: 5,
    desc: "2-Pc: ATK +10%\n4-Pc: Whenever any squad member enters the field using a Quick Assist, all squad members gain 1 stack of Astral, up to a maximum of 3 stacks, and lasting 15s. Repeated triggers reset the duration. Each stack of Astral increases the DMG dealt by the character entering the field using a Quick Assist by 8%. Only one instance of this effect can exist in the same squad.",
  },
  "32700": {
    name: "Branch & Blade Song",
    rarity: 5,
    desc: "2-Pc: CRIT DMG +16%\n4-Pc: When Anomaly Mastery exceeds or equals 115 points, the equipper's CRIT DMG increases by 30%. When any squad member applies Freeze or triggers the Shatter effect on an enemy, the equipper's CRIT Rate increases by 12%, lasting 15s.",
  },
  
  // Version 1.2
  "31900": {
    name: "Proto Punk",
    rarity: 5,
    desc: "2-Pc: Increases Shield effect by 15%.\n4-Pc: When any squad member triggers a Defensive Assist or Evasive Assist, all squad members deal 15% increased DMG, lasting 10s. Passive effects of the same name do not stack.",
  },
  "31800": {
    name: "Chaos Jazz",
    rarity: 5,
    desc: "2-Pc: Anomaly Proficiency +30\n4-Pc: Fire DMG and Electric DMG increases by 15%. While off-field, EX Special Attack and Assist Attack DMG increases by 20%. When switching on-field, this buff continues for 5s, and this continuation effect can trigger once every 7.5s.",
  },
  
  // Version 1.0
  "32600": {
    name: "Fanged Metal",
    rarity: 5,
    desc: "2-Pc: Physical DMG +10%\n4-Pc: Whenever a squad member inflicts Assault on an enemy, the equipper deals 35% additional DMG to the target for 12s.",
  },
  "32500": {
    name: "Polar Metal",
    rarity: 5,
    desc: "2-Pc: Ice DMG +10%\n4-Pc: Increase the DMG of Basic Attack and Dash Attack by 20%. When any squad member inflicts Freeze or Shatter, this effect increases by an additional 20% for 12s.",
  },
  "32400": {
    name: "Thunder Metal",
    rarity: 5,
    desc: "2-Pc: Electric DMG +10%\n4-Pc: As long as an enemy in combat is Shocked, the equipper's ATK is increased by 28%.",
  },
  "32300": {
    name: "Chaotic Metal",
    rarity: 5,
    desc: "2-Pc: Ether DMG +10%\n4-Pc: The equipper's CRIT DMG increases by 20%. When any character in the squad triggers Corruption's additional DMG, this effect further increases by 5.5% for 8s, stacking up to 6 times. Repeated triggers reset the duration.",
  },
  "32200": {
    name: "Inferno Metal",
    rarity: 5,
    desc: "2-Pc: Fire DMG +10%\n4-Pc: Upon hitting a Burning enemy, the equipper's CRIT Rate is increased by 28% for 8s.",
  },
  "31600": {
    name: "Swing Jazz",
    rarity: 5,
    desc: "2-Pc: Energy Regen +20%\n4-Pc: Launching a Chain Attack or Ultimate increases all squad members' DMG by 15% for 12s. Passive effects of the same name do not stack.",
  },
  "31500": {
    name: "Soul Rock",
    rarity: 5,
    desc: "2-Pc: DEF +16%\n4-Pc: Upon receiving an enemy attack and losing HP, the equipper takes 40% less DMG for 2.5s. This effect can trigger once every 15s.",
  },
  "31400": {
    name: "Hormone Punk",
    rarity: 5,
    desc: "2-Pc: ATK +10%\n4-Pc: Upon entering combat or switching in, its user's ATK increases by 25% for 10s. This effect can trigger once every 20s.",
  },
  "31300": {
    name: "Freedom Blues",
    rarity: 5,
    desc: "2-Pc: Anomaly Proficiency +30\n4-Pc: When an EX Special Attack hits an enemy, reduce the target's Anomaly Buildup RES to the equipper's Attribute by 20% for 8s. This effect does not stack with others of the same attribute.",
  },
  "31200": {
    name: "Shockstar Disco",
    rarity: 5,
    desc: "2-Pc: Impact +6%\n4-Pc: Basic Attacks, Dash Attacks, and Dodge Counters inflict 20% more Daze to the main target.",
  },
  "31100": {
    name: "Puffer Electro",
    rarity: 5,
    desc: "2-Pc: PEN Ratio +8%\n4-Pc: Ultimate DMG increases by 20%. Launching an Ultimate increases the equipper's ATK by 15% for 12s.",
  },
  "31000": {
    name: "Woodpecker Electro",
    rarity: 5,
    desc: "2-Pc: CRIT Rate +8%\n4-Pc: Landing a critical hit on an enemy with a Basic Attack, Dodge Counter, or EX Special Attack increases the equipper's ATK by 9% for 6s. The buff duration for different skills are calculated separately.",
  },
};

export default SETS;
