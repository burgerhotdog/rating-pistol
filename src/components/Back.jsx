import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const Back = () => (
  <Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1000 }}>
    <Button
      component={Link}
      to="/"
      sx={{ filter: 'grayscale(100%)' }}
    >
      Back
    </Button>
  </Box>
);

export default Back;
