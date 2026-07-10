import { Box } from '@mui/material';

export const Dot = ({ color }) => (
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      bgcolor: color,
      flexShrink: 0,
    }}
  />
);
