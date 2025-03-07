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
        options={Array.from({ length: generalData.LEVEL_CAP / 10 }, (_, i) => (generalData.LEVEL_CAP - i * 10))}
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
        disableClearable
      />
      <Autocomplete
        size="small"
        value={action?.data?.rank}
        options={[0, 1, 2, 3, 4, 5, 6]}
        getOptionLabel={(id) => String(id)}
        onChange={(_, newValue) => {
          if (newValue) handleRank(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Rank"
          />
        )}
        disableClearable
      />
    </Stack>
  );
};

export default EditAvatar;
