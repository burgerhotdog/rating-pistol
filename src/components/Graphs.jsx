import { Stack } from '@mui/material';
import {
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
} from '@/components';
import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BuildContext } from '@/contexts';
import { CHARACTER_LOOKUP } from '@/lookups';
import { computeDamage, combineEquipStats } from '@/utils';
import { simulateArtifactProgresion } from '@/utils';

const ITERATIONS = 10;

export const Graphs = () => {
  const { gameId, charId } = useParams();
  const { buildCollections } = useContext(BuildContext);
  const charBuild = buildCollections[gameId]?.[charId] ?? null;
  const damage = computeDamage(gameId, charId, charBuild);

  const [compiledProgressionData, avgFinalWeekStats] = useMemo(() => {
    if (!CHARACTER_LOOKUP[gameId][charId]?.CRITERIA) return [null, null];
    if (!charBuild) return [null, null];

    let rawData = [];
    for (let i = 0; i < ITERATIONS; i++) {
      const progression = simulateArtifactProgresion(gameId, charId, charBuild);
      rawData.push(progression);
    }

    let avgData = [];
    for (let i = 0; i < 21; i++) {
      const avgDmg = rawData.reduce((acc, arr) => acc + arr[i][0], 0) / ITERATIONS;
      avgData.push({ week: i, damage: avgDmg });
    }

    const avgFinalStats = {};
    for (let i = 0; i < ITERATIONS; i++) {
      const finalEquipList = rawData[i][20][1].equipList;
      const finalCombined = combineEquipStats(finalEquipList);
      for (const stat in finalCombined) {
        avgFinalStats[stat] = (avgFinalStats[stat] ?? 0) + finalCombined[stat];
      }
    }

    for (const stat in avgFinalStats) {
      avgFinalStats[stat] = avgFinalStats[stat] / ITERATIONS;
    }
    return [avgData, avgFinalStats];
  }, [gameId, charId, charBuild]);

  if (!CHARACTER_LOOKUP[gameId][charId]?.CRITERIA || !charBuild) return null;
  return (
    <Stack gap={2}>
      <CustomLineChart data={compiledProgressionData} damage={damage} />

      <Stack direction="row" gap={2}>
        <CustomRadarChart
          combinedCharBuild={combineEquipStats(charBuild.equipList)}
          avgFinalWeekStats={avgFinalWeekStats}
          weaponId={charBuild.weaponId}
        />
        <CustomTable />
      </Stack>
    </Stack>
  );
};
