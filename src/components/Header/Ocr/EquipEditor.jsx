import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Divider,
  Autocomplete,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  const hasError =
    !mainStatId || mainStatValue == null || Number.isNaN(mainStatValue) ||
    subStatList.some((line) => !line.subStatId || line.subStatValue == null || Number.isNaN(line.subStatValue));

  return (
    <Accordion defaultExpanded={hasError}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          Echo {index + 1}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid size={8}>
            <Autocomplete
              options={Object.values(SET[WW])}
              getOptionLabel={(option) => option.name ?? ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={SET[WW][setId] ?? null}
              onChange={(e, newValue) => updateField('setId', newValue?.id)}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Set" error={!setId} />
              )}
            />
          </Grid>

          <Grid size={4}>
            <TextField
              select
              label="Cost"
              value={cost ?? ''}
              onChange={(e) => updateCost(e.target.value)}
              fullWidth
              error={!cost}
            >
              {[4, 3, 1].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={8}>
            <TextField
              select
              label="Main Stat"
              value={mainStatId ?? ''}
              onChange={(e) => updateField('mainStatId', e.target.value)}
              fullWidth
              error={!mainStatId}
            >
              {Object.entries(mainStatOptions).map(([name, id]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={4}>
            <TextField
              label="Main Stat Value (%)"
              type="number"
              value={mainStatValue ?? ''}
              onChange={(e) => updateField('mainStatValue', e.target.value === '' ? null : Number(e.target.value))}
              fullWidth
              error={mainStatValue == null || Number.isNaN(mainStatValue)}
            />
          </Grid>

          <Grid size={8}>
            <TextField
              value={mainStatFlatId ?? ''}
              fullWidth
              disabled
            />
          </Grid>

          <Grid size={4}>
            <TextField
              value={mainStatFlatValue ?? ''}
              fullWidth
              error={!isInRange(mainStatFlatValue, mainStatRange[cost]?.[mainStatFlatId])}
              disabled={!mainStatFlatId}
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              Sub Stats
            </Typography>
          </Grid>

          {subStatList.map((sub, subIndex) => {
            const { subStatId, subStatValue } = sub;
            
            return (
              <Grid size={12} key={subIndex}>
                <Grid container spacing={1}>
                  <Grid size={8}>
                    <TextField
                      select
                      label={`Sub Stat ${subIndex + 1}`}
                      value={subStatId ?? ''}
                      onChange={(e) => updateSubStat(subIndex, 'subStatId', e.target.value)}
                      fullWidth
                      error={!subStatId}
                    >
                      {Object.keys(subStatRange).map((id) => (
                        <MenuItem key={id} value={id}>
                          {id}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={4}>
                    <TextField
                      label="Value"
                      type="number"
                      value={subStatValue ?? ''}
                      onChange={(e) =>
                        updateSubStat(
                          subIndex,
                          'subStatValue',
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                      fullWidth
                      error={!isInRange(subStatValue, subStatRange[subStatId]) || Number.isNaN(subStatValue)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default EquipEditor;