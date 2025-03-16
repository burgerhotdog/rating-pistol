import React from "react";
import {
  Stack,
  Typography
} from "@mui/material";

const SkillTab = ({ modalPipe }) => {
  return (
    <Stack mt={2}>
      <Typography variant="body2">
        {`Skill Levels: ${Math.round(modalPipe.rating.parts[1])}% complete`}
      </Typography>
    </Stack>
  );
};

export default SkillTab;
