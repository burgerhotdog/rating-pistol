const WEAPONS = {
  // Version 5.3
  [`A Thousand Blazing Suns`]: {
    type: "Claymore",
    base: { ATK: 741 },
    substat: "CRIT Rate: 11",
    subtitle: `Sunset Reignites the Dawn`,
    desc: [
      `Gain the "Scorching Brilliance" effect when using an Elemental Skill or Burst: CRIT DMG increased by 20% and ATK increased by 28% for 6s. This effect can trigger once every 10s.`,
      `While a "Scorching Brilliance" instance is active, its duration is increased by 2s after Normal or Charged attacks deal Elemental DMG. This effect can trigger once every second, and the max duration increase is 6s.`,
      `Additionally, when the equipping character is in the Nightsoul's Blessing state, "Scorching Brilliance" effects are increased by 75%, and its duration will not count down when the equipping character is off-field.`,
    ],
  },
  
  [`Starcaller's Watch`]: {
    type: "Catalyst",
    base: { ATK: 542 },
    substat: "Elemental Mastery: 265",
    subtitle: `Offering Unto Wind and Sun`,
    desc: [
      `Increases Elemental Mastery by 100. Gain the "Mirror of Night" effect within 15s after the equipping character creates a shield: The current active party member deals 28% increased DMG to nearby opponents. You can gain the "Mirror of Night" effect once every 14s.`,
    ],
  },
  
  // Version 5.2
  [`Astral Vulture's Crimson Plumage`]: {
    type: "Bow",
    base: { ATK: 608 },
    substat: "CRIT DMG: 66.2",
    subtitle: `The Moonring Sighted`,
    desc: [
      `For 12s after triggering a Swirl reaction, ATK increases by 24%. In addition, when 1/2 or more characters in the party are of a different Elemental Type from the equipping character, the DMG dealt by the equipping character's Charged Attacks is increased by 20%/48% and Elemental Burst DMG dealt is increased by 10%/24%.`,
    ],
  },
  
  [`Calamity of Eshu`]: {
    type: "Sword",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Diffusing Boundary`,
    desc: [
      `While characters are protected by a Shield, DMG dealt by Normal and Charged Attacks is increased by 20%, and Normal and Charged Attack CRIT Rate is increased by 8%.`,
    ],
  },
  
  [`Flower-Wreathed Feathers`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Waveriding Whirl`]: {
    type: "Catalyst",
    base: { ATK: 454 },
    substat: "Energy Recharge: 61.3",
    subtitle: `Fangs Flying To and Fro`,
    desc: [
      `Decreases Swimming Stamina consumption by 15%. In addition, for 10s after using an Elemental Skill, Max HP is increased by 20%. For every Hydro Elemental Type character in the party, Max HP is increased by another 12%, and the maximum increase that can be achieved in this way is 24%. Can be triggered once every 15s.`,
    ],
  },
  
  // Version 5.1
  [`Fruitful Hook`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `The Weight of Falling Branches`,
    desc: [
      `Increase Plunging Attack CRIT Rate by 16%; After a Plunging Attack hits an opponent, Normal, Charged, and Plunging Attack DMG increased by 16% for 10s.`,
    ],
  },
  
  [`Mountain-Bracing Bolt`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Hope Beyond the Peaks`,
    desc: [
      `Decreases Climbing Stamina Consumption by 15% and increases Elemental Skill DMG by 12%. Also, after other nearby party members use Elemental Skills, the equipping character's Elemental Skill DMG will also increase by 12% for 8s.`,
    ],
  },
  
  [`Peak Patrol Song`]: {
    type: "Sword",
    base: { ATK: 542 },
    substat: "DEF%: 82.7",
    subtitle: `Halcyon Years Unending`,
    desc: [
      `Gain "Ode to Flowers" after Normal or Plunging Attacks hit an opponent: DEF increases by 8% and gain a 10% All Elemental DMG Bonus for 6s. Max 2 stacks. Can trigger once per 0.1s. When this effect reaches 2 stacks or the 2nd stack's duration is refreshed, increase all nearby party members' All Elemental DMG Bonus by 8% for every 1,000 DEF the equipping character has, up to a maximum of 25.6%, for 15s.`,
    ],
  },
  
  [`Sturdy Bone`]: {
    type: "Sword",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Trapper's Pride`,
    desc: [
      `Sprint or Alternate Sprint Stamina Consumption decreased by 15%. Additionally, after using Sprint or Alternate Sprint, Normal Attack DMG is increased by 16% of ATK. This effect expires after triggering 18 times or 7s.`,
    ],
  },
  
  // Version 5.0
  [`Ash-Graven Drinking Horn`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "HP%: 41.3",
    subtitle: `Tupac's Grip`,
    desc: [
      `When an attack hits an opponent, deal AoE DMG equal to 40% of Max HP at the target location. This effect can be triggered once every 15s.`,
    ],
  },
  
  [`Chain Breaker`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "ATK%%: 27.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Earth Shaker`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Oath of Qhapaq Nan`,
    desc: [
      `After a party member triggers a Pyro-related reaction, the equipping character's Elemental Skill DMG is increased by 16% for 8s. This effect can be triggered even when the triggering party member is not on the field.`,
    ],
  },
  
  [`Fang of the Mountain King`]: {
    type: "Claymore",
    base: { ATK: 741 },
    substat: "CRIT Rate: 11",
    subtitle: `Turquoise Hunt`,
    desc: [
      `Gain 1 stack of Canopy's Favor after hitting an opponent with an Elemental Skill. This can be triggered once every 0.5s. After a nearby party member triggers a Burning or Burgeon reaction, the equipping character will gain 3 stacks. This effect can be triggered once every 2s and can be triggered even when the triggering party member is off-field. Canopy's Favor: Elemental Skill and Burst DMG is increased by 10% for 6s. Max 6 stacks. Each stack is counted independently.`,
    ],
  },
  
  [`Flute of Ezpitzal`]: {
    type: "Sword",
    base: { ATK: 454 },
    substat: "DEF%: 69",
    subtitle: `Smoke-and-Mirror Mystery`,
    desc: [
      `Using an Elemental Skill increases DEF by 16% for 15s.`,
    ],
  },
  
  [`Footprint of the Rainbow`]: {
    type: "Polearm",
    base: { ATK: 510 },
    substat: "DEF%: 51.7",
    subtitle: `Pact of Flowing Springs`,
    desc: [
      `Using an Elemental Skill increases DEF by 16% for 15s.`,
    ],
  },
  
  [`Ring of Yaxche`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "HP%: 41.3",
    subtitle: `Echoes of the Plentiful Land`,
    desc: [
      `Using an Elemental Skill grants the Jade-Forged Crown effect: Every 1,000 Max HP will increase the Normal Attack DMG dealt by the equipping character by 0.6% for 10s. Normal Attack DMG can be increased this way by a maximum of 16%.`,
    ],
  },
  
  [`Surf's Up`]: {
    type: "Catalyst",
    base: { ATK: 542 },
    substat: "CRIT DMG: 88.2",
    subtitle: `Aqua Remembrance`,
    desc: [
      `Max HP increased by 20%. Once every 15s, for the 14s after using an Elemental Skill: Gain 4 Scorching Summer stacks. Each stack increases Normal Attack DMG by 12%. For the duration of the effect, once every 1.5s, lose 1 stack after a Normal Attack hits an opponent; once every 1.5s, gain 1 stack after triggering a Vaporize reaction on an opponent. Max 4 Scorching Summer stacks.`,
    ],
  },
  
  // Version 4.8
  [`Lumidouce Elegy`]: {
    type: "Polearm",
    base: { ATK: 608 },
    substat: "CRIT Rate: 33.1",
    subtitle: `Bright Dawn Overture`,
    desc: [
      `ATK increased by 15%. After the equipping character triggers Burning on an opponent or deals Dendro DMG to Burning opponents, the DMG dealt is increased by 18%. This effect lasts for 8s, max 2 stacks. When 2 stacks are reached or when the duration is refreshed at 2 stacks, restore 12 Energy. Energy can be restored this way once every 12s. The 2 aforementioned effects can be triggered even when the character is off-field.`,
    ],
  },
  
  // Version 4.7
  [`Absolution`]: {
    type: "Sword",
    base: { ATK: 674 },
    substat: "CRIT DMG: 44.1",
    subtitle: `Deathly Pact`,
    desc: [
      `CRIT DMG increased by 20%. Increasing the value of a Bond of Life increases the DMG the equipping character deals by 16% for 6s. Max 3 stacks.`,
    ],
  },
  
  [`Cloudforged`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Silvershower Heartstrings`]: {
    type: "Bow",
    base: { ATK: 542 },
    substat: "HP%: 66.2",
    subtitle: `Dryas's Nocturne`,
    desc: [
      `The equipping character can gain the Remedy effect. When they possess 1/2/3 Remedy stacks, Max HP will increase by 12%/24%/40%. 1 stack may be gained when the following conditions are met: 1 stack for 25s when using an Elemental Skill; 1 stack for 25s when the value of a Bond of Life value increases; 1 stack for 20s for performing healing. Stacks can still be triggered when the equipping character is not on the field. Each stack's duration is counted independently. In addition, when 3 stacks are active, Elemental Burst CRIT Rate will be increased by 28%. This effect will be canceled 4s after falling under 3 stacks.`,
    ],
  },
  
  // Version 4.6
  [`Crimson Moon's Semblance`]: {
    type: "Polearm",
    base: { ATK: 674 },
    substat: "CRIT Rate: 22.1",
    subtitle: `Ashen Sun's Shadow`,
    desc: [
      `Grants a Bond of Life equal to 25% of Max HP when a Charged Attack hits an opponent. This effect can be triggered up to once every 14s. In addition, when the equipping character has a Bond of Life, they gain a 12% DMG Bonus; if the value of the Bond of Life is greater than or equal to 30% of Max HP, then gain an additional 24% DMG Bonus.`,
    ],
  },
  
  // Version 4.5
  [`Dialogues of the Desert Sages`]: {
    type: "Polearm",
    base: { ATK: 510 },
    substat: "HP%: 41.3",
    subtitle: `Principle of Equilibrium`,
    desc: [
      `When the wielder performs healing, restore 8 Energy. This effect can be triggered once every 10s and can occur even when the character is not on the field.`,
    ],
  },
  
  [`Uraku Misugiri`]: {
    type: "Sword",
    base: { ATK: 542 },
    substat: "CRIT DMG: 88.2",
    subtitle: `Brocade Bloom, Shrine Sword`,
    desc: [
      `Normal Attack DMG is increased by 16% and Elemental Skill DMG is increased by 24%. After a nearby active character deals Geo DMG, the aforementioned effects increase by 100% for 15s. Additionally, the wielder's DEF is increased by 20%.`,
    ],
  },
  
  // Version 4.4
  [`Crane's Echoing Call`]: {
    type: "Catalyst",
    base: { ATK: 741 },
    substat: "ATK%: 16.5",
    subtitle: `Cloudfall Axiom`,
    desc: [
      `After the equipping character hits an opponent with a Plunging Attack, all nearby party members' Plunging Attacks will deal 28% increased DMG for 20s. When nearby party members hit opponents with Plunging Attacks, they will restore 2.5 Energy to the equipping character. Energy can be restored this way every 0.7s. This energy regain effect can be triggered even if the equipping character is not on the field.`,
    ],
  },
  
  // Version 4.3
  [`"Ultimate Overlord's Mega Magic Sword"`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Melussistance!`,
    desc: [
      `ATK increased by 12%. That's not all! The support from all Melusines you've helped in Merusea Village fills you with strength! Based on the number of them you've helped, your ATK is increased by up to an additional 12%.`,
    ],
  },
  
  [`Verdict`]: {
    type: "Claymore",
    base: { ATK: 674 },
    substat: "CRIT Rate: 22.1",
    subtitle: `Many Oaths of Dawn and Dusk`,
    desc: [
      `Increases ATK by 20%. When party members obtain Elemental Shards from Crystallize reactions, the equipping character will gain 1 Seal, increasing Elemental Skill DMG by 18%. The Seal lasts for 15s, and the equipper may have up to 2 Seals at once. All of the equipper's Seals will disappear 0.2s after their Elemental Skill deals DMG.`,
    ],
  },
  
  // Version 4.2
  [`Splendor of Tranquil Waters`]: {
    type: "Sword",
    base: { ATK: 542 },
    substat: "CRIT DMG: 88.2",
    subtitle: `Dawn and Dusk by the Lake`,
    desc: [
      `When the equipping character's current HP increases or decreases, Elemental Skill DMG dealt will be increased by 8% for 6s. Max 3 stacks. This effect can be triggered once every 0.2s. When other party members' current HP increases or decreases, the equipping character's Max HP will be increased by 14% for 6s. Max 2 stacks. This effect can be triggered once every 0.2s. The aforementioned effects can be triggered even if the wielder is off-field.`,
    ],
  },
  
  [`Sword of Narzissenkreuz`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `Hero's Blade`,
    desc: [
      `When the equipping character does not have an Arkhe: When Normal Attacks, Charged Attacks, or Plunging Attacks strike, a Pneuma or Ousia energy blast will be unleashed, dealing 160% of ATK as DMG. This effect can be triggered once every 12s. The energy blast type is determined by the current type of the Sword of Narzissenkreuz.`,
    ],
  },
  
  // Version 4.1
  [`Ballad of the Boundless Blue`]: {
    type: "Catalyst",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Azure Skies`,
    desc: [
      `Within 6s after Normal or Charged Attacks hit an opponent, Normal Attack DMG will be increased by 8% and Charged Attack DMG will be increased by 6%. Max 3 stacks. This effect can be triggered once every 0.3s.`,
    ],
  },
  
  [`Cashflow Supervision`]: {
    type: "Catalyst",
    base: { ATK: 674 },
    substat: "CRIT Rate: 22.1",
    subtitle: `Golden Blood-Tide`,
    desc: [
      `ATK is increased by 16%. When current HP increases or decreases, Normal Attack DMG will be increased by 16% and Charged Attack DMG will be increased by 14% for 4s. Max 3 stacks. This effect can be triggered once every 0.3s. When the wielder has 3 stacks, ATK SPD will be increased by 8%.`,
    ],
  },
  
  [`Portable Power Saw`]: {
    type: "Claymore",
    base: { ATK: 454 },
    substat: "HP%: 55.1",
    subtitle: `Sea Shanty`,
    desc: [
      `When the wielder is healed or heals others, they will gain a Stoic's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Roused effect will be granted for 10s. For each Symbol consumed, gain 40 Elemental Mastery, and 2s after the effect occurs, 2 Energy per Symbol consumed will be restored for said character. The Roused effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.`,
    ],
  },
  
  [`Prospector's Drill`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Masons' Ditty`,
    desc: [
      `When the wielder is healed or heals others, they will gain a Unity's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Struggle effect will be granted for 10s. For each Symbol consumed, gain 3% ATK and 7% All Elemental DMG Bonus. The Struggle effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.`,
    ],
  },
  
  [`Range Gauge`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`The Dockhand's Assistant`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "HP%: 41.3",
    subtitle: `Sea Shanty`,
    desc: [
      `When the wielder is healed or heals others, they will gain a Stoic's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Roused effect will be granted for 10s. For each Symbol consumed, gain 40 Elemental Mastery, and 2s after the effect occurs, 2 Energy per Symbol consumed will be restored for said character. The Roused effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.`,
    ],
  },
  
  [`Tome of the Eternal Flow`]: {
    type: "Catalyst",
    base: { ATK: 542 },
    substat: "CRIT DMG: 88.2",
    subtitle: `Aeon Wave`,
    desc: [
      `HP is increased by 16%. When current HP increases or decreases, Charged Attack DMG will be increased by 14% for 4s. Max 3 stacks. This effect can be triggered once every 0.3s. When the character has 3 stacks or a third stack's duration refreshes, 8 Energy will be restored. This Energy restoration effect can be triggered once every 12s.`,
    ],
  },
  
  // Version 4.0
  [`Ballad of the Fjords`]: {
    type: "Polearm",
    base: { ATK: 510 },
    substat: "Energy Recharge: 27.6",
    subtitle: `Tales of the Tundra`,
    desc: [
      `When there are at least 3 different Elemental Types in your party, Elemental Mastery will be increased by 120.`,
    ],
  },
  
  [`Finale of the Deep`]: {
    type: "Sword",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `An End Sublime`,
    desc: [
      `When using an Elemental Skill, ATK will be increased by 12% for 15s, and a Bond of Life worth 25% of Max HP will be granted. This effect can be triggered once every 10s. When the Bond of Life is cleared, a maximum of 150 ATK will be gained based on 2.4% of the total amount of the Life Bond cleared, lasting for 15s.`,
    ],
  },
  
  [`Fleuve Cendre Ferryman`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "Energy Recharge: 45.9",
    subtitle: `Ironbone`,
    desc: [
      `Increases Elemental Skill CRIT Rate by 8%. Additionally, increases Energy Recharge by 16% for 5s after using an Elemental Skill.`,
    ],
  },
  
  [`Flowing Purity`]: {
    type: "Catalyst",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Unfinished Masterpiece`,
    desc: [
      `When using an Elemental Skill, All Elemental DMG Bonus will be increased by 8% for 15s, and a Bond of Life worth 24% of Max HP will be granted. This effect can be triggered once every 10s. When the Bond of Life is cleared, every 1,000 HP cleared in the process will provide 2% All Elemental DMG Bonus, up to a maximum of 12%. This effect lasts 15s.`,
    ],
  },
  
  [`Rightful Reward`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "HP%: 27.6",
    subtitle: `Tip of the Spear`,
    desc: [
      `When the wielder is healed, restore 8 Energy. This effect can be triggered once every 10s, and can occur even when the character is not on the field.`,
    ],
  },
  
  [`Sacrificial Jade`]: {
    type: "Catalyst",
    base: { ATK: 454 },
    substat: "CRIT Rate: 36.8",
    subtitle: `Jade Circulation`,
    desc: [
      `When not on the field for more than 5s, Max HP will be increased by 32% and Elemental Mastery will be increased by 40. These effects will be canceled after the wielder has been on the field for 10s.`,
    ],
  },
  
  [`Scion of the Blazing Sun`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "CRIT Rate: 18.4",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Song of Stillness`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Talking Stick`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "CRIT Rate: 18.4",
    subtitle: `"The Silver Tongue"`,
    desc: [
      `ATK will be increased by 16% for 15s after being affected by Pyro. This effect can be triggered once every 12s. All Elemental DMG Bonus will be increased by 12% for 15s after being affected by Hydro, Cryo, Electro, or Dendro. This effect can be triggered once every 12s.`,
    ],
  },
  
  [`The First Great Magic`]: {
    type: "Bow",
    base: { ATK: 608 },
    substat: "CRIT DMG: 66.2",
    subtitle: `Parsifal the Great`,
    desc: [
      `DMG dealt by Charged Attacks increased by 16%. For every party member with the same Elemental Type as the wielder (including the wielder themselves), gain 1 Gimmick stack. For every party member with a different Elemental Type from the wielder, gain 1 Theatrics stack. When the wielder has 1/2/3 or more Gimmick stacks, ATK will be increased by 16%/32%/48%. When the wielder has 1/2/3 or more Theatrics stacks, Movement SPD will be increased by 4%/7%/10%.`,
    ],
  },
  
  [`Tidal Shadow`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `White Cruising Wave`,
    desc: [
      `After the wielder is healed, ATK will be increased by 24% for 8s. This can be triggered even when the character is not on the field.`,
    ],
  },
  
  [`Wolf-Fang`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "CRIT Rate: 27.6",
    subtitle: `Northwind Wolf`,
    desc: [
      `DMG dealt by Elemental Skill and Elemental Burst is increased by 16%. When an Elemental Skill hits an opponent, its CRIT Rate will be increased by 2%. When an Elemental Burst hits an opponent, its CRIT Rate will be increased by 2%. Both of these effects last 10s separately, have 4 max stacks, and can be triggered once every 0.1s.`,
    ],
  },
  
  
  // Version 3.8
  
  // Version 3.7
  [`Ibis Piercer`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  // Version 3.6
  [`Jadefall's Splendor`]: {
    type: "Catalyst",
    base: { ATK: 608 },
    substat: "HP%: 49.6",
    subtitle: `Primordial Jade Regalia`,
    desc: [
      `For 3s after using an Elemental Burst or creating a shield, the equipping character can gain the Primordial Jade Regalia effect: Restore 4.5 Energy every 2.5s, and gain 0.3% Elemental DMG Bonus for their corresponding Elemental Type for every 1,000 Max HP they possess, up to 12%. Primordial Jade Regalia will still take effect even if the equipping character is not on the field.`,
    ],
  },
  
  // Version 3.5
  [`Beacon of the Reed Sea`]: {
    type: "Claymore",
    base: { ATK: 608 },
    substat: "CRIT Rate: 33.1",
    subtitle: `Desert Watch`,
    desc: [
      `After the character's Elemental Skill hits an opponent, their ATK will be increased by 20% for 8s. After the character takes DMG, their ATK will be increased by 20% for 8s. The 2 aforementioned effects can be triggered even when the character is not on the field. Additionally, when not protected by a shield, the character's Max HP will be increased by 32%.`,
    ],
  },
  
  [`Mailed Flower`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "Elemental Mastery: 110",
    subtitle: `Whispers of Wind and Flower`,
    desc: [
      `Within 8s after the character's Elemental Skill hits an opponent or the character triggers an Elemental Reaction, their ATK and Elemental Mastery will be increased by 12% and 48 respectively.`,
    ],
  },
  
  // Version 3.4
  [`Light of Foliar Incision`]: {
    type: "Sword",
    base: { ATK: 542 },
    substat: "CRIT DMG: 88.2",
    subtitle: `Whitemoon Bristle`,
    desc: [
      `CRIT Rate is increased by 4%. After Normal Attacks deal Elemental DMG, the Foliar Incision effect will be obtained, increasing DMG dealt by Normal Attacks and Elemental Skills by 120% of Elemental Mastery. This effect will disappear after 28 DMG instances or 12s. You can obtain Foliar Incision once every 12s.`,
    ],
  },
  
  // Version 3.3
  [`Toukabou Shigure`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: `Kaidan: Rainfall Earthbinder`,
    desc: [
      `After an attack hits opponents, it will inflict an instance of Cursed Parasol upon one of them for 10s. This effect can be triggered once every 15s. If this opponent is defeated during Cursed Parasol's duration, Cursed Parasol's CD will be refreshed immediately. The character wielding this weapon will deal 16% more DMG to the opponent affected by Cursed Parasol.`,
    ],
  },
  
  [`Tulaytullah's Remembrance`]: {
    type: "Catalyst",
    base: { ATK: 674 },
    substat: "CRIT DMG: 44.1",
    subtitle: `Bygone Azure Teardrop`,
    desc: [
      `Normal Attack SPD is increased by 10%. After the wielder unleashes an Elemental Skill, Normal Attack DMG will increase by 4.8% every second for 14s. After hitting an opponent with a Normal Attack during this duration, Normal Attack DMG will be increased by 9.6%. This increase can be triggered once every 0.3s. The maximum Normal Attack DMG increase per single duration of the overall effect is 48%. The effect will be removed when the wielder leaves the field, and using the Elemental Skill again will reset all DMG buffs.`,
    ],
  },
  
  // Version 3.2
  [`A Thousand Floating Dreams`]: {
    type: "Catalyst",
    base: { ATK: 542 },
    substat: "Elemental Mastery: 265",
    subtitle: `A Thousand Nights' Dawnsong`,
    desc: [
      `Party members other than the equipping character will provide the equipping character with buffs based on whether their Elemental Type is the same as the latter or not. If their Elemental Types are the same, increase Elemental Mastery by 32. If not, increase the equipping character's DMG Bonus from their Elemental Type by 10%. Each of the aforementioned effects can have up to 3 stacks. Additionally, all nearby party members other than the equipping character will have their Elemental Mastery increased by 40. Multiple such effects from multiple such weapons can stack.`,
    ],
  },
  
  // Version 3.1
  [`Key of Khaj-Nisut`]: {
    type: "Sword",
    base: { ATK: 542 },
    substat: "HP%: 66.2",
    subtitle: `Sunken Song of the Sands`,
    desc: [
      `HP increased by 20%. When an Elemental Skill hits opponents, you gain the Grand Hymn effect for 20s. This effect increases the equipping character's Elemental Mastery by 0.12% of their Max HP. This effect can trigger once every 0.3s. Max 3 stacks. When this effect gains 3 stacks, or when the third stack's duration is refreshed, the Elemental Mastery of all nearby party members will be increased by 0.2% of the equipping character's max HP for 20s.`,
    ],
  },
  
  [`Makhaira Aquamarine`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: `Desert Pavilion`,
    desc: [
      `The following effect will trigger every 10s: The equipping character will gain 24% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.`,
    ],
  },
  
  [`Missive Windspear`]: {
    type: "Polearm",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `The Wind Unattained`,
    desc: [
      `Within 10s after an Elemental Reaction is triggered, ATK is increased by 12% and Elemental Mastery is increased by 48.`,
    ],
  },
  
  [`Staff of the Scarlet Sands`]: {
    type: "Polearm",
    base: { ATK: 542 },
    substat: "CRIT Rate: 44.1",
    subtitle: `Heat Haze at Horizon's End`,
    desc: [
      `The equipping character gains 52% of their Elemental Mastery as bonus ATK. When an Elemental Skill hits opponents, the Dream of the Scarlet Sands effect will be gained for 10s: The equipping character will gain 28% of their Elemental Mastery as bonus ATK. Max 3 stacks.`,
    ],
  },
  
  [`Wandering Evenstar`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: `Wildling Nightstar`,
    desc: [
      `The following effect will trigger every 10s: The equipping character will gain 24% of their Elemental Mastery as bonus ATK for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.`,
    ],
  },
  
  [`Xiphos' Moonlight`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: `Jinni's Whisper`,
    desc: [
      `The following effect will trigger every 10s: The equipping character will gain 0.036% Energy Recharge for each point of Elemental Mastery they possess for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.`,
    ],
  },
  
  // Version 3.0
  [`End of the Line`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "Energy Recharge: 45.9",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Forest Regalia`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Forest Sanctuary`,
    desc: [
      `After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character 60 Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.`,
    ],
  },
  
  [`Fruit of Fulfillment`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "Energy Recharge: 45.9",
    subtitle: `Full Circle`,
    desc: [
      `Obtain the "Wax and Wane" effect after an Elemental Reaction is triggered, gaining 24 Elemental Mastery while losing 5% ATK. For every 0.3s, 1 stack of Wax and Wane can be gained. Max 5 stacks. For every 6s that go by without an Elemental Reaction being triggered, 1 stack will be lost. This effect can be triggered even when the character is off-field.`,
    ],
  },
  
  [`Hunter's Path`]: {
    type: "Bow",
    base: { ATK: 542 },
    substat: "CRIT Rate: 44.1",
    subtitle: `At the End of the Beast-Paths`,
    desc: [
      `Gain 12% All Elemental DMG Bonus. Obtain the Tireless Hunt effect after hitting an opponent with a Charged Attack. This effect increases Charged Attack DMG by 160% of Elemental Mastery. This effect will be removed after 12 Charged Attacks or 10s. Only 1 instance of Tireless Hunt can be gained every 12s.`,
    ],
  },
  
  [`King's Squire`]: {
    type: "Bow",
    base: { ATK: 454 },
    substat: "ATK%: 55.1",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Moonpiercer`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "Elemental Mastery: 110",
    subtitle: `Stillwood Moonshadow`,
    desc: [
      `After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Revival will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character 16% ATK for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field.`,
    ],
  },
  
  [`Sapwood Blade`]: {
    type: "Sword",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Forest Sanctuary`,
    desc: [
      `After triggering Burning, Quicken, Aggravate, Spread, Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character 60 Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.`,
    ],
  },
  
  // Version 2.8
  [`Kagotsurube Isshin`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `Isshin Art Clarity`,
    desc: [
      `When a Normal, Charged, or Plunging Attack hits an opponent, it will whip up a Hewing Gale, dealing AoE DMG equal to 180% of ATK and increasing ATK by 15% for 8s. This effect can be triggered once every 8s.`,
    ],
  },
  
  // Version 2.7
  [`Aqua Simulacra`]: {
    type: "Bow",
    base: { ATK: 542 },
    substat: "CRIT DMG: 88.2",
    subtitle: `The Cleansing Form`,
    desc: [
      `HP is increased by 16%. When there are opponents nearby, the DMG dealt by the wielder of this weapon is increased by 20%. This will take effect whether the character is on-field or not.`,
    ],
  },
  
  [`Fading Twilight`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  // Version 2.6
  [`Haran Geppaku Futsu`]: {
    type: "Sword",
    base: { ATK: 608 },
    substat: "CRIT Rate: 33.1",
    subtitle: `Honed Flow`,
    desc: [
      `Obtain 12% All Elemental DMG Bonus. When other nearby party members use Elemental Skills, the character equipping this weapon will gain 1 Wavespike stack. Max 2 stacks. This effect can be triggered once every 0.3s. When the character equipping this weapon uses an Elemental Skill, all stacks of Wavespike will be consumed to gain Rippling Upheaval: each stack of Wavespike consumed will increase Normal Attack DMG by 20% for 8s.`,
    ],
  },
  
  // Version 2.5
  [`Kagura's Verity`]: {
    type: "Catalyst",
    base: { ATK: 608 },
    substat: "CRIT DMG: 66.2",
    subtitle: `Kagura Dance of the Sacred Sakura`,
    desc: [
      `Gains the Kagura Dance effect when using an Elemental Skill, causing the Elemental Skill DMG of the character wielding this weapon to increase by 12% for 16s. Max 3 stacks. This character will gain 12% All Elemental DMG Bonus when they possess 3 stacks.`,
    ],
  },
  
  [`Oathsworn Eye`]: {
    type: "Catalyst",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `People of the Faltering Light`,
    desc: [
      `Increases Energy Recharge by 24% for 10s after using an Elemental Skill.`,
    ],
  },
  
  // Version 2.4
  [`Calamity Queller`]: {
    type: "Polearm",
    base: { ATK: 741 },
    substat: "ATK%: 16.5",
    subtitle: `Extinguishing Precept`,
    desc: [
      `Gain 12% All Elemental DMG Bonus. Obtain Consummation for 20s after using an Elemental Skill, causing ATK to increase by 3.2% per second. This ATK increase has a maximum of 6 stacks. When the character equipped with this weapon is not on the field, Consummation's ATK increase is doubled.`,
    ],
  },
  
  // Version 2.3
  [`Cinnabar Spindle`]: {
    type: "Sword",
    base: { ATK: 454 },
    substat: "DEF%: 69",
    subtitle: `Spotless Heart`,
    desc: [
      `Elemental Skill DMG is increased by 40% of DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.`,
    ],
  },
  
  [`Redhorn Stonethresher`]: {
    type: "Claymore",
    base: { ATK: 542 },
    substat: "CRIT DMG: 88.2",
    subtitle: `Gokadaiou Otogibanashi`,
    desc: [
      `DEF is increased by 28%. Normal and Charged Attack DMG is increased by 40% of DEF.`,
    ],
  },
  
  // Version 2.2
  [`Akuoumaru`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `Watatsumi Wavewalker`,
    desc: [
      `For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12%. A maximum of 40% increased Elemental Burst DMG can be achieved this way.`,
    ],
  },
  
  [`Mouun's Moon`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Polar Star`]: {
    type: "Bow",
    base: { ATK: 608 },
    substat: "CRIT Rate: 33.1",
    subtitle: `Daylight's Augury`,
    desc: [
      `Elemental Skill and Elemental Burst DMG increased by 12%. After a Normal Attack, Charged Attack, Elemental Skill or Elemental Burst hits an opponent, 1 stack of Ashen Nightstar will be gained for 12s. When 1/2/3/4 stacks of Ashen Nightstar are present, ATK is increased by 10/20/30/48%. The stack of Ashen Nightstar created by the Normal Attack, Charged Attack, Elemental Skill or Elemental Burst will be counted independently of the others.`,
    ],
  },
  
  [`Wavebreaker's Fin`]: {
    type: "Polearm",
    base: { ATK: 620 },
    substat: "ATK%: 13.8",
    subtitle: `Watatsumi Wavewalker`,
    desc: [
      `For every point of the entire party's combined maximum Energy capacity, the Elemental Burst DMG of the character equipping this weapon is increased by 0.12%. A maximum of 40% increased Elemental Burst DMG can be achieved this way.`,
    ],
  },
  
  // Version 2.1
  [`Engulfing Lightning`]: {
    type: "Polearm",
    base: { ATK: 608 },
    substat: "Energy Recharge: 55.1",
    subtitle: `Timeless Dream: Eternal Stove`,
    desc: [
      `ATK increased by 28% of Energy Recharge over the base 100%. You can gain a maximum bonus of 80% ATK. Gain 30% Energy Recharge for 12s after using an Elemental Burst.`,
    ],
  },
  
  [`Everlasting Moonglow`]: {
    type: "Catalyst",
    base: { ATK: 608 },
    substat: "HP%: 49.6",
    subtitle: `Byakuya Kougetsu`,
    desc: [
      `Healing Bonus increased by 10%, Normal Attack DMG is increased by 1% of the Max HP of the character equipping this weapon. For 12s after using an Elemental Burst, Normal Attacks that hit opponents will restore 0.6 Energy. Energy can be restored this way once every 0.1s.`,
    ],
  },
  
  [`Luxurious Sea-Lord`]: {
    type: "Claymore",
    base: { ATK: 454 },
    substat: "ATK%: 55.1",
    subtitle: `Oceanic Victory`,
    desc: [
      `Increases Elemental Burst DMG by 12%. When Elemental Burst hits opponents, there is a 100% chance of summoning a huge onrush of tuna that deals 100% ATK as AoE DMG. This effect can occur once every 15s.`,
    ],
  },
  
  [`Predator`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`"The Catch"`]: {
    type: "Polearm",
    base: { ATK: 510 },
    substat: "Energy Recharge: 45.9",
    subtitle: `Shanty`,
    desc: [
      `Increases Elemental Burst DMG by 16% and Elemental Burst CRIT Rate by 6%.`,
    ],
  },
  
  // Version 2.0
  [`Amenoma Kageuchi`]: {
    type: "Sword",
    base: { ATK: 454 },
    substat: "ATK%: 55.1",
    subtitle: `Iwakura Succession`,
    desc: [
      `After casting an Elemental Skill, gain 1 Succession Seed. This effect can be triggered once every 5s. The Succession Seed lasts for 30s. Up to 3 Succession Seeds may exist simultaneously. After using an Elemental Burst, all Succession Seeds are consumed and after 2s, the character regenerates 6 Energy for each seed consumed.`,
    ],
  },
  
  [`Hakushin Ring`]: {
    type: "Catalyst",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Sakura Saiguu`,
    desc: [
      `After the character equipped with this weapon triggers an Electro elemental reaction, nearby party members of an Elemental Type involved in the elemental reaction receive a 10% Elemental DMG Bonus for their element, lasting 6s. Elemental Bonuses gained in this way cannot be stacked.`,
    ],
  },
  
  [`Hamayumi`]: {
    type: "Bow",
    base: { ATK: 454 },
    substat: "ATK%: 55.1",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Katsuragikiri Nagamasa`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "Energy Recharge: 45.9",
    subtitle: `Samurai Conduct`,
    desc: [
      `Increases Elemental Skill DMG by 6%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates 3 Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered even when the character is not on the field.`,
    ],
  },
  
  [`Kitain Cross Spear`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "Elemental Mastery: 110",
    subtitle: `Samurai Conduct`,
    desc: [
      `Increases Elemental Skill DMG by 6%. After Elemental Skill hits an opponent, the character loses 3 Energy but regenerates 3 Energy every 2s for the next 6s. This effect can occur once every 10s. Can be triggered even when the character is not on the field.`,
    ],
  },
  
  [`Mistsplitter Reforged`]: {
    type: "Sword",
    base: { ATK: 674 },
    substat: "CRIT DMG: 44.1",
    subtitle: `Mistsplitter's Edge`,
    desc: [
      `Gain a 12% Elemental DMG Bonus for all elements and receive the might of the Mistsplitter's Emblem. At stack levels 1/2/3, the Mistsplitter's Emblem provides a 8/16/28% Elemental DMG Bonus for the character's Elemental Type. The character will obtain 1 stack of Mistsplitter's Emblem in each of the following scenarios: Normal Attack deals Elemental DMG (stack lasts 5s), casting Elemental Burst (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.`,
    ],
  },
  
  [`Thundering Pulse`]: {
    type: "Bow",
    base: { ATK: 608 },
    substat: "CRIT DMG: 66.2",
    subtitle: `Rule by Thunder`,
    desc: [
      `Increases ATK by 20% and grants the might of the Thunder Emblem. At stack levels 1/2/3, the Thunder Emblem increases Normal Attack DMG by 12/24/40%. The character will obtain 1 stack of Thunder Emblem in each of the following scenarios: Normal Attack deals DMG (stack lasts 5s), casting Elemental Skill (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.`,
    ],
  },
  
  // Version 1.6
  [`Dodoco Tales`]: {
    type: "Catalyst",
    base: { ATK: 454 },
    substat: "ATK%: 55.1",
    subtitle: `Dodoventure!`,
    desc: [
      `Normal Attack hits on opponents increase Charged Attack DMG by 16% for 6s. Charged Attack hits on opponents increase ATK by 8% for 6s.`,
    ],
  },
  
  [`Freedom-Sworn`]: {
    type: "Sword",
    base: { ATK: 608 },
    substat: "Elemental Mastery: 198",
    subtitle: `Revolutionary Chorale`,
    desc: [
      `A part of the "Millennial Movement" that wanders amidst the winds. Increases DMG by 10%. When the character wielding this weapon triggers Elemental Reactions, they gain a Sigil of Rebellion. This effect can be triggered once every 0.5s and can be triggered even if said character is not on the field. When you possess 2 Sigils of Rebellion, all of them will be consumed and all nearby party members will obtain "Millennial Movement: Song of Resistance" for 12s. "Millennial Movement: Song of Resistance" increases Normal, Charged and Plunging Attack DMG by 16% and increases ATK by 20%. Once this effect is triggered, you will not gain Sigils of Rebellion for 20s. Of the many effects of the "Millennial Movement," buffs of the same type will not stack.`,
    ],
  },
  
  [`Mitternachts Waltz`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "Physical DMG: 51.7",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  // Version 1.5
  [`Song of Broken Pines`]: {
    type: "Claymore",
    base: { ATK: 741 },
    substat: "Physical DMG: 20.7",
    subtitle: `Rebel's Banner-Hymn`,
    desc: [
      `A part of the "Millennial Movement" that wanders amidst the winds. Increases ATK by 16%, and when Normal or Charged Attacks hit opponents, the character gains a Sigil of Whispers. This effect can be triggered once every 0.3s. When you possess 4 Sigils of Whispers, all of them will be consumed and all nearby party members will obtain the "Millennial Movement: Banner-Hymn" effect for 12s. "Millennial Movement: Banner-Hymn" increases Normal ATK SPD by 12% and increases ATK by 20%. Once this effect is triggered, you will not gain Sigils of Whispers for 20s. Of the many effects of the "Millennial Movement," buffs of the same type will not stack.`,
    ],
  },
  
  // Version 1.4
  [`Alley Hunter`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Elegy for the End`]: {
    type: "Bow",
    base: { ATK: 608 },
    substat: "Energy Recharge: 55.1",
    subtitle: `The Parting Refrain`,
    desc: [
      `A part of the "Millennial Movement" that wanders amidst the winds. Increases Elemental Mastery by 60. When the Elemental Skills or Elemental Bursts of the character wielding this weapon hit opponents, that character gains a Sigil of Remembrance. This effect can be triggered once every 0.2s and can be triggered even if said character is not on the field. When you possess 4 Sigils of Remembrance, all of them will be consumed and all nearby party members will obtain the "Millennial Movement: Farewell Song" effect for 12s. "Millennial Movement: Farewell Song" increases Elemental Mastery by 100 and increases ATK by 20%. Once this effect is triggered, you will not gain Sigils of Remembrance for 20s. Of the many effects of the "Millennial Movement," buffs of the same type will not stack.`,
    ],
  },
  
  [`The Alley Flash`]: {
    type: "Sword",
    base: { ATK: 620 },
    substat: "Elemental Mastery: 55",
    subtitle: `Itinerant Hero`,
    desc: [
      `Increases DMG dealt by the character equipping this weapon by 12%. Taking DMG disables this effect for 5s.`,
    ],
  },
  
  [`Windblume Ode`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Wine and Song`]: {
    type: "Catalyst",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Ever-Changing`,
    desc: [
      `Hitting an opponent with a Normal Attack decreases the Stamina consumption of Sprint or Alternate Sprint by 14% for 5s. Additionally, using a Sprint or Alternate Sprint ability increases ATK by 20% for 5s.`,
    ],
  },
  
  // Version 1.3
  [`Lithic Blade`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `Lithic Axiom: Unity`,
    desc: [
      `For every character in the party who hails from Liyue, the character who equips this weapon gains a 7% ATK increase and a 3% CRIT Rate increase. This effect stacks up to 4 times.`,
    ],
  },
  
  [`Lithic Spear`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Lithic Axiom: Unity`,
    desc: [
      `For every character in the party who hails from Liyue, the character who equips this weapon gains a 7% ATK increase and a 3% CRIT Rate increase. This effect stacks up to 4 times.`,
    ],
  },
  
  [`Primordial Jade Cutter`]: {
    type: "Sword",
    base: { ATK: 542 },
    substat: "CRIT Rate: 44.1",
    subtitle: `Protector's Virtue`,
    desc: [
      `HP increased by 20%. Additionally, provides an ATK Bonus based on 1.2% of the wielder's Max HP.`,
    ],
  },
  
  [`Staff of Homa`]: {
    type: "Polearm",
    base: { ATK: 608 },
    substat: "CRIT DMG: 66.2",
    subtitle: `Reckless Cinnabar`,
    desc: [
      `HP increased by 20%. Additionally, provides an ATK Bonus based on 0.8% of the wielder's Max HP. When the wielder's HP is less than 50%, this ATK Bonus is increased by an additional 1% of Max HP.`,
    ],
  },
  
  // Version 1.2
  [`Dragonspine Spear`]: {
    type: "Polearm",
    base: { ATK: 454 },
    substat: "Physical DMG: 69",
    subtitle: `Frost Burial`,
    desc: [
      `Hitting an opponent with Normal and Charged Attacks has a 60% chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to 80% of ATK. Opponents affected by Cryo are instead dealt DMG equal to 200% of ATK. Can only occur once every 10s.`,
    ],
  },
  
  [`Festering Desire`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "Energy Recharge: 45.9",
    subtitle: `Undying Admiration`,
    desc: [
      `Increases Elemental Skill DMG by 16% and Elemental Skill CRIT Rate by 6%.`,
    ],
  },
  
  [`Frostbearer`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `Frost Burial`,
    desc: [
      `Hitting an opponent with Normal and Charged Attacks has a 60% chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to 80% of ATK. Opponents affected by Cryo are instead dealt DMG equal to 200% of ATK. Can only occur once every 10s.`,
    ],
  },
  
  [`Snow-Tombed Starsilver`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "Physical DMG: 34.5",
    subtitle: `Frost Burial`,
    desc: [
      `Hitting an opponent with Normal and Charged Attacks has a 60% chance of forming and dropping an Everfrost Icicle above them, dealing AoE DMG equal to 80% of ATK. Opponents affected by Cryo are instead dealt DMG equal to 200% of ATK. Can only occur once every 10s.`,
    ],
  },
  
  [`Summit Shaper`]: {
    type: "Sword",
    base: { ATK: 608 },
    substat: "ATK%: 49.6",
    subtitle: `Golden Majesty`,
    desc: [
      `Increases Shield Strength by 20%. Scoring hits on opponents increases ATK by 4% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.`,
    ],
  },
  
  // Version 1.1
  [`Memory of Dust`]: {
    type: "Catalyst",
    base: { ATK: 608 },
    substat: "ATK%: 49.6",
    subtitle: `Golden Majesty`,
    desc: [
      `Increases Shield Strength by 20%. Scoring hits on opponents increases ATK by 4% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.`,
    ],
  },
  
  [`Royal Spear`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Focus`,
    desc: [
      `Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.`,
    ],
  },
  
  [`The Unforged`]: {
    type: "Claymore",
    base: { ATK: 608 },
    substat: "ATK%: 49.6",
    subtitle: `Golden Majesty`,
    desc: [
      `Increases Shield Strength by 20%. Scoring hits on opponents increases ATK by 4% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.`,
    ],
  },
  
  [`Vortex Vanquisher`]: {
    type: "Polearm",
    base: { ATK: 608 },
    substat: "ATK%: 49.6",
    subtitle: `Golden Majesty`,
    desc: [
      `Increases Shield Strength by 20%. Scoring hits on opponents increases ATK by 4% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.`,
    ],
  },
  
  // Version 1.0
  [`Amos' Bow`]: {
    type: "Bow",
    base: { ATK: 608 },
    substat: "ATK%: 49.6",
    subtitle: `Strong-Willed`,
    desc: [
      `Increases Normal and Charged Attack DMG by 12%. After a Normal or Charged Attack is fired, DMG dealt increases by a further 8% every 0.1s the arrow is in the air for up to 5 times.`,
    ],
  },
  
  [`Aquila Favonia`]: {
    type: "Sword",
    base: { ATK: 674 },
    substat: "Physical DMG: 41.3",
    subtitle: `Falcon's Defiance`,
    desc: [
      `ATK is increased by 20%. Triggers on taking DMG: the soul of the Falcon of the West awakens, holding the banner of resistance aloft, regenerating HP equal to 100% of ATK and dealing 200% of ATK as DMG to surrounding opponents. This effect can only occur once every 15s.`,
    ],
  },
  
  [`Black Tassel`]: {
    type: "Polearm",
    base: { ATK: 354 },
    substat: "HP%: 46.9",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Blackcliff Agate`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "CRIT DMG: 55.1",
    subtitle: `Press the Advantage`,
    desc: [
      `After defeating an enemy, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.`,
    ],
  },
  
  [`Blackcliff Longsword`]: {
    type: "Sword",
    base: { ATK: 565 },
    substat: "CRIT DMG: 36.8",
    subtitle: `Press the Advantage`,
    desc: [
      `After defeating an opponent, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.`,
    ],
  },
  
  [`Blackcliff Pole`]: {
    type: "Polearm",
    base: { ATK: 510 },
    substat: "CRIT DMG: 55.1",
    subtitle: `Press the Advantage`,
    desc: [
      `After defeating an enemy, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.`,
    ],
  },
  
  [`Blackcliff Slasher`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "CRIT DMG: 55.1",
    subtitle: `Press the Advantage`,
    desc: [
      `After defeating an opponent, ATK is increased by 12% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.`,
    ],
  },
  
  [`Blackcliff Warbow`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "CRIT DMG: 36.8",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Bloodtainted Greatsword`]: {
    type: "Claymore",
    base: { ATK: 354 },
    substat: "Elemental Mastery: 187",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Compound Bow`]: {
    type: "Bow",
    base: { ATK: 454 },
    substat: "Physical DMG: 69",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Cool Steel`]: {
    type: "Sword",
    base: { ATK: 401 },
    substat: "ATK%: 35.2",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Crescent Pike`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "Physical DMG: 34.5",
    subtitle: `Infusion Needle`,
    desc: [
      `After picking up an Elemental Orb/Particle, Normal and Charged Attacks deal additional DMG equal to 20% of ATK for 5s.`,
    ],
  },
  
  [`Dark Iron Sword`]: {
    type: "Sword",
    base: { ATK: 401 },
    substat: "Elemental Mastery: 141",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Deathmatch`]: {
    type: "Polearm",
    base: { ATK: 454 },
    substat: "CRIT Rate: 36.8",
    subtitle: `Gladiator`,
    desc: [
      `If there are at least 2 opponents nearby, ATK is increased by 16% and DEF is increased by 16%. If there are fewer than 2 opponents nearby, ATK is increased by 24%.`,
    ],
  },
  
  [`Debate Club`]: {
    type: "Claymore",
    base: { ATK: 401 },
    substat: "ATK%: 35.2",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Dragon's Bane`]: {
    type: "Polearm",
    base: { ATK: 454 },
    substat: "Elemental Mastery: 221",
    subtitle: `Bane of Flame and Water`,
    desc: [
      `Increases DMG against opponents affected by Hydro or Pyro by 20%.`,
    ],
  },
  
  [`Emerald Orb`]: {
    type: "Catalyst",
    base: { ATK: 448 },
    substat: "Elemental Mastery: 94",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Eye of Perception`]: {
    type: "Catalyst",
    base: { ATK: 454 },
    substat: "ATK%: 55.1",
    subtitle: `Echo`,
    desc: [
      `Normal and Charged Attacks have a 50% chance to fire a Bolt of Perception, dealing 240% ATK as DMG. This bolt can bounce between opponents a maximum of 4 times. This effect can occur once every 12s.`,
    ],
  },
  
  [`Favonius Codex`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "Energy Recharge: 45.9",
    subtitle: `Windfall`,
    desc: [
      `CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.`,
    ],
  },
  
  [`Favonius Greatsword`]: {
    type: "Claymore",
    base: { ATK: 454 },
    substat: "Energy Recharge: 61.3",
    subtitle: `Windfall`,
    desc: [
      `CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.`,
    ],
  },
  
  [`Favonius Lance`]: {
    type: "Polearm",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Windfall`,
    desc: [
      `CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.`,
    ],
  },
  
  [`Favonius Sword`]: {
    type: "Sword",
    base: { ATK: 454 },
    substat: "Energy Recharge: 61.3",
    subtitle: `Windfall`,
    desc: [
      `CRIT Hits have a 60% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12s.`,
    ],
  },
  
  [`Favonius Warbow`]: {
    type: "Bow",
    base: { ATK: 454 },
    substat: "Energy Recharge: 61.3",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Ferrous Shadow`]: {
    type: "Claymore",
    base: { ATK: 401 },
    substat: "HP%: 35.2",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Fillet Blade`]: {
    type: "Sword",
    base: { ATK: 401 },
    substat: "ATK%: 35.2",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Halberd`]: {
    type: "Polearm",
    base: { ATK: 448 },
    substat: "ATK%: 23.5",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Harbinger of Dawn`]: {
    type: "Sword",
    base: { ATK: 401 },
    substat: "CRIT DMG: 46.9",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Iron Sting`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: `Infusion Stinger`,
    desc: [
      `Dealing Elemental DMG increases all DMG by 6% for 6s. Max 2 stacks. Can occur once every 1s.`,
    ],
  },
  
  [`Lion's Roar`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `Bane of Fire and Thunder`,
    desc: [
      `Increases DMG against opponents affected by Pyro or Electro by 20%.`,
    ],
  },
  
  [`Lost Prayer to the Sacred Winds`]: {
    type: "Catalyst",
    base: { ATK: 608 },
    substat: "CRIT Rate: 33.1",
    subtitle: `Boundless Blessing`,
    desc: [
      `Increases Movement SPD by 10%. When in battle, gain an 8% Elemental DMG Bonus every 4s. Max 4 stacks. Lasts until the character falls or leaves combat.`,
    ],
  },
  
  [`Magic Guide`]: {
    type: "Catalyst",
    base: { ATK: 354 },
    substat: "Elemental Mastery: 187",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Mappa Mare`]: {
    type: "Catalyst",
    base: { ATK: 565 },
    substat: "Elemental Mastery: 110",
    subtitle: `Infusion Scroll`,
    desc: [
      `Triggering an Elemental reaction grants a 8% Elemental DMG Bonus for 10s. Max 2 stacks.`,
    ],
  },
  
  [`Messenger`]: {
    type: "Bow",
    base: { ATK: 448 },
    substat: "CRIT Rate: 31.2",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Otherworldly Story`]: {
    type: "Catalyst",
    base: { ATK: 401 },
    substat: "Energy Recharge: 39",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Primordial Jade Winged-Spear`]: {
    type: "Polearm",
    base: { ATK: 674 },
    substat: "CRIT Rate: 22.1",
    subtitle: `Eagle Spear of Justice`,
    desc: [
      `On hit, increases ATK by 3.2% for 6s. Max 7 stacks. This effect can only occur once every 0.3s. While in possession of the maximum possible stacks, DMG dealt is increased by 12%.`,
    ],
  },
  
  [`Prototype Amber`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "HP%: 41.3",
    subtitle: `Gilding`,
    desc: [
      `Using an Elemental Burst regenerates 4 Energy every 2s for 6s. All party members will regenerate 4% HP every 2s for this duration.`,
    ],
  },
  
  [`Prototype Archaic`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Crush`,
    desc: [
      `On hit, Normal or Charged Attacks have a 50% chance to deal an additional 240% ATK DMG to opponents within a small AoE. Can only occur once every 15s.`,
    ],
  },
  
  [`Prototype Crescent`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Prototype Rancour`]: {
    type: "Sword",
    base: { ATK: 565 },
    substat: "Physical DMG: 34.5",
    subtitle: `Smashed Stone`,
    desc: [
      `On hit, Normal or Charged Attacks increase ATK and DEF by 4% for 6s. Max 4 stacks. This effect can only occur once every 0.3s.`,
    ],
  },
  
  [`Prototype Starglitter`]: {
    type: "Polearm",
    base: { ATK: 510 },
    substat: "Energy Recharge: 45.9",
    subtitle: `Magic Affinity`,
    desc: [
      `After using an Elemental Skill, increases Normal and Charged Attack DMG by 8% for 12s. Max 2 stacks.`,
    ],
  },
  
  [`Rainslasher`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: `Bane of Storm and Tide`,
    desc: [
      `Increases DMG against opponents affected by Hydro or Electro by 20%.`,
    ],
  },
  
  [`Raven Bow`]: {
    type: "Bow",
    base: { ATK: 448 },
    substat: "Elemental Mastery: 94",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Recurve Bow`]: {
    type: "Bow",
    base: { ATK: 354 },
    substat: "HP%: 46.9",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Royal Bow`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Royal Greatsword`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Focus`,
    desc: [
      `Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.`,
    ],
  },
  
  [`Royal Grimoire`]: {
    type: "Catalyst",
    base: { ATK: 565 },
    substat: "ATK%: 27.6",
    subtitle: `Focus`,
    desc: [
      `Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.`,
    ],
  },
  
  [`Royal Longsword`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `Focus`,
    desc: [
      `Upon damaging an opponent, increases CRIT Rate by 8%. Max 5 stacks. A CRIT Hit removes all stacks.`,
    ],
  },
  
  [`Rust`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Sacrificial Bow`]: {
    type: "Bow",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Sacrificial Fragments`]: {
    type: "Catalyst",
    base: { ATK: 454 },
    substat: "Elemental Mastery: 221",
    subtitle: `Composed`,
    desc: [
      `After damaging an opponent with an Elemental Skill, the skill has a 40% chance to end its own CD. Can only occur once every 30s.`,
    ],
  },
  
  [`Sacrificial Greatsword`]: {
    type: "Claymore",
    base: { ATK: 565 },
    substat: "Energy Recharge: 30.6",
    subtitle: `Composed`,
    desc: [
      `After damaging an opponent with an Elemental Skill, the skill has a 40% chance to end its own CD. Can only occur once every 30s.`,
    ],
  },
  
  [`Sacrificial Sword`]: {
    type: "Sword",
    base: { ATK: 454 },
    substat: "Energy Recharge: 61.3",
    subtitle: `Composed`,
    desc: [
      `After damaging an opponent with an Elemental Skill, the skill has a 40% chance to end its own CD. Can only occur once every 30s.`,
    ],
  },
  
  [`Serpent Spine`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "CRIT Rate: 27.6",
    subtitle: `Wavesplitter`,
    desc: [
      `Every 4s a character is on the field, they will deal 6% more DMG and take 3% more DMG. This effect has a maximum of 5 stacks and will not be reset if the character leaves the field, but will be reduced by 1 stack when the character takes DMG.`,
    ],
  },
  
  [`Sharpshooter's Oath`]: {
    type: "Bow",
    base: { ATK: 401 },
    substat: "CRIT DMG: 46.9",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Skyrider Greatsword`]: {
    type: "Claymore",
    base: { ATK: 401 },
    substat: "Physical DMG: 43.9",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Skyrider Sword`]: {
    type: "Sword",
    base: { ATK: 354 },
    substat: "Energy Recharge: 52.1",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Skyward Atlas`]: {
    type: "Catalyst",
    base: { ATK: 674 },
    substat: "ATK%: 33.1",
    subtitle: `Wandering Clouds`,
    desc: [
      `Increases Elemental DMG Bonus by 12%. Normal Attack hits have a 50% chance to earn the favor of the clouds, which actively seek out nearby opponents to attack for 15s, dealing 160% ATK DMG. Can only occur once every 30s.`,
    ],
  },
  
  [`Skyward Blade`]: {
    type: "Sword",
    base: { ATK: 608 },
    substat: "Energy Recharge: 55.1",
    subtitle: `Sky-Piercing Fang`,
    desc: [
      `CRIT Rate increased by 4%. Gains Skypiercing Might upon using an Elemental Burst: Increases Movement SPD by 10%, increases ATK SPD by 10%, and Normal and Charged hits deal additional DMG equal to 20% of ATK. Skypiercing Might lasts for 12s.`,
    ],
  },
  
  [`Skyward Harp`]: {
    type: "Bow",
    base: { ATK: 674 },
    substat: "CRIT Rate: 22.1",
    subtitle: `Echoing Ballad`,
    desc: [
      `Increases CRIT DMG by 20%. Hits have a 60% chance to inflict a small AoE attack, dealing 125% Physical ATK DMG. Can only occur once every 4s.`,
    ],
  },
  
  [`Skyward Pride`]: {
    type: "Claymore",
    base: { ATK: 674 },
    substat: "Energy Recharge: 36.8",
    subtitle: `Sky-ripping Dragon Spine`,
    desc: [
      `Increases all DMG by 8%. After using an Elemental Burst, a vacuum blade that does 80% of ATK as DMG to opponents along its path will be created when Normal or Charged Attacks hit. Lasts for 20s or 8 vacuum blades.`,
    ],
  },
  
  [`Skyward Spine`]: {
    type: "Polearm",
    base: { ATK: 674 },
    substat: "Energy Recharge: 36.8",
    subtitle: `Black Wing`,
    desc: [
      `Increases CRIT Rate by 8% and increases Normal ATK SPD by 12%. Additionally, Normal and Charged Attacks hits on opponents have a 50% chance to trigger a vacuum blade that deals 40% of ATK as DMG in a small AoE. This effect can occur no more than once every 2s.`,
    ],
  },
  
  [`Slingshot`]: {
    type: "Bow",
    base: { ATK: 354 },
    substat: "CRIT Rate: 31.2",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Solar Pearl`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "CRIT Rate: 27.6",
    subtitle: `Solar Shine`,
    desc: [
      `Normal Attack hits increase Elemental Skill and Elemental Burst DMG by 20% for 6s. Likewise, Elemental Skill or Elemental Burst hits increase Normal Attack DMG by 20% for 6s.`,
    ],
  },
  
  [`Sword of Descension`]: {
    type: "Sword",
    base: { ATK: 440 },
    substat: "ATK%: 35.2",
    subtitle: `Descension`,
    desc: [
      `Effective only on the following platform:`,
      `"PlayStation Network"`,
      `Hitting opponents with Normal and Charged Attacks grants a 50% chance to deal 200% ATK as DMG in a small AoE. This effect can only occur once every 10s. Additionally, if the Traveler equips the Sword of Descension, their ATK is increased by 66.`,
    ],
  },
  
  [`The Bell`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "HP%: 41.3",
    subtitle: `Rebellious Guardian`,
    desc: [
      `Taking DMG generates a shield which absorbs DMG up to 20% of Max HP. This shield lasts for 10s or until broken, and can only be triggered once every 45s. While protected by a shield, the character gains 12% increased DMG.`,
    ],
  },
  
  [`The Black Sword`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "CRIT Rate: 27.6",
    subtitle: `Justice`,
    desc: [
      `Increases DMG dealt by Normal and Charged Attacks by 20%. Additionally, regenerates 60% of ATK as HP when Normal and Charged Attacks score a CRIT Hit. This effect can occur once every 5s.`,
    ],
  },
  
  [`The Flute`]: {
    type: "Sword",
    base: { ATK: 510 },
    substat: "ATK%: 41.3",
    subtitle: `Chord`,
    desc: [
      `Normal or Charged Attacks grant a Harmonic on hits. Gaining 5 Harmonics triggers the power of music and deals 100% ATK DMG to surrounding opponents. Harmonics last up to 30s, and a maximum of 1 can be gained every 0.5s.`,
    ],
  },
  
  [`The Stringless`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "Elemental Mastery: 165",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`The Viridescent Hunt`]: {
    type: "Bow",
    base: { ATK: 510 },
    substat: "CRIT Rate: 27.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`The Widsith`]: {
    type: "Catalyst",
    base: { ATK: 510 },
    substat: "CRIT DMG: 55.1",
    subtitle: `Debut`,
    desc: [
      `When the character takes the field, they will gain a random theme song for 10s. This can only occur once every 30s. Recitative: ATK is increased by 60%. Aria: Increases all Elemental DMG by 48%. Interlude: Elemental Mastery is increased by 240.`,
    ],
  },
  
  [`Thrilling Tales of Dragon Slayers`]: {
    type: "Catalyst",
    base: { ATK: 401 },
    substat: "HP%: 35.2",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Traveler's Handy Sword`]: {
    type: "Sword",
    base: { ATK: 448 },
    substat: "DEF%: 29.3",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Twin Nephrite`]: {
    type: "Catalyst",
    base: { ATK: 448 },
    substat: "CRIT Rate: 15.6",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`White Iron Greatsword`]: {
    type: "Claymore",
    base: { ATK: 401 },
    substat: "DEF%: 43.9",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`White Tassel`]: {
    type: "Polearm",
    base: { ATK: 401 },
    substat: "CRIT Rate: 23.4",
    subtitle: ``,
    desc: [
      ``,
    ],
  },
  
  [`Whiteblind`]: {
    type: "Claymore",
    base: { ATK: 510 },
    substat: "DEF%: 51.7",
    subtitle: `Infusion Blade`,
    desc: [
      `On hit, Normal or Charged Attacks increase ATK and DEF by 6% for 6s. Max 4 stacks. This effect can only occur once every 0.5s.`,
    ],
  },
  
  [`Wolf's Gravestone`]: {
    type: "Claymore",
    base: { ATK: 608 },
    substat: "ATK%: 49.6",
    subtitle: `Wolfish Tracker`,
    desc: [
      `Increases ATK by 20%. On hit, attacks against opponents with less than 30% HP increase all party members' ATK by 40% for 12s. Can only occur once every 30s.`,
    ],
  },
};

export default WEAPONS;