import { LinearProgress } from '@mui/material';

export default ({ value, t1 = 100 / 3, t2 = 200 / 3, reverse = false }) => {
  const getColor = (val) => {
    if (val < t1) return reverse ? 'success.main' : 'error.main';
    if (val < t2) return 'warning.main';
    return reverse ? 'error.main' : 'success.main' ;
  };

  return (
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 4,
        borderRadius: 2,
        '& .MuiLinearProgress-bar': {
          backgroundColor: getColor(value),
        },
      }}
    />
  );
};
