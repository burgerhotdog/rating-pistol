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
import getData from "../../getData";

const EditSkills = ({
  gameType,
  action,
  setAction,
}) => {
  const { generalData } = getData(gameType);
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
            { length: generalData.SKILL_DATA[skillKey].skill_cap }, 
            (_, i) => (i + 1).toString()
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
          disableClearable
        />
      ))}
    </Stack>
  );
};

export default EditSkills;
