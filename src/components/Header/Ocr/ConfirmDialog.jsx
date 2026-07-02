import { useMemo } from 'react';
import { Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Typography } from '@mui/material';
import { WW, CHARACTER } from '@/data';
import EquipEditor from './EquipEditor';
import { weaponIdToName } from './ocrBuildDefaults';

const ConfirmDialog = ({
  open,
  pendingEntry,
  isLoading,
  isBatchMode,
  batchIndex,
  batchTotal,
  onUpdateCharacterId,
  onUpdateTopField,
  onUpdateEquip,
  onCancel,
  onConfirm,
}) => {
  const build = pendingEntry ? pendingEntry[1] : null;
  const characterId = pendingEntry ? pendingEntry[0] : '';

  const missingTopCount = useMemo(() => {
    if (!build) return 0;
    return (!characterId ? 1 : 0) + (!build.weaponId ? 1 : 0);
  }, [build, characterId]);

  const confirmLabel = isBatchMode
    ? batchIndex < batchTotal
      ? 'Confirm & Next'
      : 'Confirm & Finish'
    : 'Confirm & Save';

  const cancelLabel = isBatchMode ? 'Skip' : 'Cancel';

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isBatchMode ? `Confirm Data (${batchIndex} of ${batchTotal})` : 'Confirm Scanned Data'}
        {missingTopCount > 0 && (
          <Typography variant="body2" color="warning.main">
            Some fields could not be read — please fill them in below.
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {build && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={6}>
              <Autocomplete
                options={Object.values(CHARACTER[WW])}
                getOptionLabel={(option) => option.name ?? ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={CHARACTER[WW][characterId] ?? null}
                onChange={(e, newValue) => onUpdateCharacterId(newValue?.id)}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Character" error={!characterId} />
                )}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                select
                label="Rank"
                value={build.rank ?? ''}
                onChange={(e) => onUpdateTopField('rank', e.target.value)}
                fullWidth
              >
                {[0, 1, 2, 3, 4, 5, 6].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                select
                label="Weapon"
                value={build.weaponId ?? ''}
                onChange={(e) => onUpdateTopField('weaponId', e.target.value)}
                fullWidth
                error={!build.weaponId}
              >
                {Object.entries(weaponIdToName).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}

        {build?.equipList?.map((equip, index) => (
          <EquipEditor key={index} equip={equip} index={index} onChange={onUpdateEquip} />
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>

        <Button onClick={onConfirm} variant="contained" loading={isLoading}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;