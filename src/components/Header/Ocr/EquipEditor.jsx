import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { WW, SET } from '@/data';
import { mainstatNameToIdByCost } from '@/workers/ocr/helpers/maps';
import { mainstatRange, substatRange } from './statValueRange';

const isInRange = (value = 0, range = []) => {
  const [min = 0, max = 0] = range;

  return value >= min && value <= max;
};

const EquipEditor = ({ equip, index, onChange }) => {
  const { cost, setId, mainstatId, mainstatValue, mainstatSubId, mainstatSubValue, substats } = equip;

  const mainstatOptions = mainstatNameToIdByCost[cost] || {};

  const updateCost = (newCost) => {
    const mainstatSubId = newCost === 1 ? 'hp' : 'atk';
    const mainstatSubValue = mainstatRange[newCost][mainstatSubId][1];
    onChange(index, { ...equip, cost: newCost, mainstatSubId, mainstatSubValue });
  };

  const updateField = (field, value) => {
    onChange(index, { ...equip, [field]: value });
  };

  const updateSubStat = (subIndex, field, value) => {
    const nextList = substats.map((s, i) => (i === subIndex ? { ...s, [field]: value } : s));
    onChange(index, { ...equip, substats: nextList });
  };

  const mainIsPercent = mainstatId && mainstatId.endsWith('%');

  return (
    <Card>
      <CardHeader title={`Echo ${index + 1}`} />

      <CardContent component={Stack} spacing={1}>
        <Stack direction="row" spacing={1}>
          <Autocomplete
            options={Object.values(SET[WW])}
            getOptionLabel={(option) => option.name ?? ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={SET[WW][setId] ?? null}
            onChange={(_, newValue) => updateField('setId', newValue?.id)}
            renderInput={(params) => (
              <TextField {...params} label="Set" error={!setId} />
            )}
            sx={{ flex: 2 }}
          />
          <TextField
            select
            label="Cost"
            value={cost ?? ''}
            onChange={(e) => updateCost(e.target.value)}
            error={!cost}
            sx={{ flex: 1 }}
          >
            {[4, 3, 1].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField
            select
            label="Mainstat"
            value={mainstatId ?? ''}
            onChange={(e) => updateField('mainstatId', e.target.value)}
            error={!mainstatId}
            sx={{ flex: 2 }}
          >
            {Object.entries(mainstatOptions).map(([name, id]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            value={
              mainstatValue
                ? (mainstatValue * (mainIsPercent ? 0.1 : 1))
                : ''
            }
            onChange={(e) =>
              updateField('mainstatValue', e.target.value === '' ? null : (Number(e.target.value) * (mainIsPercent ? 10 : 1)))
            }
            error={mainstatValue == null || Number.isNaN(mainstatValue)}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField
            value={mainstatSubId ?? ''}
            disabled
            sx={{ flex: 2 }}
          />
          <TextField
            value={mainstatSubValue ?? ''}
            error={!isInRange(mainstatSubValue, mainstatRange[cost]?.[mainstatSubId])}
            disabled={!mainstatSubId}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">
            Substats
          </Typography>

          {substats.map((sub, subIndex) => {
            const { id, value } = sub;
            const isPercent = id && id.endsWith('%');
            return (
              <Stack key={subIndex} direction="row" spacing={1}>
                <TextField
                  select
                  value={id ?? ''}
                  onChange={(e) => updateSubStat(subIndex, 'stat', e.target.value)}
                  error={!id}
                  sx={{ flex: 2 }}
                >
                  {Object.keys(substatRange).map((id) => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  type="number"
                  value={value ? (value * (isPercent ? 0.1: 1)): ''}
                  onChange={(e) =>
                    updateSubStat(
                      subIndex,
                      'value',
                      e.target.value === '' ? null : (Number(e.target.value) * (isPercent ? 10: 1))
                    )
                  }
                  error={!isInRange(value, substatRange[id]) || Number.isNaN(value)}
                  sx={{ flex: 1 }}
                />
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default EquipEditor;
