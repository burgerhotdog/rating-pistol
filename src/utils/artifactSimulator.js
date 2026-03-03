const RESIN_PER_WEEK = 180 * 7 + 60; // assuming 1 transient Resin from Teapot.
const RESIN_PER_RUN = 20;
const ARTIFACTS_PER_RUN = 1.065;

const TYPE_FLOWER = "Flower";
const TYPE_PLUME = "Plume";
const TYPE_SANDS = "Sands";
const TYPE_GOBLET = "Goblet";
const TYPE_CIRCLET = "Circlet";
const ARTIFACT_TYPES = [
  TYPE_FLOWER,
  TYPE_PLUME,
  TYPE_SANDS,
  TYPE_GOBLET,
  TYPE_CIRCLET
];

const STAT_BASE_HP = "Base HP";
const STAT_FLAT_HP = "Flat HP";
const STAT_HP_PCT = "HP %";
const STAT_TOTAL_HP = "Total HP";

const STAT_BASE_ATK = "Base ATK"
const STAT_FLAT_ATK = "Flat ATK";
const STAT_ATK_PCT = "ATK %";
const STAT_TOTAL_ATK = "Total ATK";

const STAT_BASE_DEF = "Base DEF";
const STAT_FLAT_DEF = "Flat DEF";
const STAT_DEF_PCT = "DEF %";
const STAT_TOTAL_DEF = "Total DEF";

const STAT_ER = "Energy Recharge";
const STAT_EM = "Elemental Mastery";
const STAT_ELEMENTAL_DMG = "Elemental DMG %";
const STAT_PHYSICAL_DMG = "Physical DMG %";
const STAT_OTHER_DMG = "Other DMG %";
const STAT_CR = "Crit Rate %";
const STAT_CD = "Crit DMG %";
const STAT_HB = "Healing Bonus %";

const STAT_AMPLIFYING_RXN_MULTIPLIER = "Amplifying Reaction Multiplier";
const STAT_TRANSFORMATIVE_RXN_MULTIPLIER = "Transformative Reaction Multiplier";
const STAT_BASE_DAMAGE = "Base Damage Output";

const FLOWER_MAIN_STATS = {};
FLOWER_MAIN_STATS[STAT_FLAT_HP] = 4780;

const PLUME_MAIN_STATS = {};
PLUME_MAIN_STATS[STAT_FLAT_ATK] = 311;

const SANDS_MAIN_STATS = {};
SANDS_MAIN_STATS[STAT_HP_PCT] = 46.6;
SANDS_MAIN_STATS[STAT_ATK_PCT] = 46.6;
SANDS_MAIN_STATS[STAT_DEF_PCT] = 58.3;
SANDS_MAIN_STATS[STAT_ER] = 51.8;
SANDS_MAIN_STATS[STAT_EM] = 186.5;

const GOBLET_MAIN_STATS = {};
GOBLET_MAIN_STATS[STAT_HP_PCT] = 46.6;
GOBLET_MAIN_STATS[STAT_ATK_PCT] = 46.6;
GOBLET_MAIN_STATS[STAT_DEF_PCT] = 58.3;
GOBLET_MAIN_STATS[STAT_EM] = 186.5;
GOBLET_MAIN_STATS[STAT_ELEMENTAL_DMG] = 46.6;
GOBLET_MAIN_STATS[STAT_OTHER_DMG] = 46.6;
GOBLET_MAIN_STATS[STAT_PHYSICAL_DMG] = 58.3;

const CIRCLET_MAIN_STATS = {};
CIRCLET_MAIN_STATS[STAT_HP_PCT] = 46.6;
CIRCLET_MAIN_STATS[STAT_ATK_PCT] = 46.6;
CIRCLET_MAIN_STATS[STAT_DEF_PCT] = 58.3;
CIRCLET_MAIN_STATS[STAT_EM] = 186.5;
CIRCLET_MAIN_STATS[STAT_CR] = 31.1;
CIRCLET_MAIN_STATS[STAT_CD] = 62.2;
CIRCLET_MAIN_STATS[STAT_HB] = 35.9;

const MAIN_STAT_VALUES = {};
MAIN_STAT_VALUES[TYPE_FLOWER] = FLOWER_MAIN_STATS;
MAIN_STAT_VALUES[TYPE_PLUME] = PLUME_MAIN_STATS;
MAIN_STAT_VALUES[TYPE_SANDS] = SANDS_MAIN_STATS;
MAIN_STAT_VALUES[TYPE_GOBLET] = GOBLET_MAIN_STATS;
MAIN_STAT_VALUES[TYPE_CIRCLET] = CIRCLET_MAIN_STATS;

const SUBSTAT_VALUES= {};
SUBSTAT_VALUES[STAT_FLAT_HP] = 298.75;
SUBSTAT_VALUES[STAT_FLAT_ATK] = 19.45;
SUBSTAT_VALUES[STAT_FLAT_DEF] = 23.15;
SUBSTAT_VALUES[STAT_HP_PCT] = 5.83;
SUBSTAT_VALUES[STAT_ATK_PCT] = 5.83;
SUBSTAT_VALUES[STAT_DEF_PCT] = 7.29;
SUBSTAT_VALUES[STAT_ER] = 6.48;
SUBSTAT_VALUES[STAT_EM] = 23.31;
SUBSTAT_VALUES[STAT_CR] = 3.89;
SUBSTAT_VALUES[STAT_CD] = 7.77;

// Weights assigned to each substat which indicates the relative
// probability of each substat occurring.
const SUBSTAT_POOL = [
	{
  	stat: STAT_FLAT_HP,
    weight: 15
  },
	{
  	stat: STAT_FLAT_ATK,
    weight: 15
  },
	{
  	stat: STAT_FLAT_DEF,
    weight: 15
  },
	{
  	stat: STAT_HP_PCT,
    weight: 10
  },
	{
  	stat: STAT_ATK_PCT,
    weight: 10
  },
	{
  	stat: STAT_DEF_PCT,
    weight: 10
  },
	{
  	stat: STAT_ER,
    weight: 10
  },
	{
  	stat: STAT_EM,
    weight: 10
  },
	{
  	stat: STAT_CR,
    weight: 7.5
  },
	{
  	stat: STAT_CD,
    weight: 7.5
  }
];

const SKYWARD_ATLAS_STATS = {};
SKYWARD_ATLAS_STATS[STAT_ATK_PCT] = 33.1;
SKYWARD_ATLAS_STATS[STAT_ELEMENTAL_DMG] = 12;
const SKYWARD_ATLAS = {
	baseAtk: 674,
  stats: SKYWARD_ATLAS_STATS
};

const STRINGLESS_STATS = {};
STRINGLESS_STATS[STAT_EM] = 165;
STRINGLESS_STATS[STAT_ELEMENTAL_DMG] = 24; // At R1.
const STRINGLESS = {
	baseAtk: 510,
  stats: STRINGLESS_STATS
};

const THE_CATCH_STATS = {};
THE_CATCH_STATS[STAT_ER] = 41.9;
THE_CATCH_STATS[STAT_CR] = 12;
THE_CATCH_STATS[STAT_ELEMENTAL_DMG] = 32;
const THE_CATCH = {
	baseAtk: 449,
  stats: THE_CATCH_STATS
};

const IRON_STING_STATS = {};
IRON_STING_STATS[STAT_EM] = 165;
IRON_STING_STATS[STAT_ELEMENTAL_DMG] = 12; // At 2 stacks.
const IRON_STING = {
	baseAtk: 510,
  stats: IRON_STING_STATS
};

const FAVONIUS_LANCE_STATS = {};
FAVONIUS_LANCE_STATS[STAT_ER] = 30.6;
FAVONIUS_LANCE = {
  baseAtk: 565,
  stats: FAVONIUS_LANCE_STATS
}

const DESERT_PAVILION_STATS= {};
DESERT_PAVILION_STATS[STAT_ELEMENTAL_DMG] = 15 + 40; // 2P + 4P effect combined
const DESERT_PAVILION_SET = {
  stats: DESERT_PAVILION_STATS
};

const GOLDEN_TROUPE_STATS= {};
GOLDEN_TROUPE_STATS[STAT_ELEMENTAL_DMG] = 20 + 25 + 25; // 2P + 4P effect combined
const GOLDEN_TROUPE_SET = {
  stats: GOLDEN_TROUPE_STATS
};

const EMBLEM_STATS = {};
EMBLEM_STATS[STAT_ER] = 20;
const EMBLEM_SET = {
	stats: EMBLEM_STATS,
  dynamicStats: [{
  	sourceStat: STAT_ER,
    targetStat: STAT_ELEMENTAL_DMG,
    offset: 0,
    multiplier: 0.25
  }]
};

const PARADISE_STATS = {};
PARADISE_STATS[STAT_EM] = 80;
PARADISE_STATS[STAT_TRANSFORMATIVE_RXN_MULTIPLIER] = 0.8;
const PARADISE_SET = {
	stats: PARADISE_STATS
};

const TENACITY_STATS = {};
TENACITY_STATS[STAT_HP_PCT] = 20;
const TENACITY_SET = {
	stats: TENACITY_STATS
};

const BLANK_CHARACTER_STATS = {};
BLANK_CHARACTER_STATS[STAT_FLAT_HP] = 0;
BLANK_CHARACTER_STATS[STAT_HP_PCT] = 0;
BLANK_CHARACTER_STATS[STAT_FLAT_ATK] = 0;
BLANK_CHARACTER_STATS[STAT_ATK_PCT] = 0;
BLANK_CHARACTER_STATS[STAT_FLAT_DEF] = 0;
BLANK_CHARACTER_STATS[STAT_DEF_PCT] = 0;
BLANK_CHARACTER_STATS[STAT_ER] = 100;
BLANK_CHARACTER_STATS[STAT_EM] = 0;
BLANK_CHARACTER_STATS[STAT_CR] = 5;
BLANK_CHARACTER_STATS[STAT_CD] = 50;
BLANK_CHARACTER_STATS[STAT_AMPLIFYING_RXN_MULTIPLIER] = 1;
BLANK_CHARACTER_STATS[STAT_TRANSFORMATIVE_RXN_MULTIPLIER] = 1;
BLANK_CHARACTER_STATS[STAT_ELEMENTAL_DMG] = 0;

const WANDERER_STATS = { ...BLANK_CHARACTER_STATS };
WANDERER_STATS[STAT_ATK_PCT] = 30; // Assuming Pyro is absorbed by his Skill.
WANDERER_STATS[STAT_CR] = 24.2;
const WANDERER = {
	baseHp: 10164,
  baseAtk: 328,
  baseDef: 607,
  weapon: SKYWARD_ATLAS,
  artifactSet: DESERT_PAVILION_SET,
  stats: WANDERER_STATS
};

const FISCHL_STATS = { ...BLANK_CHARACTER_STATS };
FISCHL_STATS[STAT_ATK_PCT] = 24;
const FISCHL = {
	baseHp: 9189,
  baseAtk: 244,
  baseDef: 593,
  weapon: STRINGLESS,
  artifactSet: GOLDEN_TROUPE_SET,
  stats: FISCHL_STATS
};

const XIANGLING_STATS = { ...BLANK_CHARACTER_STATS };
XIANGLING_STATS[STAT_EM] = 96;
const XIANGLING = {
	baseHp: 10875,
  baseAtk: 225,
  baseDef: 669,
  weapon: THE_CATCH,
  artifactSet: EMBLEM_SET,
  stats: XIANGLING_STATS,
  usesAmplifyingReactions: true
};

const KUKI_STATS = { ...BLANK_CHARACTER_STATS };
KUKI_STATS[STAT_EM] = 96;
const KUKI = {
	baseHp: 12289,
  baseAtk: 212,
  baseDef: 751,
  weapon: IRON_STING,
  artifactSet: PARADISE_SET,
  stats: KUKI_STATS,
  usesTransformativeReactions: true
};

const ZHONGLI_STATS = { ...BLANK_CHARACTER_STATS };
ZHONGLI_STATS[STAT_ELEMENTAL_DMG] = 28.8;
const ZHONGLI = {
	baseHp: 14695,
  baseAtk: 251,
  baseDef: 737,
  weapon: FAVONIUS_LANCE,
  artifactSet: TENACITY_SET,
  stats: ZHONGLI_STATS,
  usesHpOnly: true
};

const RAIDEN_STATS = { ...BLANK_CHARACTER_STATS };
RAIDEN_STATS[STAT_ER] = 132;
RAIDEN_STATS[STAT_ELEMENTAL_DMG] = 26.1 // From Skill passive.
const RAIDEN = {
	baseHp: 12907,
  baseAtk: 337,
  baseDef: 789,
  weapon: THE_CATCH,
  artifactSet: EMBLEM_SET,
  stats: RAIDEN_STATS,
  dynamicStats: [{
  	sourceStat: STAT_ER,
    targetStat: STAT_ELEMENTAL_DMG,
    offset: -100,
    multiplier: 0.4 // from A4 passive.
  }]
};

/********************************
 * Configurable input parameters.
 ********************************/

// Number of times to simulate a farming cycle.
const ITERATIONS = 1;

// Number of weeks to farm Artifacts for.
const MAX_NUM_WEEKS = 20;
const STARTING_WEEK = 1;

// The character being built.
const CHARACTER_UNDER_TEST = WANDERER;

// Flag that indicates whether un-upgraded artifacts should be recycled
// through the strongbox.
const USE_STRONGBOX = false;

const BENNETT_ATK_BUFF = 0;

const SET1 = "Emblem of Severed Fate";
const SET2 = "Shimenawa's Reminiscence";
const DESIRED_SET = SET1;

const DESIRED_MAIN_STATS = {};
DESIRED_MAIN_STATS[TYPE_SANDS] = [STAT_ATK_PCT];
DESIRED_MAIN_STATS[TYPE_GOBLET] = [STAT_ELEMENTAL_DMG];
DESIRED_MAIN_STATS[TYPE_CIRCLET] = [STAT_CR, STAT_CD];

const DESIRED_SUBSTATS = [
  // STAT_HP_PCT,
  // STAT_FLAT_HP,
  STAT_ATK_PCT,
  STAT_CR,
  STAT_CD,
  STAT_ER,
  // STAT_EM
];

/******************************
 * Main method and entry point.
 ******************************/
 
// For debugging and demos.
// demo();

function demo() {
  var artifact = getArtifact(false);
  console.log("Generated random artifact:");
  console.log(formatArtifact(artifact));
  
  if (artifact.substats.length === 3) {
    artifact = upgradeToFour(artifact);
  }

  upgradeArtifact(artifact);
  console.log("Upgraded to +20:");
  console.log(formatArtifact(artifact));
  console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
}
 
/**
 * Program entry point. Open the Console to view outputs.
 */
simulateMultiWeekArtifactProgression();

function simulateMultiWeekArtifactProgression() {
  let resultsByWeek = [];
  
  for (let currentWeek = STARTING_WEEK; currentWeek <= MAX_NUM_WEEKS; currentWeek++) {
  let numArtifactsToFarm = Math.floor(currentWeek * RESIN_PER_WEEK / RESIN_PER_RUN * ARTIFACTS_PER_RUN);
  	let result = simulateArtifactProgression(CHARACTER_UNDER_TEST, numArtifactsToFarm);    
    resultsByWeek.push(result);
  }
  
  if (STARTING_WEEK === MAX_NUM_WEEKS) {
  	console.log("Average total stats: \n" + 
    		formatStats(CHARACTER_UNDER_TEST, resultsByWeek[0].averageTotalStats));
  }
  
  console.log(multiWeekResultsToCsv(CHARACTER_UNDER_TEST, resultsByWeek));
}

function simulateArtifactProgression(character, numArtifactsPerIteration) {
  let totalArtifactsObtained = 0;
  let totalArtifactsUpgraded = 0;
  let totalUpgradedToFourButSkipped = 0;
  let averageTotalStats;
  
  for (let i = 0; i < ITERATIONS; i++) {
  	let equippedArtifacts = {};
    let bestTotalStats;

    // Number of artifacts to roll in this cycle.
    let artifactsToRoll = numArtifactsPerIteration;
    debugLog("Number of Artifacts to simulate: " + artifactsToRoll);
    
    // Number of +0 Artifacts from the previous run that weren't enough to
    // recycle through the Strongbox. Should always be between 0 and 2.
    let leftoverArtifacts = 0;
    
    let getArtifactsFromStrongbox = false;
    
		while (artifactsToRoll > 0) {
      let artifactsObtained = 0;
      let artifactsUpgraded = 0;
      let upgradedToFourButSkipped = 0;
      for (let j = 0; j < artifactsToRoll; j++) {
        let artifact = getArtifact(getArtifactsFromStrongbox);
        artifactsObtained++;
        let type = artifact.type;
        let isThreeLineStarter = artifact.substats.length === 3;

        let isSlotEmpty = equippedArtifacts[type] === undefined;
        // If there is no artifact currently equipped in this slot, just use this
        // artifact.
        if (isSlotEmpty && artifact.set === DESIRED_SET) {
          if (isThreeLineStarter) {
            artifact = upgradeToFour(artifact);
          }
          upgradeArtifact(artifact);
          artifactsUpgraded++;
          equippedArtifacts[type] = artifact;
          debugLog("Equipped Artifact of type " + type);
          debugLog(formatArtifact(artifact));
          bestTotalStats = getTotalStats(character, Object.values(equippedArtifacts));
          continue;
        }

        // If it's a 3-line artifact, first determine if it's worth upgrading to +4.
        if (isThreeLineStarter) {
          if (isWorthUpgrading(artifact)) {
            artifact = upgradeToFour(artifact);
          } else {
            debugLog("Artifact is not worth upgrading.");
            continue;
          }
        }

        // Now determine if this 4-line artifact is worth upgrading to +20.
        if (!isWorthUpgrading(artifact)) {
          if (isThreeLineStarter) {
            upgradedToFourButSkipped++;
          }
          debugLog("Artifact is not worth upgrading.");
          continue;
        }

        upgradeArtifact(artifact);
        artifactsUpgraded++;

        // Compare the total stats before and after equipping this artifact to
        // determine whether the current one should be replaced.
        let existingArtifact = equippedArtifacts[type];
        let totalStats1 = getTotalStats(character, Object.values(equippedArtifacts));

        equippedArtifacts[type] = artifact;
        let totalStats2 = getTotalStats(character, Object.values(equippedArtifacts));

        if (totalStats2[STAT_BASE_DAMAGE] > totalStats1[STAT_BASE_DAMAGE]) {
          bestTotalStats = totalStats2;
          debugLog("Replaced " + type + " with better Artifact:");
          debugLog(formatArtifact(artifact));
        } else {
          bestTotalStats = totalStats1;
          equippedArtifacts[type] = existingArtifact;
          debugLog("Currently equipped " + type + " is better.");
        }
      }
      
      totalArtifactsObtained += artifactsObtained;
      totalArtifactsUpgraded += artifactsUpgraded;
      totalUpgradedToFourButSkipped += upgradedToFourButSkipped;
      
      let remainingArtifacts = artifactsToRoll - artifactsUpgraded - upgradedToFourButSkipped;
      let artifactsToRecycle = remainingArtifacts + leftoverArtifacts;
      
      debugLog("Artifacts obtained: " + artifactsObtained);
      debugLog("Upgraded to +20: " + artifactsUpgraded);
      debugLog("Upgraded to +4, but skipped: " + upgradedToFourButSkipped);
      debugLog("Artifacts to recycle: " + artifactsToRecycle);
      
      // After farming artifacts with Resin, recycle the remaining artifacts with
      // the strongbox.
      if (!USE_STRONGBOX || artifactsToRecycle < 3) {
        break;
      }
      
      artifactsToRoll = Math.floor(artifactsToRecycle / 3);
      leftoverArtifacts = artifactsToRecycle % 3;
      getArtifactsFromStrongbox = true;
    }
      
    // Keep a running aggregate of total stats across all iterations to compute
    // an average at the end.
    averageTotalStats = aggregateTotalStats(averageTotalStats, bestTotalStats);
    
    if (ITERATIONS === 1) {
    	console.log("Best artifact setup: ");
      console.log(formatArtifacts(equippedArtifacts));
      console.log(formatStats(character, averageTotalStats));
    }
  }
  
  // Divide all total stats by number of iterations to compute the average.
  mapOntoTotalStats(averageTotalStats, function(stat) {
  	return stat / ITERATIONS;
  });
  
  let result = {};
  result.obtainedArtifacts = totalArtifactsObtained;
  result.upgradedArtifacts = totalArtifactsUpgraded;
  result.upgradedToFourButSkipped = totalUpgradedToFourButSkipped;
  result.averageTotalStats = averageTotalStats;
  
  if (ITERATIONS === 1) {
  	console.log("\n\n\n");
    console.log("Artifacts obtained: " + totalArtifactsObtained);
    console.log("Upgraded to +20: " + totalArtifactsUpgraded);
  	console.log("\n\n");
  }
  
  return result;
}

/**
 * Determines whether an artifact is worth upgrading by evaluating its stats
 * against provided desirable main and substats.
 */
function isWorthUpgrading(artifact) {
	// For all pieces other than the Goblet, consider the artifact undesirable
  // if the set does not match.
  let type = artifact.type;
  if (artifact.set != DESIRED_SET && type != TYPE_GOBLET) {
  	return false;
  }

	let numSubstats = artifact.substats.length;
	let desirableSubstats = 0;
  artifact.substats.forEach(function(substat) {
  	if (DESIRED_SUBSTATS.includes(substat.stat)) {
    	desirableSubstats++;
    }
  });
  
  // For Flowers and Plumes, consider a artifact as worth upgrading if there is
  // at least 1 desirable substat (2 if it's a 4-line artifact).
  if (type === TYPE_FLOWER || type === TYPE_PLUME) {
  	if (numSubstats === 3) {
  		return desirableSubstats >= 1;
    } else {
    	return desirableSubstats >= 2;
    }
  }
  
  // For other pieces, the main stat must be desirable, and there should
  // be at least 1 desirable substat if it's a 4-line artifact.
  if (!DESIRED_MAIN_STATS[type].includes(artifact.mainStat.stat)) {
  	return false;
  }

	if (numSubstats === 4) {
  	return desirableSubstats >= 1;
  } else {
  	return true;
  }
}

/*********************************************************
 * Helper methods for calculating stats and damage output.
 *********************************************************/
 
function getTotalStats(character, artifacts) {
	let weapon = character.weapon;
  let artifactSet = character.artifactSet;
	let baseAtk = character.baseAtk + weapon.baseAtk;
  let baseDef = character.baseDef;
  let baseHp = character.baseHp;
  let totalStats = {};
  
  // Sum up all stats from the various sources.
  aggregateStats(character.stats, totalStats);
  aggregateStats(weapon.stats, totalStats);
  aggregateStats(artifactSet.stats, totalStats);
  artifacts.forEach(function(artifact) {
  	aggregateArtifactStats(artifact, totalStats);
  });
  
  // Apply dynamic stat scalings.
  if (character.dynamicStats != null) {
  	let dynamicStats = character.dynamicStats;
  	dynamicStats.forEach(function(dynamicStat) {
      let sourceStatValue = totalStats[dynamicStat.sourceStat];
      totalStats[dynamicStat.targetStat] += (sourceStatValue + dynamicStat.offset) * dynamicStat.multiplier;
    });
  }
  if (artifactSet.dynamicStats != null) {
  	let dynamicStats = artifactSet.dynamicStats;
  	dynamicStats.forEach(function(dynamicStat) {
      let sourceStatValue = totalStats[dynamicStat.sourceStat];
      totalStats[dynamicStat.targetStat] += (sourceStatValue + dynamicStat.offset) * dynamicStat.multiplier;
    });
  }
  
  // Apply EM to amplifying damage multiplier.
  let totalEm = totalStats[STAT_EM];
  totalStats[STAT_AMPLIFYING_RXN_MULTIPLIER] += 2.78 * totalEm / (totalEm + 1400);
  totalStats[STAT_TRANSFORMATIVE_RXN_MULTIPLIER] += 16 * totalEm / (totalEm + 2000);
  
  let totalAtk = baseAtk * (1 + totalStats[STAT_ATK_PCT] / 100)
  		+ totalStats[STAT_FLAT_ATK]
      + BENNETT_ATK_BUFF;
  let totalHp = baseHp * (1 + totalStats[STAT_HP_PCT] / 100) + totalStats[STAT_FLAT_HP];
  let totalDef = baseDef * (1 + totalStats[STAT_DEF_PCT] / 100) + totalStats[STAT_FLAT_DEF];
  totalStats[STAT_BASE_ATK] = baseAtk;
  totalStats[STAT_TOTAL_ATK] = totalAtk;
  totalStats[STAT_TOTAL_HP] = totalHp;
  totalStats[STAT_TOTAL_DEF] = totalDef;
  totalStats[STAT_BASE_DAMAGE] = getBaseDamage(character, totalStats);
  
  return totalStats;
}

/**
 * Calculates the average base damage output of a character with a given
 * stat configuration.
 *
 * 'Base damage' is defined as the expected damage output of a 100%-scaling
 * Talent. I.e., a Talent with 200% scaling would deal two times whatever
 * this method ouputs.
 *
 * Does NOT take into account enemy RES or DEF multiplier.
 */
function getBaseDamage(character, totalStats) {
	if (character.usesTransformativeReactions) {
  	let baseReactionDamage = 4340.56;
    return baseReactionDamage * totalStats[STAT_TRANSFORMATIVE_RXN_MULTIPLIER];
  }
  
  if (character.usesHpOnly) {
    return totalStats[STAT_TOTAL_HP];
  }

  let totalAtk = totalStats[STAT_TOTAL_ATK];
  let dmgPctMultiplier = 1 + totalStats[STAT_ELEMENTAL_DMG] / 100;
  let critMultiplier = 1 + (totalStats[STAT_CR] * totalStats[STAT_CD] / 10000);
  let amplifyingReactionMultiplier = 1;
  if (character.usesAmplifyingReactions) {
    let baseReactionMultiplier = 1.5; // Assuming reverse Melt/Vaporize.
    amplifyingReactionMultiplier = baseReactionMultiplier * totalStats[STAT_AMPLIFYING_RXN_MULTIPLIER];
  }
  return totalAtk * dmgPctMultiplier * critMultiplier * amplifyingReactionMultiplier;
}

function aggregateStats(stats, totalStats) {
	let statNames = Object.keys(stats);
	for (let i = 0; i < statNames.length; i++) {
  	let statName = statNames[i];
    addOrSetStat(statName, stats[statName], totalStats);
  }
}

function aggregateArtifactStats(artifact, totalStats) {
  if (!artifact) {
    return;
  }

	let mainStat = artifact.mainStat;
	addOrSetStat(mainStat.stat, mainStat.value, totalStats);
  
  artifact.substats.forEach(function(substat) {
		addOrSetStat(substat.stat, substat.value, totalStats);
  });
}

function addOrSetStat(stat, value, totalStats) {
  if (isNaN(value)) {
    return;
  }

	if (totalStats[stat] === undefined || isNaN(totalStats[stat])) {
  	totalStats[stat] = value;
  } else {
  	totalStats[stat] += value;
  }
}

function aggregateTotalStats(totalStats1, totalStats2) {
	if (totalStats1 === undefined) {
  	return totalStats2;
  }
  
  if (totalStats2 === undefined) {
  	return totalStats1;
  }
  
  Object.keys(totalStats1).forEach(function(stat) {
  	totalStats1[stat] += totalStats2[stat];
  });
  return totalStats1;
}

function mapOntoTotalStats(totalStats, mapFunction) {
	Object.keys(totalStats).forEach(function(stat) {
  	let originalValue = totalStats[stat];
  	totalStats[stat] = mapFunction(originalValue);
  });
}

/******************************************************************
 * Helper functions for randomly generating artifacts and substats.
 ******************************************************************/

function getArtifact(fromStrongbox) {  
  let set = getSet();
  let type = getType();
  let mainStat = getMainStat(type);
  let numSubstats = getNumSubstats(fromStrongbox);
  let numUpgradesRemaining = 5;
  let substats = getSubstats(mainStat, [], numSubstats);
  
  let artifact = {};
  artifact.set = set;
  artifact.type = type;
  artifact.mainStat = {
  	stat: mainStat,
    value: 0 // placeholder value until artifact is upgraded.
  }
  artifact.numUpgradesRemaining = numUpgradesRemaining;
  artifact.substats = substats;
  
  return artifact;
}

function getSet() {
	let randomNumber = Math.random();
	if (randomNumber < 0.5) {
  	return SET1;
  } else {
  	return SET2;
  }
}

function getType() {
	let randomIndex = Math.floor(Math.random() * ARTIFACT_TYPES.length);
  return ARTIFACT_TYPES[randomIndex];
}

function getMainStat(artifactType) {
	let randomNumber = Math.random();
	if (artifactType === TYPE_FLOWER) {
  	return STAT_FLAT_HP;
  } else if (artifactType === TYPE_PLUME) {
  	return STAT_FLAT_ATK;
  } else if (artifactType === TYPE_SANDS) {
  	return getSandsMainStat(randomNumber);
  } else if (artifactType === TYPE_GOBLET) {
  	return getGobletMainStat(randomNumber);
  } else if (artifactType === TYPE_CIRCLET) {
  	return getCircletMainStat(randomNumber);
  }
}

// Main stat probability distribution for Sands artifacts
function getSandsMainStat(randomNumber) {
	if (randomNumber < 0.2668) {
  	return STAT_HP_PCT;
  } else if (randomNumber < 0.5334) {
  	return STAT_ATK_PCT;
  } else if (randomNumber < 0.80) {
  	return STAT_DEF_PCT;
  } else if (randomNumber < 0.90) {
  	return STAT_ER;
  } else {
  	return STAT_EM;
  }
}

// Main stat probability distribution for Goblet artifacts
function getGobletMainStat(randomNumber) {
	if (randomNumber < 0.1925) {
  	return STAT_HP_PCT;
  } else if (randomNumber < 0.3850) {
  	return STAT_ATK_PCT;
  } else if (randomNumber < 0.5750) {
  	return STAT_DEF_PCT;
  } else if (randomNumber < 0.60) {
  	return STAT_EM;
  } else if (randomNumber < 0.65) {
  	return STAT_ELEMENTAL_DMG;
  } else if (randomNumber < 0.70) {
  	return STAT_PHYSICAL_DMG;
  } else {
  	return STAT_OTHER_DMG;
  }
}

// Main stat probability distribution for Circlet artifacts
function getCircletMainStat(randomNumber) {
	if (randomNumber < 0.22) {
  	return STAT_HP_PCT;
  } else if (randomNumber < 0.44) {
  	return STAT_ATK_PCT;
  } else if (randomNumber < 0.66) {
  	return STAT_DEF_PCT;
  } else if (randomNumber < 0.76) {
  	return STAT_CR;
  } else if (randomNumber < 0.86) {
  	return STAT_CD;
  } else if (randomNumber < 0.96) {
  	return STAT_HB;
  } else {
  	return STAT_EM;
  }
}

/**
 * Determines how many substats an artifact should start with.
 * 
 * Artifacts obtained from strongboxes have a 34% chance of starting
 * with 4 substats. Artifacts obtained from Domains have a 20% chance
 * of starting with 4 substats.
 */
function getNumSubstats(fromStrongbox) {  
	let randomNumber = Math.random();
  if (fromStrongbox) {
  	if (randomNumber < 0.66) {
    	return 3;
    } else {
    	return 4;
    }
  } else {
  	if (randomNumber < 0.80) {
    	return 3;
    } else {
    	return 4;
    }
  }
}

function getSubstats(mainStat, existingSubstats, numSubstats) {
	// Populate a pool of available substats, excluding the main stat
  // of the artifact.
  let existingSubstatsList = [];
  existingSubstats.forEach(
    substat => existingSubstatsList.push(substat.stat)
  );
	let availableSubstats = [];
  SUBSTAT_POOL.forEach(
    substat => {
      if (substat.stat != mainStat && !existingSubstatsList.includes(substat.stat)) {
        availableSubstats.push(substat);
      }
    }
  );
  
  // Roll a random substat, repeating `numSubstats` times.
  let substats = [];
  for (let i = 0; i < numSubstats; i++) {
  	substats.push(getSubstat(availableSubstats));
  }
  
  return substats;
}

/**
 * Returns a random substat from the substat pool, taking into
 * account the relative probabilities of each substat occurring,
 * excluding any stats that are already present on the artifact.
 *
 * Removes the randomly selected substat from the provided substat
 * pool.
 */
function getSubstat(availableSubstats) {  
	// Build substat cumulative probability distribution from set of
  // remaining substats.
  substatDist = [];
  let cumulativeWeight = 0;
  for (let i = 0; i < availableSubstats.length; i++) {
    cumulativeWeight += availableSubstats[i].weight;
  	substatDist.push(cumulativeWeight);
  }
  
  // Use a random number to select a substat from the distribution.
  let randomNumber = Math.random() * cumulativeWeight;
  let selectedSubstatIndex = 0;
  for (let i = 0; i < substatDist.length; i++) {
  	selectedSubstatIndex = i;
  	if (randomNumber < substatDist[i]) {
    	break;
    }
  }
  let substat = {};
  substat.stat = availableSubstats[selectedSubstatIndex].stat;
  
  // Determine the value of the substat roll, based on whether it
  // is a low or high roll.
  substat.value = getSubstatValue(SUBSTAT_VALUES[substat.stat]);
  
  // Remove the substat from the pool of available substats.
  availableSubstats.splice(selectedSubstatIndex, 1);
  
  return substat;
}

function getSubstatValue(originalValue) {
	let randomNumber = Math.random();
  if (randomNumber < 0.25) {
  	return originalValue * 0.7;
  } else if (randomNumber < 0.50) {
  	return originalValue * 0.8;
  } else if (randomNumber < 0.75) {
  	return originalValue * 0.9;
  } else {
  	return originalValue;
  }
}

/**
 * Upgrades a 3-line artifact to +4. If the artifact already has 4 lines, just
 * returns the artifact as is.
 */
function upgradeToFour(artifact) {
	if (artifact.substats.length === 4) {
  	return artifact;
  }
  
  let newSubstat = getSubstats(artifact.mainStat.stat, artifact.substats, 1)[0];
  artifact.substats.push(newSubstat);
  artifact.numUpgradesRemaining = 4;
  return artifact;
}

/**
 * Upgrade an artifact to level 20, upgrading a random substat at
 * every 4 levels. Performs in-place updates to the provided artifact.
 */
function upgradeArtifact(artifact) {
 	// Upgrade the main stat to its full value.
	artifact.mainStat.value = MAIN_STAT_VALUES[artifact.type][artifact.mainStat.stat];
  
  // Upgrade a random substat, repeating `numUpgradesRemaining` times.
  let substats = artifact.substats;
  for (let i = 0; i < artifact.numUpgradesRemaining; i++) {
  	let randomIndex = Math.floor(Math.random() * substats.length);
  	let substatToUpgrade = substats[randomIndex];
    
    let value = getSubstatValue(SUBSTAT_VALUES[substatToUpgrade.stat]);
    substatToUpgrade.value += value;
  }
}

/**************************************************************************
 * Helper functions for converting objects into pretty strings for printing
 * on the console.
 **************************************************************************/

function formatStats(character, totalStats) {
	let output = "";
  
	output += "\nHP %: " + round(totalStats[STAT_HP_PCT], 1);
	output += "\nDEF %: " + round(totalStats[STAT_DEF_PCT], 1);
	output += "\nBase ATK: " + round(totalStats[STAT_BASE_ATK], 0);
	output += "\nATK %: " + round(totalStats[STAT_ATK_PCT], 1);
	output += "\nFlat ATK: " + round(totalStats[STAT_FLAT_ATK], 0);
  if (BENNETT_ATK_BUFF > 0) {
		output += "\nBennett ATK Buff: " + round(BENNETT_ATK_BUFF, 0);
  }
	output += "\nTotal ATK: " + round(totalStats[STAT_TOTAL_ATK], 0);
  output += "\n";
  output += "\nEM: " + round(totalStats[STAT_EM], 0);
  if (character.usesAmplifyingReactions) {
  	output += "\nAmplifying Reaction Multiplier: " 
    		+ round(totalStats[STAT_AMPLIFYING_RXN_MULTIPLIER], 2);
  }
  output += "\n";
  output += "\nCrit Rate %: " + round(totalStats[STAT_CR], 1);
  output += "\nCrit DMG %: " + round(totalStats[STAT_CD], 1);
  output += "\n";
  output += "\nER %: " + round(totalStats[STAT_ER], 1);
  output += "\n";
  output += "\nTotal DMG %: " + round(totalStats[STAT_ELEMENTAL_DMG], 1);
  output += "\n";
  output += "\nExpected Base Damage: " + round(totalStats[STAT_BASE_DAMAGE], 0);
  
  return output;
}

function formatArtifacts(artifacts) {
	let output = "";
  
  for (let i = 0; i < ARTIFACT_TYPES.length; i++) {
  	let type = ARTIFACT_TYPES[i];
    let artifact = artifacts[type];
    output += formatArtifact(artifact);
  	output += "\n";
  }
  
  return output;
}

function formatArtifact(artifact) {
  if (!artifact) {
    return "No available artifact.";
  }
  
	let output = "";
  let mainStat = artifact.mainStat;
  let substats = artifact.substats;
  output += "\n" + artifact.type + " - " + artifact.set;
  output += "\n" + mainStat.stat;
  if (mainStat.value > 0) {
  	output += ": " + round(mainStat.value, 1);
  }
  for (let j = 0; j < substats.length; j++) {
    let substat = substats[j];
    output += "\n\t" + substat.stat + ": " + round(substat.value, 1);
  }
  
  return output;
}

function toCsvFormat(character, totalStats, artifactsUpgraded, artifactsUpgradedToFour) {
	let output = "";
  
  output += "\n" + artifactsUpgraded;
  output += "\n" + artifactsUpgradedToFour;
  output += "\n";
	output += "\n" + round(totalStats[STAT_HP_PCT], 1);
	output += "\n" + round(totalStats[STAT_DEF_PCT], 1);
	output += "\n" + round(totalStats[STAT_ATK_PCT], 1);
	output += "\n" + round(totalStats[STAT_TOTAL_ATK], 0);
  output += "\n";
  output += "\n" + round(totalStats[STAT_EM], 0);
  output += "\n" + round(totalStats[STAT_ER], 1);
  output += "\n" + round(totalStats[STAT_CR], 1);
  output += "\n" + round(totalStats[STAT_CD], 1);
  output += "\n" + round(totalStats[STAT_ELEMENTAL_DMG], 1);
  output += "\n";
  output += "\n" + round(totalStats[STAT_BASE_DAMAGE], 0);
  output += "\n";
  
  return output;
}

function multiWeekResultsToCsv(character, resultsByWeek) {
  let output = "";
  let delimiter = ",";
  
  resultsByWeek.forEach(result => {
    output += result.obtainedArtifacts;
    output += delimiter + result.upgradedArtifacts;
    output += delimiter + result.upgradedToFourButSkipped;
    
    let totalStats = result.averageTotalStats;
    output += delimiter + round(totalStats[STAT_HP_PCT], 1);
    output += delimiter + round(totalStats[STAT_DEF_PCT], 1);
    output += delimiter + round(totalStats[STAT_ATK_PCT], 1);
    output += delimiter + round(totalStats[STAT_TOTAL_ATK], 0);
    output += delimiter + round(totalStats[STAT_EM], 0);
    output += delimiter + round(totalStats[STAT_ER], 1);
    output += delimiter + round(totalStats[STAT_CR], 1);
    output += delimiter + round(totalStats[STAT_CD], 1);
    output += delimiter + round(totalStats[STAT_ELEMENTAL_DMG], 1);
    output += delimiter + round(totalStats[STAT_BASE_DAMAGE], 0);
    
    output += "\n";
  });
  
  return output;
}

function round(value, decimalPlaces) {
	let multiplier = Math.pow(10, decimalPlaces);
	return Math.round(value * multiplier) / multiplier;
}

/**
 * Helper to prevent accidentally flooding console when printing
 * debug logs.
 */
function debugLog(message) {
  if (ITERATIONS === 1 && MAX_NUM_WEEKS === STARTING_WEEK) {
    console.log(message);
  }
}
