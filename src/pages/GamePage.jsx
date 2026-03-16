import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
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
    <Stack
      direction="row"
      overflow="hidden"
      gap={2}
      pb={2}
    >
      <Sidebar
        selectedId={selectedId}
        setSelectedId={setSelectedId}
      />

      <StatsPanel
        selectedId={selectedId}
        baseStats={baseStats}
        equipStats={equipStats}
      />
      <Typography variant="h6" fontWeight={700}>
        Work in Progress. Stats may not reflect actual in-game values.
      </Typography>

      {/* ── Graphs panel ── */}
      <Stack gap={2}>
        {false && (
          <>
            <CustomLineChart />

            <Stack direction="row" gap={2}>
              <CustomRadarChart />
              <CustomTable />
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default GamePage;
