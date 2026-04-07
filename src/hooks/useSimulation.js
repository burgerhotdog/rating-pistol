import { useEffect, useRef, useState } from 'react';
import { useCurrent } from '@/hooks';

export function useSimulation(criteriaIndex, buffs) {
  const { gameId, characterId, build, criteria } = useCurrent();

  const workerRef = useRef(null);
  const [result, setResult] = useState({
    weeklyRatings: null,
    finalStats: null,
    isLoading: false,
    completed: 0,
  });
  
  useEffect(() => {
    if (!build || !criteria) {
      setResult({
        weeklyRatings: null,
        finalStats: null,
        isLoading: false,
        completed: 0,
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
        setResult(prev => ({
          ...prev,
          completed: data.completed,
          weeklyRatings: data.weeklyRatings,
          finalStats: data.finalStats,
          isLoading: false,
        }));

        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      }
    };
    worker.postMessage({
      gameId,
      characterId,
      build,
      criteria: criteria[criteriaIndex],
      buffs,
    });

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [gameId, characterId, build, criteria, criteriaIndex, buffs]);

  return result;
}
