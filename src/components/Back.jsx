import { Link, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';

export default () => {
  const location = useLocation();
  const isGamePage = [
    "/genshin-impact",
    "/honkai-star-rail",
    "/wuthering-waves",
    "/zenless-zone-zero",
  ].includes(location.pathname);

  if (!isGamePage) return null;
  return (
    <Box position="fixed" top={16} left={16} zIndex={1000}>
      <Button component={Link} to="/" sx={{ filter: 'grayscale(100%)' }}>
        Back
      </Button>
    </Box>
  );
};
