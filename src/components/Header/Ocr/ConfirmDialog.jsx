import { useState } from 'react'; 
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
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
  const charId = pendingEntry ? pendingEntry[0] : '';

  const confirmLabel = isBatchMode
    ? batchIndex < batchTotal
      ? 'Confirm & Next'
      : 'Confirm & Finish'
    : 'Confirm & Save';

  const cancelLabel = isBatchMode ? 'Skip' : 'Cancel';

  const [tab, setTab] = useState(0);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isBatchMode ? `Confirm Data (${batchIndex} of ${batchTotal})` : 'Confirm Scanned Data'}
      </DialogTitle>

      <DialogContent dividers>
        {build && (
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2}>
              <Autocomplete
                options={Object.values(CHARACTER[WW])}
                getOptionLabel={(option) => option.name ?? ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={CHARACTER[WW][charId] ?? null}
                onChange={(e, newValue) => onUpdateCharacterId(newValue?.id)}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Character" error={!charId} />
                )}
                sx={{ flex: 2 }}
              />
              <TextField
                select
                label="Rank"
                value={build.rank ?? ''}
                onChange={(e) => onUpdateTopField('rank', e.target.value)}
                fullWidth
                sx={{ flex: 1 }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Autocomplete
              options={Object.values(WEAPON[WW]).filter((option) => option.type === CHARACTER[WW][charId]?.type)}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={WEAPON[WW][build.weaponId] ?? null}
              onChange={(e, newValue) => onUpdateTopField('weaponId', newValue?.id)}
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Weapon" error={!build.weaponId} />
              )}
            />
          </Stack>
        )}

        <Stack>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            centered
          >
            {build?.equipList?.map((_, index) => (
              <Tab
                key={index}
                value={index}
                label={index}
              />
            ))}
          </Tabs>
          {build?.equipList?.[tab] && (
            <EquipEditor
              equip={build?.equipList?.[tab]}
              index={tab}
              onChange={onUpdateEquip}
            />
          )}
        </Stack>
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
