import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const PREFIX = { gi: "R", hsr: "R", ww: "R", zzz: "S" };

const WeaponRank = ({ gameId, pipe, setPipe }) => {
  const weaponRankOptions = () => {
    const giNoRankOpt = gameId === "gi" && (
      pipe.data.weaponId === "11416" || // Kagotsurube Isshin
      pipe.data.weaponId === "15415" || // Predator
      pipe.data.weaponId === "11412" || // Sword of Descension
      pipe.data.weaponId === "15201" || // Seasoned Hunter's Bow
      pipe.data.weaponId === "14201" || // Pocket Grimoire
      pipe.data.weaponId === "13201" || // Iron Point
      pipe.data.weaponId === "12201" || // Old Merc's Pal
      pipe.data.weaponId === "11201" || // Silver Sword
      pipe.data.weaponId === "15101" || // Hunter's Bow
      pipe.data.weaponId === "14101" || // Apprentice's Notes
      pipe.data.weaponId === "13101" || // Beginner's Protector
      pipe.data.weaponId === "12101" || // Waster Greatsword
      pipe.data.weaponId === "11101" // Dull Blade
    );
    
    const noRankOpt = giNoRankOpt;

    return noRankOpt ? [1] : [1, 2, 3, 4, 5];
  };

  const handleWeaponRank = (e) => {
    const newValue = e.target.value;
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponRank: newValue,
      },
    }));
  };

  return (
    <FormControl sx={{ width: 75 }} disabled={!pipe.data.weaponId}>
      <InputLabel id="weapon-rank-select" shrink>
        Rank
      </InputLabel>
      <Select
        labelId="weapon-rank-select"
        label="Rank"
        value={pipe.data.weaponRank ?? ""}
        onChange={handleWeaponRank}
        notched
      >
        {weaponRankOptions().map((rank) => (
          <MenuItem key={rank} value={rank}>
            {`${PREFIX[gameId]}${rank}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WeaponRank;
