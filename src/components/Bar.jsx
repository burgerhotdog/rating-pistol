import { Box, LinearProgress, Typography } from '@mui/material';

export const Bar = ({ completed, total, progress }) => {
  return (
    <Box sx={{ px: 1 }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Simulating {completed}/{total} runs ({progress}%)
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );  
};
