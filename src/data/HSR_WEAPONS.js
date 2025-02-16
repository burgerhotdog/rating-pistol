const HSR_WEAPONS = {
  // Version 3.0
  [`Geniuses' Greetings`]: {
    type: "Remembrance",
    base: { HP: 953, ATK: 476, DEF: 331 },
    subtitle: `Congratulations`,
    desc: [
      `Increases the wearer's ATK by 16%. After the wearer uses Ultimate, increases the Basic ATK DMG dealt by the wearer and their memosprite by 20%, lasting for 3 turn(s).`,
    ],
  },

  [`Into the Unreachable Veil`]: {
    type: "Erudition",
    base: { HP: 952, ATK: 635, DEF: 463 },
    subtitle: `Mind Game`,
    desc: [
      `Increases the wearer's CRIT Rate by 12%. When the wearer uses Ultimate, increases the Skill and Ultimate DMG dealt by the wearer by 60%, lasting for 3 turn(s). After the wearer uses Ultimate, if this instance of Ultimate consumed 140 or more Energy, recovers 1 Skill Point.`,
    ],
  },

  [`Reminiscence`]: {
    type: "Remembrance",
    base: { HP: 635, ATK: 423, DEF: 264 },
    subtitle: `Going to Sleep`,
    desc: [
      `When memosprite's turn starts, the wearer and memosprite each gain 1 stack of "Commemoration." Each stack increases DMG dealt by 8%, stacking up to 4 time(s). When memosprite disappears, removes "Commemoration" from the wearer and memosprite.`,
    ],
  },

  [`Shadowburn`]: {
    type: "Remembrance",
    base: { HP: 846, ATK: 317, DEF: 264 },
    subtitle: `Beautify`,
    desc: [
      `When the wearer summons memosprite for the first time, recovers 1 Skill Point(s) and regenerates 12 Energy for this unit.`,
    ],
  },

  [`Sweat Now, Cry Less`]: {
    type: "Remembrance",
    base: { HP: 1058, ATK: 529, DEF: 198 },
    subtitle: `Come Train!`,
    desc: [
      `Increases the wearer's CRIT Rate by 12%. When the wearer's memosprite is on the field, increases the DMG dealt by the wearer and their memosprite by 24%.`,
    ],
  },

  [`Time Woven Into Gold`]: {
    type: "Remembrance",
    base: { HP: 1058, ATK: 635, DEF: 397 },
    subtitle: `Establishment`,
    desc: [
      `Increases the wearer's base SPD by 12. After the wearer and the wearer's memosprite attacks, the wearer gains 1 stack of "Brocade." Each stack of "Brocade" increases the wearer's and their memosprite's CRIT DMG by 9%, stacking up to 6 time(s). When reaching maximum stacks, each "Brocade" stack additionally increases Basic ATK DMG dealt by 9%.`,
    ],
  },

  [`Victory In a Blink`]: {
    type: "Remembrance",
    base: { HP: 952, ATK: 476, DEF: 396 },
    subtitle: `Final Hit`,
    desc: [
      `Increases the wearer's CRIT DMG by 12%. When the wearer's memosprite uses an ability on an ally target, increases the DMG dealt by all ally targets by 8%, lasting for 3 turn(s).`,
    ],
  },

  // Version 2.7
  [`A Grounded Ascent`]: {
    type: "Harmony",
    base: { HP: 1164, ATK: 476, DEF: 529 },
    subtitle: `Departing Anew`,
    desc: [
      `After the wearer uses Skill or Ultimate on one ally character, the wearer regenerates 6 Energy and the ability's target receives 1 stack of "Hymn" for 3 turn(s), stacking up to 3 time(s). Each stack of "Hymn" increases its holder's DMG dealt by 15%. After every 2 instance(s) of Skill or Ultimate the wearer uses on one ally character, recovers 1 Skill Point.`,
    ],
  },
  
  [`Long Road Leads Home`]: {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 661 },
    subtitle: `Rebirth`,
    desc: [
      `Increases the wearer's Break Effect by 60%. When an enemy target's Weakness gets broken, there is a 100% base chance to inflict the "Charring" state on it, which increases its Break DMG taken by 18%, lasting for 2 turn(s). This effect can stack 2 time(s).`,
    ],
  },
  
  // Version 2.6
  [`Dream's Montage`]: {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Academy-Style Edit`,
    desc: [
      `Increases the wearer's SPD by 8%. After attacking enemy targets that are Weakness Broken, regenerates 3 Energy. This effect can trigger up to 2 time(s) per turn.`,
    ],
  },
  
  [`Ninja Record: Sound Hunt`]: {
    type: "Destruction",
    base: { HP: 1058, ATK: 476, DEF: 264 },
    subtitle: `Curtains Up!`,
    desc: [
      `Increases the wearer's Max HP by 12%. When losing or restoring this unit's HP, increases CRIT DMG by 18%, lasting for 2 turn(s). This effect can only trigger once per turn.`,
    ],
  },
  
  [`Ninjutsu Inscription: Dazzling Evilbreaker`]: {
    type: "Erudition",
    base: { HP: 952, ATK: 582, DEF: 529 },
    subtitle: `Exorcism`,
    desc: [
      `Increases the wearer's Break Effect by 60%. When entering battle, immediately regenerates 30 Energy. After the wearer uses Ultimate, obtains "Raiton." After using 2 Basic ATKs, advances the wearer's action by 50% and removes "Raiton." After the wearer uses Ultimate, resets "Raiton."`,
    ],
  },
  
  // Version 2.5
  [`I Venture Forth to Hunt`]: {
    type: "The Hunt",
    base: { HP: 952, ATK: 635, DEF: 463 },
    subtitle: `Intimidation`,
    desc: [
      `Increases the wearer's CRIT Rate by 15%. When the wearer launches a follow-up attack, gains 1 stack of "Luminflux," stacking up to 2 time(s). Each stack of "Luminflux" enables the Ultimate DMG dealt by the wearer to ignore 27% of the target's DEF. When the wearer's turn ends, removes 1 stack of "Luminflux."`,
    ],
  },
  
  [`Scent Alone Stays True`]: {
    type: "Abundance",
    base: { HP: 1058, ATK: 529, DEF: 529 },
    subtitle: `Contentment`,
    desc: [
      `Increases the wearer's Break Effect by 60%. After the wearer uses Ultimate to attack enemy targets, inflicts the targets with the "Woefree" state, lasting for 2 turn(s). While in "Woefree," enemy targets take 10% increased DMG. The effect of increasing DMG taken is additionally boosted by 8% if the wearer's current Break Effect is 150% or higher.`,
    ],
  },
  
  [`Shadowed by Night`]: {
    type: "The Hunt",
    base: { HP: 846, ATK: 476, DEF: 396 },
    subtitle: `Concealment`,
    desc: [
      `Increases the wearer's Break Effect by 28%. When entering battle or after dealing Break DMG, increases SPD by 8%, lasting for 2 turn(s). This effect can only trigger once per turn.`,
    ],
  },
  
  // Version 2.4
  [`Dance at Sunset`]: {
    type: "Destruction",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Deeply Engrossed`,
    desc: [
      `Greatly increases the wearer's chance of getting attacked and increases CRIT DMG by 36%. After the wearer uses Ultimate, receives 1 stack of Firedance, lasting for 2 turns and stacking up to 2 time(s). Each stack of Firedance increases the DMG dealt by the wearer's follow-up attack by 36%.`,
    ],
  },
  
  [`Poised to Bloom`]: {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Lose Not, Forget Not`,
    desc: [
      `Increases the wearer's ATK by 16%. Upon entering battle, if two or more characters follow the same Path, then these characters' CRIT DMG increases by 16%. Abilities of the same type cannot stack.`,
    ],
  },
  
  [`Those Many Springs`]: {
    type: "Nihility",
    base: { HP: 952, ATK: 582, DEF: 529 },
    subtitle: `Worldly Affairs Leave No Mark`,
    desc: [
      `Increases the wearer's Effect Hit Rate by 60%. After the wearer uses Basic ATK, Skill, or Ultimate to attack an enemy target, there is a 60% base chance to inflict "Unarmored" on the target. While in the Unarmored state, the enemy target receives 10% increased DMG, lasting for 2 turn(s). If the target is under a DoT state inflicted by the wearer, there is a 60% base chance to upgrade the "Unarmored" state inflicted by the wearer to the "Cornered" state, which additionally increases the DMG the enemy target receives by 14%, lasting for 2 turn(s). During this period, the wearer cannot inflict "Unarmored" on the target.`,
    ],
  },
  
  // Version 2.3
  [`After the Charmony Fall`]: {
    type: "Erudition",
    base: { HP: 846, ATK: 476, DEF: 396 },
    subtitle: `Quiescence`,
    desc: [
      `Increases the wearer's Break Effect by 28%. After the wearer uses Ultimate, increases SPD by 8%, lasting for 2 turn(s).`,
    ],
  },
  
  [`Eternal Calculus`]: {
    type: "Erudition",
    base: { HP: 1058, ATK: 529, DEF: 396 },
    subtitle: `Boundless Thought`,
    desc: [
      `Increases the wearer's ATK by 8%. After using an attack, for each enemy target hit, additionally increases ATK by 4%. This effect can stack up to 5 times and last until the next attack. If there are 3 or more enemy targets hit, this unit's SPD increases by 8%, lasting for 1 turn(s).`,
    ],
  },
  
  [`Whereabouts Should Dreams Rest`]: {
    type: "Destruction",
    base: { HP: 1164, ATK: 476, DEF: 529 },
    subtitle: `Metamorphosis`,
    desc: [
      `Increases the wearer's Break Effect by 60%. When the wearer deals Break DMG to an enemy target, inflicts Routed on the enemy, lasting for 2 turn(s). Targets afflicted with Routed receive 24% increased Break DMG from the wearer, and their SPD is lowered by 20%. Effects of the same type cannot be stacked.`,
    ],
  },
  
  [`Yet Hope Is Priceless`]: {
    type: "Erudition",
    base: { HP: 952, ATK: 582, DEF: 529 },
    subtitle: `Promise`,
    desc: [
      `Increases the wearer's CRIT Rate by 16%. While the wearer is in battle, for every 20% CRIT DMG that exceeds 120%, the DMG dealt by follow-up attack increases by 12%. This effect can stack up to 4 time(s). When the battle starts or after the wearer uses their Basic ATK, enables the DMG dealt by Ultimate or follow-up attack to ignore 20% of the target's DEF, lasting for 2 turn(s).`,
    ],
  },
  
  // Version 2.2
  [`Boundless Choreo`]: {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Scrutinize`,
    desc: [
      `Increase the wearer's CRIT Rate by 8%. The wearer deals 24% more CRIT DMG to enemies that are currently Slowed or have reduced DEF.`,
    ],
  },
  
  [`Flowing Nightglow`]: {
    type: "Harmony",
    base: { HP: 952, ATK: 635, DEF: 463 },
    subtitle: `Pacify`,
    desc: [
      `Every time an ally attacks, the wearer gains 1 stack of Cantillation. Each stack of Cantillation increases the wearer's Energy Regeneration Rate by 3%, stacking up to 5 time(s). When the wearer uses their Ultimate, removes Cantillation and gains Cadenza. Cadenza increases the Wearer's ATK by 48% and increases all allies' DMG dealt by 24%, lasting for 1 turn(s).`,
    ],
  },
  
  [`For Tomorrow's Journey`]: {
    type: "Harmony",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Bonds`,
    desc: [
      `Increases the wearer's ATK by 16%. After the wearer uses their Ultimate, increases their DMG dealt by 18%, lasting for 1 turn(s).`,
    ],
  },
  
  [`Sailing Towards A Second Life`]: {
    type: "The Hunt",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Rough Water`,
    desc: [
      `Increases the wearer's Break Effect by 60%. The Break DMG dealt by the wearer ignores 20% of the target's DEF. When the wearer's Break Effect in battle is at 150% or greater, increases their SPD by 12%.`,
    ],
  },
  
  // Version 2.1
  [`Along the Passing Shore`]: {
    type: "Nihility",
    base: { HP: 1058, ATK: 635, DEF: 396 },
    subtitle: `Steerer`,
    desc: [
      `Increases the wearer's CRIT DMG by 36%. When the wearer hits an enemy target, inflicts Mirage Fizzle on the enemy, lasting for 1 turn. Each time the wearer attacks, this effect can only trigger 1 time on each target. The wearer deals 24% increased DMG to targets afflicted with Mirage Fizzle, and the DMG dealt by Ultimate additionally increases by 24%.`,
    ],
  },
  
  [`Concert for Two`]: {
    type: "Preservation",
    base: { HP: 952, ATK: 370, DEF: 463 },
    subtitle: `Inspire`,
    desc: [
      `Increases the wearer's DEF by 16%. For every on-field character that has a Shield, the DMG dealt by the wearer increases by 4%.`,
    ],
  },
  
  [`Inherently Unjust Destiny`]: {
    type: "Preservation",
    base: { HP: 1058, ATK: 423, DEF: 661 },
    subtitle: `All-In`,
    desc: [
      `Increases the wearer's DEF by 40%. When the wearer provides a Shield to an ally, the wearer's CRIT DMG increases by 40%, lasting for 2 turn(s). When the wearer's follow-up attack hits an enemy target, there is a 100% base chance to increase the DMG taken by the attacked enemy target by 10%, lasting for 2 turn(s).`,
    ],
  },
  
  // Version 2.0
  [`Destiny's Threads Forewoven`]: {
    type: "Preservation",
    base: { HP: 952, ATK: 370, DEF: 463 },
    subtitle: `Insight`,
    desc: [
      `Increases the wearer's Effect RES by 12%. For every 100 of DEF the wearer has, increases the wearer's DMG dealt by 0.8%, up to a maximum DMG increase of 32%.`,
    ],
  },
  
  [`Dreamville Adventure`]: {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Solidarity`,
    desc: [
      `After the wearer uses a certain type of ability such as Basic ATK, Skill, or Ultimate, all allies gain Childishness, which increases allies' DMG for the same type of ability as used by the wearer by 12%. Childishness only takes effect for the most recent type of ability the wearer used and cannot be stacked.`,
    ],
  },
  
  [`Earthly Escapade`]: {
    type: "Harmony",
    base: { HP: 1164, ATK: 529, DEF: 463 },
    subtitle: `Capriciousness`,
    desc: [
      `Increases the wearer's CRIT DMG by 32%. At the start of the battle, the wearer gains Mask, lasting for 3 turn(s). While the wearer has Mask, the wearer's teammates have their CRIT Rate increased by 10% and their CRIT DMG increased by 28%. For every 1 Skill Point the wearer recovers (including Skill Points that exceed the limit), they gain 1 stack of Radiant Flame. And when the wearer has 4 stacks of Radiant Flame, all the stacks are removed, and they gain Mask, lasting for 4 turn(s).`,
    ],
  },
  
  [`Final Victor`]: {
    type: "The Hunt",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Wager`,
    desc: [
      `Increases the wearer's ATK by 12%. When the wearer lands a CRIT hit on enemies, gains 1 stack of Good Fortune. This can stack up to 4 time(s). Every stack of Good Fortune increases the wearer's CRIT DMG by 8%. Good Fortune will be removed at the end of the wearer's turn.`,
    ],
  },
  
  [`Flames Afar`]: {
    type: "Destruction",
    base: { HP: 1058, ATK: 476, DEF: 264 },
    subtitle: `Deflagration`,
    desc: [
      `When the wearer's cumulative HP loss during one attack exceeds 25% of their Max HP, or if the amount of their own HP consumed at one time is greater than 25% of their Max HP, immediately heals the wearer for 15% of their Max HP, and at the same time, increases the DMG they deal by 25% for 2 turn(s). This effect can only be triggered once every 3 turn(s).`,
    ],
  },
  
  [`Indelible Promise`]: {
    type: "Destruction",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Inheritance`,
    desc: [
      `Increases the wearer's Break Effect by 28%. When the wearer uses their Ultimate, increases CRIT Rate by 15%, lasting for 2 turn(s).`,
    ],
  },
  
  [`It's Showtime`]: {
    type: "Nihility",
    base: { HP: 1058, ATK: 476, DEF: 264 },
    subtitle: `Self-Amusement`,
    desc: [
      `When the wearer inflicts a debuff on an enemy, gains a stack of Trick. Every stack of Trick increases the wearer's DMG dealt by 6%, stacking up to 3 time(s). This effect lasts for 1 turn(s). When the wearer's Effect Hit Rate is 80% or higher, increases ATK by 20%.`,
    ],
  },
  
  [`Reforged Remembrance`]: {
    type: "Nihility",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Crystallize`,
    desc: [
      `Increases the wearer's Effect Hit Rate by 40%. When the wearer deals DMG to an enemy inflicted with Wind Shear, Burn, Shock, or Bleed, each respectively grants 1 stack of Prophet, stacking up to 4 time(s). In a single battle, only 1 stack of Prophet can be granted for each type of DoT. Every stack of Prophet increases wearer's ATK by 5% and enables the DoT dealt to ignore 7.2% of the target's DEF.`,
    ],
  },
  
  [`The Day The Cosmos Fell`]: {
    type: "Erudition",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Stratagem`,
    desc: [
      `Increases the wearer's ATK by 16%. When the wearer uses an attack and at least 2 attacked enemies have the corresponding Weakness, the wearer's CRIT DMG increases by 20%, lasting for 2 turn(s).`,
    ],
  },
  
  [`What Is Real?`]: {
    type: "Abundance",
    base: { HP: 1058, ATK: 423, DEF: 330 },
    subtitle: `Hypothesis`,
    desc: [
      `Increases the wearer's Break Effect by 24%. After using Basic ATK, restores HP for the wearer by an amount equal to 2% of Max HP plus 800.`,
    ],
  },
  
  // Version 1.6
  [`Baptism of Pure Thought`]: {
    type: "The Hunt",
    base: { HP: 952, ATK: 582, DEF: 529 },
    subtitle: `Mental Training`,
    desc: [
      `Increases the wearer's CRIT DMG by 20%. For every debuff on the enemy target, the wearer's CRIT DMG dealt against this target additionally increases by 8%, stacking up to 3 times. When using Ultimate to attack the enemy target, the wearer receives the Disputation effect, which increases DMG dealt by 36% and enables their follow-up attacks to ignore 24% of the target's DEF. This effect lasts for 2 turns.`,
    ],
  },
  
  [`Past Self in Mirror`]: {
    type: "Harmony",
    base: { HP: 1058, ATK: 529, DEF: 529 },
    subtitle: `The Plum Fragrance In My Bones`,
    desc: [
      `Increases the wearer's Break Effect by 60%. When the wearer uses their Ultimate, increases all allies' DMG by 24%, lasting for 3 turn(s). Should the wearer's Break Effect exceed or equal 150%, 1 Skill Point will be recovered.`,
      `At the start of each wave, all allies regenerate 10 Energy immediately. Abilities of the same type cannot stack.`,
    ],
  },
  
  // Version 1.5
  [`An Instant Before A Gaze`]: {
    type: "Erudition",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `A Knight's Pilgrimage`,
    desc: [
      `Increases the wearer's CRIT DMG by 36%. When the wearer uses Ultimate, increases DMG dealt by the wearer's Ultimate based on their Max Energy. Each point of Energy increases DMG dealt by Ultimate by 0.36%. A max of 180 points of Energy will be taken into account for this.`,
    ],
  },
  
  [`Hey, Over Here`]: {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `I'm Not Afraid!`,
    desc: [
      `Increases the wearer's Max HP by 8%. When the wearer uses their Skill, increases Outgoing Healing by 16%, lasting for 2 turn(s).`,
    ],
  },
  
  [`Night of Fright`]: {
    type: "Abundance",
    base: { HP: 1164, ATK: 476, DEF: 529 },
    subtitle: `Deep, Deep Breaths`,
    desc: [
      `Increases the wearer's Energy Regeneration Rate by 12%. When any ally uses their Ultimate, the wearer restores HP for the ally currently with the lowest HP percentage by an amount equal to 10% of the healed ally's Max HP. When the wearer provides healing for an ally, increases the healed ally's ATK by 2.4%. This effect can stack up to 5 times and lasts for 2 turn(s).`,
    ],
  },
  
  // Version 1.4
  [`I Shall Be My Own Sword`]: {
    type: "Destruction",
    base: { HP: 1164, ATK: 582, DEF: 396 },
    subtitle: `With This Evening Jade`,
    desc: [
      `Increases the wearer's CRIT DMG by 20%. When a teammate gets attacked or loses HP, the wearer gains 1 stack of Eclipse, up to a max of 3 stack(s). Each stack of Eclipse increases the DMG of the wearer's next attack by 14%. When 3 stack(s) are reached, additionally enables that attack to ignore 12% of the enemy's DEF. This effect will be removed after the wearer uses an attack.`,
    ],
  },
  
  [`Worrisome, Blissful`]: {
    type: "The Hunt",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `One At A Time`,
    desc: [
      `Increase the wearer's CRIT Rate by 18% and increases DMG dealt by follow-up attack by 30%. After the wearer uses a follow-up attack, inflicts the target with the Tame state, stacking up to 2 time(s). When allies hit enemy targets under the Tame state, each Tame stack increases the CRIT DMG dealt by 12%.`,
    ],
  },
  
  // Version 1.3
  [`Brighter Than the Sun`]: {
    type: "Destruction",
    base: { HP: 1058, ATK: 635, DEF: 396 },
    subtitle: `Defiant Till Death`,
    desc: [
      `Increases the wearer's CRIT Rate by 18%. When the wearer uses their Basic ATK, they will gain 1 stack of Dragon's Call, lasting for 2 turns. Each stack of Dragon's Call increases the wearer's ATK by 18% and Energy Regeneration Rate by 6%. Dragon's Call can be stacked up to 2 times.`,
    ],
  },
  
  [`She Already Shut Her Eyes`]: {
    type: "Preservation",
    base: { HP: 1270, ATK: 423, DEF: 529 },
    subtitle: `Visioscape`,
    desc: [
      `Increases the wearer's Max HP by 24% and Energy Regeneration Rate by 12%. When the wearer's HP is reduced, all allies' DMG dealt increases by 9%, lasting for 2 turn(s).`,
      `At the start of every wave, restores HP to all allies by an amount equal to 80% of their respective lost HP.`,
    ],
  },
  
  [`Solitary Healing`]: {
    type: "Nihility",
    base: { HP: 1058, ATK: 529, DEF: 396 },
    subtitle: `Chaos Elixir`,
    desc: [
      `Increases the wearer's Break Effect by 20%. When the wearer uses their Ultimate, increases DoT dealt by the wearer by 24%, lasting for 2 turn(s). When a target enemy suffering from DoT imposed by the wearer is defeated, regenerates 4 Energy for the wearer.`,
    ],
  },
  
  // Version 1.2
  [`Patience Is All You Need`]: {
    type: "Nihility",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Spider Web`,
    desc: [
      `Increases DMG dealt by the wearer by 24%. After every attack launched by wearer, their SPD increases by 4.8%, stacking up to 3 times.`,
      `If the wearer hits an enemy target that is not afflicted by Erode, there is a 100% base chance to inflict Erode to the target. Enemies afflicted with Erode are also considered to be Shocked and will receive Lightning DoT at the start of each turn equal to 60% of the wearer's ATK, lasting for 1 turn(s).`,
    ],
  },
  
  [`The Unreachable Side`]: {
    type: "Destruction",
    base: { HP: 1270, ATK: 582, DEF: 330 },
    subtitle: `Unfulfilled Yearning`,
    desc: [
      `Increases the wearer's CRIT Rate by 18% and increases their Max HP by 18%. When the wearer is attacked or consumes their own HP, their DMG increases by 24%. This effect is removed after the wearer uses an attack.`,
    ],
  },
  
  // Version 1.1
  [`Before the Tutorial Mission Starts`]: {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Quick on the Draw`,
    desc: [
      `Increases the wearer's Effect Hit Rate by 20%. When the wearer attacks DEF-reduced enemies, regenerates 4 Energy.`,
    ],
  },
  
  [`Echoes of the Coffin`]: {
    type: "Abundance",
    base: { HP: 1164, ATK: 582, DEF: 396 },
    subtitle: `Thorns`,
    desc: [
      `Increases the wearer's ATK by 24%. After the wearer uses an attack, for each different enemy target the wearer hits, regenerates 3 Energy. Each attack can regenerate Energy up to 3 time(s) this way. After the wearer uses their Ultimate, all allies gain 12 SPD for 1 turn.`,
    ],
  },
  
  [`Incessant Rain`]: {
    type: "Nihility",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Mirage of Reality`,
    desc: [
      `Increases the wearer's Effect Hit Rate by 24%. When the wearer deals DMG to an enemy that currently has 3 or more debuffs, increases the wearer's CRIT Rate by 12%. After the wearer uses their Basic ATK, Skill, or Ultimate, there is a 100% base chance to implant Aether Code on a random hit target that does not yet have it. Targets with Aether Code receive 12% increased DMG for 1 turn.`,
    ],
  },
  
  // Version 1.0
  [`Adversarial`]: {
    type: "The Hunt",
    base: { HP: 740, ATK: 370, DEF: 264 },
    subtitle: `Alliance`,
    desc: [
      `When the wearer defeats an enemy, increases SPD by 10% for 2 turn(s).`,
    ],
  },
  
  [`Amber`]: {
    type: "Preservation",
    base: { HP: 846, ATK: 264, DEF: 330 },
    subtitle: `Stasis`,
    desc: [
      `Increases the wearer's DEF by 16%. If the wearer's current HP percentage is lower than 50%, increases their DEF by a further 16%.`,
    ],
  },
  
  [`Arrows`]: {
    type: "The Hunt",
    base: { HP: 846, ATK: 317, DEF: 264 },
    subtitle: `Crisis`,
    desc: [
      `At the start of the battle, the wearer's CRIT Rate increases by 12% for 3 turn(s).`,
    ],
  },
  
  [`A Secret Vow`]: {
    type: "Destruction",
    base: { HP: 1058, ATK: 476, DEF: 264 },
    subtitle: `Spare No Effort`,
    desc: [
      `Increases DMG dealt by the wearer by 20%. The wearer also deals an extra 20% of DMG to enemies whose current HP percentage is equal to or higher than the wearer's current HP percentage.`,
    ],
  },
  
  [`Before Dawn`]: {
    type: "Erudition",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Long Night`,
    desc: [
      `Increases the wearer's CRIT DMG by 36%. Increases DMG dealt by the wearer's Skill and Ultimate by 18%. After the wearer uses Skill or Ultimate, gains Somnus Corpus. Upon triggering a follow-up attack, consumes Somnus Corpus, and increases DMG dealt by follow-up attack by 48%.`,
    ],
  },
  
  [`But the Battle Isn't Over`]: {
    type: "Harmony",
    base: { HP: 1164, ATK: 529, DEF: 463 },
    subtitle: `Heir`,
    desc: [
      `Increases the wearer's Energy Regeneration Rate by 10% and regenerates 1 Skill Point when the wearer uses their Ultimate on an ally. This effect can be triggered once after every 2 uses of the wearer's Ultimate. When the wearer uses their Skill, the next ally taking action (except the wearer) deals 30% more DMG for 1 turn(s).`,
    ],
  },
  
  [`Carve the Moon, Weave the Clouds`]: {
    type: "Harmony",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Secret`,
    desc: [
      `At the start of the battle and whenever the wearer's turn begins, one of the following effects is applied randomly: All allies' ATK increases by 10%, all allies' CRIT DMG increases by 12%, or all allies' Energy Regeneration Rate increases by 6%. The applied effect cannot be identical to the last effect applied, and will replace the previous effect. The applied effect will be removed when the wearer has been knocked down. Effects of the same type cannot be stacked.`,
    ],
  },
  
  [`Chorus`]: {
    type: "Harmony",
    base: { HP: 846, ATK: 317, DEF: 264 },
    subtitle: `Concerted`,
    desc: [
      `After entering battle, increases the ATK of all allies by 8%. Abilities of the same type cannot stack.`,
    ],
  },
  
  [`Collapsing Sky`]: {
    type: "Destruction",
    base: { HP: 846, ATK: 370, DEF: 198 },
    subtitle: `Havoc`,
    desc: [
      `The wearer's Basic ATK and Skill deal 20% more DMG.`,
    ],
  },
  
  [`Cornucopia`]: {
    type: "Abundance",
    base: { HP: 952, ATK: 264, DEF: 264 },
    subtitle: `Prosperity`,
    desc: [
      `When the wearer uses their Skill or Ultimate, their Outgoing Healing increases by 12%.`,
    ],
  },
  
  [`Cruising in the Stellar Sea`]: {
    type: "The Hunt",
    base: { HP: 952, ATK: 529, DEF: 463 },
    subtitle: `Chase`,
    desc: [
      `Increases the wearer's CRIT rate by 8%, and increases their CRIT rate against enemies with HP percentage less than or equal to 50% by an extra 8%. When the wearer defeats an enemy, their ATK is increased by 20% for 2 turn(s).`,
    ],
  },
  
  [`Dance! Dance! Dance!`]: {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Cannot Stop It!`,
    desc: [
      `When the wearer uses their Ultimate, all allies' actions are Advanced Forward by 16%.`,
    ],
  },
  
  [`Darting Arrow`]: {
    type: "The Hunt",
    base: { HP: 740, ATK: 370, DEF: 264 },
    subtitle: `War Cry`,
    desc: [
      `When the wearer defeats an enemy, increases ATK by 24% for 3 turn(s).`,
    ],
  },
  
  [`Data Bank`]: {
    type: "Erudition",
    base: { HP: 740, ATK: 370, DEF: 264 },
    subtitle: `Learned`,
    desc: [
      `Increases DMG dealt by the wearer's Ultimate by 28%.`,
    ],
  },
  
  [`Day One of My New Life`]: {
    type: "Preservation",
    base: { HP: 952, ATK: 370, DEF: 463 },
    subtitle: `At This Very Moment`,
    desc: [
      `Increases the wearer's DEF by 16%. After entering battle, increases All-Type RES of all allies by 8%. Abilities of the same type cannot stack.`,
    ],
  },
  
  [`Defense`]: {
    type: "Preservation",
    base: { HP: 952, ATK: 264, DEF: 264 },
    subtitle: `Revitalization`,
    desc: [
      `When the wearer unleashes their Ultimate, they restore HP by 18% of their Max HP.`,
    ],
  },
  
  [`Eyes of the Prey`]: {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Self-Confidence`,
    desc: [
      `Increases the wearer's Effect Hit Rate by 20% and increases DoT by 24%.`,
    ],
  },
  
  [`Fermata`]: {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Semibreve Rest`,
    desc: [
      `Increases the wearer's Break Effect by 16%, and increases their DMG to enemies afflicted with Shock or Wind Shear by 16%. This also applies to DoT.`,
    ],
  },
  
  [`Fine Fruit`]: {
    type: "Abundance",
    base: { HP: 952, ATK: 317, DEF: 198 },
    subtitle: `Savor`,
    desc: [
      `At the start of the battle, immediately regenerates 6 Energy for all allies.`,
    ],
  },
  
  [`Geniuses' Repose`]: {
    type: "Erudition",
    base: { HP: 846, ATK: 476, DEF: 396 },
    subtitle: `Each Now Has a Role to Play`,
    desc: [
      `Increases the wearer's ATK by 16%. When the wearer defeats an enemy, the wearer's CRIT DMG increases by 24% for 3 turn(s).`,
    ],
  },
  
  [`Good Night and Sleep Well`]: {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Toiler`,
    desc: [
      `For every debuff the target enemy has, the DMG dealt by the wearer increases by 12%, stacking up to 3 time(s). This effect also applies to DoT.`,
    ],
  },
  
  [`Hidden Shadow`]: {
    type: "Nihility",
    base: { HP: 846, ATK: 317, DEF: 264 },
    subtitle: `Mechanism`,
    desc: [
      `After using Skill, the wearer's next Basic ATK deals Additional DMG equal to 60% of ATK to the target enemy.`,
    ],
  },
  
  [`In the Name of the World`]: {
    type: "Nihility",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Inheritor`,
    desc: [
      `Increases the wearer's DMG to debuffed enemies by 24%. When the wearer uses their Skill, the Effect Hit Rate for this attack increases by 18%, and ATK increases by 24%.`,
    ],
  },
  
  [`In the Night`]: {
    type: "The Hunt",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Flowers and Butterflies`,
    desc: [
      `Increases the wearer's CRIT Rate by 18%. While the wearer is in battle, for every 10 SPD that exceeds 100, increases DMG dealt by Basic ATK and Skill by 6%. At the same time, increases the CRIT DMG of Ultimate by 12%. This effect can stack up to 6 time(s).`,
    ],
  },
  
  [`Landau's Choice`]: {
    type: "Preservation",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Time Fleets Away`,
    desc: [
      `The wearer is more likely to be attacked, and DMG taken is reduced by 16%.`,
    ],
  },
  
  [`Loop`]: {
    type: "Nihility",
    base: { HP: 846, ATK: 317, DEF: 264 },
    subtitle: `Pursuit`,
    desc: [
      `Increases DMG dealt from its wearer to Slowed enemies by 24%.`,
    ],
  },
  
  [`Make the World Clamor`]: {
    type: "Erudition",
    base: { HP: 846, ATK: 476, DEF: 396 },
    subtitle: `The Power of Sound`,
    desc: [
      `The wearer regenerates 20 Energy immediately upon entering battle, and increases DMG dealt by the wearer's Ultimate by 32%.`,
    ],
  },
  
  [`Mediation`]: {
    type: "Harmony",
    base: { HP: 846, ATK: 317, DEF: 264 },
    subtitle: `Family`,
    desc: [
      `Upon entering battle, increases SPD of all allies by 12 points for 1 turn(s).`,
    ],
  },
  
  [`Memories of the Past`]: {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Old Photo`,
    desc: [
      `Increases the wearer's Break Effect by 28%. When the wearer attacks, additionally regenerates 4 Energy. This effect cannot be repeatedly triggered in a single turn.`,
    ],
  },
  
  [`Meshing Cogs`]: {
    type: "Harmony",
    base: { HP: 846, ATK: 317, DEF: 264 },
    subtitle: `Fleet Triumph`,
    desc: [
      `After the wearer uses attacks or gets hit, additionally regenerates 4 Energy. This effect cannot be repeatedly triggered in a single turn.`,
    ],
  },
  
  [`Moment of Victory`]: {
    type: "Preservation",
    base: { HP: 1058, ATK: 476, DEF: 595 },
    subtitle: `Verdict`,
    desc: [
      `Increases the wearer's DEF by 24% and Effect Hit Rate by 24%. Increases the chance for the wearer to be attacked by enemies. When the wearer is attacked, increase their DEF by an extra 24% until the end of the wearer's turn.`,
    ],
  },
  
  [`Multiplication`]: {
    type: "Abundance",
    base: { HP: 952, ATK: 317, DEF: 198 },
    subtitle: `Denizens of Abundance`,
    desc: [
      `After the wearer uses their Basic ATK, their next action will be Advanced Forward by 12%.`,
    ],
  },
  
  [`Mutual Demise`]: {
    type: "Destruction",
    base: { HP: 846, ATK: 370, DEF: 198 },
    subtitle: `Legion`,
    desc: [
      `If the wearer's current HP percentage is lower than 80%, CRIT Rate increases by 12%.`,
    ],
  },
  
  [`Night on the Milky Way`]: {
    type: "Erudition",
    base: { HP: 1164, ATK: 582, DEF: 396 },
    subtitle: `Meteor Swarm`,
    desc: [
      `For every enemy on the field, increases the wearer's ATK by 9%, up to 5 stacks. When an enemy is inflicted with Weakness Break, the DMG dealt by the wearer increases by 30% for 1 turn.`,
    ],
  },
  
  [`Nowhere to Run`]: {
    type: "Destruction",
    base: { HP: 952, ATK: 529, DEF: 264 },
    subtitle: `Desperate Times`,
    desc: [
      `Increases the wearer's ATK by 24%. Whenever the wearer defeats an enemy, they restore HP equal to 12% of their ATK.`,
    ],
  },
  
  [`Only Silence Remains`]: {
    type: "The Hunt",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Record`,
    desc: [
      `Increases the wearer's ATK by 16%. If there are 2 or fewer enemies on the field, increases wearer's CRIT Rate by 12%.`,
    ],
  },
  
  [`On the Fall of an Aeon`]: {
    type: "Destruction",
    base: { HP: 1058, ATK: 529, DEF: 396 },
    subtitle: `Moth to Flames`,
    desc: [
      `When the wearer attacks, increases their ATK by 8% in this battle. This effect can stack up to 4 time(s). After the wearer breaks an enemy's Weakness, increases DMG dealt by 12%, lasting for 2 turn(s).`,
    ],
  },
  
  [`Passkey`]: {
    type: "Erudition",
    base: { HP: 740, ATK: 370, DEF: 264 },
    subtitle: `Epiphany`,
    desc: [
      `After the wearer uses their Skill, additionally regenerates 8 Energy. This effect cannot be repeatedly triggered in a single turn.`,
    ],
  },
  
  [`Past and Future`]: {
    type: "Harmony",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Kites From the Past`,
    desc: [
      `When the wearer uses their Skill, the next ally taking action (except the wearer) deals 16% increased DMG for 1 turn(s).`,
    ],
  },
  
  [`Perfect Timing`]: {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Refraction of Sightline`,
    desc: [
      `Increases the wearer's Effect RES by 16% and increases Outgoing Healing by an amount that is equal to 33% of Effect RES. Outgoing Healing can be increased this way by up to 15%.`,
    ],
  },
  
  [`Pioneering`]: {
    type: "Preservation",
    base: { HP: 952, ATK: 264, DEF: 264 },
    subtitle: `IPC`,
    desc: [
      `When the wearer Breaks an enemy's Weakness, the wearer restores HP by 12% of their Max HP.`,
    ],
  },
  
  [`Planetary Rendezvous`]: {
    type: "Harmony",
    base: { HP: 1058, ATK: 423, DEF: 330 },
    subtitle: `Departure`,
    desc: [
      `After entering battle, if an ally deals the same DMG Type as the wearer, DMG dealt increases by 12%`,
    ],
  },
  
  [`Post-Op Conversation`]: {
    type: "Abundance",
    base: { HP: 1058, ATK: 423, DEF: 330 },
    subtitle: `Mutual Healing`,
    desc: [
      `Increases the wearer's Energy Regeneration Rate by 8% and increases Outgoing Healing when they use their Ultimate by 12%.`,
    ],
  },
  
  [`Quid Pro Quo`]: {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Enjoy With Rapture`,
    desc: [
      `At the start of the wearer's turn, regenerates 8 Energy for a randomly chosen ally (excluding the wearer) whose current Energy is lower than 50%.`,
    ],
  },
  
  [`Resolution Shines As Pearls of Sweat`]: {
    type: "Nihility",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Glance Back`,
    desc: [
      `When the wearer hits an enemy and if the hit enemy is not already "Ensnared," then there is a 60% base chance to "Ensnare" the hit enemy. "Ensnared" enemies' DEF decreases by 12% for 1 turn(s).`,
    ],
  },
  
  [`Return to Darkness`]: {
    type: "The Hunt",
    base: { HP: 846, ATK: 529, DEF: 330 },
    subtitle: `Raging Waves`,
    desc: [
      `Increases the wearer's CRIT Rate by 12%. After a CRIT Hit, there is a 16% fixed chance to dispel 1 buff on the target enemy. This effect can only trigger 1 time per attack.`,
    ],
  },
  
  [`River Flows in Spring`]: {
    type: "The Hunt",
    base: { HP: 846, ATK: 476, DEF: 396 },
    subtitle: `Stave Off the Lingering Cold`,
    desc: [
      `After entering battle, increases the wearer's SPD by 8% and DMG by 12%. When the wearer takes DMG, this effect will disappear. This effect will resume after the end of the wearer's next turn.`,
    ],
  },
  
  [`Sagacity`]: {
    type: "Erudition",
    base: { HP: 740, ATK: 370, DEF: 264 },
    subtitle: `Genius`,
    desc: [
      `When the wearer uses their Ultimate, increases ATK by 24% for 2 turn(s).`,
    ],
  },
  
  [`Shared Feeling`]: {
    type: "Abundance",
    base: { HP: 952, ATK: 423, DEF: 396 },
    subtitle: `Cure and Repair`,
    desc: [
      `Increases the wearer's Outgoing Healing by 10%. When using Skill, regenerates 2 Energy for all allies.`,
    ],
  },
  
  [`Shattered Home`]: {
    type: "Destruction",
    base: { HP: 846, ATK: 370, DEF: 198 },
    subtitle: `Eradication`,
    desc: [
      `The wearer deals 20% more DMG to enemy targets whose HP percentage is greater than 50%.`,
    ],
  },
  
  [`Sleep Like the Dead`]: {
    type: "The Hunt",
    base: { HP: 1058, ATK: 582, DEF: 463 },
    subtitle: `Sweet Dreams`,
    desc: [
      `Increases the wearer's CRIT DMG by 30%. When the wearer's Basic ATK or Skill DMG does not result in a CRIT Hit, increases their CRIT Rate by 36%, lasting for 1 turn(s). This effect can only trigger once every 3 turn(s).`,
    ],
  },
  
  [`Something Irreplaceable`]: {
    type: "Destruction",
    base: { HP: 1164, ATK: 582, DEF: 396 },
    subtitle: `Kinship`,
    desc: [
      `Increases the wearer's ATK by 24%. When the wearer defeats an enemy or is hit, immediately restores HP equal to 8% of the wearer's ATK. At the same time, the wearer's DMG is increased by 24% until the end of their next turn. This effect cannot stack and can only trigger 1 time per turn.`,
    ],
  },
  
  [`Subscribe for More!`]: {
    type: "The Hunt",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Like Before You Leave!`,
    desc: [
      `The wearer's Basic ATK and Skill deals 24% more DMG. This effect increases by an extra 24% when the wearer's current Energy reaches its max level.`,
    ],
  },
  
  [`Swordplay`]: {
    type: "The Hunt",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Answers of Their Own`,
    desc: [
      `For each time the wearer hits the same target, DMG dealt increases by 8%, stacking up to 5 time(s). This effect will be dispelled when the wearer changes targets.`,
    ],
  },
  
  [`Texture of Memories`]: {
    type: "Preservation",
    base: { HP: 1058, ATK: 423, DEF: 529 },
    subtitle: `Treasure`,
    desc: [
      `Increases the wearer's Effect RES by 8%. If the wearer is attacked and has no Shield, they gain a Shield equal to 16% of their Max HP for 2 turn(s). This effect can only be triggered once every 3 turn(s). If the wearer has a Shield when attacked, the DMG they receive decreases by 12%.`,
    ],
  },
  
  [`The Birth of the Self`]: {
    type: "Erudition",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `The Maiden in the Painting`,
    desc: [
      `Increases DMG dealt by the wearer's follow-up attacks by 24%. If the current HP percentage of the target enemy is below or equal to 50%, increases DMG dealt by follow-up attacks by an extra 24%.`,
    ],
  },
  
  [`The Moles Welcome You`]: {
    type: "Destruction",
    base: { HP: 1058, ATK: 476, DEF: 264 },
    subtitle: `Fantastic Adventure`,
    desc: [
      `When the wearer uses Basic ATK, Skill, or Ultimate to attack enemies, the wearer gains one stack of Mischievous. Each stack increases the wearer's ATK by 12%.`,
    ],
  },
  
  [`The Seriousness of Breakfast`]: {
    type: "Erudition",
    base: { HP: 846, ATK: 476, DEF: 396 },
    subtitle: `Get Ready`,
    desc: [
      `Increases the wearer's DMG by 12%. For every enemy defeated by the wearer, the wearer's ATK increases by 4%, stacking up to 3 time(s).`,
    ],
  },
  
  [`This Is Me!`]: {
    type: "Preservation",
    base: { HP: 846, ATK: 370, DEF: 529 },
    subtitle: `New Chapter`,
    desc: [
      `Increases the wearer's DEF by 16%. Increases the DMG of the wearer when they use their Ultimate by 60% of the wearer's DEF. This effect only applies 1 time per enemy target during each use of the wearer's Ultimate.`,
    ],
  },
  
  [`Time Waits for No One`]: {
    type: "Abundance",
    base: { HP: 1270, ATK: 476, DEF: 463 },
    subtitle: `Morn, Noon, Dusk, and Night`,
    desc: [
      `Increases the wearer's Max HP by 18% and Outgoing Healing by 12%. When the wearer heals allies, record the amount of Outgoing Healing. When any ally launches an attack, a random attacked enemy takes Additional DMG equal to 36% of the recorded Outgoing Healing value. The type of this Additional DMG is of the same Type as the wearer's. This Additional DMG is not affected by other buffs, and can only occur 1 time per turn.`,
    ],
  },
  
  [`Today Is Another Peaceful Day`]: {
    type: "Erudition",
    base: { HP: 846, ATK: 529, DEF: 330 },
    subtitle: `A Storm Is Coming`,
    desc: [
      `After entering battle, increases the wearer's DMG based on their Max Energy. Each point of Energy increases DMG by 0.2%. A max of 160 Energy will be taken into account for this.`,
    ],
  },
  
  [`Trend of the Universal Market`]: {
    type: "Preservation",
    base: { HP: 1058, ATK: 370, DEF: 396 },
    subtitle: `A New Round of Shuffling`,
    desc: [
      `Increases the wearer's DEF by 16%. When the wearer is attacked, there is a 100% base chance to Burn the enemy. For each turn, the wearer deals DoT that is equal to 40% of the wearer's DEF for 2 turn(s).`,
    ],
  },
  
  [`Under the Blue Sky`]: {
    type: "Destruction",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Rye Under the Sun`,
    desc: [
      `Increases the wearer's ATK by 16%. When the wearer defeats an enemy, the wearer's CRIT Rate increases by 12% for 3 turn(s).`,
    ],
  },
  
  [`Void`]: {
    type: "Nihility",
    base: { HP: 846, ATK: 317, DEF: 264 },
    subtitle: `Fallen`,
    desc: [
      `At the start of the battle, the wearer's Effect Hit Rate increases by 20% for 3 turn(s).`,
    ],
  },
  
  [`Warmth Shortens Cold Nights`]: {
    type: "Abundance",
    base: { HP: 1058, ATK: 370, DEF: 396 },
    subtitle: `Tiny Light`,
    desc: [
      `Increases the wearer's Max HP by 16%. When using Basic ATK or Skill, restores all allies' HP by an amount equal to 2% of their respective Max HP.`,
    ],
  },
  
  [`We Are Wildfire`]: {
    type: "Preservation",
    base: { HP: 740, ATK: 476, DEF: 463 },
    subtitle: `Teary-Eyed`,
    desc: [
      `At the start of the battle, the DMG dealt to all allies decreases by 8% for 5 turn(s). At the same time, immediately restores HP to all allies equal to 30% of the respective HP difference between the characters' Max HP and current HP.`,
    ],
  },
  
  [`We Will Meet Again`]: {
    type: "Nihility",
    base: { HP: 846, ATK: 529, DEF: 330 },
    subtitle: `A Discourse in Arms`,
    desc: [
      `After the wearer uses Basic ATK or Skill, deals Additional DMG equal to 48% of the wearer's ATK to a random enemy that has been attacked.`,
    ],
  },
  
  [`Woof! Walk Time!`]: {
    type: "Destruction",
    base: { HP: 952, ATK: 476, DEF: 330 },
    subtitle: `Run!`,
    desc: [
      `Increases the wearer's ATK by 10%, and increases their DMG to enemies afflicted with Burn or Bleed by 16%. This also applies to DoT.`,
    ],
  },
};

export default HSR_WEAPONS;
