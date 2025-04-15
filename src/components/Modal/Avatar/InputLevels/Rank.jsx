import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import INFO from "@data/static/info";

const Rank = ({ gameId, pipe, setPipe }) => {
  const options = () => {
    const giNoRank = gameId === "gi" && (
      pipe.id === "10000062" // Aloy
    );
    const noRank = giNoRank;

    return noRank ? [0] : Array.from({ length: 7 }, (_, i) => i);
  };

  const handleChange = (newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        rank: Number(newValue),
      },
    }));
  };

  return (
    <FormControl sx={{ width: 75 }}>
      <InputLabel id="rank-select" shrink>
        Rank
      </InputLabel>
      <Select
        labelId="rank-select"
        label="Rank"
        value={pipe.data.rank ?? 0}
        onChange={(e) => handleChange(e.target.value)}
        notched
      >
        {options().map((rank) => (
          <MenuItem key={rank} value={rank}>
            {`${INFO[gameId].PREFIX_AVATAR}${rank}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Rank;
