import React from "react";
import { Stack, Typography } from "@mui/material";

const SkillTab = ({ pipe }) => {
  return (
    <Stack mt={2}>
      <Typography variant="body2">
        {`Skill Levels: ${Math.round(pipe.rating.parts[1])}% complete`}
      </Typography>
    </Stack>
  );
};

export default SkillTab;
