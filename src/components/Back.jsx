import React from "react";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";

const Back = () => (
  <Box sx={{
    position: "fixed",
    top: 8,
    left: 8,
  }}>
    <Button component={Link} to="/">
      Back
    </Button>
  </Box>
);

export default Back;
