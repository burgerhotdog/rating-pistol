import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const Back = () => (
  <Box sx={{ position: "fixed", top: 8, left: 8 }}>
    <Button component={Link} to="/">
      <Typography variant="body2">
        Back
      </Typography>
    </Button>
  </Box>
);

export default Back;
