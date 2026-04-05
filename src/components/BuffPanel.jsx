import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { CHARACTERS, SETS, WEAPONS } from '@/data';

const createTeammate = () => ({
  id: crypto.randomUUID(),
  characterId: '',
  weaponId: '',
  setId: '',
});

export function cloneTeam(team = []) {
  return team.map(member => ({ ...member }));
}

function getSupportWeaponOptions(gameId, characterId) {
  if (!characterId) return [];

  const char = CHARACTERS[gameId]?.[characterId];
  return Object.entries(WEAPONS[gameId] ?? {}).filter(([, weapon]) => {
    const matchesType = !char?.type || weapon.type === char.type;
    return matchesType && (weapon.buffs?.team?.fixedStats || weapon.buffs?.ally?.fixedStats);
  });
}

function getSupportSetOptions(gameId) {
  return Object.entries(SETS[gameId] ?? {}).filter(([, set]) => set.buffs?.team?.fixedStats || set.buffs?.ally?.fixedStats);
}

export const BuffPanel = ({
  gameId,
  mainCharacterId,
  draftTeam,
  appliedTeam,
  setDraftTeam,
  onApply,
  onReset,
}) => {
  const [open, setOpen] = useState(false);

  const availableCharacters = useMemo(() => {
    return Object.entries(CHARACTERS[gameId] ?? {}).filter(
      ([id, data]) => id !== mainCharacterId && (data.buffs?.team?.fixedStats || data.buffs?.ally?.fixedStats)
    );
  }, [gameId, mainCharacterId]);

  const addTeammate = () => {
    setDraftTeam(prev => [...prev, createTeammate()]);
  };

  const updateTeammate = (id, patch) => {
    setDraftTeam(prev =>
      prev.map(member =>
        member.id === id ? { ...member, ...patch } : member
      )
    );
  };

  const removeTeammate = (id) => {
    setDraftTeam(prev => prev.filter(member => member.id !== id));
  };

  const handleOpen = () => {
    setDraftTeam(cloneTeam(appliedTeam));
    setOpen(true);
  };

  const handleClose = () => {
    setDraftTeam(cloneTeam(appliedTeam));
    setOpen(false);
  };

  const handleSave = () => {
    onApply();
    setOpen(false);
  };

  const activeCount = appliedTeam.filter(member => member.characterId).length;

  return (
    <>
      <Button variant="outlined" onClick={handleOpen} sx={{ mt: 1 }}>
        Team Buffs {activeCount ? `(${activeCount})` : ''}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth disableRestoreFocus>
        <DialogTitle>Team Buffs</DialogTitle>

        <DialogContent>
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" sx={{ pt: 1 }}>
            {draftTeam.map(member => {
              const weaponOptions = getSupportWeaponOptions(gameId, member.characterId);
              const setOptions = getSupportSetOptions(gameId);
              const selectedChar = CHARACTERS[gameId]?.[member.characterId];

              return (
                <Card key={member.id} variant="outlined" sx={{ width: 220, p: 1.5 }}>
                  <Stack spacing={1.25}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight="bold" noWrap>
                        {selectedChar?.name || 'New Teammate'}
                      </Typography>
                      <IconButton size="small" onClick={() => removeTeammate(member.id)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <FormControl fullWidth size="small">
                      <InputLabel>Character</InputLabel>
                      <Select
                        value={member.characterId}
                        label="Character"
                        onChange={(e) =>
                          updateTeammate(member.id, {
                            characterId: e.target.value,
                            weaponId: '',
                            setId: '',
                          })
                        }
                      >
                        <MenuItem value="">None</MenuItem>
                        {availableCharacters.map(([id, data]) => (
                          <MenuItem key={id} value={id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" disabled={!member.characterId}>
                      <InputLabel>Weapon</InputLabel>
                      <Select
                        value={member.weaponId}
                        label="Weapon"
                        onChange={(e) =>
                          updateTeammate(member.id, { weaponId: e.target.value })
                        }
                      >
                        <MenuItem value="">None</MenuItem>
                        {weaponOptions.map(([id, data]) => (
                          <MenuItem key={id} value={id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small" disabled={!member.characterId}>
                      <InputLabel>Set</InputLabel>
                      <Select
                        value={member.setId}
                        label="Set"
                        onChange={(e) =>
                          updateTeammate(member.id, { setId: e.target.value })
                        }
                      >
                        <MenuItem value="">None</MenuItem>
                        {setOptions.map(([id, data]) => (
                          <MenuItem key={id} value={id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Card>
              );
            })}

            <Card
              variant="outlined"
              onClick={addTeammate}
              sx={{
                width: 220,
                minHeight: 220,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderStyle: 'dashed',
              }}
            >
              <Stack alignItems="center" spacing={1}>
                <AddIcon />
                <Typography variant="body2">Add Teammate</Typography>
              </Stack>
            </Card>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              onReset();
              setOpen(false);
            }}
          >
            Clear All
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};