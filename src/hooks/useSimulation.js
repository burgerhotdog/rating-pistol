import { useEffect, useRef, useState } from 'react';
import { useBuild } from '@/contexts';
import { WEAPONS } from '@/data';

function validate(gameId, build) {
  if (!build) return "Build not found";
  const { weaponId } = build;
  const weaponData = WEAPONS[gameId][weaponId];
  if (!weaponData) return "Unrecognized Weapon";
  if (weaponData.quality < 3) return "Invalid Weapon";
  return null;
}

export function useSimulation(gameId, characterId, team, enabled = true) {
  const build = useBuild().getBuilds(gameId)[characterId];

  const workerRef = useRef(null);
  const [result, setResult] = useState({
    weeklyScores: null,
    finalStats: null,
    preferredMainStats: null,
    mainStatDist: null,
    weeklyDistribution: null,
    teamWeeklyScores: null,
    isLoading: false,
    completed: 0,
  });
  
  useEffect(() => {
    if (!enabled) {
      workerRef.current?.terminate();
      workerRef.current = null;
      setResult({
        weeklyScores: null,
        finalStats: null,
        preferredMainStats: null,
        mainStatDist: null,
        weeklyDistribution: null,
        teamWeeklyScores: null,
        isLoading: false,
        completed: 0,
        diff: null,
        simCharacter: characterId,
      });
      return;
    }

    const validationError = validate(gameId, build);
    if (validationError) {
      setResult({
        weeklyScores: null,
        finalStats: null,
        preferredMainStats: null,
        mainStatDist: null,
        weeklyDistribution: null,
        teamWeeklyScores: null,
        isLoading: false,
        completed: 0,
      });
      return;
    }
  
    setResult(prev => ({
      ...prev,
      isLoading: true,
      completed: 0,
      diff: null,
    }));
  
    workerRef.current?.terminate();

    const worker = new Worker(
      new URL('../workers/simulation/worker.js', import.meta.url),
      { type: 'module' },
    );
    workerRef.current = worker;

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        setResult(prev => ({
          ...prev,
          completed: data.completed,
          diff: data.diff,
        }));
        return;
      }

      if (data.type === 'done') {
        setResult(prev => ({
          ...prev,
          completed: data.completed,
          weeklyScores: data.weeklyScores,
          finalStats: data.finalStats,
          preferredMainStats: data.preferredMainStats,
          mainStatDist: data.mainStatDist,
          weeklyDistribution: data.weeklyDistribution,
          teamWeeklyScores: data.teamWeeklyScores,
          isLoading: false,
          simCharacter: characterId,
          teamFinalStats: data.teamFinalStats,
        }));

        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      }
    };

    worker.postMessage({
      gameId,
      characterId,
      build,
      team,
    });

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [enabled, gameId, characterId, build, team]);

  return result;
}
