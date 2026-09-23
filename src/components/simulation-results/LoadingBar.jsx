import { LinearProgress, Stack, Typography } from '@mui/material';
import { useAccent } from '@/hooks';

const LoadingBar = ({ results }) => {
  const { disabled, title, message, progressDay } = results;
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
          sx={{ textAlign: 'center', height: '1.5em' }}
        >
          {title}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progressDay ?? 0}
          sx={{
            visibility: disabled ? 'hidden' : 'visible',
            backgroundColor: 'action.hover',
            borderRadius: 2,
            '& .MuiLinearProgress-bar': { backgroundColor: accent },
          }}
        />

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ height: '1.5em' }}
        >
          {message}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default LoadingBar;
