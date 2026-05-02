import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBuild } from '@/contexts';
import { CHARACTERS, MVS, WEAPONS } from '@/data';

function validatePayload({ gameId, characterId, build, team }) {
  // gameId
  if (!['wuthering-waves'].includes(gameId)) return `invalid gameId "${gameId}"`;

  // characterId (characters.json and mvs.json)
  const characterData = CHARACTERS[gameId][characterId];
  if (!characterData) return `characterId "${characterId}" doesn't exist in gameId "${gameId}"`;
  const { element, stats: characterStats } = characterData;
  if (!element) return `missing "element" for characterId "${characterId}"`;
  if (!characterStats) return `missing "stats" for characterId "${characterId}"`;
  const { BASE_HP, BASE_ATK, BASE_DEF } = characterStats.constant;
  if (!BASE_HP || !BASE_ATK || !BASE_DEF) return `missing base stats for characterId "${characterId}"`;
  const characterMvs = MVS[gameId][characterId];
  if (!characterMvs) return `missing "mvs" for characterId "${characterId}"`;

  // build
  if (!build) return 'build is undefined';
  const { weaponId, equipList } = build;
  if (!weaponId) return 'weaponId is undefined';
  const weaponData = WEAPONS[gameId][weaponId];
  if (!weaponData) return `weaponId "${weaponId}" doesn't exist in gameId "${gameId}"`;
  const { name: weaponName, quality: weaponQuality } = weaponData;
  if (Number(weaponQuality) < 3) return `weapon "${weaponName}" is not supported"`;
  if (!equipList) return 'equipList is undefined';

  // team
  if (!team) return 'team is undefined';
  for (const member of team) {
    if (!member) return 'team contains undefined member';
    const { memberId, weaponId, setCounts, rotation, build } = member;
    if (memberId === null) continue;
    if (!memberId) return 'team contains undefined memberId';
    const memberData = CHARACTERS[gameId][memberId];
    if (!memberData) return `memberId "${memberId}" doesn't exist in gameId "${gameId}"`;
    const { name, element, stats } = memberData;
    if (!element) return `missing "element" for memberId "${memberId}"`;
    if (!stats) return `missing "stats" for memberId "${memberId}"`;
    const { BASE_HP, BASE_ATK, BASE_DEF } = stats.constant;
    if (!BASE_HP || !BASE_ATK || !BASE_DEF) return `missing base stats for memberId "${memberId}"`;
    if (!MVS[gameId][memberId]) return `missing "mvs" for memberId "${memberId}"`;

    if (!weaponId) return `team member "${name}" contains undefined weaponId`;
    if (!setCounts) return `team member "${name}" contains undefined setCounts`;
    if (!rotation) return `team member "${name}" contains undefined rotation`;

    if (memberId === characterId) {
      if (!build) return `team member "${name}" contains undefined build`;
      const { equipList } = build;
      if (!equipList) return `team member "${name}" contains undefined equipList`;
    }
  }
  return null;
}

export function useSimulation(team) {
  const { gameId, characterId } = useParams();
  const build = useBuild().getBuilds(gameId)[characterId];

  const workerRef = useRef(null);
  const [result, setResult] = useState({});
  
  useEffect(() => {
    const payload = { gameId, characterId, build, team };
    const error = validatePayload(payload);
    if (error) {
      console.log(error);
      workerRef.current?.terminate();
      workerRef.current = null;
      setResult({ error });
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
          completed: data.completed,
          diff: data.diff,
        }));
        return;
      }

      if (data.type === 'done') {
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
          teamFinalStats: data.teamFinalStats,
          actionMap: data.actionMap,
          actionMapsWithSub: data.actionMapsWithSub,
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
  }, [gameId, characterId, build, team]);

  return result;
}
