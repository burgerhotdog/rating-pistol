import { useEffect, useRef, useState } from 'react';
import { useBuild } from '@/contexts';
import { CHARACTERS, WEAPONS } from '@/data';

function validate(gameId, build, calcs) {
  if (!build) return "Build not found";
  const { weaponId } = build;
  const weaponData = WEAPONS[gameId][weaponId];
  if (!weaponData) return "Unrecognized Weapon";
  if (weaponData.quality < 3) return "Invalid Weapon";
  return null;
}

export function useSimulation(gameId, characterId, calcsIndex, team) {
  const build = useBuild().getBuilds(gameId)[characterId];
  const calcs = CHARACTERS[gameId][characterId]?.calcs?.[calcsIndex];
  const [error, setError] = useState(null);

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
    const validationError = validate(gameId, build, calcs);
    if (validationError) {
      setError(validationError);
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
        }));

        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      }
    };

    worker.postMessage({
      gameId,
      characterId,
      build,
      calcs,
      team,
    });

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [gameId, characterId, build, calcs, team]);

  return result;
}
