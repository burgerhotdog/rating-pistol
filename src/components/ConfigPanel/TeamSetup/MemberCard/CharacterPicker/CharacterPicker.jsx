import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useBuilds, useData } from '@/hooks';
import { initMember } from '@/utils';
import CharacterPickerDialog from './CharacterPickerDialog';

const CharacterPicker = ({ member, setMember }) => {
  const { gameId } = useParams();
  const builds = useBuilds();
  const [open, setOpen] = useState(false);

  const memberData = useData('character')[member.id];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          '&:hover .member-remove-btn': {
            opacity: 1,
            pointerEvents: 'auto',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Card sx={{ width: 80 }}>
            <CardActionArea onClick={() => setOpen(true)}>
              <CardMedia
                image={memberData?.icon}
                title={memberData?.name ?? null}
                sx={{ width: 80, height: 80 }}
              />
            </CardActionArea>
          </Card>

          <IconButton
            className="member-remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMember({});
            }}
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              width: 18,
              height: 18,
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.15s',
              '&:hover': {
                bgcolor: 'error.main',
                color: '#fff',
                borderColor: 'error.main',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 11 }} />
          </IconButton>
        </Box>
        <Typography variant="caption">
          {memberData?.name ?? '—'}
        </Typography>
      </Box>

      <CharacterPickerDialog
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(id) => setMember(initMember(id, gameId, builds))}
      />
    </>
  );
};

export default CharacterPicker;
