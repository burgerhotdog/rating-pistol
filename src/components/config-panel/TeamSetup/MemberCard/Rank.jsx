import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const RANK_OPTIONS = [0, 1, 2, 3, 4, 5, 6];

const Rank = ({ memberId, memberRank, onChange }) => {
  return (
    <ToggleButtonGroup
      value={memberRank ?? null}
      onChange={(_, rank) => rank !== null && onChange(rank)}
      disabled={!memberId}
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

export default Rank;
