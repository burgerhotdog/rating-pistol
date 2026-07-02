import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { mainStatNameToIdByCost, subStatValueOptionsById } from '@/workers/ocr/helpers/maps';
import { costOptions, subStatIds } from './ocrBuildDefaults';

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

  const missingCount =
    (!mainStatId ? 1 : 0) +
    (mainStatValue == null || Number.isNaN(mainStatValue) ? 1 : 0) +
    subStatList.filter((s) => !s.subStatId || s.subStatValue == null || Number.isNaN(s.subStatValue)).length;

  return (
    <Accordion defaultExpanded={missingCount > 0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          Echo {index + 1} (Cost {cost || '?'})
          {missingCount > 0 ? ` — ${missingCount} field(s) need review` : ''}
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
              fullWidth
              size="small"
            >
              {costOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={6}>
            <TextField
              label="Set ID"
              value={setId ?? ''}
              onChange={(e) => updateField('setId', e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid size={6}>
            <TextField
              select
              label="Main Stat"
              value={mainStatId ?? ''}
              onChange={(e) => updateField('mainStatId', e.target.value)}
              fullWidth
              size="small"
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