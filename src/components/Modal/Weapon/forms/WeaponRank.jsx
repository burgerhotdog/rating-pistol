import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const PREFIX = { gi: "R", hsr: "R", ww: "R", zzz: "S" };

const WeaponRank = ({ gameId, modalPipe, setModalPipe }) => {
  const weaponRankOptions = () => {
    const giNoRankOpt = gameId === "gi" && (
      modalPipe.data.weaponId === "11416" || // Kagotsurube Isshin
      modalPipe.data.weaponId === "15415" || // Predator
      modalPipe.data.weaponId === "11412" || // Sword of Descension
      modalPipe.data.weaponId === "15201" || // Seasoned Hunter's Bow
      modalPipe.data.weaponId === "14201" || // Pocket Grimoire
      modalPipe.data.weaponId === "13201" || // Iron Point
      modalPipe.data.weaponId === "12201" || // Old Merc's Pal
      modalPipe.data.weaponId === "11201" || // Silver Sword
      modalPipe.data.weaponId === "15101" || // Hunter's Bow
      modalPipe.data.weaponId === "14101" || // Apprentice's Notes
      modalPipe.data.weaponId === "13101" || // Beginner's Protector
      modalPipe.data.weaponId === "12101" || // Waster Greatsword
      modalPipe.data.weaponId === "11101" // Dull Blade
    );
    
    const noRankOpt = giNoRankOpt;

    return noRankOpt ? [1] : [1, 2, 3, 4, 5];
  };

  const handleWeaponRank = (e) => {
    const newValue = e.target.value;
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weaponRank: newValue,
      },
    }));
  };

  return (
    <FormControl sx={{ width: 75 }} disabled={!modalPipe.data.weaponId}>
      <InputLabel id="weapon-rank-select" shrink>
        Rank
      </InputLabel>
      <Select
        labelId="weapon-rank-select"
        label="Rank"
        value={modalPipe.data.weaponRank ?? ""}
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
