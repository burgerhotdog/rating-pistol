const WW_WEAPONS = {
  // Version 2.1
  "21050046": {
    name: "Luminous Hymn",
    type: "Rectifier",
    base: { FLAT_ATK: 500 },
    substat: "CRIT Rate: 36%",
    subtitle: "Homebuilder's Anthem",
    desc: "Increase ATK by 12%. Dealing DMG to targets with Spectro Frazzle grants the wielder 14% Basic Attack DMG Bonus and 14% Heavy Attack DMG Bonus, stacking up to 3 times for 6s. Casting Outro Skill Amplifies the Spectro Frazzle DMG on targets around the active Resonator by 30% for 30s. Effects of the same name cannot be stacked.",
  },
  "21020036": {
    name: "Unflickering Valor",
    type: "Sword",
    base: { FLAT_ATK: 413 },
    substat: "Energy Regen: 77%",
    subtitle: "Laughter Prevails",
    desc: "Increase CRIT Rate by 8%. Casting Resonance Liberation gives 24% Basic Attack DMG Bonus for 10s. Dealing Basic Attack DMG gives 24% Basic Attack DMG Bonus for 4s.",
  },
  "21050027": {
    name: "Ocean's Gift",
    type: "Sword",
    base: { FLAT_ATK: 463 },
    substat: "ATK: 18.2%",
    subtitle: "Fish Catch",
    desc: "Dealing DMG to enemies with Spectro Frazzle increases the wielder's Spectro DMG by 6%, gaining 1 stack per second for 6s, stacking up to 4 times.",
  },
  
  // Version 2.0
  "21050017": {
    name: "Call of the Abyss",
    type: "Rectifier",
    base: { FLAT_ATK: 338 },
    substat: "Energy Regen: 51.8%",
    subtitle: "Pole of the Celestial Dome",
    desc: "Casting Resonance Liberation increases the Resonator's Healing Bonus by 16% for 15s.",
  },
  "21020094": {
    name: "Fables of Wisdom",
    type: "Sword",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Rhetoric",
    desc: "Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.",
  },
  "21040094": {
    name: "Legend of Drunken Hero",
    type: "Gauntlets",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Rhetoric",
    desc: "Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.",
  },
  "21010094": {
    name: "Meditations on Mercy",
    type: "Broadblade",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Rhetoric",
    desc: "Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.",
  },
  "21030094": {
    name: "Romance in Farewell",
    type: "Pistols",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Rhetoric",
    desc: "Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.",
  },
  "21030016": {
    name: "The Last Dance",
    type: "Pistols",
    base: { FLAT_ATK: 500 },
    substat: "CRIT DMG: 72%",
    subtitle: "Silent Eulogy",
    desc: "Increases ATK by 12%. Every time Intro Skill or Resonance Liberation is cast, Resonance Skill DMG Bonus increases by 48% for 5s.",
  },
  "21040026": {
    name: "Tragicomedy",
    type: "Gauntlets",
    base: { FLAT_ATK: 587 },
    substat: "CRIT Rate: 24.3%",
    subtitle: "Fool's Warble",
    desc: "Increases ATK by 12%. Every time Basic Attack or Intro Skill is cast, Heavy Attack DMG Bonus increases by 48% for 3s.",
  },
  "21050094": {
    name: "Waltz in Masquerade",
    type: "Rectifier",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Rhetoric",
    desc: "Dealing DMG to enemies with Negative Statuses increases the wielder's ATK by 4% for 10s. This effect can be triggered 1 time per second, stackable up to 4 times.",
  },
  
  // Version 1.4
  "21020026": {
    name: "Red Spring",
    type: "Sword",
    base: { FLAT_ATK: 587 },
    substat: "CRIT Rate: 24.3%",
    subtitle: "Beyond the Cycle",
    desc: "Increase ATK by 12%. When dealing Basic Attack DMG, the wielder gains 10% Basic Attack DMG Bonus for 14s. This effect can be triggered once per second, stacking up to 3 times.\nWhen the wielder's Concerto Energy is consumed, gain 40% Basic DMG Bonus for 10. This effect can be triggered once per second and ends when the wielder is switched off the field.",
  },
  "21020017": {
    name: "Somnoire Anchor",
    type: "Sword",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Meow!",
    desc: "Gain 1 stack of Hiss when dealing damage to the target, with 1 stack generated every 1s.\nHiss: each stack increases the wielder's ATK by 2% for 3s, stacking up to 10 times. Switching off the wielder clears all stacks. Gaining 10 stacks increases the wielder's CRIT Rate by 6%.",
  },
  
  // Version 1.3
  "21040084": {
    name: "Celestial Spiral",
    type: "Gauntlets",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Intergalactic Gaze",
    desc: "Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.",
  },
  "21020084": {
    name: "Endless Collapse",
    type: "Sword",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Intergalactic Gaze",
    desc: "Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.",
  },
  "21050084": {
    name: "Fusion Accretion",
    type: "Rectifier",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Intergalactic Gaze",
    desc: "Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.",
  },
  "21030084": {
    name: "Relativistic Jet",
    type: "Pistols",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Intergalactic Gaze",
    desc: "Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.",
  },
  "21050036": {
    name: "Stellar Symphony",
    type: "Rectifier",
    base: { FLAT_ATK: 412 },
    substat: "Energy Regen: 77%",
    subtitle: "Astral Evolvement",
    desc: "Increase HP by 12%. Restore 8 Concerto Energy when casting Resonance Liberation. This effect can be triggered 1 time(s) every 20s. When casting Resonance Skill that heals, increase nearby party members' ATK by 14% for 30s. Effects of the same name cannot be stacked.",
  },
  "21010084": {
    name: "Waning Redshift",
    type: "Broadblade",
    base: { FLAT_ATK: 462 },
    substat: "ATK: 18.2%",
    subtitle: "Intergalactic Gaze",
    desc: "Casting the Resonance Skill grants 6 Resonance Energy and increases ATK by 10%, lasting for 16s. This effect can be triggered once every 20s.",
  },
  
  // Version 1.2
  "21050026": {
    name: "Rime-Draped Sprouts",
    type: "Rectifier",
    base: { FLAT_ATK: 500 },
    substat: "CRIT DMG: 72%",
    subtitle: "Panorama",
    desc: "Increase ATK by 12%. While the wielder is on the field, using Resonance Skill grants 12% Basic Attack DMG Bonus, stacking up to 3 times for 6s. At 3 stacks or above, casting Outro Skill consumes all stacks of this effect and grants the wielder 52% Basic Attack DMG Bonus for 27s, effective when the wielder is off the field.",
  },
  "21040016": {
    name: "Verity's Handle",
    type: "Gauntlets",
    base: { FLAT_ATK: 587 },
    substat: "CRIT Rate: 24.3%",
    subtitle: "Ad Veritatem",
    desc: "Gain 12% Attribute DMG Bonus. When using Resonance Liberation, the wielder gains 48% Resonance Liberation DMG Bonus for 8s. This effect can be extended by 5s each time Resonance Skills are cast, up to 3 times.",
  },
  
  // Version 1.1
  "21010063": {
    name: "Beguiling Melody",
    type: "Broadblade",
    base: { FLAT_ATK: 300 },
    substat: "ATK: 30.4%",
    subtitle: "Graceful Touch",
    desc: "When Intro Skill is cast, restores 4 Concerto Energy. When Outro Skill is cast, restores 4 Resonance Energy.",
  },
  "21020016": {
    name: "Blazing Brilliance",
    type: "Sword",
    base: { FLAT_ATK: 587 },
    substat: "CRIT DMG: 48.6%",
    subtitle: "Crimson Phoenix",
    desc: "ATK increased by 12%. The wielder gains 1 stack of Searing Feather upon dealing damage, which can be triggered once every 0.5s, and gains 5 stacks of the same effect upon casting Resonance Skill. Each stack of Searing Feather gives 4% additional Resonance Skill DMG Bonus for up to 14 stacks. After reaching the max stacks, all stacks will be removed in 12s.",
  },
  "21010026": {
    name: "Ages of Harvest",
    type: "Broadblade",
    base: { FLAT_ATK: 587 },
    substat: "CRIT Rate: 24.3%",
    subtitle: "Divine Blessing",
    desc: "Grants 12% Attribute DMG Bonus. Casting Intro Skill gives the equipper Ageless Marking, which grants 24% Resonance Skill DMG Bonus for 12s. Casting Resonance Skill gives the equipper Ethereal Endowment, which grants 24% Resonance Skill DMG Bonus for 12s.",
  },
  
  // Version 1.0
  "21040015": {
    name: "Abyss Surges",
    type: "Gauntlets",
    base: { FLAT_ATK: 587 },
    substat: "ATK: 36.4%",
    subtitle: "Stormy Resolution",
    desc: "Increases Energy Regen by 12.8%. When hitting a target with Resonance Skill, increases Basic Attack DMG Bonus by 10%, lasting for 8s. When hitting a target with Basic Attacks, increases Resonance Skill DMG Bonus by 10%, lasting for 8s.",
  },
  "21040044": {
    name: "Amity Accord",
    type: "Gauntlets",
    base: { FLAT_ATK: 337 },
    substat: "DEF: 61.5%",
    subtitle: "Camaraderie",
    desc: "When Intro Skill is cast, increases Resonance Liberation DMG Bonus by 20%, lasting for 15s.",
  },
  "21050074": {
    name: "Augment",
    type: "Rectifier",
    base: { FLAT_ATK: 412 },
    substat: "CRIT Rate: 20.2%",
    subtitle: "Forgiving Resilience",
    desc: "Casting Resonance Liberation increases the wielder's ATK by 15%, lasting for 15s.",
  },
  "21010074": {
    name: "Autumntrace",
    type: "Broadblade",
    base: { FLAT_ATK: 412 },
    substat: "CRIT Rate: 20.2%",
    subtitle: "Edge Direction",
    desc: "Increases ATK by 4% upon dealing Basic Attack DMG or Heavy Attack DMG, stacking up to 5 time(s). This effect lasts for 7s and can be triggered 1 time(s) every 1s.",
  },
  "21010034": {
    name: "Broadblade#41",
    type: "Broadblade",
    base: { FLAT_ATK: 412 },
    substat: "Energy Regen: 32.3%",
    subtitle: "Veteran",
    desc: "When the Resonator's HP is above 80%, increases ATK by 12%. When the Resonator's HP is below 40%, gives 5% healing when dealing Basic Attack DMG or Heavy Attack DMG. This effect can be triggered 1 time(s) every 8s.",
  },
  "21010013": {
    name: "Broadblade of Night",
    type: "Broadblade",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Valiance",
    desc: "When Intro Skill is cast, increases ATK by 8%, lasting for 10s.",
  },
  "21010043": {
    name: "Broadblade of Voyager",
    type: "Broadblade",
    base: { FLAT_ATK: 300 },
    substat: "Energy Regen: 32.3%",
    subtitle: "Long Journey",
    desc: "When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.",
  },
  "21030024": {
    name: "Cadenza",
    type: "Pistols",
    base: { FLAT_ATK: 337 },
    substat: "Energy Regen: 51.8%",
    subtitle: "Ceaseless Aria",
    desc: "When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 times every 20s.",
  },
  "21050064": {
    name: "Comet Flare",
    type: "Rectifier",
    base: { FLAT_ATK: 412 },
    substat: "HP: 30.3%",
    subtitle: "Luminous Protection",
    desc: "When dealing Basic Attack DMG or Heavy Attack DMG, increases Healing Bonus by 3%, stacking up to 3 time(s). This effect lasts for 8s and can be triggered 1 time(s) every 0.6s.",
  },
  "21020044": {
    name: "Commando of Conviction",
    type: "Sword",
    base: { FLAT_ATK: 412 },
    substat: "ATK: 30.3%",
    subtitle: "Unyielding",
    desc: "When Intro Skill is cast, increases ATK by 15%, lasting for 15s.",
  },
  "21050015": {
    name: "Cosmic Ripples",
    type: "Rectifier",
    base: { FLAT_ATK: 500 },
    substat: "ATK: 54%",
    subtitle: "Stormy Resolution",
    desc: "Increases Energy Regen by 12.8%. When dealing Basic Attack DMG, increases Basic Attack DMG Bonus by 3.2%, stacking up to 5 time(s). This effect lasts for 8s and can be triggered 1 time(s) every 0.5s.",
  },
  "21010044": {
    name: "Dauntless Evernight",
    type: "Broadblade",
    base: { FLAT_ATK: 337 },
    substat: "DEF: 61.5%",
    subtitle: "Battlebound",
    desc: "When Intro Skill is cast, increases ATK by 8% and DEF by 15%, lasting for 15s.",
  },
  "21010024": {
    name: "Discord",
    type: "Broadblade",
    base: { FLAT_ATK: 337 },
    substat: "Energy Regen: 51.8%",
    subtitle: "Ceaseless Aria",
    desc: "When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 time(s) every 20s.",
  },
  "21020015": {
    name: "Emerald of Genesis",
    type: "Sword",
    base: { FLAT_ATK: 587 },
    substat: "CRIT Rate: 24.3%",
    subtitle: "Stormy Resolution",
    desc: "Increases Energy Regen by 12.8%. When Resonance Skill is cast, increases ATK by 6%, stacking up to 2 time(s). This effect lasts for 10s.",
  },
  "21040034": {
    name: "Gauntlets#21D",
    type: "Gauntlets",
    base: { FLAT_ATK: 387 },
    substat: "Energy Regen: 38.8%",
    subtitle: "Mastermind",
    desc: "When the Resonator dashes or dodges, increases ATK by 8%. Increases Dodge Counter DMG by 50%, lasting for 8s. When Dodge Counter is performed, heals 5% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 6s.",
  },
  "21040013": {
    name: "Gauntlets of Night",
    type: "Gauntlets",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Valiance",
    desc: "When Intro Skill is cast, increases ATK by 8%, lasting for 10s.",
  },
  "21040043": {
    name: "Gauntlets of Voyager",
    type: "Gauntlets",
    base: { FLAT_ATK: 325 },
    substat: "Energy Regen: 30.7%",
    subtitle: "Crusade",
    desc: "When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.",
  },
  "21010053": {
    name: "Guardian Broadblade",
    type: "Broadblade",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Consensus",
    desc: "Increases Basic Attack DMG Bonus and Heavy Attack DMG Bonus by 12%.",
  },
  "21040053": {
    name: "Guardian Gauntlets",
    type: "Gauntlets",
    base: { FLAT_ATK: 300 },
    substat: "DEF: 38.4%",
    subtitle: "Collective Strength",
    desc: "Increases Resonance Liberation DMG Bonus by 12%.",
  },
  "21030053": {
    name: "Guardian Pistols",
    type: "Pistols",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Unity",
    desc: "Resonance Skill DMG Bonus is increased by 12%.",
  },
  "21050053": {
    name: "Guardian Rectifier",
    type: "Rectifier",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Companionship",
    desc: "Increases Basic Attack and Heavy Attack DMG Bonus by 12%.",
  },
  "21020053": {
    name: "Guardian Sword",
    type: "Sword",
    base: { FLAT_ATK: 300 },
    substat: "ATK: 30.3%",
    subtitle: "Unified",
    desc: "Resonance Skill DMG Bonus is increased by 12%.",
  },
  "21010064": {
    name: "Helios Cleaver",
    type: "Broadblade",
    base: { FLAT_ATK: 412 },
    substat: "ATK: 30.3%",
    subtitle: "Plasma Recoiler",
    desc: "Within 12s after Resonance Skill is cast, increases ATK by 3% every 2s, stacking up to 4 time(s). This effect can be triggered 1 time(s) every 12s. When the number of stacks reaches 4, all stacks will be reset within 6s.",
  },
  "21040064": {
    name: "Hollow Mirage",
    type: "Gauntlets",
    base: { FLAT_ATK: 412 },
    substat: "ATK: 30.3%",
    subtitle: "Celestial Blessing",
    desc: "When Resonance Liberation is cast, grants 3 stack(s) of Iron Armor. Each stack increases ATK and DEF by 3%, stacking up to 3 time(s). When the Resonator takes damage, reduces the number of stacks by 1.",
  },
  "21050044": {
    name: "Jinzhou Keeper",
    type: "Rectifier",
    base: { FLAT_ATK: 387 },
    substat: "ATK: 36.4%",
    subtitle: "Guardian",
    desc: "Casting Intro Skill increases the wielder's ATK by 8% and HP by 10%, lasting for 15s.",
  },
  "21020074": {
    name: "Lumingloss",
    type: "Sword",
    base: { FLAT_ATK: 387 },
    substat: "ATK: 36.4%",
    subtitle: "Pale Gale",
    desc: "When Resonance Skill is cast, increases Basic Attack DMG Bonus and Heavy Attack DMG Bonus by 20%, stacking up to 1 time(s). This effect lasts for 10s and can be triggered 1 time(s) every 1s.",
  },
  "21020064": {
    name: "Lunar Cutter",
    type: "Sword",
    base: { FLAT_ATK: 412 },
    substat: "ATK: 30.3%",
    subtitle: "Preordained",
    desc: "Equipped Resonator gains 6 stack(s) of Oath upon entering the battlefield. Each stack increases ATK by 2%, up to 6 stacks. This effect can be triggered 1 time(s) every 12s. The equipped Resonator loses 1 stack(s) of Oath every 2s, and gains 6 stack(s) upon defeating an enemy.",
  },
  "21010015": {
    name: "Lustrous Razor",
    type: "Broadblade",
    base: { FLAT_ATK: 587 },
    substat: "ATK: 36.4%",
    subtitle: "Stormy Resolution",
    desc: "Increases Energy Regen by 12.8%. When Resonance Skill is cast, Resonance Liberation DMG Bonus is increased by 7%, stacking up to 3 times. This effect lasts for 12s.",
  },
  "21040024": {
    name: "Marcato",
    type: "Gauntlets",
    base: { FLAT_ATK: 337 },
    substat: "Energy Regen: 51.8%",
    subtitle: "Ceaseless Aria",
    desc: "When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 times every 20s.",
  },
  "21030064": {
    name: "Novaburst",
    type: "Pistols",
    base: { FLAT_ATK: 412 },
    substat: "ATK: 30.3%",
    subtitle: "Ever-changing",
    desc: "When the Resonator dashes or dodges, increases ATK by 4%, stacking up to 3 time(s). This effect lasts for 8s.",
  },
  "21010023": {
    name: "Originite: Type I",
    type: "Broadblade",
    base: { FLAT_ATK: 300 },
    substat: "DEF: 38.4%",
    subtitle: "Temperance",
    desc: "When Resonance Skill is cast, heals 3% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 12s.",
  },
  "21020023": {
    name: "Originite: Type II",
    type: "Sword",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Vanquish",
    desc: "When Resonance Liberation is cast, heals 5% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 20s.",
  },
  "21030023": {
    name: "Originite: Type III",
    type: "Pistols",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Alarcrity",
    desc: "When Dodge Counter is cast, heals 1.6% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 6s.",
  },
  "21040023": {
    name: "Originite: Type IV",
    type: "Gauntlets",
    base: { FLAT_ATK: 300 },
    substat: "CRIT DMG: 40.5%",
    subtitle: "Rejuvinate",
    desc: "When dealing Basic Attack DMG, heals 0.5% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 3s.",
  },
  "21050023": {
    name: "Originite: Type V",
    type: "Rectifier",
    base: { FLAT_ATK: 300 },
    substat: "ATK: 30.3%",
    subtitle: "Augment",
    desc: "When Intro Skill is cast, heals 5% of the Resonator's Max HP. This effect can be triggered 1 time(s) every 20s.",
  },
  "21020024": {
    name: "Overture",
    type: "Sword",
    base: { FLAT_ATK: 337 },
    substat: "Energy Regen: 51.8%",
    subtitle: "Ceaseless Aria",
    desc: "When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 time(s) every 20s.",
  },
  "21030034": {
    name: "Pistols#26",
    type: "Pistols",
    base: { FLAT_ATK: 387 },
    substat: "ATK: 36.4%",
    subtitle: "Omniscient",
    desc: "When the Resonator takes no damage, increases ATK by 6% every 5s, stacking up to 2 time(s). This effect lasts for 8s. When the Resonator takes damage, loses 1 stacks and heals 5% of their Max HP.",
  },
  "21030013": {
    name: "Pistols of Night",
    type: "Pistols",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Valiance",
    desc: "When Intro Skill is cast, increases ATK by 8%, lasting for 10s.",
  },
  "21030043": {
    name: "Pistols of Voyager",
    type: "Pistols",
    base: { FLAT_ATK: 300 },
    substat: "ATK: 30.3%",
    subtitle: "Long Journey",
    desc: "When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.",
  },
  "21050034": {
    name: "Rectifier#25",
    type: "Rectifier",
    base: { FLAT_ATK: 337 },
    substat: "Energy Regen: 51.8%",
    subtitle: "Dawnbringer",
    desc: "When Resonance Skill is cast, if the Resonator's HP is below 60%, heals 5% of their Max HP. This effect can be triggered 1 time(s) every 8s. If the Resonator's HP is above 60%, increases ATK by 12%, lasting for 10s.",
  },
  "21050013": {
    name: "Rectifier of Night",
    type: "Rectifier",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Valiance",
    desc: "When Intro Skill is cast, increases ATK by 8%, lasting for 10s.",
  },
  "21050043": {
    name: "Rectifier of Voyager",
    type: "Rectifier",
    base: { FLAT_ATK: 300 },
    substat: "Energy Regen: 32.3%",
    subtitle: "Crusade",
    desc: "When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.",
  },
  "21030015": {
    name: "Static Mist",
    type: "Pistols",
    base: { FLAT_ATK: 587 },
    substat: "CRIT Rate: 24.3%",
    subtitle: "Stormy Resolution",
    desc: "Increases Energy Regen by 12.8%. Incoming Resonator’s ATK is increased by 10% for 14s, stackable for up to 1 times after the wielder casts Outro Skill.",
  },
  "21040074": {
    name: "Stonard",
    type: "Gauntlets",
    base: { FLAT_ATK: 412 },
    substat: "CRIT Rate: 20.2%",
    subtitle: "Wallbreaker",
    desc: "Casting Resonance Skill increases the wielder's Resonance Liberation DMG Bonus by 18%, lasting for 15s.",
  },
  "21050016": {
    name: "Stringmaster",
    type: "Rectifier",
    base: { FLAT_ATK: 500 },
    substat: "CRIT Rate: 36%",
    subtitle: "Electric Amplification",
    desc: "Grants 12% Attribute DMG Bonus. When dealing Resonance Skill DMG, increases ATK by 12%, stacking up to 2 times. This effect lasts for 5s. When the wielder is not on the field, increases their ATK by an additional 12%.",
  },
  "21020034": {
    name: "Sword#18",
    type: "Sword",
    base: { FLAT_ATK: 387 },
    substat: "ATK: 36.4%",
    subtitle: "Daybreak",
    desc: "When the Resonator's HP drops below 40%, increases Heavy Attack DMG Bonus by 18% and gives 5% healing when dealing Heavy Attack DMG. This effect can be triggered 1 time(s) every 8s.",
  },
  "21020013": {
    name: "Sword of Night",
    type: "Sword",
    base: { FLAT_ATK: 325 },
    substat: "ATK: 24.3%",
    subtitle: "Valiance",
    desc: "When Intro Skill is cast, increases ATK by 8%, lasting for 10s.",
  },
  "21020043": {
    name: "Sword of Voyager",
    type: "Sword",
    base: { FLAT_ATK: 300 },
    substat: "Energy Regen: 32.3%",
    subtitle: "Crusade",
    desc: "When Resonance Skill is cast, restores 8 Resonance Energy. This effect can be triggered 1 time(s) every 20s.",
  },
  "21030074": {
    name: "Thunderbolt",
    type: "Pistols",
    base: { FLAT_ATK: 387 },
    substat: "ATK: 36.4%",
    subtitle: "Unstoppable",
    desc: "When hitting a target with Basic Attacks or Heavy Attacks, increases Resonance Skill DMG Bonus by 7%, stacking up to 3 time(s). This effect lasts for 10s and can be triggered 1 time(s) every 1s.",
  },
  "21030044": {
    name: "Undying Flame",
    type: "Pistols",
    base: { FLAT_ATK: 412 },
    substat: "ATK: 30.3%",
    subtitle: "Loyalty",
    desc: "When Intro Skill is cast, increases Resonance Skill DMG Bonus by 20% for 15s.",
  },
  "21050024": {
    name: "Variation",
    type: "Rectifier",
    base: { FLAT_ATK: 337 },
    substat: "Energy Regen: 51.8%",
    subtitle: "Ceaseless Aria",
    desc: "When Resonance Skill is cast, restores 8 Concerto Energy. This effect can be triggered 1 times every 20s.",
  },
  "21010016": {
    name: "Verdant Summit",
    type: "Broadblade",
    base: { FLAT_ATK: 587 },
    substat: "CRIT DMG: 48.6%",
    subtitle: "Swordsworn",
    desc: "Increases Attribute DMG Bonus by 12%. Every time Intro Skill or Resonance Liberation is cast, increases Heavy Attack DMG Bonus by 24%, stacking up to 2 time(s). This effect lasts for 14s.",
  },
  "21010012": {
    name: "Tyro Broadblade",
    type: "Broadblade",
    base: { FLAT_ATK: 275 },
    substat: "ATK: 14.8%",
    subtitle: "Prologue",
    desc: "Increases ATK by 5%.",
  },
  "21020012": {
    name: "Tyro Sword",
    type: "Sword",
    base: { FLAT_ATK: 275 },
    substat: "ATK: 14.8%",
    subtitle: "Prologue",
    desc: "Increases ATK by 5%.",
  },
  "21030012": {
    name: "Tyro Pistols",
    type: "Pistols",
    base: { FLAT_ATK: 275 },
    substat: "ATK: 14.8%",
    subtitle: "Prologue",
    desc: "Increases ATK by 5%.",
  },
  "21040012": {
    name: "Tyro Gauntlets",
    type: "Gauntlets",
    base: { FLAT_ATK: 275 },
    substat: "ATK: 14.8%",
    subtitle: "Prologue",
    desc: "Increases ATK by 5%.",
  },
  "21050012": {
    name: "Tyro Rectifier",
    type: "Rectifier",
    base: { FLAT_ATK: 275 },
    substat: "ATK: 14.8%",
    subtitle: "Prologue",
    desc: "Increases ATK by 5%.",
  },
  "21010011": {
    name: "Training Broadblade",
    type: "Broadblade",
    base: { FLAT_ATK: 250 },
    substat: "ATK: 11.5%",
    subtitle: "Persevere",
    desc: "Increases ATK by 4%.",
  },
  "21020011": {
    name: "Training Sword",
    type: "Sword",
    base: { FLAT_ATK: 250 },
    substat: "ATK: 11.5%",
    subtitle: "Persevere",
    desc: "Increases ATK by 4%.",
  },
  "21030011": {
    name: "Training Pistols",
    type: "Pistols",
    base: { FLAT_ATK: 250 },
    substat: "ATK: 11.5%",
    subtitle: "Persevere",
    desc: "Increases ATK by 4%.",
  },
  "21040011": {
    name: "Training Gauntlets",
    type: "Gauntlets",
    base: { FLAT_ATK: 250 },
    substat: "ATK: 11.5%",
    subtitle: "Persevere",
    desc: "Increases ATK by 4%.",
  },
  "21050011": {
    name: "Training Rectifier",
    type: "Rectifier",
    base: { FLAT_ATK: 250 },
    substat: "ATK: 11.5%",
    subtitle: "Persevere",
    desc: "Increases ATK by 4%.",
  },
};

export default WW_WEAPONS;
