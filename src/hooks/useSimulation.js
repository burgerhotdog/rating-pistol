import { useEffect, useRef, useState } from 'react';
import { useBuild } from "@/contexts";
import { CHARACTERS, WEAPONS } from "@/data";

function validate(gameId, build, criteria) {
  if (!build) return "Build not found";
  const { weaponId } = build;
  const weaponData = WEAPONS[gameId][weaponId];
  if (!weaponData) return "Unrecognized Weapon";
  if (weaponData.quality < 3) return "Invalid Weapon";
  if (!criteria) return "Criteria not found";
  return null;
}

export function useSimulation(gameId, characterId, criteriaIndex, team) {
  const build = useBuild().getBuilds(gameId)[characterId];
  const criteria = CHARACTERS[gameId][characterId]?.criteria?.[criteriaIndex];
  const [error, setError] = useState(null);
  const startTimeRef = useRef(0);
  const intervalRef = useRef(null);

  const workerRef = useRef(null);
  const [result, setResult] = useState({
    weeklyScores: null,
    finalStats: null,
    isLoading: false,
    completed: 0,
    duration: 0,
    elapsed: 0,
  });
  
  useEffect(() => {
    const validationError = validate(gameId, build, criteria);
    if (validationError) {
      setError(validationError);
      setResult({
        weeklyScores: null,
        finalStats: null,
        isLoading: false,
        completed: 0,
        duration: 0,
        elapsed: 0,
      });
      return;
    }
  
    setResult(prev => ({
      ...prev,
      isLoading: true,
      completed: 0,
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
        }));
        return;
      }

      if (data.type === 'done') {
        const endTime = performance.now();
        const duration = endTime - startTimeRef.current;

        clearInterval(intervalRef.current);
        intervalRef.current = null;

        setResult(prev => ({
          ...prev,
          completed: data.completed,
          weeklyScores: data.weeklyScores,
          finalStats: data.finalStats,
          isLoading: false,
          duration,
          elapsed: duration,
        }));

        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      }
    };

    startTimeRef.current = performance.now();
    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTimeRef.current;
      setResult(prev => ({ ...prev, elapsed }));
    }, 1000);

    worker.postMessage({
      gameId,
      characterId,
      build,
      criteria,
      team,
    });

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [gameId, characterId, build, criteria, team]);

  return result;
}
