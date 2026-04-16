import { Box, Card, LinearProgress, Stack, Typography } from '@mui/material';

export const Bar = ({ completed, elapsed }) => {
  const maxWeeks = 20;
  const progress = Math.min((completed / maxWeeks) * 100, 100);
  const elapsedSeconds = Math.floor((elapsed ?? 0) / 1000);

  return (
    <Card sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} sx={{ width: '50%', maxWidth: 360 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Running simulation…
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
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
