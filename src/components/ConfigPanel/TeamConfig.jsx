import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MemberConfig } from './MemberConfig';

export const TeamConfig = ({ team, open, onClose, onSave }) => {
  const [draft, setDraft] = useState(team);

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const handleCancel = () => {
    setDraft(team);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="lg">
        <DialogTitle>
          Team Configuration
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="row" spacing={2}>
            {team.map((_, index) => (
              <MemberConfig
                key={index}
                member={draft[index]}
                onChange={(nextMember) =>
                  setDraft((prev) => prev.with(index, nextMember))
                }
              />
            ))}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
