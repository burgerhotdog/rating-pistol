import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useData } from '@/hooks';
import { formatStr } from '@/utils';

const Mode = ({ member, onChange }) => {
  const memberData = useData('character')[member.id];

  return (
    <ToggleButtonGroup
      value={member.mode}
      onChange={(_, mode) => mode !== null && onChange(mode)}
      exclusive
    >
      {memberData.modes.map((mode) => (
        <ToggleButton key={mode} value={mode} title={formatStr(mode)}>
          <img
            src={`wuthering-waves/mode/${mode}.webp`}
            alt=""
            style={{ width: 14, height: 14 }}
          />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default Mode;
