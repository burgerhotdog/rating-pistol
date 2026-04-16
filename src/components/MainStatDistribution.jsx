import { Box, Card, LinearProgress, Tooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { STATS } from '@/data';

export const MainStatDistribution = ({ gameId, mainStatDist }) => {
  if (!mainStatDist) return null;

  const { EQUIP_NAMES, MAIN_STAT_TYPES } = STATS[gameId];
  if (!EQUIP_NAMES) return null;

  const slots = EQUIP_NAMES
    .map((slotName, index) => {
      const slotOptions = MAIN_STAT_TYPES[index];
      if (!slotOptions) return null;

      const dist = mainStatDist[index];
      // For fixed slots (single option), show 100% for that stat
      const isFixed = Object.keys(slotOptions).length === 1;
      const effectiveDist = (dist && Object.keys(dist).length)
        ? dist
        : isFixed ? { [Object.keys(slotOptions)[0]]: 1 } : null;
      if (!effectiveDist) return null;

      // Sort by percentage descending
      const entries = Object.entries(effectiveDist)
        .map(([statId, pct]) => ({
          statId,
          name: slotOptions[statId]?.NAME ?? statId,
          pct,
        }))
        .sort((a, b) => b.pct - a.pct);

      return { slotName, entries };
    })
    .filter(Boolean);

  if (!slots.length) return null;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold">Main Stat Distribution</Typography>
        <Tooltip title="How often each main stat appears across all simulated builds at the benchmark week." placement="top" arrow>
          <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </Tooltip>
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, pb: 1.5 }}>
        {slots.map(({ slotName, entries }) => (
          <Box key={slotName} sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {slotName}
            </Typography>
            {entries.map(({ statId, name, pct }) => (
              <Box key={statId} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                <Typography variant="caption" sx={{ minWidth: 80, flexShrink: 0 }}>
                  {name}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={pct * 100}
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'action.hover',
                    '& .MuiLinearProgress-bar': { borderRadius: 3 },
                  }}
                />
                <Typography variant="caption" sx={{ minWidth: 36, textAlign: 'right' }}>
                  {(pct * 100).toFixed(0)}%
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Card>
  );
};
