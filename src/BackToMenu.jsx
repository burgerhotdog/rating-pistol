import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const BackToMenu = () => (
  <Button component={Link} to="/" variant="contained" color="secondary" fullWidth>
    Back to Menu
  </Button>
);

export default BackToMenu;