const WEAPONS = {
  // Version 2.0
  [`Call of the Abyss`]: {
    type: "Rectifier",
    base: { ATK: 338 },
    substat: "Energy Regen: 51.8",
    subtitle: `Pole of the Celestial Dome`,
    desc: [
      `Casting Resonance Liberation increases the Resonator's Healing Bonus by 16% for 15s.`,
    ],
  },
  
  [`Fables of Wisdom`]: {
    type: "Sword",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Rhetoric`,
    desc: [
      `Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.`,
    ],
  },

  [`Legend of Drunken Hero`]: {
    type: "Gauntlets",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Rhetoric`,
    desc: [
      `Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.`,
    ],
  },

  [`Meditations on Mercy`]: {
    type: "Broadblade",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Rhetoric`,
    desc: [
      `Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.`,
    ],
  },
  
  [`Romance in Farewell`]: {
    type: "Pistols",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Rhetoric`,
    desc: [
      `Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.`,
    ],
  },

  [`The Last Dance`]: {
    type: "Pistols",
    base: { ATK: 500 },
    substat: "CRIT DMG: 72",
    subtitle: `Silent Eulogy`,
    desc: [
      `Increases ATK by 12%. Every time Intro Skill or Resonance Liberation is cast, Resonance Skill DMG Bonus increases by 48% for 5s.`,
    ],
  },

  [`Tragicomedy`]: {
    type: "Gauntlets",
    base: { ATK: 587 },
    substat: "CRIT Rate: 24.3",
    subtitle: `Fool's Warble`,
    desc: [
      `Increases ATK by 12%. Every time Basic Attack or Intro Skill is cast, Heavy Attack DMG Bonus increases by 48% for 3s.`,
    ],
  },
  
  [`Waltz in Masquerade`]: {
    type: "Rectifier",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Rhetoric`,
    desc: [
      `Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.`,
    ],
  },
  
  // Version 1.4
  [`Red Spring`]: {
    type: "Sword",
    base: { ATK: 587 },
    substat: "CRIT Rate: 24.3",
    subtitle: `Beyond the Cycle`,
    desc: [
      `Increase ATK by 12%. When dealing Basic Attack DMG, the wielder gains 10% Basic Attack DMG Bonus for 14s. This effect can be triggered once per second, stacking up to 3 times.`,
      `When the wielder's Concerto Energy is consumed, gain 40% Basic DMG Bonus for 10. This effect can be triggered once per second and ends when the wielder is switched off the field.`,
    ],
  },
  
  [`Somnoire Anchor`]: {
    type: "Sword",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Meow!`,
    desc: [
      `Gain 1 stack of Hiss when dealing damage to the target, with 1 stack generated every 1s.`,
      `Hiss: each stack increases the wielder's ATK by 2% for 3s, stacking up to 10 times. Switching off the wielder clears all stacks. Gaining 10 stacks increases the wielder's Crit. Rate by 6%.`,
    ],
  },
  
  // Version 1.3
  [`Celestial Spiral`]: {
    type: "Gauntlets",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Intergalactic Gaze`,
    desc: [
      `Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.`,
    ],
  },
  
  [`Endless Collapse`]: {
    type: "Sword",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Intergalactic Gaze`,
    desc: [
      `Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.`,
    ],
  },
  
  [`Fusion Accretion`]: {
    type: "Rectifier",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Intergalactic Gaze`,
    desc: [
      `Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.`,
    ],
  },
  
  [`Relativistic Jet`]: {
    type: "Pistols",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Intergalactic Gaze`,
    desc: [
      `Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.`,
    ],
  },
  
  [`Stellar Symphony`]: {
    type: "Rectifier",
    base: { ATK: 412 },
    substat: "Energy Regen: 77",
    subtitle: `Astral Evolvement`,
    desc: [
      `Increase HP by 12%. Restore 8 Concerto Energy when casting Resonance Liberation. This effect can be triggered 1 time(s) every 20s. When casting Resonance Skill that heals, increase nearby party members' ATK by 14% for 30s. Effects of the same name cannot be stacked.`,
    ],
  },
  
  [`Waning Redshift`]: {
    type: "Broadblade",
    base: { ATK: 462 },
    substat: "ATK%: 18.2",
    subtitle: `Intergalactic Gaze`,
    desc: [
      `Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.`,
    ],
  },
  
  // Version 1.2
  [`Rime-Draped Sprouts`]: {
    type: "Rectifier",
    base: { ATK: 500 },
    substat: "CRIT DMG: 72",
    subtitle: `Panorama`,
    desc: [
      `Increase ATK by 12%. While the wielder is on the field, using Resonance Skill grants 12% Basic Attack DMG Bonus, stacking up to 3 times for 6s. At 3 stacks or above, casting Outro Skill consumes all stacks of this effect and grants the wielder 52% Basic Attack DMG Bonus for 27s, effective when the wielder is off the field.`,
    ],
  },
  
  [`Verity's Handle`]: {
    type: "Gauntlets",
    base: { ATK: 587 },
    substat: "CRIT Rate: 24.3",
    subtitle: `Ad Veritatem`,
    desc: [
      `Gain 12% Attribute DMG Bonus. When using Resonance Liberation, the wielder gains 48% Resonance Liberation DMG Bonus for 8s. This effect can be extended by 5s each time Resonance Skills are cast, up to 3 times.`,
    ],
  },
  
  // Version 1.1
  [`Beguiling Melody`]: {
    type: "Broadblade",
    base: { ATK: 300 },
    substat: "ATK%: 30.4",
    subtitle: `Graceful Touch`,
    desc: [
      `When Intro Skill is cast, restores 4 Concerto Energy. When Outro Skill is cast, restores 4 Resonance Energy.`,
    ],
  },
  
  [`Blazing Brilliance`]: {
    type: "Sword",
    base: { ATK: 587 },
    substat: "CRIT DMG: 48.6",
    subtitle: `Crimson Phoenix`,
    desc: [
      `ATK increased by 12%. The wielder gains 1 stack of Searing Feather upon dealing damage, which can be triggered once every 0.5s, and gains 5 stacks of the same effect upon casting Resonance Skill. Each stack of Searing Feather gives 4% additional Resonance Skill DMG Bonus for up to 14 stacks. After reaching the max stacks, all stacks will be removed in 12s.`,
    ],
  },
  
  [`Ages of Harvest`]: {
    type: "Broadblade",
    base: { ATK: 587 },
    substat: "CRIT Rate: 24.3",
    subtitle: `Divine Blessing`,
    desc: [
      `Grants 12% Attribute DMG Bonus. Casting Intro Skill gives the equipper Ageless Marking, which grants 24% Resonance Skill DMG Bonus for 12s. Casting Resonance Skill gives the equipper Ethereal Endowment, which grants 24% Resonance Skill DMG Bonus for 12s.`,
    ],
  },
  
  // Version 1.0
  [`Abyss Surges`]: {
    type: "Gauntlets",
    base: { ATK: 587 },
    substat: "ATK%: 36.4",
    subtitle: `Stormy Resolution`,
    desc: [
      `Increases Energy Regen by 12.8%. When hitting a target with Resonance Skill, increases Basic Attack DMG Bonus by 10%, lasting for 8s. When hitting a target with Basic Attacks, increases Resonance Skill DMG Bonus by 10%, lasting for 8s.`,
    ],
  },
  
  [`Amity Accord`]: {
    type: "Gauntlets",
    base: { ATK: 337 },
    substat: "DEF%: 61.5",
    subtitle: `Camaraderie`,
    desc: [
      `When Intro Skill is cast, increases Resonance Liberation DMG Bonus by 20%, lasting for 15s.`,
    ],
  },
  
  [`Augment`]: {
    type: "Rectifier",
    base: { ATK: 412 },
    substat: "CRIT Rate: 20.2",
    subtitle: `Forgiving Resilience`,
    desc: [
      `Casting Resonance Liberation increases the wielder's ATK by 15%, lasting for 15s.`,
    ],
  },
  
  [`Autumntrace`]: {
    type: "Broadblade",
    base: { ATK: 412 },
    substat: "CRIT Rate: 20.2",
    subtitle: `Edge Direction`,
    desc: [
      `Increases ATK by 4% upon dealing Basic Attack DMG or Heavy Attack DMG, stacking up to 5 time(s). This effect lasts for 7s and can be triggered 1 time(s) every 1s.`,
    ],
  },
  
  [`Broadblade#41`]: {
    type: "Broadblade",
    base: { ATK: 412 },
    substat: "Energy Regen: 32.3",
    subtitle: `Veteran`,
    desc: [
      `When the Resonator's HP is above 80%, increases ATK by 12%. When the Resonator's HP is below 40%, gives 5% healing when dealing Basic Attack DMG or Heavy Attack DMG. This effect can be triggered 1 time(s) every 8s.`,
    ],
  },
  
  [`Broadblade of Night`]: {
    type: "Broadblade",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Valiance`,
    desc: [
      `When Intro Skill is cast, increases ATK by 8%, lasting for 10s.`,
    ],
  },
  
  [`Broadblade of Voyager`]: {
    type: "Broadblade",
    base: { ATK: 300 },
    substat: "Energy Regen: 32.3",
    subtitle: `Long Journey`,
    desc: [
      `When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Cadenza`]: {
    type: "Pistols",
    base: { ATK: 337 },
    substat: "Energy Regen: 51.8",
    subtitle: `Ceaseless Aria`,
    desc: [
      `When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 times every 20s.`,
    ],
  },
  
  [`Comet Flare`]: {
    type: "Rectifier",
    base: { ATK: 412 },
    substat: "HP%: 30.3",
    subtitle: `Luminous Protection`,
    desc: [
      `When dealing Basic Attack DMG or Heavy Attack DMG, increases Healing Bonus by 3%, stacking up to 3 time(s). This effect lasts for 8s and can be triggered 1 time(s) every 0.6s.`,
    ],
  },
  
  [`Commando of Conviction`]: {
    type: "Sword",
    base: { ATK: 412 },
    substat: "ATK%: 30.3",
    subtitle: `Unyielding`,
    desc: [
      `When Intro Skill is cast, increases ATK by 15%, lasting for 15s.`,
    ],
  },
  
  [`Cosmic Ripples`]: {
    type: "Rectifier",
    base: { ATK: 500 },
    substat: "ATK%: 54",
    subtitle: `Stormy Resolution`,
    desc: [
      `Increases Energy Regen by 12.8%. When dealing Basic Attack DMG, increases Basic Attack DMG Bonus by 3.2%, stacking up to 5 time(s). This effect lasts for 8s and can be triggered 1 time(s) every 0.5s.`,
    ],
  },
  
  [`Dauntless Evernight`]: {
    type: "Broadblade",
    base: { ATK: 337 },
    substat: "DEF%: 61.5",
    subtitle: `Battlebound`,
    desc: [
      `When Intro Skill is cast, increases ATK by 8% and DEF by 15%, lasting for 15s.`,
    ],
  },
  
  [`Discord`]: {
    type: "Broadblade",
    base: { ATK: 337 },
    substat: "Energy Regen: 51.8",
    subtitle: `Ceaseless Aria`,
    desc: [
      `When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Emerald of Genesis`]: {
    type: "Sword",
    base: { ATK: 587 },
    substat: "CRIT Rate: 24.3",
    subtitle: `Stormy Resolution`,
    desc: [
      `Increases Energy Regen by 12.8%. When Resonance Skill is cast, increases ATK by 6%, stacking up to 2 time(s). This effect lasts for 10s.`,
    ],
  },
  
  [`Gauntlets#21D`]: {
    type: "Gauntlets",
    base: { ATK: 387 },
    substat: "Energy Regen: 38.8",
    subtitle: `Mastermind`,
    desc: [
      `When the Resonator dashes or dodges, increases ATK by 8%. Increases Dodge Counter DMG by 50%, lasting for 8s. When Dodge Counter is performed, heals 5% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 6s.`,
    ],
  },
  
  [`Gauntlets of Night`]: {
    type: "Gauntlets",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Valiance`,
    desc: [
      `When Intro Skill is cast, increases ATK by 8%, lasting for 10s.`,
    ],
  },
  
  [`Gauntlets of Voyager`]: {
    type: "Gauntlets",
    base: { ATK: 325 },
    substat: "Energy Regen: 30.7",
    subtitle: `Crusade`,
    desc: [
      `When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Guardian Broadblade`]: {
    type: "Broadblade",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Consensus`,
    desc: [
      `Increases Basic Attack DMG Bonus and Heavy Attack DMG Bonus by 12%.`,
    ],
  },
  
  [`Guardian Gauntlets`]: {
    type: "Gauntlets",
    base: { ATK: 300 },
    substat: "DEF%: 38.4",
    subtitle: `Collective Strength`,
    desc: [
      `Increases Resonance Liberation DMG Bonus by 12%.`,
    ],
  },
  
  [`Guardian Pistols`]: {
    type: "Pistols",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Unity`,
    desc: [
      `Resonance Skill DMG Bonus is increased by 12%.`,
    ],
  },
  
  [`Guardian Rectifier`]: {
    type: "Rectifier",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Companionship`,
    desc: [
      `Increases Basic Attack and Heavy Attack DMG Bonus by 12%.`,
    ],
  },
  
  [`Guardian Sword`]: {
    type: "Sword",
    base: { ATK: 300 },
    substat: "ATK%: 30.3",
    subtitle: `Unified`,
    desc: [
      `Resonance Skill DMG Bonus is increased by 12%.`,
    ],
  },
  
  [`Helios Cleaver`]: {
    type: "Broadblade",
    base: { ATK: 412 },
    substat: "ATK%: 30.3",
    subtitle: `Plasma Recoiler`,
    desc: [
      `Within 12s after Resonance Skill is cast, increases ATK by 3% every 2s, stacking up to 4 time(s). This effect can be triggered 1 time(s) every 12s. When the number of stacks reaches 4, all stacks will be reset within 6s.`,
    ],
  },
  
  [`Hollow Mirage`]: {
    type: "Gauntlets",
    base: { ATK: 412 },
    substat: "ATK%: 30.3",
    subtitle: `Celestial Blessing`,
    desc: [
      `When Resonance Liberation is cast, grants 3 stack(s) of Iron Armor. Each stack increases ATK and DEF by 3%, stacking up to 3 time(s). When the Resonator takes damage, reduces the number of stacks by 1.`,
    ],
  },
  
  [`Jinzhou Keeper`]: {
    type: "Rectifier",
    base: { ATK: 387 },
    substat: "ATK%: 36.4",
    subtitle: `Guardian`,
    desc: [
      `Casting Intro Skill increases the wielder's ATK by 8% and HP by 10%, lasting for 15s.`,
    ],
  },
  
  [`Lumingloss`]: {
    type: "Sword",
    base: { ATK: 387 },
    substat: "ATK%: 36.4",
    subtitle: `Pale Gale`,
    desc: [
      `When Resonance Skill is cast, increases Basic Attack DMG Bonus and Heavy Attack DMG Bonus by 20%, stacking up to 1 time(s). This effect lasts for 10s and can be triggered 1 time(s) every 1s.`,
    ],
  },
  
  [`Lunar Cutter`]: {
    type: "Sword",
    base: { ATK: 412 },
    substat: "ATK%: 30.3",
    subtitle: `Preordained`,
    desc: [
      `Equipped Resonator gains 6 stack(s) of Oath upon entering the battlefield. Each stack increases ATK by 2%, up to 6 stacks. This effect can be triggered 1 time(s) every 12s. The equipped Resonator loses 1 stack(s) of Oath every 2s, and gains 6 stack(s) upon defeating an enemy.`,
    ],
  },
  
  [`Lustrous Razor`]: {
    type: "Broadblade",
    base: { ATK: 587 },
    substat: "ATK%: 36.4",
    subtitle: `Stormy Resolution`,
    desc: [
      `Increases Energy Regen by 12.8%. When Resonance Skill is cast, Resonance Liberation DMG Bonus is increased by 7%, stacking up to 3 times. This effect lasts for 12s.`,
    ],
  },
  
  [`Marcato`]: {
    type: "Gauntlets",
    base: { ATK: 337 },
    substat: "Energy Regen: 51.8",
    subtitle: `Ceaseless Aria`,
    desc: [
      `When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 times every 20s.`,
    ],
  },
  
  [`Novaburst`]: {
    type: "Pistols",
    base: { ATK: 412 },
    substat: "ATK%: 30.3",
    subtitle: `Ever-changing`,
    desc: [
      `When the Resonator dashes or dodges, increases ATK by 4%, stacking up to 3 time(s). This effect lasts for 8s.`,
    ],
  },
  
  [`Originite: Type I`]: {
    type: "Broadblade",
    base: { ATK: 300 },
    substat: "DEF%: 38.4",
    subtitle: `Temperance`,
    desc: [
      `When Resonance Skill is cast, heals 3% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 12s.`,
    ],
  },
  
  [`Originite: Type II`]: {
    type: "Sword",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Vanquish`,
    desc: [
      `When Resonance Liberation is cast, heals 5% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Originite: Type III`]: {
    type: "Pistols",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Alarcrity`,
    desc: [
      `When Dodge Counter is cast, heals 1.6% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 6s.`,
    ],
  },
  
  [`Originite: Type IV`]: {
    type: "Gauntlets",
    base: { ATK: 300 },
    substat: "CRIT DMG: 40.5",
    subtitle: `Rejuvinate`,
    desc: [
      `When dealing Basic Attack DMG, heals 0.5% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 3s.`,
    ],
  },
  
  [`Originite: Type V`]: {
    type: "Rectifier",
    base: { ATK: 300 },
    substat: "ATK%: 30.3",
    subtitle: `Augment`,
    desc: [
      `When Intro Skill is cast, heals 5% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Overture`]: {
    type: "Sword",
    base: { ATK: 337 },
    substat: "Energy Regen: 51.8",
    subtitle: `Ceaseless Aria`,
    desc: [
      `When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Pistols#26`]: {
    type: "Pistols",
    base: { ATK: 387 },
    substat: "ATK%: 36.4",
    subtitle: `Omniscient`,
    desc: [
      `When the Resonator takes no damage, increases ATK by 6% every 5s, stacking up to 2 time(s). This effect lasts for 8s. When the Resonator takes damage, loses 1 stacks and heals 5% of their Max HP.`,
    ],
  },
  
  [`Pistols of Night`]: {
    type: "Pistols",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Valiance`,
    desc: [
      `When Intro Skill is cast, increases ATK by 8%, lasting for 10s.`,
    ],
  },
  
  [`Pistols of Voyager`]: {
    type: "Pistols",
    base: { ATK: 300 },
    substat: "ATK%: 30.3",
    subtitle: `Long Journey`,
    desc: [
      `When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Rectifier#25`]: {
    type: "Rectifier",
    base: { ATK: 337 },
    substat: "Energy Regen: 51.8",
    subtitle: `Dawnbringer`,
    desc: [
      `When Resonance Skill is cast, if the Resonator's HP is below 60%, heals 5% of their Max HP. This effect can be triggered 1 time(s) every 8s. If the Resonator's HP is above 60%, increases ATK by 12%, lasting for 10s.`,
    ],
  },
  
  [`Rectifier of Night`]: {
    type: "Rectifier",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Valiance`,
    desc: [
      `When Intro Skill is cast, increases ATK by 8%, lasting for 10s.`,
    ],
  },
  
  [`Rectifier of Voyager`]: {
    type: "Rectifier",
    base: { ATK: 300 },
    substat: "Energy Regen: 32.3",
    subtitle: `Crusade`,
    desc: [
      `When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Static Mist`]: {
    type: "Pistols",
    base: { ATK: 587 },
    substat: "CRIT Rate: 24.3",
    subtitle: `Stormy Resolution`,
    desc: [
      `Increases Energy Regen by 12.8%. Incoming Resonator’s ATK is increased by 10% for 14s, stackable for up to 1 times after the wielder casts Outro Skill.`,
    ],
  },
  
  [`Stonard`]: {
    type: "Gauntlets",
    base: { ATK: 412 },
    substat: "CRIT Rate: 20.2",
    subtitle: `Wallbreaker`,
    desc: [
      `Casting Resonance Skill increases the wielder's Resonance Liberation DMG Bonus by 18%, lasting for 15s.`,
    ],
  },
  
  [`Stringmaster`]: {
    type: "Rectifier",
    base: { ATK: 500 },
    substat: "CRIT Rate: 36",
    subtitle: `Electric Amplification`,
    desc: [
      `Grants 12% Attribute DMG Bonus. When dealing Resonance Skill DMG, increases ATK by 12%, stacking up to 2 times. This effect lasts for 5s. When the wielder is not on the field, increases their ATK by an additional 12%.`,
    ],
  },
  
  [`Sword#18`]: {
    type: "Sword",
    base: { ATK: 387 },
    substat: "ATK%: 36.4",
    subtitle: `Daybreak`,
    desc: [
      `When the Resonator's HP drops below 40%, increases Heavy Attack DMG Bonus by 18% and gives 5% healing when dealing Heavy Attack DMG. This effect can be triggered 1 time(s) every 8s.`,
    ],
  },
  
  [`Sword of Night`]: {
    type: "Sword",
    base: { ATK: 325 },
    substat: "ATK%: 24.3",
    subtitle: `Valiance`,
    desc: [
      `When Intro Skill is cast, increases ATK by 8%, lasting for 10s.`,
    ],
  },
  
  [`Sword of Voyager`]: {
    type: "Sword",
    base: { ATK: 300 },
    substat: "Energy Regen: 32.3",
    subtitle: `Crusade`,
    desc: [
      `When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.`,
    ],
  },
  
  [`Thunderbolt`]: {
    type: "Pistols",
    base: { ATK: 387 },
    substat: "ATK%: 36.4",
    subtitle: `Unstoppable`,
    desc: [
      `When hitting a target with Basic Attacks or Heavy Attacks, increases Resonance Skill DMG Bonus by 7%, stacking up to 3 time(s). This effect lasts for 10s and can be triggered 1 time(s) every 1s.`,
    ],
  },
  
  [`Undying Flame`]: {
    type: "Pistols",
    base: { ATK: 412 },
    substat: "ATK%: 30.3",
    subtitle: `Loyalty`,
    desc: [
      `When Intro Skill is cast, increases Resonance Skill DMG Bonus by 20% for 15s.`,
    ],
  },
  
  [`Variation`]: {
    type: "Rectifier",
    base: { ATK: 337 },
    substat: "Energy Regen: 51.8",
    subtitle: `Ceaseless Aria`,
    desc: [
      `When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 times every 20s.`,
    ],
  },
  
  [`Verdant Summit`]: {
    type: "Broadblade",
    base: { ATK: 587 },
    substat: "CRIT DMG: 48.6",
    subtitle: `Swordsworn`,
    desc: [
      `Increases Attribute DMG Bonus by 12%. Every time Intro Skill or Resonance Liberation is cast, increases Heavy Attack DMG Bonus by 24%, stacking up to 2 time(s). This effect lasts for 14s.`,
    ],
  },
};

export default WEAPONS;
