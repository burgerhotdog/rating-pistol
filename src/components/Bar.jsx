import { Box, Typography } from '@mui/material';

export const Bar = ({ completed }) => {
  return (
    <Box sx={{ px: 1 }}>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Simulated {completed} runs
      </Typography>
    </Box>
  );  
};
