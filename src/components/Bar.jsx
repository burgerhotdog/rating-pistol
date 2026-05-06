import { useRef } from 'react';
import { Box, Card, LinearProgress, Stack, Typography } from '@mui/material';

export const Bar = ({ completed, diff, currentMember }) => {
  const initialDiffRef = useRef(null);
  const prevMemberRef = useRef(currentMember);

  if (prevMemberRef.current !== currentMember) {
    prevMemberRef.current = currentMember;
    initialDiffRef.current = diff ?? null;
  }

  const value = diff ? Math.min(Math.max(((initialDiffRef.current - diff) / (initialDiffRef.current - 0.01)) ** 2, 0), 1) * 100 : 0;

  return (
    <Card sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} sx={{ width: '50%', maxWidth: 360 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Running simulation…
        </Typography>

        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': { borderRadius: 3 },
          }}
        />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            {currentMember ? `${currentMember}: Week ${completed}` : ''}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};