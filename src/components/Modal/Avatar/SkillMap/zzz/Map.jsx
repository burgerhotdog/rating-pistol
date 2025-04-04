import React from "react";
import {
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
const options10 = Array.from({ length: 12 }, (_, i) => i + 1);
const optionsCore = Array.from({ length: 7 }, (_, i) => i + 1);

const ZZZ = ({ rank, skillMap, editSkillMap }) => {  
  const handleSkill = (event) => {
    const { name, value } = event.target;
    editSkillMap(name, value);
  };

  const rankBonus = (lvl) => {
    if (rank >= 5) return lvl + 4;
    if (rank >= 3) return lvl + 2;
    return lvl;
  }

  const coreLabel = (lvl) => {
    const labels = ["unleveled","A","B","C","D","E","F"];
    return labels[lvl - 1];
  }

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
          value={skillMap["001"]}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {rankBonus(lvl)}
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
          value={skillMap["004"]}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {rankBonus(lvl)}
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
          value={skillMap["005"]}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {rankBonus(lvl)}
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
          value={skillMap["002"]}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {rankBonus(lvl)}
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
          value={skillMap["003"]}
          onChange={handleSkill}
          notched
        >
          {options10.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {rankBonus(lvl)}
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
          value={skillMap["006"]}
          onChange={handleSkill}
          notched
        >
          {optionsCore.map((lvl) => (
            <MenuItem key={lvl} value={lvl}>
              {coreLabel(lvl)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default ZZZ;
