import { Box, Stack } from '@mui/material';
import {
  Sidebar,
  StatsPanel,
  CustomLineChart,
  CustomRadarChart,
  CustomTable,
} from '@/components';

const GamePage = () => {
  return (
    <Box
      display="flex"
      sx={{
        overflow: 'hidden',
        pb: 4,
        gap: 2,
        flex: 1,
      }}
    >
      <Sidebar />
      <StatsPanel />

      <Stack gap={2}>
        <CustomLineChart />

        <Stack direction="row" gap={2}>
          <CustomRadarChart />
          <CustomTable />
        </Stack>
      </Stack>
    </Box>
  );
};

export default GamePage;
