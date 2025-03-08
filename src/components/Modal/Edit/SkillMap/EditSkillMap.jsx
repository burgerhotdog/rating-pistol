import React from "react";
import {
  Grid2 as Grid,
  Box,
  Stack,
  Divider,
  Autocomplete,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import getData from "../../../getData";

const EditSkillMap = ({
  gameId,
  action,
  setAction,
}) => {
  const { generalData } = getData(gameId);
  const handleSkill = (newValue, skillKey) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        skillMap: {
          ...prev.data.skillMap,
          [skillKey]: newValue,
        },
      },
    }));
  }

  return (
    <Stack spacing={2}>
      {Object.entries(action.data.skillMap).map(([skillKey, skillValue]) => (
        <Autocomplete
          key={skillKey}
          size="small"
          value={skillValue}
          options={Array.from(
            { length: generalData.SKILL_DATA[skillKey].skill_cap }, 
            (_, i) => (i + 1).toString()
          )}
          getOptionLabel={(id) => id.toString() || ""}
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

export default EditSkillMap;
