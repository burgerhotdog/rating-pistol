import React from "react";
import Grid from "@mui/material/Grid2";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const ModalEditSkills = ({
  gameType,
  gameData,
  gameIcons,
  action,
  setAction,
}) => {
  const { INFO } = gameData;
  const handleSkill = (newValue, skillKey) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        info: {
          ...prev.data.info,
          skills: {
            ...prev.data.info.skills,
            [skillKey]: newValue || "",
          },
        },
      },
    }));
  }

  return (
    <Stack spacing={2}>
      {Object.entries(action.data.info.skills).map(([skillKey, skillValue]) => (
          <Autocomplete
            key={skillKey}
            size="small"
            value={skillValue || ""}
            options={Array.from(
              { length: INFO.SKILL_DATA[skillKey].skill_cap }, 
              (_, i) => (INFO.SKILL_DATA[skillKey].skill_cap - i).toString()
            )}
            onChange={(_, newValue) => {
              if (newValue) handleSkill(newValue, skillKey);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={skillKey}
              />
            )}
            sx={{ width: 80 }}
            disableClearable
          />
        )
      )}
    </Stack>
  );
};

export default ModalEditSkills;
