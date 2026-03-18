import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
} from '@/components';
import { useSortCharacterIds, useComputedStats } from '@/hooks';

const GamePage = ({ gameId }) => {
  const sortedIds = useSortCharacterIds();
  const [selectedId, setSelectedId] = useState(sortedIds[0] ?? null);
  const { baseStats, equipStats } = useComputedStats(selectedId);

  return (
    <Stack
      direction="row"
      overflow="hidden"
      gap={2}
      pb={2}
    >
      <Sidebar
        sortedIds={sortedIds}
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
