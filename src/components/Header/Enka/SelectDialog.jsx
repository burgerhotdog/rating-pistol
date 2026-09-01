import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useBuild } from '@/contexts';
import { ZZZ } from '@/data';
import { useData } from '@/hooks';
import { parseEnka } from './parseEnka';

const SelectDialog = ({ open, onClose, charEnkas }) => {
  const { gameId } = useParams();
  const { saveBuildEntries } = useBuild();
  const charDatas = useData('character');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelected = (id) => setSelectedIds((prev) => {
    const next = new Set(prev);

    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    return next;
  })

  const handleSave = async () => {
    const charBuffer = charEnkas
      .filter((charEnka) => selectedIds.has(charEnka.avatarId))
      .map((charEnka) => parseEnka(gameId, charEnka));

    if (charBuffer.length) {
      saveBuildEntries(gameId, charBuffer);
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        transition: {
          onEnter: () => setSelectedIds(new Set(charEnkas.map((charEnka) => charEnka.avatarId))),
        },
      }}
    >
      <DialogTitle>
        Select Characters to Import
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gameId === ZZZ ? 6: 4}, 100px)`,
          justifyContent: 'center',
          gap: 1,
        }}
      >
        {charEnkas.map((charEnka) => {
          const id = charEnka.avatarId;
          const { name, icon } = charDatas[id];
          const isSelected = selectedIds.has(id);

          return (
            <Card
              key={id}
              title={name}
              sx={{
                border: 2,
                borderColor: isSelected ? 'primary.main' : 'transparent',
                boxShadow: isSelected ? 3 : 1,
                transform: isSelected ? 'scale(1.03)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <CardActionArea onClick={() => toggleSelected(id)}>
                <CardMedia
                  component="img"
                  src={icon}
                  alt={name}
                  loading="lazy"
                  sx={{
                    width: 100,
                    height: 100,
                    filter: !isSelected && 'brightness(40%)',
                  }}
                />
                <Typography
                  variant="body2"
                  color={!isSelected && 'textDisabled'}
                  noWrap
                  sx={{
                    textAlign: 'center',
                    px: 1,
                    fontWeight: isSelected && 'bold',
                  }}
                >
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          );
        })}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!selectedIds.size}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectDialog;
