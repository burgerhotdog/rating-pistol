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
import { mainStatNameToIdByCost } from '@/workers/ocr/helpers/maps';
import { mainStatRange, subStatRange } from './statValueRange';

const isInRange = (value = 0, range = []) => {
  const [min = 0, max = 0] = range;

  return value >= min && value <= max;
};

const EquipEditor = ({ equip, index, onChange }) => {
  const { cost, setId, mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList } = equip;

  const mainStatOptions = mainStatNameToIdByCost[cost] || {};

  const updateCost = (newCost) => {
    const mainStatFlatId = newCost === 1 ? 'hp' : 'atk';
    const mainStatFlatValue = mainStatRange[newCost][mainStatFlatId][1];
    onChange(index, { ...equip, cost: newCost, mainStatFlatId, mainStatFlatValue });
  };

  const updateField = (field, value) => {
    onChange(index, { ...equip, [field]: value });
  };

  const updateSubStat = (subIndex, field, value) => {
    const nextList = subStatList.map((s, i) => (i === subIndex ? { ...s, [field]: value } : s));
    onChange(index, { ...equip, subStatList: nextList });
  };

  const mainIsPercent = mainStatId && mainStatId.endsWith('%');

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
            value={mainStatId ?? ''}
            onChange={(e) => updateField('mainStatId', e.target.value)}
            error={!mainStatId}
            sx={{ flex: 2 }}
          >
            {Object.entries(mainStatOptions).map(([name, id]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            value={
              mainStatValue
                ? (mainStatValue * (mainIsPercent ? 0.1 : 1))
                : ''
            }
            onChange={(e) =>
              updateField('mainStatValue', e.target.value === '' ? null : (Number(e.target.value) * (mainIsPercent ? 10 : 1)))
            }
            error={mainStatValue == null || Number.isNaN(mainStatValue)}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField
            value={mainStatFlatId ?? ''}
            disabled
            sx={{ flex: 2 }}
          />
          <TextField
            value={mainStatFlatValue ?? ''}
            error={!isInRange(mainStatFlatValue, mainStatRange[cost]?.[mainStatFlatId])}
            disabled={!mainStatFlatId}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">
            Substats
          </Typography>

          {subStatList.map((sub, subIndex) => {
            const { subStatId, subStatValue } = sub;
            const isPercent = subStatId && subStatId.endsWith('%');
            return (
              <Stack key={subIndex} direction="row" spacing={1}>
                <TextField
                  select
                  value={subStatId ?? ''}
                  onChange={(e) => updateSubStat(subIndex, 'subStatId', e.target.value)}
                  error={!subStatId}
                  sx={{ flex: 2 }}
                >
                  {Object.keys(subStatRange).map((id) => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  type="number"
                  value={subStatValue ? (subStatValue * (isPercent ? 0.1: 1)): ''}
                  onChange={(e) =>
                    updateSubStat(
                      subIndex,
                      'subStatValue',
                      e.target.value === '' ? null : (Number(e.target.value) * (isPercent ? 10: 1))
                    )
                  }
                  error={!isInRange(subStatValue, subStatRange[subStatId]) || Number.isNaN(subStatValue)}
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
