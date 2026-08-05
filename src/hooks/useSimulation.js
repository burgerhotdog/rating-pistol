import { useMemo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WW } from '@/data';

const WORKER_PATH = '../workers/simulation/worker.js';
const VALID_GAME_IDS = new Set([WW]);

export function useSimulation(team) {
  const { gameId, charId } = useParams();
  const workerRef = useRef(null);
  const prevPayloadRef = useRef(undefined);
  const [result, setResult] = useState({});

  const payload = useMemo(() => {
    if (!team?.members?.length) return;
    if (!VALID_GAME_IDS.has(gameId)) return;

    const filteredTeam = team.members.filter((member) => member.id);
    if (filteredTeam.some((member) => !member.rotation?.length)) return;

    return { gameId, charId, team: filteredTeam };
  }, [gameId, charId, team]);

  if (prevPayloadRef.current !== payload) {
    prevPayloadRef.current = payload;
    setResult({});
  }

  useEffect(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    if (!payload) return;

    const worker = new Worker(new URL(WORKER_PATH, import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = ({ data }) => {
      setResult((prev) => ({ ...prev, ...data }));

      if ('userSummary' in data) {
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

  return payload ? result : {};
}
