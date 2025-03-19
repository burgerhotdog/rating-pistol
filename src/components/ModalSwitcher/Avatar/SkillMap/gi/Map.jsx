import React from "react";
import {
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
const options10 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const GI = ({
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
          Elemental Skill
        </InputLabel>
        <Select
          name="skill"
          labelId="skill-label"
          label="Elemental Skill"
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
          Elemental Burst
        </InputLabel>
        <Select
          name="ult"
          labelId="ult-label"
          label="Elemental Burst"
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
    </Stack>
  );
};

export default GI;
