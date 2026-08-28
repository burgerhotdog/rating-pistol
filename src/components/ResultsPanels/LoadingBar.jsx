import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { useAccent } from '@/hooks';

const LoadingBar = ({ results }) => {
  const { status, progressDay } = results;
  const accent = useAccent();

  return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} sx={{ width: '50%' }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: 'center' }}
        >
          {status ?? ''}
        </Typography>

        {status && (
          <LinearProgress
            variant="determinate"
            value={progressDay ?? 0}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: accent,
              },
            }}
          />
        )}

        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ visibility: progressDay ? 'visible' : 'hidden' }}
          >
            Day {progressDay}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LoadingBar;
