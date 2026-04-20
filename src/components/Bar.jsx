import { useState, useEffect } from "react";
import { Box, Card, LinearProgress, Stack, Typography } from '@mui/material';

export const Bar = ({ completed, elapsed, diff }) => {
  const maxWeeks = 20;
  const elapsedSeconds = Math.floor((elapsed ?? 0) / 1000);

  const [initialDiff, setInitialDiff] = useState(diff);

  useEffect(() => {
    if (diff === undefined) {
      setInitialDiff(undefined);
    } else if (initialDiff === undefined) {
      setInitialDiff(diff);
    }
  }, [diff, initialDiff]);

  return (
    <Card sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} sx={{ width: '50%', maxWidth: 360 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Running simulation…
        </Typography>

        <LinearProgress
          variant="determinate"
          value={initialDiff !== undefined && diff !== undefined
            ? Math.min(Math.max(((initialDiff - diff) / (initialDiff - 0.01)) * 100, 0), 100)
            : 0}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': { borderRadius: 3 },
          }}
        />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            Week {completed} / {maxWeeks}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {elapsedSeconds}s
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};