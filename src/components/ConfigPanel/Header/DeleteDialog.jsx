import { useParams } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useData } from '@/hooks';

const DeleteDialog = ({ open, onClose }) => {
  const { charId } = useParams();
  const charData = useData('character');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Delete {charData[charId].name}?
      </DialogTitle>

      <DialogContent dividers>
        Warning: this action is irreversible!
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onClose()}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
