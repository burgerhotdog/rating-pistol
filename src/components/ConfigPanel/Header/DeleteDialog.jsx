import { useParams } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useBuild } from '@/contexts';
import { useData } from '@/hooks';

const DeleteDialog = ({ open, onClose }) => {
  const { gameId, charId } = useParams();
  const { deleteBuildId } = useBuild();
  const charDatas = useData('character');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Delete {charDatas[charId].name}?
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
          onClick={() => {
            deleteBuildId(gameId, charId);
            onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
