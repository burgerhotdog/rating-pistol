import { useMemo, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WW, CHARACTER, WEAPON, SET, ECHO } from '@/data';

const VALID_GAMES = new Set([WW]);

function validTeam(gameId, charId, team) {
  if (!VALID_GAMES.has(gameId)) return;

  const fTeam = team.filter((member) => member?.id);
  if (!fTeam.length) return;
  return fTeam.every((member) => {
    // Check all ids are valid
    if (!(member.id in CHARACTER[gameId])) return;
    if (!(member.weaponId in WEAPON[gameId])) return;
    if (Object.keys(member.setCounts).some((setId) => !(setId in SET[gameId]))) return;
    if (member.mainEcho && !(member.mainEcho in ECHO)) return;

    // charId must have build
    if (member.id === charId) {
      if (!member.build?.equipList) return;
    }

    return true;
  });
}

export function useSimulation(team) {
  const { gameId, charId } = useParams();
  const workerRef = useRef(null);
  const prevPayloadRef = useRef(undefined);
  const [result, setResult] = useState({});

  const payload = useMemo(() => {
    const charIdNum = Number(charId);
    if (!validTeam(gameId, charIdNum, team)) return;
    return { gameId, charId: charIdNum, team };
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
}
