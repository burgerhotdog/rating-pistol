import { useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Typography } from '@mui/material';
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
              <TextField
                label="Character ID"
                value={characterId ?? ''}
                onChange={(e) => onUpdateCharacterId(e.target.value)}
                fullWidth
                size="small"
                error={!characterId}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                label="Rank"
                type="number"
                value={build.rank ?? ''}
                onChange={(e) => onUpdateTopField('rank', e.target.value === '' ? null : Number(e.target.value))}
                fullWidth
                size="small"
                inputProps={{ min: 0, max: 5 }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                select
                label="Weapon"
                value={build.weaponId ?? ''}
                onChange={(e) => onUpdateTopField('weaponId', e.target.value)}
                fullWidth
                size="small"
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