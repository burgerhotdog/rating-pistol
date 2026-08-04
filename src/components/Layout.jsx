import { Box } from '@mui/material';
import { ResponsiveContainer } from 'recharts';

export const ChartFill = ({ children, flex = 1, ...props }) => {
  return (
    <Box
      sx={{
        flex,
        minHeight: 0,
        position: 'relative',
      }}
      {...props}
    >
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
