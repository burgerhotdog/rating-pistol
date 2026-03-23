import { Box, Stack } from '@mui/material';
import {
  Graphs,
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
      <Graphs />
    </Box>
  );
};

export default GamePage;
