import { LinearProgress, Stack, Typography } from '@mui/material';
import { useAccent } from '@/hooks';

const LoadingBar = ({ results }) => {
  const { status, progressDay } = results;
  const accent = useAccent();

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Stack spacing={1} sx={{ width: '50%' }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: 'center' }}
        >
          {status ?? ''}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progressDay ?? 0}
          sx={{
            visibility: status ? 'visible' : 'hidden',
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': { backgroundColor: accent },
          }}
        />

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ visibility: progressDay ? 'visible' : 'hidden' }}
        >
          Day {progressDay}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default LoadingBar;
