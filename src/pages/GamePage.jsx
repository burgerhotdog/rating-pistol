import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CharacterSidebar, StatsPanel, RadarChartTest } from '@/components';

const PlaceholderGraph = ({ title, sx, ...props }) => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 3,
      bgcolor: 'rgba(255,255,255,0.02)',
      minHeight: 0,
      ...sx,
    }}
    {...props}
  >
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Box>
);

const GamePage = () => {
  const [selectedId, setSelectedId] = useState(0);

  return (
    <Box sx={{
      display: 'flex',
      flex: 1,
      minHeight: 0,
      gap: 2,
      pb: 2,
      overflow: 'hidden',
    }}>
      <CharacterSidebar selectedId={selectedId} setSelectedId={setSelectedId} />
      <StatsPanel selectedId={selectedId} />

      {/* ── Graphs panel ── */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: 0,
      }}>
        <PlaceholderGraph title="Distribution Graph" sx={{ flex: 3 }} />

        <Box sx={{ flex: 2, display: 'flex', gap: 2, minHeight: 0 }}>
          <RadarChartTest />
          <PlaceholderGraph title="Comparison" />
        </Box>
      </Box>
    </Box>
  );
};

export default GamePage;
