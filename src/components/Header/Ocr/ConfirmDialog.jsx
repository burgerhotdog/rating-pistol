import { Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid } from '@mui/material';
import { WW, CHARACTER, WEAPON } from '@/data';
import EquipEditor from './EquipEditor';

export const ConfirmDialog = ({
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
      </DialogTitle>

      <DialogContent dividers>
        {build && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={8}>
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

            <Grid size={4}>
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
              <Autocomplete
                options={Object.values(WEAPON[WW]).filter((option) => option.type === CHARACTER[WW][characterId]?.type)}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={WEAPON[WW][build.weaponId] ?? null}
                onChange={(e, newValue) => onUpdateTopField('weaponId', newValue?.id)}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Weapon" error={!build.weaponId} />
                )}
              />
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
