import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const PREFIX = { gi: "R", hsr: "R", ww: "R", zzz: "S" };

const WeaponRank = ({ gameId, weaponId, weaponRank, setWeaponRank }) => {
  const weaponRankOptions = () => {
    const giNoRankOpt = gameId === "gi" && (
      weaponId === "11416" || // Kagotsurube Isshin
      weaponId === "15415" || // Predator
      weaponId === "11412" || // Sword of Descension
      weaponId === "15201" || // Seasoned Hunter's Bow
      weaponId === "14201" || // Pocket Grimoire
      weaponId === "13201" || // Iron Point
      weaponId === "12201" || // Old Merc's Pal
      weaponId === "11201" || // Silver Sword
      weaponId === "15101" || // Hunter's Bow
      weaponId === "14101" || // Apprentice's Notes
      weaponId === "13101" || // Beginner's Protector
      weaponId === "12101" || // Waster Greatsword
      weaponId === "11101" // Dull Blade
    );
    
    const noRankOpt = giNoRankOpt;

    return noRankOpt ? [1] : [1, 2, 3, 4, 5];
  };

  const handleWeaponRank = (newValue) => {
    setWeaponRank(newValue);
  };

  return (
    <FormControl sx={{ width: 75 }} disabled={!weaponId}>
      <InputLabel id="weapon-rank-select" shrink>
        Rank
      </InputLabel>
      <Select
        labelId="weapon-rank-select"
        label="Rank"
        value={weaponRank ?? ""}
        onChange={(e) => handleWeaponRank(e.target.value)}
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
