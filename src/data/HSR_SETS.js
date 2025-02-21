const HSR_SETS = {
  // Version 3.0
  "123": {
    name: "Hero of Triumphant Song",
    rarity: 5,
    desc: "2-Pc: Increases ATK by 12%.\n4-Pc: While the wearer's memosprite is on the field, increases the wearer's SPD by 6%. When the wearer's memosprite attacks, increases the wearer's and memosprite's CRIT DMG by 30%, lasting for 2 turn(s).",
  },
  "124": {
    name: "Poet of Mourning Collapse",
    rarity: 5,
    desc: "2-Pc: Increases Quantum DMG by 10%.\n4-Pc: Decreases the wearer's SPD by 8%. Before entering battle, if the wearer's SPD is lower than 110/95, increases the wearer's CRIT Rate by 20%/32%. This effect applies to the wearer's memosprite at the same time.",
  },
  
  // Version 2.6
  "121": {
    name: "Sacerdos' Relived Ordeal",
    rarity: 5,
    desc: "2-Pc: Increases SPD by 6%.\n4-Pc: When using Skill or Ultimate on one ally target, increases the ability target's CRIT DMG by 18%, lasting for 2 turn(s). This effect can stack up to 2 time(s).",
  },
  "122": {
    name: "Scholar Lost in Erudition",
    rarity: 5,
    desc: "2-Pc: Increases CRIT Rate by 8%.\n4-Pc: Increases DMG dealt by Skill and Ultimate by 20%. After using Ultimate, additionally increases the DMG dealt by the next Skill by 25%.",
  },
  
  // Version 2.3  
  "119": {
    name: "Iron Cavalry Against the Scourge",
    rarity: 5,
    desc: "2-Pc: Increases Break Effect by 16%.\n4-Pc: If the wearer's Break Effect is 150% or higher, the Break DMG dealt to the enemy target ignores 10% of their DEF. If the wearer's Break Effect is 250% or higher, the Super Break DMG dealt to the enemy target additionally ignores 15% of their DEF.",
  },
  "120": {
    name: "The Wind-Soaring Valorous",
    rarity: 5,
    desc: "2-Pc: Increases ATK by 12%.\n4-Pc: Increases the wearer's CRIT Rate by 6%. After the wearer uses a follow-up attack, increases DMG dealt by Ultimate by 36%, lasting for 1 turn(s).",
  },
  
  // Version 2.0
  "117": {
    name: "Pioneer Diver of Dead Waters",
    rarity: 5,
    desc: "2-Pc: Increases DMG dealt to enemies with debuffs by 12%.\n4-Pc: Increases CRIT Rate by 4%. The wearer deals 8%/12% increased CRIT DMG to enemies with at least 2/3 debuffs. After the wearer inflicts a debuff on enemy targets, the aforementioned effects increase by 100%, lasting for 1 turn(s).",
  },
  "118": {
    name: "Watchmaker, Master of Dream Machinations",
    rarity: 5,
    desc: "2-Pc: Increases Break Effect by 16%.\n4-Pc: When the wearer uses their Ultimate on an ally, all allies' Break Effect increases by 30% for 2 turn(s). This effect cannot be stacked.",
  },
  
  // Version 1.5  
  "116": {
    name: "Prisoner in Deep Confinement",
    rarity: 5,
    desc: "2-Pc: Increases ATK by 12%.\n4-Pc: For every DoT the enemy target is afflicted with, the wearer will ignore 6% of its DEF when dealing DMG to it. This effect is valid for a max of 3 DoTs.",
  },
  "115": {
    name: "The Ashblazing Grand Duke",
    rarity: 5,
    desc: "2-Pc: Increases the DMG dealt by follow-up attack by 20%.\n4-Pc: When the wearer uses a follow-up attack, increases the wearer's ATK by 6% for every time the follow-up attack deals DMG. This effect can stack up to 8 time(s) and lasts for 3 turn(s). This effect is removed the next time the wearer uses a follow-up attack.",
  },
  
  // Version 1.2  
  "113": {
    name: "Longevous Disciple",
    rarity: 5,
    desc: "2-Pc: Increases Max HP by 12%.\n4-Pc: When the wearer is hit or has their HP consumed by an ally or themselves, their CRIT Rate increases by 8% for 2 turn(s) and up to 2 stacks.",
  },
  "114": {
    name: "Messenger Traversing Hackerspace",
    rarity: 5,
    desc: "2-Pc: Increases SPD by 6%.\n4-Pc: When the wearer uses their Ultimate on an ally, SPD for all allies increases by 12% for 1 turn(s). This effect cannot be stacked.",
  },
  
  // Version 1.0
  "109": {
    name: "Band of Sizzling Thunder",
    rarity: 5,
    desc: "2-Pc: Increases Lightning DMG by 10%.\n4-Pc: When the wearer uses their Skill, increases the wearer's ATK by 20% for 1 turn(s).",
  },
  "105": {
    name: "Champion of Streetwise Boxing",
    rarity: 5,
    desc: "2-Pc: Increases Physical DMG by 10%.\n4-Pc: After the wearer attacks or is hit, their ATK increases by 5% for the rest of the battle. This effect can stack up to 5 time(s).",
  },
  "110": {
    name: "Eagle of Twilight Line",
    rarity: 5,
    desc: "2-Pc: Increases Wind DMG by 10%.\n4-Pc: After the wearer uses their Ultimate, their action is Advanced Forward by 25%.",
  },
  "107": {
    name: "Firesmith of Lava-Forging",
    rarity: 5,
    desc: "2-Pc: Increases Fire DMG by 10%.\n4-Pc: Increases DMG by the wearer's Skill by 12%. After unleashing Ultimate, increases the wearer's Fire DMG by 12% for the next attack.",
  },
  "108": {
    name: "Genius of Brilliant Stars",
    rarity: 5,
    desc: "2-Pc: Increases Quantum DMG by 10%.\n4-Pc: When the wearer deals DMG to the target enemy, ignores 10% DEF. If the target enemy has Quantum Weakness, the wearer additionally ignores 10% DEF.",
  },
  "106": {
    name: "Guard of Wuthering Snow",
    rarity: 5,
    desc: "2-Pc: Reduces DMG taken by 8%.\n4-Pc: At the beginning of the turn, if the wearer's HP percentage is equal to or less than 50%, restores HP equal to 8% of their Max HP and regenerates 5 Energy.",
  },
  "104": {
    name: "Hunter of Glacial Forest",
    rarity: 5,
    desc: "2-Pc: Increases Ice DMG by 10%.\n4-Pc: After the wearer uses their Ultimate, their CRIT DMG increases by 25% for 2 turn(s).",
  },
  "103": {
    name: "Knight of Purity Palace",
    rarity: 5,
    desc: "2-Pc: Increases DEF by 15%.\n4-Pc: Increases the max DMG that can be absorbed by the Shield created by the wearer by 20%.",
  },
  "102": {
    name: "Musketeer of Wild Wheat",
    rarity: 5,
    desc: "2-Pc: Increases ATK by 12%.\n4-Pc: The wearer's SPD increases by 6% and DMG dealt by Basic ATK increases by 10%.",
  },
  "101": {
    name: "Passerby of Wandering Cloud",
    rarity: 5,
    desc: "2-Pc: Increases Outgoing Healing by 10%.\n4-Pc: At the start of the battle, immediately regenerates 1 Skill Point.",
  },
  "111": {
    name: "Thief of Shooting Meteor",
    rarity: 5,
    desc: "2-Pc: Increases Break Effect by 16%.\n4-Pc: Increases the wearer's Break Effect by 16%. After the wearer inflicts Weakness Break on an enemy, regenerates 3 Energy.",
  },
  "112": {
    name: "Wastelander of Banditry Desert",
    rarity: 5,
    desc: "2-Pc: Increases Imaginary DMG by 10%.\n4-Pc: When dealing DMG to debuffed enemy targets, the wearer has their CRIT Rate increased by 10%. And when they deal DMG to Imprisoned enemy targets, their CRIT DMG increases by 20%.",
  },


  // Version 2.5
  "317": {
    name: "Lushaka, the Sunken Seas",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's Energy Regeneration Rate by 5%. If the wearer is not the first character in the team lineup, then increases the ATK of the first character in the team lineup by 12%.",
  },
  "318": {
    name: "The Wondrous BananAmusement Park",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's CRIT DMG by 16%. When a target summoned by the wearer is on the field, CRIT DMG additionally increases by 32%.",
  },
  
  // Version 2.3
  "315": {
    name: "Duran, Dynasty of Running Wolves",
    rarity: 5,
    desc: "2-Pc: When an ally uses a follow-up attack, the wearer gains 1 stack of Merit, stacking up to 5 time(s). Each stack of Merit increases the DMG dealt by the wearer's follow-up attacks by 5%. When there are 5 stacks, additionally increases the wearer's CRIT DMG by 25%.",
  },
  "316": {
    name: "Forge of the Kalpagni Lantern",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's SPD by 6%. When the wearer hits an enemy target that has Fire Weakness, the wearer's Break Effect increases by 40%, lasting for 1 turn(s).",
  },
  
  // Version 2.1
  "314": {
    name: "Izumo Gensei and Takama Divine Realm",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's ATK by 12%. When entering battle, if at least one teammate follows the same Path as the wearer, then the wearer's CRIT Rate increases by 12%.",
  },
  "313": {
    name: "Sigonia, the Unclaimed Desolation",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's CRIT Rate by 4%. When an enemy target gets defeated, the wearer's CRIT DMG increases by 4%, stacking up to 10 time(s).",
  },
  
  // Version 1.5
  "311": {
    name: "Firmament Frontline: Glamoth",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's ATK by 12%. When the wearer's SPD is equal to or higher than 135/160, the wearer deals 12%/18% more DMG.",
  },
  "312": {
    name: "Penacony, Land of the Dreams",
    rarity: 5,
    desc: "2-Pc: Increases wearer's Energy Regeneration Rate by 5%. Increases DMG by 10% for all other allies that are of the same Type as the wearer.",
  },
  
  // Version 1.2
  "310": {
    name: "Broken Keel",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's Effect RES by 10%. When the wearer's Effect RES is at 30% or higher, all allies' CRIT DMG increases by 10%.",
  },
  "309": {
    name: "Rutilant Arena",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's CRIT Rate by 8%. When the wearer's current CRIT Rate reaches 70% or higher, DMG dealt by Basic ATK and Skill increases by 20%.",
  },
  
  // Version 1.0  
  "304": {
    name: "Belobog of the Architects",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's DEF by 15%. When the wearer's Effect Hit Rate is 50% or higher, the wearer gains an extra 15% DEF.",
  },
  "305": {
    name: "Celestial Differentiator",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's CRIT DMG by 16%. When the wearer's current CRIT DMG reaches 120% or higher, after entering battle, the wearer's CRIT Rate increases by 60% until the end of their first attack.",
  },
  "302": {
    name: "Fleet of the Ageless",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's Max HP by 12%. When the wearer's SPD reaches 120 or higher, all allies' ATK increases by 8%.",
  },
  "306": {
    name: "Inert Salsotto",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's CRIT Rate by 8%. When the wearer's current CRIT Rate reaches 50% or higher, the DMG dealt by the wearer's Ultimate and follow-up attack increases by 15%.",
  },
  "303": {
    name: "Pan-Cosmic Commercial Enterprise",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's Effect Hit Rate by 10%. Meanwhile, the wearer's ATK increases by an amount that is equal to 25% of the current Effect Hit Rate, up to a maximum of 25%.",
  },
  "301": {
    name: "Space Sealing Station",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's ATK by 12%. When the wearer's SPD reaches 120 or higher, the wearer's ATK increases by an extra 12%.",
  },
  "308": {
    name: "Sprightly Vonwacq",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's Energy Regeneration Rate by 5%. When the wearer's SPD reaches 120 or higher, the wearer's action is Advanced Forward by 40% immediately upon entering battle.",
  },
  "307": {
    name: "Talia: Kingdom of Banditry",
    rarity: 5,
    desc: "2-Pc: Increases the wearer's Break Effect by 16%. When the wearer's SPD reaches 145 or higher, the wearer's Break Effect increases by an extra 20%.",
  },
}

export default HSR_SETS;
