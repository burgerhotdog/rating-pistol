import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import BuildEditor from '../../BuildEditor';

export const ConfirmDialog = ({
  open,
  isLoading,
  isBatchMode,
  batchIndex,
  batchTotal,
  onCancel,
  onConfirm,
  draft,
  setDraft,
}) => {
  const confirmLabel = isBatchMode
    ? batchIndex < batchTotal
      ? 'Confirm & Next'
      : 'Confirm & Finish'
    : 'Confirm & Save';

  const cancelLabel = isBatchMode ? 'Skip' : 'Cancel';

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
        <BuildEditor
          draft={draft}
          setDraft={setDraft}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          loading={isLoading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
