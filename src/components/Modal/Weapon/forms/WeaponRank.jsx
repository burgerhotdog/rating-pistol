import { useMemo } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { INFO_DATA } from "@data";
import noRankOptions from "./noRankOptions.json";

const WeaponRank = ({ gameId, weaponId, weaponRank, setWeaponRank }) => {
  const options = useMemo(() =>
    noRankOptions[gameId].includes(weaponId)
      ? [0]
      : Array.from({ length: 5 }, (_, i) => i + 1),
    [gameId, weaponId],
  );

  return (
    <FormControl sx={{ width: 75 }} disabled={!weaponId}>
      <InputLabel id="weapon-rank-select" shrink>
        Rank
      </InputLabel>
      <Select
        labelId="weapon-rank-select"
        label="Rank"
        value={weaponRank ?? ""}
        onChange={(e) => setWeaponRank(e.target.value)}
        notched
      >
        {options.map((rank) => (
          <MenuItem key={rank} value={rank}>
            {`${INFO_DATA[gameId].PREFIX_WEAPON}${rank}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WeaponRank;
