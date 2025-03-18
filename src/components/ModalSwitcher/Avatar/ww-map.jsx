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
const options10 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const WW = ({
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
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 75 }}>
        <InputLabel id="skill-label" shrink>
          Resonance Skill
        </InputLabel>
        <Select
          name="skill"
          labelId="skill-label"
          label="Resonance Skill"
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
        <InputLabel id="forte-label" shrink>
          Forte Circuit
        </InputLabel>
        <Select
          name="forte"
          labelId="forte-label"
          label="Forte Circuit"
          value={skillMap.forte ?? ""}
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
          Resonance Liberation
        </InputLabel>
        <Select
          name="ult"
          labelId="ult-label"
          label="Resonance Liberation"
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
        <InputLabel id="intro-label" shrink>
          Intro Skill
        </InputLabel>
        <Select
          name="intro"
          labelId="intro-label"
          label="Intro Skill"
          value={skillMap.intro ?? ""}
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

export default WW;
