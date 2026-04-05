import { Card, Typography } from '@mui/material';

export const Bar = ({ completed }) => {
  return (
    <Card sx={{ p: 1 }}>
      <Typography>
        Simulated {completed} weeks
      </Typography>
    </Card>
  );  
};
