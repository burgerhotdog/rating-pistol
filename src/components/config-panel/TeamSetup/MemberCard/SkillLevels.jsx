import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
} from '@mui/material';
import { useData } from '@/hooks';
import { formatStr, inRange } from '@/utils';

const SkillLevels = ({ memberId, skillLevels, onChange }) => {
  const [open, setOpen] = useState(false);
  const { skillIds, maxSkillLevel } = useData('misc');
  const [draftLevels, setDraftLevels] = useState({});

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        disabled={!memberId}
      >
        Edit Skill Levels
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          transition: {
            onEnter: () => setDraftLevels({ ...skillLevels }),
          },
        }}
      >
        <DialogTitle>
          Edit Skill Levels
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction="row" spacing={1}>
            {skillIds.map((skillId, i) => {
              return (
                <TextField
                  key={i}
                  type="number"
                  value={draftLevels[skillId] ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^\d*$/.test(value)) return;
      
                    const skillLevel = value === '' ? null : Number(value);
                    if (skillLevel === null || inRange(skillLevel, 1, maxSkillLevel)) {
                      setDraftLevels((prev) => ({ ...prev, [skillId]: skillLevel }));
                    }
                  }}
                  label={formatStr(skillId)}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      max: maxSkillLevel,
                      step: 1,
                    },
                  }}
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              onChange(draftLevels);
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

export default SkillLevels;
