import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  ComparisonTable,
} from '@/components';
import { BuildDataContext } from '@/contexts';
import { ALL_CHARACTER_LOOKUP, ALL_WEAPON_LOOKUP, ALL_GENERAL_LOOKUP } from '@/lookups';

const GamePage = () => {
  const { gameId } = useParams();
  const { allBuildData } = useContext(BuildDataContext);

  const [selectedId, setSelectedId] = useState(null);

  const [baseStats, buildStats] = useMemo(() => {
    const selectedData = allBuildData[gameId]?.[selectedId];
    if (!selectedData) return [{}, {}];

    const baseStats = {};
    const characterBaseStats = ALL_CHARACTER_LOOKUP[gameId][selectedId].baseStats;
    for (const statId in characterBaseStats) {
      baseStats[statId] = characterBaseStats[statId];
    }

    const weaponBaseStats = ALL_WEAPON_LOOKUP[gameId][selectedData.weaponId].baseStats;
    for (const statId in weaponBaseStats) {
      baseStats[statId] += weaponBaseStats[statId];
    }

    const buildStats = {};
    const selectedEquipList = selectedData.equipList;
    for (const equipObj of selectedEquipList) {
      buildStats[equipObj.mainStatId] = (buildStats[equipObj.mainStatId] || 0) + ALL_GENERAL_LOOKUP[gameId].STATS[equipObj.mainStatId].mainValue;

      for (const subStatObj of equipObj.subStatList) {
        buildStats[subStatObj.subStatId] = (buildStats[subStatObj.subStatId] || 0) + subStatObj.value;
      }
    }

    return [baseStats, buildStats];
  }, [selectedId]);

  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      minHeight: 0,
      gap: 2,
      pb: 2,
      overflow: 'hidden',
    }}>
      <Sidebar
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />

      <StatsPanel
        selectedId={selectedId}
        baseStats={baseStats}
        buildStats={buildStats}
      />

      {/* ── Graphs panel ── */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
      }}>
        <CustomLineChart />

        <Box sx={{ flex: 2, display: 'flex', gap: 2, minHeight: 0 }}>
          <CustomRadarChart />
          <ComparisonTable />
        </Box>
      </Box>
    </Box>
  );
};

export default GamePage;
