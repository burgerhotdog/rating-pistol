import { useMemo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GI, WW, ZZZ } from '@/data';

const VALID = new Set([GI, WW, ZZZ]);

export const useSimulation = (team) => {
  const { gameId, characterId } = useParams();

  const workerRef = useRef(null);
  const [result, setResult] = useState({});

  const payload = useMemo(() => {
    const isValidGame = VALID.has(gameId);
    const isValidTeam = team.every(member => !member.id || member.rotation.length > 0);
    const isValid = isValidGame && isValidTeam;

    return isValid ? { gameId, characterId, team } : null;
  }, [gameId, characterId, team]);

  useEffect(() => {
    workerRef.current?.terminate();
    workerRef.current = null;

    if (!payload) return;

    const worker = new Worker(
      new URL('../workers/simulation/worker.js', import.meta.url),
      { type: 'module' },
    );

    workerRef.current = worker;

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        return setResult(prev => ({ ...prev, ...data }));
      }

      if (data.type === 'done') {
        setResult(prev => ({ ...prev, ...data }));

        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      }
    };

    worker.postMessage(payload);

    return () => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
    };
  }, [payload]);

  return payload ? result : { statusMessage: 'Simulation disabled' };
};
