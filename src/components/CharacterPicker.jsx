import { useState, useMemo } from 'react';
import {
  Avatar,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { STATS, CHARACTERS, WEAPONS } from '@/data';

export const CharacterPicker = ({ gameId, currentId, updateTeam }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const options = useMemo(() => {
    const searchLower = search.toLowerCase();
    return Object.entries(CHARACTERS[gameId])
      .filter(([_, { name }]) =>
        name.toLowerCase().includes(searchLower)
      )
      .map(([id, { name }]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gameId, search]);

  const handleSelect = (id) => {
    updateTeam(id);
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <Card>
        <CardActionArea onClick={() => setOpen(true)}>
          <Avatar
            src={`${gameId}/character/${currentId}.webp`}
            alt={CHARACTERS[gameId][currentId]?.name}
            sx={{ width: 48, height: 48 }}
            variant="rounded"
          />
        </CardActionArea>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Select Character</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search characters..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={1}>
            {options.map(({ id, name }) => {
              return (
                <Grid key={id}>
                  <Card sx={{ width: 100 }}>
                    <CardActionArea onClick={() => handleSelect(id)}>
                      <CardMedia
                        image={`${gameId}/character/${id}.webp`}
                        title={name}
                        sx={{ width: 100, height: 100 }}
                      />
                      <Typography variant="body2" textAlign="center" noWrap>
                        {name}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};
