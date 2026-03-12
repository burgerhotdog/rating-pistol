import { useState } from 'react';
import { Box } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
} from '@/components';
import { useComputedStats } from '@/hooks';

const GamePage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const { baseStats, equipStats } = useComputedStats(selectedId);

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
        equipStats={equipStats}
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
          <CustomTable />
        </Box>
      </Box>
    </Box>
  );
};

export default GamePage;
