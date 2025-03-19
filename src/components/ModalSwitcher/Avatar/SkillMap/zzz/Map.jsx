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
const options10 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const optionsCore = ["1", "2", "3", "4", "5", "6", "7"];

const ZZZ = ({
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
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 75 }}>
        <InputLabel id="dodge-label" shrink>
          Dodge
        </InputLabel>
        <Select
          name="dodge"
          labelId="dodge-label"
          label="Dodge"
          value={skillMap.dodge ?? ""}
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
        <InputLabel id="assist-label" shrink>
          Assist
        </InputLabel>
        <Select
          name="assist"
          labelId="assist-label"
          label="Assist"
          value={skillMap.assist ?? ""}
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
        <InputLabel id="skill-label" shrink>
          EX Special
        </InputLabel>
        <Select
          name="skill"
          labelId="skill-label"
          label="EX Special"
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
          Chain Attack / Ultimate
        </InputLabel>
        <Select
          name="ult"
          labelId="ult-label"
          label="Chain Attack / Ultimate"
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
        <InputLabel id="core-label" shrink>
          Core Passive
        </InputLabel>
        <Select
          name="core"
          labelId="core-label"
          label="Core Passive"
          value={skillMap.core ?? ""}
          onChange={handleSkill}
          notched
        >
          {optionsCore.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default ZZZ;
