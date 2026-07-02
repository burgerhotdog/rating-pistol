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
import { mainStatNameToIdByCost, subStatValueOptionsById } from '@/workers/ocr/helpers/maps';
import { subStatIds } from './ocrBuildDefaults';

const EquipEditor = ({ equip, index, onChange }) => {
  const { cost, setId, mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList } = equip;

  const mainStatOptions = mainStatNameToIdByCost[cost] || {};

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
          <Grid size={6}>
            <TextField
              select
              label="Cost"
              value={cost ?? ''}
              onChange={(e) => updateField('cost', e.target.value)}
              size="small"
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

          <Grid size={6}>
            <Autocomplete
              options={Object.values(SET[WW])}
              getOptionLabel={(option) => option.name ?? ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={SET[WW][setId] ?? null}
              onChange={(e, newValue) => updateField('setId', newValue?.id)}
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Set" error={!setId} />
              )}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              select
              label="Main Stat"
              value={mainStatId ?? ''}
              onChange={(e) => updateField('mainStatId', e.target.value)}
              size="small"
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

          <Grid size={6}>
            <TextField
              label="Main Stat Value (%)"
              type="number"
              value={mainStatValue ?? ''}
              onChange={(e) => updateField('mainStatValue', e.target.value === '' ? null : Number(e.target.value))}
              fullWidth
              size="small"
              error={mainStatValue == null || Number.isNaN(mainStatValue)}
              inputProps={{ step: 0.1 }}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              select
              label="Flat Stat Type"
              value={mainStatFlatId ?? ''}
              onChange={(e) => updateField('mainStatFlatId', e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="hp">hp</MenuItem>
              <MenuItem value="atk">atk</MenuItem>
            </TextField>
          </Grid>

          <Grid size={6}>
            <TextField
              label="Flat Stat Value"
              type="number"
              value={mainStatFlatValue ?? ''}
              onChange={(e) => updateField('mainStatFlatValue', e.target.value === '' ? null : Number(e.target.value))}
              fullWidth
              size="small"
              error={mainStatFlatValue == null || Number.isNaN(mainStatFlatValue)}
            />
          </Grid>

          <Grid size={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              Sub Stats
            </Typography>
          </Grid>

          {subStatList.map((sub, subIndex) => {
            const valueOptions = (subStatValueOptionsById[sub.subStatId] || []).map((value) => sub.subStatId.endsWith('%') ? value / 100 : value);
            return (
              <Grid size={12} key={subIndex}>
                <Grid container spacing={1}>
                  <Grid size={7}>
                    <TextField
                      select
                      label={`Sub Stat ${subIndex + 1}`}
                      value={sub.subStatId ?? ''}
                      onChange={(e) => updateSubStat(subIndex, 'subStatId', e.target.value)}
                      fullWidth
                      size="small"
                      error={!sub.subStatId}
                    >
                      {subStatIds.map((id) => (
                        <MenuItem key={id} value={id}>
                          {id}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={5}>
                    <TextField
                      select={valueOptions.length > 0}
                      label="Value"
                      type={valueOptions.length > 0 ? undefined : 'number'}
                      value={sub.subStatValue ?? ''}
                      onChange={(e) =>
                        updateSubStat(
                          subIndex,
                          'subStatValue',
                          e.target.value === '' ? null : Number(e.target.value)
                        )
                      }
                      fullWidth
                      size="small"
                      error={sub.subStatValue == null || Number.isNaN(sub.subStatValue)}
                    >
                      {valueOptions.length > 0
                        ? valueOptions.map((val) => (
                            <MenuItem key={val} value={val}>
                              {val}
                            </MenuItem>
                          ))
                        : null}
                    </TextField>
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