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

const EditAvatar = ({
  gameId,
  action,
  setAction,
}) => {
  const { generalData } = getData[gameId];
  
  const handleLevel = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        level: newValue,
      },
    }));
  };

  const handleRank = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        rank: newValue,
      },
    }));
  };

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
      <Stack direction="row" spacing={2}>
        <Autocomplete
          size="small"
          value={action?.data?.level}
          options={Array.from({ length: generalData.LEVEL_CAP / 10 }, (_, i) => (i * 10 + 10))}
          getOptionLabel={(id) => String(id)}
          onChange={(_, newValue) => {
            if (newValue) handleLevel(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Level"
            />
          )}
          sx={{ width: 150 }}
          disableClearable
        />
        <Autocomplete
          size="small"
          value={action?.data?.rank}
          options={[0, 1, 2, 3, 4, 5, 6]}
          getOptionLabel={(id) => `${generalData.RANK_PREFIX}${id}`}
          onChange={(_, newValue) => {
            if (newValue) handleRank(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={generalData.RANK}
            />
          )}
          sx={{ width: 150 }}
          disableClearable
        />
      </Stack>
      {Object.entries(action.data.skillMap).map(([skillKey, skillValue]) => (
        <Autocomplete
          key={skillKey}
          size="small"
          value={skillValue}
          options={Array.from(
            { length: generalData.SKILL_DATA[skillKey].skill_cap }, 
            (_, i) => (i + 1)
          )}
          getOptionLabel={(id) => String(id)}
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

export default EditAvatar;
