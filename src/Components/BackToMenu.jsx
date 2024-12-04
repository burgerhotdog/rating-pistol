import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const BackToMenu = () => (
  <Button component={Link} to="/">
    Back to Menu
  </Button>
);

export default BackToMenu;
