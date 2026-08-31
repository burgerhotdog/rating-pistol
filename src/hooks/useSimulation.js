import { useMemo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CHARACTER, WEAPON, SET, ECHO } from '@/data';

const isValid = ({ gameId, charId, team }) => team
  .filter((member) => member.id != null)
  .every((member) => {
    const charData = CHARACTER[gameId][member.id];
    if (!charData || charData.disabled) return;

    const weapData = WEAPON[gameId][member.weaponId];
    if (!weapData || weapData.disabled) return;

    for (const setId in member.setCounts) {
      const setData = SET[gameId][setId];
      if (!setData || setData.disabled) return;
    }

    if (member.mainEcho) {
      const echoData = ECHO[member.mainEcho];
      if (!echoData || echoData.disabled) return;
    }

    // charId must have build
    if (member.id === charId) {
      if (!member.build?.equipList) return;
    }

    return true;
  });

export const useSimulation = (team) => {
  const { gameId, charId } = useParams();
  const workerRef = useRef(null);
  const prevPayloadRef = useRef(undefined);
  const [result, setResult] = useState({});

  const payload = useMemo(() => {
    const data = { gameId, charId: Number(charId), team };
    return isValid(data) ? data : null;
  }, [gameId, charId, team]);

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

      if (data.userSnapshots) {
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
};
