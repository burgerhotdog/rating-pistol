import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import getData from "../../getData";

const options6 = ["1", "2", "3", "4", "5", "6"];
const options10 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const HSR = ({
  gameId,
  modalPipe,
  handleSkill,
}) => {
  const { skillMap } = modalPipe.data;

  return (
    <Stack spacing={2}>
      <FormControl sx={{ width: 75 }}>
        <InputLabel id="basic-label" shrink>
          Basic
        </InputLabel>
        <Select
          name="basic"
          labelId="basic-label"
          label="Basic"
          value={skillMap.basic ?? ""}
          onChange={handleSkill}
          notched
        >
          {options6.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 75 }}>
        <InputLabel id="skill-label" shrink>
          Skill
        </InputLabel>
        <Select
          name="skill"
          labelId="skill-label"
          label="Skill"
          value={skillMap.skill ?? ""}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 75 }}>
        <InputLabel id="ult-label" shrink>
          Ult
        </InputLabel>
        <Select
          name="ult"
          labelId="ult-label"
          label="Ult"
          value={skillMap.ult ?? ""}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 75 }}>
        <InputLabel id="talent-label" shrink>
          Talent
        </InputLabel>
        <Select
          name="talent"
          labelId="talent-label"
          label="Talent"
          value={skillMap.talent ?? ""}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default HSR;
