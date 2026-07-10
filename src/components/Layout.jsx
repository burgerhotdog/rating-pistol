import { Box, Card } from '@mui/material';
import { ResponsiveContainer } from 'recharts';

export const FlexRow = ({ spacing, sx, ...props }) => (
  <Box
    sx={[{
      display: 'flex',
      flex: 1,
      minHeight: 0,
      gap: spacing,
    }, sx]}
    {...props}
  />
);

export const FlexCol = ({ spacing, sx, ...props }) => (
  <Box
    sx={[{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
      gap: spacing,
    }, sx]}
    {...props}
  />
);

export const FlexCard = ({ direction = 'column', sx, ...props }) => (
  <Card
    sx={[{
      display: 'flex',
      flexDirection: direction,
      flex: 1,
    }, sx]}
    {...props}
  />
);

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
