import { useRef } from 'react';
import { Box, Card, LinearProgress, Stack, Typography } from '@mui/material';

export const LoadingBar = ({ statusMessage, week, diff }) => {
  const initialDiffRef = useRef(null);

  // const value = diff != null ? Math.min(Math.max(((initialDiffRef.current - diff) / (initialDiffRef.current - 0.01)) ** 2, 0), 1) * 100 : 0;

  return (
    <Card sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} sx={{ width: '50%', maxWidth: 360 }}>
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
          {statusMessage || 'Initializing...'}
        </Typography>

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

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ visibility: week ? 'visible' : 'hidden' }}
          >
            {`Week ${week}`}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};