import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const WeaponRank = ({ weaponId, weaponRank, onChange }) => {
  return (
    <ToggleButtonGroup
      value={weaponRank ?? null}
      onChange={(_, weaponRank) =>
        weaponRank !== null && onChange(weaponRank)
      }
      disabled={!weaponId}
      exclusive
      fullWidth
    >
      {[1, 2, 3, 4, 5].map((rank) => (
        <ToggleButton key={rank} value={rank}>
          {`S${rank}`}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default WeaponRank;
