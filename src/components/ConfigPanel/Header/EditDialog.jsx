import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useBuilds, useData } from '@/hooks';
import BuildEditor from '../../BuildEditor';
import DeleteDialog from './DeleteDialog';

const EditDialog = ({ open, onClose }) => {
  const { charId } = useParams();
  const build = useBuilds()[charId];
  const character = useData('character')[charId];

  const [draft, setDraft] = useState(build);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        transition: {
          onEnter: () => setDraft(build),
        },
      }}
      fullWidth
    >
      <DialogTitle>
        Edit {character.name}
      </DialogTitle>

      <DialogContent dividers>
        <BuildEditor draft={draft} setDraft={setDraft} />
      </DialogContent>

      <DialogActions component={Stack} direction="row" sx={{ justifyContent: 'space-between' }}>
        <Button
          onClick={() => setDeleteOpen(true)}
          color="secondary"
        >
          Delete
        </Button>
        <Stack direction="row" spacing={0.5}>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onClose();
              console.log(draft);
            }}
          >
            Save
          </Button>
        </Stack>
      </DialogActions>

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </Dialog>
  );
};

export default EditDialog;
