import React from "react";
import {
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
const options10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const optionsCore = [1, 2, 3, 4, 5, 6, 7];

const ZZZ = ({ modalPipe, editSkillMap }) => {
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
        <InputLabel id="dodge-label" shrink>
          Dodge
        </InputLabel>
        <Select
          name="004"
          labelId="dodge-label"
          label="Dodge"
          value={String(skillMap["004"])}
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
        <InputLabel id="assist-label" shrink>
          Assist
        </InputLabel>
        <Select
          name="005"
          labelId="assist-label"
          label="Assist"
          value={String(skillMap["005"])}
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
          EX Special
        </InputLabel>
        <Select
          name="002"
          labelId="skill-label"
          label="EX Special"
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
          Chain Attack / Ultimate
        </InputLabel>
        <Select
          name="003"
          labelId="ult-label"
          label="Chain Attack / Ultimate"
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

      <FormControl sx={{ width: 150 }}>
        <InputLabel id="core-label" shrink>
          Core Passive
        </InputLabel>
        <Select
          name="006"
          labelId="core-label"
          label="Core Passive"
          value={String(skillMap["006"])}
          onChange={handleSkill}
          notched
        >
          {optionsCore.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {String(lvl)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default ZZZ;
