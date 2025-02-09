const SETS = {
  // Version 2.0
  [`Empyrean Anthem`]: {
    desc: [
      `2-Pc: Energy Regen +10%`,
      `5-Pc: Increase the Resonator's Coordinated Attack DMG by 80%. Upon a critical hit of Coordinated Attack, increase the active Resonator's ATK by 20% for 4s.`,
    ],
  },
  
  [`Eternal Radiance`]: {
    desc: [
      `2-Pc: Spectro DMG +10%`,
      `5-Pc: Inflicting enemies with Spectro Frazzle increases CRIT Rate by 20% for 15s. Attacking enemies with 10 stacks of Spectro Frazzle grants 15% Spectro DMG Bonus for 15s.`,
    ],
  },
  
  [`Frosty Resolve`]: {
    desc: [
      `2-Pc: Resonance Skill DMG +12%`,
      `5-Pc: Casting Resonance Skill grants 22.5% Glacio DMG Bonus for 15s and casting Resonance Liberation increases Resonance Skill DMG by 18%, lasting for 5s. This effect stacks up to 2 times.`,
    ],
  },
  
  [`Midnight Veil`]: {
    desc: [
      `2-Pc: Havoc DMG +10%`,
      `5-Pc: When Outro Skill is triggered, deal additional 480% Havoc DMG to surrounding enemies, considered Outro Skill DMG, and grant the incoming Resonator 15% Havoc DMG Bonus for 15s.`,
    ],
  },
  
  [`Tidebreaking Courage`]: {
    desc: [
      `2-Pc: Energy Regen +10%`,
      `5-Pc: Increase the Resonator's ATK by 15%. Reaching 250% Energy Regen increases all Attribute DMG by 30% for the Resonator.`,
    ],
  },
  
  // Version 1.4
  
  // Version 1.3
  
  // Version 1.2
  
  // Version 1.1
  
  // Version 1.0
  [`Celestial Light`]: {
    desc: [
      `2-Pc: Spectro DMG +10%.`,
      `5-Pc: Spectro DMG +30% for 15s after releasing Intro Skill.`,
    ],
  },
  
  [`Freezing Frost`]: {
    desc: [
      `2-Pc: Glacio DMG +10%.`,
      `5-Pc: Glacio DMG +10% after releasing Basic Attack or Heavy Attack. This effect stacks up to 3 times, each stack lasts 15s.`,
    ],
  },
  
  [`Lingering Tunes`]: {
    desc: [
      `2-Pc: ATK +10%`,
      `5-Pc: While on the field, ATK increases by 5% every 1.5s. This effect stacks up to 4 times. Outro Skill DMG +60%.`,
    ],
  },
  
  [`Molten Rift`]: {
    desc: [
      `2-Pc: Fusion DMG +10%.`,
      `5-Pc: Fusion DMG +30% for 15s after releasing Resonance Skill.`,
    ],
  },
  
  [`Moonlit Clouds`]: {
    desc: [
      `2-Pc: Energy Regen +10%.`,
      `5-Pc: Upon using Outro Skill, increases the ATK of the next Resonator by 22.5% for 15s.`,
    ],
  },
  
  [`Rejuvenating Glow`]: {
    desc: [
      `2-Pc: Healing Bonus +10%.`,
      `5-Pc: Increases the ATK of all party members by 15% for 30s upon healing allies.`,
    ],
  },
  
  [`Sierra Gale`]: {
    desc: [
      `2-Pc: Aero DMG +10%.`,
      `5-Pc: Aero DMG +30% for 15s after releasing Intro Skill.`,
    ],
  },
  
  [`Havoc Eclipse`]: {
    desc: [
      `2-Pc: Havoc DMG +10%.`,
      `5-Pc: Havoc DMG +7.5% after releasing Basic Attack or Heavy Attack. This effect stacks up to 4 times, each stack lasts 15s.`,
    ],
  },
  
  [`Void Thunder`]: {
    desc: [
      `2-Pc: Electro DMG +10%.`,
      `5-Pc: Electro DMG +15% after releasing Heavy Attack or Resonance Skill. This effect stacks up to 2 times, each stack lasts 15s.`,
    ],
  },
};

export default SETS;
