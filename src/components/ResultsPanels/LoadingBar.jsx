import { Box, LinearProgress, Stack, Typography } from '@mui/material';

const LoadingBar = ({ results }) => {
  const { status, week } = results;

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
            value={0}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': { borderRadius: 3 },
            }}
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ visibility: week ? 'visible' : 'hidden' }}
          >
            {`Day ${week}`}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoadingBar;
