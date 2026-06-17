import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CHARACTER } from '@/data';

export function useSimulation(team) {
  const { gameId, characterId } = useParams();

  const workerRef = useRef(null);
  const [result, setResult] = useState({});
  
  useEffect(() => {
    const payload = { gameId, characterId, team };

    if (!['wuthering-waves'].includes(gameId)) {
      workerRef.current?.terminate();
      workerRef.current = null;
      setResult({});
      return;
    }
  
    setResult({
      simCharacter: characterId,
      isLoading: true,
    });
  
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
          ...('currentMember' in data ? { currentMember: data.currentMember ? CHARACTER[gameId][data.currentMember].name : null } : {}),
          ...('completed' in data ? { completed: data.completed } : {}),
          ...('diff' in data ? { diff: data.diff } : {}),
          ...('trial' in data ? { trial: data.trial } : {}),
          ...('statusMessage' in data ? { statusMessage: data.statusMessage } : {}),
        }));
        return;
      }

      if (data.type === 'done') {
        console.log(data);
        setResult(prev => ({
          ...prev,
          isFarmingDone: true,
          completed: data.completed,
          weeklyScores: data.weeklyScores,
          finalStats: data.finalStats,
          preferredMainStats: data.preferredMainStats,
          mainStatDist: data.mainStatDist,
          weeklyDistribution: data.weeklyDistribution,
          isLoading: false,
          simCharacter: characterId,
          actionMap: data.actionMap,
          actionMapsWithSub: data.actionMapsWithSub,
          cache: data.cache,
        }));

        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      }
    };

    worker.postMessage(payload);

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [gameId, characterId, team]);

  return result;
}
