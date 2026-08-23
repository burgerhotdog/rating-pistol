import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const Rank = ({ memberId, memberRank, onChange }) => {
  return (
    <ToggleButtonGroup
      value={memberRank ?? null}
      onChange={(_, rank) => rank !== null && onChange(rank)}
      disabled={!memberId}
      exclusive
      fullWidth
    >
      {[0, 1, 2, 3, 4, 5, 6].map((rank) => (
        <ToggleButton key={rank} value={rank}>
          {`S${rank}`}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default Rank;
