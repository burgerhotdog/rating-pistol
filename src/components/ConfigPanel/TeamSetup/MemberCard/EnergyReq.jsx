import { TextField } from '@mui/material';
import { inRange } from '@/utils';

const EnergyReq = ({ memberId, energyReq, onChange }) => {
  return (
    <TextField
      type="number"
      value={energyReq == null ? '' : (energyReq * 100).toFixed()}
      onChange={(e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        if (value === '') {
          onChange(null);
          return;
        }

        const displayValue = Number(value);

        if (inRange(displayValue, 100, 300)) {
          onChange(displayValue / 100);
        }
      }}
      label="Energy Req"
      disabled={!memberId}
      slotProps={{
        htmlInput: {
          min: 100,
          max: 300,
          step: 10,
        },
      }}
    />
  );
};

export default EnergyReq;
