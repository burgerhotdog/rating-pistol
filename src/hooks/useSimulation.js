import { useMemo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WW } from '@/data';

const VALID_GAME_IDS = new Set([WW]);

export const useSimulation = (team) => {
  const { gameId, characterId } = useParams();
  const workerRef = useRef(null);
  const prevPayloadRef = useRef(undefined);
  const [result, setResult] = useState({});

  const payload = useMemo(() => {
    if (!VALID_GAME_IDS.has(gameId)) return null;

    const filteredTeam = team.filter((member) => member.id);
    if (filteredTeam.some((member) => !member.rotation.length)) {
      return null;
    }

    return { gameId, characterId, team: filteredTeam };
  }, [gameId, characterId, team]);

  if (prevPayloadRef.current !== payload) {
    prevPayloadRef.current = payload;
    setResult({});
  }

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
      setResult((prev) => ({ ...prev, ...data }));

      if ('userSummary' in data) {
        worker.terminate();
        if (workerRef.current === worker) {
          workerRef.current = null;
        }
      }
    };

    worker.postMessage(payload);

    return () => {
      worker.terminate();
      if (workerRef.current === worker) {
        workerRef.current = null;
      }
    };
  }, [payload]);

  return payload ? result : { status: 'Simulation disabled' };
};
