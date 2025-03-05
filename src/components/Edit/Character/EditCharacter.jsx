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

const EditCharacter = ({
  gameType,
  action,
  setAction,
}) => {
  const { INFO } = getData(gameType);
  
  const handleCharacterLevel = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        info: {
          ...prev.data.info,
          characterLevel: newValue || "",
        }
      },
    }));
  };

  const handleCharacterRank = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        info: {
          ...prev.data.info,
          characterRank: newValue || "",
        }
      },
    }));
  };

  return (
    <Stack direction="row" spacing={2}>
      <Autocomplete
        size="small"
        value={action?.data?.info?.characterLevel || ""}
        options={Array.from({ length: INFO.LEVEL_CAP / 10 }, (_, i) => (INFO.LEVEL_CAP - i * 10).toString())}
        onChange={(_, newValue) => {
          if (newValue) handleCharacterLevel(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Level"
          />
        )}
        sx={{ width: 80 }}
        disableClearable
      />
      <Autocomplete
        size="small"
        value={action?.data?.info?.characterRank || ""}
        options={["0", "1", "2", "3", "4", "5", "6"]}
        onChange={(_, newValue) => {
          if (newValue) handleCharacterRank(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Rank"
          />
        )}
        sx={{ width: 80 }}
        disableClearable
      />
    </Stack>
  );
};

export default EditCharacter;
