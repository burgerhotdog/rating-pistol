import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const RANK_OPTIONS = [1, 2, 3, 4, 5];

const WeaponRank = ({ weaponId, weaponRank, onChange }) => {
  return (
    <ToggleButtonGroup
      value={weaponRank ?? null}
      onChange={(_, weaponRank) => weaponRank !== null && onChange(weaponRank)}
      disabled={!weaponId}
      exclusive
      fullWidth
    >
      {RANK_OPTIONS.map((rank) => (
        <ToggleButton key={rank} value={rank}>
          {`S${rank}`}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default WeaponRank;
