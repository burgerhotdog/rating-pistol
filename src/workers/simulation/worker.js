import { mergeEquipList, computeTotalStat, compileStatMap } from "@/utils";
import { findBenchmarkWeek, getAverageScores, findRelativeError } from "./helpers";
import { createTrial } from "./createTrial";
import { advanceTrial } from "./advanceTrial";
import { advanceTrialWuwa } from "./advanceTrialWuwa";
import { findPreferred, findPreferredWuwa } from "./findPreferred";
import { CHARACTERS } from "@/data";

const MIN_TRIALS = 100;
const MAX_TRIALS = 1000;
const MAX_WEEKS = 20;

self.onmessage = ({ data }) => {
  const { gameId, characterId, build, calcs, team } = data;
  const isWuwa = gameId === "wuthering-waves";
  const setIdList = build.equipList.map(equip => equip?.setId);
  const matchTargets = (calcs.match ?? []).map(stat => {
    return computeTotalStat(stat, compileStatMap(gameId, characterId, build, team, "menu"));
  });
  const trials = [];
  let lastBenchmarkWeek = null;

  // Initialize first week
  for (let i = 0; i < MIN_TRIALS; i++) {
    trials.push(createTrial(matchTargets, gameId, characterId, build, calcs, team));
  }

  const preferredMainStats = isWuwa
    ? findPreferredWuwa(trials[0], gameId, characterId, calcs, team, matchTargets)
    : findPreferred(trials[0], gameId, characterId, calcs, team, matchTargets);

  for (let week = 1; week <= MAX_WEEKS; week++) {
    // advance all trials by one week
    for (const trial of trials) {
      if (isWuwa) {
        advanceTrialWuwa(preferredMainStats, trial, setIdList, matchTargets, characterId, calcs, team);
      } else {
        advanceTrial(preferredMainStats, trial, setIdList, matchTargets, gameId, characterId, calcs, team);
      }
    }

    // if relative error is too high add more trials
    while (trials.length < MAX_TRIALS) {
      const values = trials.map(trial => trial.scores[week]);
      if (findRelativeError(values) <= 0.005) break;

      // add another trial
      const trial = createTrial(matchTargets, gameId, characterId, build, calcs, team);
      for (let w = 1; w <= week; w++) {
        if (isWuwa) {
          advanceTrialWuwa(preferredMainStats, trial, setIdList, matchTargets, characterId, calcs, team);
        } else {
          advanceTrial(preferredMainStats, trial, setIdList, matchTargets, gameId, characterId, calcs, team);
        }
      }
      trials.push(trial);
    }
  
    let weeklyScores = getAverageScores(trials, week);
    let { benchmarkWeek, diff } = findBenchmarkWeek(weeklyScores);

    if (benchmarkWeek !== -1 && benchmarkWeek <= week) {
      lastBenchmarkWeek = benchmarkWeek;
      break;
    }

    self.postMessage({ type: "progress", completed: week, diff });
  }

  // If damage never hit plateau, set benchmark to week 20
  if (!lastBenchmarkWeek) {
    lastBenchmarkWeek = 20;
  }

  const weeklyScores = getAverageScores(trials, lastBenchmarkWeek);

  // Average final week equip stats
  const finalStats = {};
  for (let i = 0; i < trials.length; i++) {
    const finalCombined = mergeEquipList(trials[i].build.equipList);
    for (const stat in finalCombined) {
      finalStats[stat] = (finalStats[stat] ?? 0) + finalCombined[stat] / trials.length;
    }
  }

  // Main stat distribution at benchmark week (per slot)
  const slotCount = trials[0].build.equipList.length;
  const mainStatDist = Array.from({ length: slotCount }, () => ({}));
  for (const trial of trials) {
    for (let s = 0; s < slotCount; s++) {
      const equip = trial.build.equipList[s];
      if (!equip) continue;
      const id = equip.mainStatId;
      mainStatDist[s][id] = (mainStatDist[s][id] ?? 0) + 1;
    }
  }
  // Normalize to percentages
  for (let s = 0; s < slotCount; s++) {
    const total = Object.values(mainStatDist[s]).reduce((a, b) => a + b, 0);
    if (total > 0) {
      for (const id in mainStatDist[s]) {
        mainStatDist[s][id] = mainStatDist[s][id] / total;
      }
    }
  }

  // Per-week score percentiles for distribution bands
  const weeklyDistribution = [];
  for (let week = 0; week <= lastBenchmarkWeek; week++) {
    const values = trials.map(t => t.scores[week]).sort((a, b) => a - b);
    const n = values.length;
    weeklyDistribution.push({
      min: values[0],
      p10: values[Math.floor(n * 0.1)],
      q1: values[Math.floor(n * 0.25)],
      median: values[Math.floor(n * 0.5)],
      q3: values[Math.floor(n * 0.75)],
      p90: values[Math.floor(n * 0.9)],
      max: values[n - 1],
    });
  }

  // Simulate teammates (Wuthering Waves only)
  const teamWeeklyScores = {};
  if (isWuwa) {
    for (let ti = team.length - 1; ti >= 0; ti--) {
      const memberCharId = team[ti];
      if (!memberCharId || memberCharId === characterId) continue;

      const memberData = CHARACTERS["wuthering-waves"][memberCharId];
      const memberCalcs = memberData?.calcs?.[0];
      if (!memberCalcs) continue;

      const memberPreset = memberData?.preset;
      if (!memberPreset?.weaponId || !memberPreset?.setBonuses) continue;

      // Build setIdList from preset.setBonuses: fill slots in order
      const memberSetIdList = new Array(5).fill(null);
      let slot = 0;
      for (const [setId, count] of memberPreset.setBonuses) {
        for (let i = 0; i < Number(count); i++) {
          if (slot < 5) memberSetIdList[slot++] = setId;
        }
      }

      const memberBuild = {
        weaponId: memberPreset.weaponId,
        equipList: new Array(5).fill(null),
      };

      const memberMatchTargets = (memberCalcs.match ?? []).map(stat => {
        return computeTotalStat(stat, compileStatMap("wuthering-waves", memberCharId, memberBuild, team, "menu"));
      });

      // Initialize trials for this teammate
      const memberTrials = [];
      for (let i = 0; i < MIN_TRIALS; i++) {
        memberTrials.push(createTrial(memberMatchTargets, "wuthering-waves", memberCharId, memberBuild, memberCalcs, team));
      }

      const memberPreferredMainStats = findPreferredWuwa(
        memberTrials[0], "wuthering-waves", memberCharId, memberCalcs, team, memberMatchTargets
      );

      // Advance for lastBenchmarkWeek weeks, aligned to main character's timeline
      for (let week = 1; week <= lastBenchmarkWeek; week++) {
        for (const trial of memberTrials) {
          advanceTrialWuwa(memberPreferredMainStats, trial, memberSetIdList, memberMatchTargets, memberCharId, memberCalcs, team);
        }

        while (memberTrials.length < MAX_TRIALS) {
          const values = memberTrials.map(trial => trial.scores[week]);
          if (findRelativeError(values) <= 0.005) break;

          const trial = createTrial(memberMatchTargets, "wuthering-waves", memberCharId, memberBuild, memberCalcs, team);
          for (let w = 1; w <= week; w++) {
            advanceTrialWuwa(memberPreferredMainStats, trial, memberSetIdList, memberMatchTargets, memberCharId, memberCalcs, team);
          }
          memberTrials.push(trial);
        }
      }

      teamWeeklyScores[memberCharId] = getAverageScores(memberTrials, lastBenchmarkWeek);
    }
  }

  self.postMessage({ type: "done", completed: lastBenchmarkWeek, weeklyScores, finalStats, preferredMainStats, mainStatDist, weeklyDistribution, teamWeeklyScores });
};
