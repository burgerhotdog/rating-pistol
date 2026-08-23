import { useState } from 'react';
import { Button } from '@mui/material';
import RotationEditorDialog from './RotationEditorDialog';

const RotationEditor = ({ member, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Edit Rotation
      </Button>

      <RotationEditorDialog
        open={open}
        onClose={() => setOpen(false)}
        charId={member.id}
        member={member}
        rotation={member.rotation}
        onChange={onChange}
      />
    </>
  );
};

export default RotationEditor;
