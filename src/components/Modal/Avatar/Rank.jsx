import { useMemo } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { INFO_DATA } from "@data";
import noRankOptions from "./noRankOptions.json";

const Rank = ({ gameId, id, rank, setRank }) => {
  const options = useMemo(() =>
    noRankOptions[gameId].includes(id)
      ? [0]
      : Array.from({ length: 7 }, (_, i) => i),
    [gameId, id],
  );

  return (
    <FormControl sx={{ width: 75 }}>
      <InputLabel id="rank-select" shrink>
        Rank
      </InputLabel>
      <Select
        labelId="rank-select"
        label="Rank"
        value={rank}
        onChange={(e) => setRank(e.target.value)}
        notched
      >
        {options.map((rank) => (
          <MenuItem key={rank} value={rank}>
            {`${INFO_DATA[gameId].PREFIX_AVATAR}${rank}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Rank;
