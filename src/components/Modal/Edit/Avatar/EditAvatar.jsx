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
  const { generalData } = getData(gameId);
  
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

  return (
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
  );
};

export default EditAvatar;
