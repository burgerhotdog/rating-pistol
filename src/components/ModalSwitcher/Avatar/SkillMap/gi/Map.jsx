import React from "react";
import {
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
const options10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const GI = ({ modalPipe, editSkillMap }) => {
  const { skillMap } = modalPipe.data;
  
  const handleSkill = (event) => {
    const { name, value } = event.target;
    editSkillMap(name, value);
  };

  return (
    <Stack spacing={2}>
      <FormControl sx={{ width: 150 }}>
        <InputLabel id="basic-label" shrink>
          Basic
        </InputLabel>
        <Select
          name="001"
          labelId="basic-label"
          label="Basic"
          value={String(skillMap["001"])}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {String(lvl)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 150 }}>
        <InputLabel id="skill-label" shrink>
          Elemental Skill
        </InputLabel>
        <Select
          name="002"
          labelId="skill-label"
          label="Elemental Skill"
          value={String(skillMap["002"])}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {String(lvl)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 150 }}>
        <InputLabel id="ult-label" shrink>
          Elemental Burst
        </InputLabel>
        <Select
          name="003"
          labelId="ult-label"
          label="Elemental Burst"
          value={String(skillMap["003"])}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {String(lvl)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default GI;
