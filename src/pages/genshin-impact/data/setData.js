const setData = {
  // Version 5.3
  
  // Version 5.2
  
  // Version 5.1

  // Version 5.0
  ObsidianCodex: {
    name: "Obsidian Codex",
    desc: `2-Pc: While the equipping character is in Nightsoul's Blessing and is on the field, their DMG dealt is increased by 15%.
      4-Pc: After the equipping character consumes 1 Nightsoul point while on the field, CRIT Rate increases by 40% for 6s. This effect can trigger once every second.`,
    stats: { cr: 40 },
  },
  
  ScrollOfTheHeroOfCinderCity: {
    name: "Scroll of the Hero of Cinder City",
    desc: `2-Pc: When a nearby party member triggers a Nightsoul Burst, the equipping character regenerates 6 Elemental Energy.
      4-Pc: After the equipping character triggers a reaction related to their Elemental Type, all nearby party members gain a 12% Elemental DMG Bonus for the Elemental Types involved in the elemental reaction for 15s. If the equipping character is in the Nightsoul's Blessing state when triggering this effect, all nearby party members gain an additional 28% Elemental DMG Bonus for the Elemental Types involved in the elemental reaction for 20s. The equipping character can trigger this effect while off-field, and the DMG bonus from Artifact Sets with the same name do not stack.`,
    stats: {},
  },
  
  // Version 4.8
  
  // Version 4.7
  
  // Version 4.6
  FragmentOfHarmonicWhimsy: {
    name: "Fragment of Harmonic Whimsy",
    desc: `2-Pc: ATK +18%.
      4-Pc: When the value of a Bond of Life increases or decreases, this character deals 18% increased DMG for 6s. Max 3 stacks.`,
    stats: { atkp: 18 },
  },
  
  UnfinishedReverie: {
    name: "Unfinished Reverie",
    desc: `2-Pc: ATK +18%.
      4-Pc: After leaving combat for 3s, DMG dealt increased by 50%. In combat, if no Burning opponents are nearby for more than 6s, this DMG Bonus will decrease by 10% per second until it reaches 0%. When a Burning opponent exists, it will increase by 10% instead until it reaches 50%. This effect still triggers if the equipping character is off-field.`,
    stats: { atkp: 18 },
  },
  
  // Version 4.5
  
  // Version 4.4
  
  // Version 4.3
  NighttimeWhispersInTheEchoingWoods: {
    name: "Nighttime Whispers in the Echoing Woods",
    desc: `2-Pc: ATK +18%.
      4-Pc: After using an Elemental Skill, gain a 20% Geo DMG Bonus for 10s. While under a shield granted by the Crystallize reaction, the above effect will be increased by 150%, and this additional increase disappears 1s after that shield is lost.`,
    stats: { atkp: 18 },
  },
  
  SongOfDaysPast: {
    name: "Song of Days Past",
    desc: `2-Pc: Healing Bonus +15%.
      4-Pc: When the equipping character heals a party member, the Yearning effect will be created for 6s, which records the total amount of healing provided (including overflow healing). When the duration expires, the Yearning effect will be transformed into the "Waves of Days Past" effect: When your active party member hits an opponent with a Normal Attack, Charged Attack, Plunging Attack, Elemental Skill, or Elemental Burst, the DMG dealt will be increased by 8% of the total healing amount recorded by the Yearning effect. The "Waves of Days Past" effect is removed after it has taken effect 5 times or after 10s. A single instance of the Yearning effect can record up to 15,000 healing, and only a single instance can exist at once, but it can record the healing from multiple equipping characters. Equipping characters on standby can still trigger this effect.`,
    stats: { hb: 15 },
  },
  
  // Version 4.2
  
  // Version 4.1
  
  // Version 4.0
  GoldenTroupe: {
    name: "Golden Troupe",
    desc: `2-Pc: Increases Elemental Skill DMG by 20%.
      4-Pc: Increases Elemental Skill DMG by 25%. Additionally, when not on the field, Elemental Skill DMG will be further increased by 25%. This effect will be cleared 2s after taking the field.`,
    stats: {},
  },
  
  MarechausseeHunter: {
    name: "Marechaussee Hunter",
    desc: `2-Pc: Normal and Charged Attack DMG +15%
      4-Pc: When current HP increases or decreases, CRIT Rate will be increased by 12% for 5s. Max 3 stacks.`,
    stats: { cr: 36 },
  },
  
  // Version 3.8
  
  // Version 3.7
  
  // Version 3.6
  NymphsDream: {
    name: "Nymph's Dream",
    desc: `2-Pc: Hydro DMG Bonus +15%
      4-Pc: After Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts hit opponents, 1 stack of Mirrored Nymph will be triggered, lasting 8s. When under the effect of 1, 2, or 3 or more Mirrored Nymph stacks, ATK will be increased by 7%/16%/25%, and Hydro DMG Bonus will be increased by 4%/9%/15%. Mirrored Nymph stacks created by Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts exist independently.`,
    stats: { hydro: 15 },
  },
  
  VourukashasGlow: {
    name: "Vourukasha's Glow",
    desc: `2-Pc: HP +20%
      4-Pc: Elemental Skill and Elemental Burst DMG will be increased by 10%. After the equipping character takes DMG, the aforementioned DMG Bonus is increased by 80% for 5s. This effect increase can have 5 stacks. The duration of each stack is counted independently. These effects can be triggered even when the equipping character is not on the field.`,
    stats: { hpp: 20 },
  },
  
  // Version 3.5
  
  // Version 3.4
  
  // Version 3.3
  DesertPavilionChronicle: {
    name: "Desert Pavilion Chronicle",
    desc: `2-Pc: Anemo DMG Bonus +15%
      4-Pc: When Charged Attacks hit opponents, the equipping character's Normal Attack SPD will increase by 10% while Normal, Charged, and Plunging Attack DMG will increase by 40% for 15s.`,
    stats: { anemo: 15 },
  },
  
  FlowerOfParadiseLost: {
    name: "Flower of Paradise Lost",
    desc: `2-Pc: Increases Elemental Mastery by 80.
      4-Pc: The equipping character's Bloom, Hyperbloom, and Burgeon reaction DMG are increased by 40%. Additionally, after the equipping character triggers Bloom, Hyperbloom, or Burgeon, they will gain another 25% bonus to the effect mentioned prior. Each stack of this lasts 10s. Max 4 stacks simultaneously. This effect can only be triggered once per second. The character who equips this can still trigger its effects when not on the field.`,
    stats: { em: 80 },
  },
  
  // Version 3.2
  
  // Version 3.1
  
  // Version 3.0
  DeepwoodMemories: {
    name: "Deepwood Memories",
    desc: `2-Pc: Dendro DMG Bonus +15%.
      4-Pc: After Elemental Skills or Bursts hit opponents, the targets' Dendro RES will be decreased by 30% for 8s. This effect can be triggered even if the equipping character is not on the field.`,
    stats: { dendro: 15 },
  },
  
  GildedDreams: {
    name: "Gilded Dreams",
    desc: `2-Pc: Increases Elemental Mastery by 80.
      4-Pc: Within 8s of triggering an Elemental Reaction, the character equipping this will obtain buffs based on the Elemental Type of the other party members. ATK is increased by 14% for each party member whose Elemental Type is the same as the equipping character, and Elemental Mastery is increased by 50 for every party member with a different Elemental Type. Each of the aforementioned buffs will count up to 3 characters. This effect can be triggered once every 8s. The character who equips this can still trigger its effects when not on the field.`,
    stats: { em: 80 },
  },
  
  // Version 2.8
  
  // Version 2.7
  
  // Version 2.6
  EchoesOfAnOffering: {
    name: "Echoes of an Offering",
    desc: `2-Pc: ATK +18%.
      4-Pc: When Normal Attacks hit opponents, there is a 36% chance that it will trigger Valley Rite, which will increase Normal Attack DMG by 70% of ATK. This effect will be dispelled 0.05s after a Normal Attack deals DMG. If a Normal Attack fails to trigger Valley Rite, the odds of it triggering the next time will increase by 20%. This trigger can occur once every 0.2s.`,
    stats: { atkp: 18 },
  },
  
  VermillionHereafter: {
    name: "Vermillion Hereafter",
    desc: `2-Pc: ATK +18%.
      4-Pc: After using an Elemental Burst, this character will gain the Nascent Light effect, increasing their ATK by 8% for 16s. When the character's HP decreases, their ATK will further increase by 10%. This further increase can occur this way a maximum of 4 times. This effect can be triggered once every 0.8s. Nascent Light will be dispelled when the character leaves the field. If an Elemental Burst is used again during the duration of Nascent Light, the original Nascent Light will be dispelled.`,
    stats: { atkp: 18 },
  },
  
  // Version 2.5
  
  // Version 2.4
  
  // Version 2.3
  HuskOfOpulentDreams: {
    name: "Husk of Opulent Dreams",
    desc: `2-Pc: DEF +30%
      4-Pc: A character equipped with this Artifact set will obtain the Curiosity effect in the following conditions: When on the field, the character gains 1 stack after hitting an opponent with a Geo attack, triggering a maximum of once every 0.3s. When off the field, the character gains 1 stack every 3s. Curiosity can stack up to 4 times, each providing 6% DEF and a 6% Geo DMG Bonus. When 6 seconds pass without gaining a Curiosity stack, 1 stack is lost.`,
    stats: { defp: 30 },
  },
  
  OceanHuedClam: {
    name: "Ocean-Hued Clam",
    desc: `2-Pc: Healing Bonus +15%.
      4-Pc: When the character equipping this artifact set heals a character in the party, a Sea-Dyed Foam will appear for 3 seconds, accumulating the amount of HP recovered from healing (including overflow healing). At the end of the duration, the Sea-Dyed Foam will explode, dealing DMG to nearby opponents based on 90% of the accumulated healing. (This DMG is calculated similarly to Reactions such as Electro-Charged, and Superconduct, but is not affected by Elemental Mastery, Character Levels, or Reaction DMG Bonuses). Only one Sea-Dyed Foam can be produced every 3.5 seconds. Each Sea-Dyed Foam can accumulate up to 30,000 HP (including overflow healing). There can be no more than one Sea-Dyed Foam active at any given time. This effect can still be triggered even when the character who is using this artifact set is not on the field.`,
    stats: { hb: 15 },
  },
  
  // Version 2.2
  
  // Version 2.1
  
  // Version 2.0
  EmblemOfSeveredFate: {
    name: "Emblem of Severed Fate",
    desc: `2-Pc: Energy Recharge +20%
      4-Pc: Increases Elemental Burst DMG by 25% of Energy Recharge. A maximum of 75% bonus DMG can be obtained in this way.`,
    stats: { er: 20 },
  },
  
  ShimenawasReminiscence: {
    name: "Shimenawa's Reminiscence",
    desc: `2-Pc: ATK +18%.
      4-Pc: When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and Normal/Charged/Plunging Attack DMG is increased by 50% for 10s. This effect will not trigger again during that duration.`,
    stats: { atkp: 18 },
  },
  
  // Version 1.6
  
  // Version 1.5
  PaleFlame: {
    name: "Pale Flame",
    desc: `2-Pc: Physical DMG is increased by 25%.
      4-Pc: When an Elemental Skill hits an opponent, ATK is increased by 9% for 7s. This effect stacks up to 2 times and can be triggered once every 0.3s. Once 2 stacks are reached, the 2-set effect is increased by 100%.`,
    stats: { physical: 25 },
  },
  
  TenacityOfTheMillelith: {
    name: "Tenacity of the Millelith",
    desc: `2-Pc: HP +20%
      4-Pc: When an Elemental Skill hits an opponent, the ATK of all nearby party members is increased by 20% and their Shield Strength is increased by 30% for 3s. This effect can be triggered once every 0.5s. This effect can still be triggered even when the character who is using this artifact set is not on the field.`,
    stats: { hpp: 20 },
  },
  
  // Version 1.4
  
  // Version 1.3
  
  // Version 1.2
  BlizzardStrayer: {
    name: "Blizzard Strayer",
    desc: `2-Pc: Cryo DMG Bonus +15%
      4-Pc: When a character attacks an opponent affected by Cryo, their CRIT Rate is increased by 20%. If the opponent is Frozen, CRIT Rate is increased by an additional 20%.`,
    stats: { cryo: 15, cr: 40 },
  },
  
  HeartOfDepth: {
    name: "Heart of Depth",
    desc: `2-Pc: Hydro DMG Bonus +15%
      4-Pc: After using Elemental Skill, increases Normal Attack and Charged Attack DMG by 30% for 15s.`,
    stats: { hydro: 15 },
  },
  
  // Version 1.1
  
  // Version 1.0
  ArchaicPetra: {
    name: "Archaic Petra",
    desc: `2-Pc: Gain a 15% Geo DMG Bonus.
      4-Pc: Upon obtaining an Elemental Shard created through a Crystallize Reaction, all party members gain a 35% DMG Bonus for that particular element for 10s. Only one form of Elemental DMG Bonus can be gained in this manner at any one time.`,
    stats: { geo: 15 },
  },
  
  BloodstainedChivalry: {
    name: "Bloodstained Chivalry",
    desc: `2-Pc: Physical DMG +25%
      4-Pc: After defeating an opponent, increases Charged Attack DMG by 50%, and reduces its Stamina cost to 0 for 10s.`,
    stats: { physical: 25 },
  },
  
  CrimsonWitchOfFlames: {
    name: "Crimson Witch of Flames",
    desc: `2-Pc: Pyro DMG Bonus +15%
    4-Pc: Increases Overloaded, Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using Elemental Skill increases the 2-Piece Set Bonus by 50% of its starting value for 10s. Max 3 stacks.`,
    stats: { pyro: 15 },
  },
  
  GladiatorsFinale: {
    name: "Gladiator's Finale",
    desc: `2-Pc: ATK +18%.
      4-Pc: If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their Normal Attack DMG by 35%.`,
    stats: { atkp: 18 },
  },
  
  Lavawalker: {
    name: "Lavawalker",
    desc: `2-Pc: Pyro RES increased by 40%.
      4-Pc: Increases DMG against opponents affected by Pyro by 35%.`,
    stats: {},
  },
  
  MaidenBeloved: {
    name: "Maiden Beloved",
    desc: `2-Pc: Character Healing Effectiveness +15%
      4-Pc: Using an Elemental Skill or Burst increases healing received by all party members by 20% for 10s.`,
    stats: { hb: 15 },
  },
  
  NoblesseOblige: {
    name: "Noblesse Oblige",
    desc: `2-Pc: Elemental Burst DMG +20%
      4-Pc: Using an Elemental Burst increases all party members' ATK by 20% for 12s. This effect cannot stack.`,
    stats: {},
  },
  
  RetracingBolide: {
    name: "Retracing Bolide",
    desc: `2-Pc: Increases Shield Strength by 35%.
      4-Pc: While protected by a shield, gain an additional 40% Normal and Charged Attack DMG.`,
    stats: {},
  },
  
  ThunderingFury: {
    name: "Thundering Fury",
    desc: `2-Pc: Electro DMG Bonus +15%
      4-Pc: Increases DMG caused by Overloaded, Electro-Charged, Superconduct, and Hyperbloom by 40%, and the DMG Bonus conferred by Aggravate is increased by 20%. When Quicken or the aforementioned Elemental Reactions are triggered, Elemental Skill CD is decreased by 1s. Can only occur once every 0.8s.`,
    stats: { electro: 15 },
  },
  
  Thundersoother: {
    name: "Thundersoother",
    desc: `2-Pc: Electro RES increased by 40%.
      4-Pc: Increases DMG against opponents affected by Electro by 35%.`,
    stats: {},
  },
  
  ViridescentVenerer: {
    name: "Viridescent Venerer",
    desc: `2-Pc: Anemo DMG Bonus +15%
      4-Pc: Increases Swirl DMG by 60%. Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for 10s.`,
    stats: { anemo: 15 },
  },
  
  WanderersTroupe: {
    name: "Wanderer's Troupe",
    desc: `2-Pc: Increases Elemental Mastery by 80.
      4-Pc: Increases Charged Attack DMG by 35% if the character uses a Catalyst or a Bow.`,
    stats: { em: 80 },
  },
};

export default setData;
