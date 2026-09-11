import { Dialog, DialogTitle, DialogContent, Stack, Button } from '@mui/material';

const ModeSelectDialog = ({ open, onClose, onSelectUpload, onSelectScratch }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xs"
    fullWidth
  >
    <DialogTitle>
      Add Build
    </DialogTitle>

    <DialogContent>
      <Stack spacing={1}>
        <Button
          onClick={onSelectUpload}
          variant="outlined"
          fullWidth
        >
          Upload Image(s)
        </Button>

        <Button
          onClick={onSelectScratch}
          variant="outlined"
          fullWidth
        >
          Enter details manually
        </Button>
      </Stack>
    </DialogContent>
  </Dialog>
);

export default ModeSelectDialog;
