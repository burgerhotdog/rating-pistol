import React, { useState } from "react";
import { db } from "@config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Box, Grid, Typography, Stack, Button, Paper, IconButton, TextField, InputAdornment } from "@mui/material";
import { Close, Edit, Analytics, Add } from "@mui/icons-material";
import { AVATAR_ASSETS } from "@assets";
import { AVATARS } from "@data";

const TeamsView = ({ gameId, userId, localDocs, teamDocs, setTeamDocs, sortedDocs }) => {
  const [team, setTeam] = useState([null, null, null, null]);
  const [teamName, setTeamName] = useState("My Team");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [characterDialogOpen, setCharacterDialogOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  
  const handleTeamChange = async (teamId, slot, characterId) => {
    setTeamDocs(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [slot]: characterId,
      },
    }));
  };

  const handleSlotClick = (index) => {
    if (team[index]) {
      // Remove character if slot is filled
      const newTeam = [...team];
      newTeam[index] = '';
      setTeam(newTeam);
    } else {
      // Open character selection if slot is empty
      setSelectedSlot(index);
      setCharacterDialogOpen(true);
    }
  };

  const CharacterSlot = ({ charId, index }) => {
    const AVATAR = AVATARS[gameId][charId];
    return (
      <Paper
        onClick={() => handleSlotClick(index)}
        sx={{
          width: 120,
          height: 150,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { 
            transform: 'scale(1.05)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.4)'
          },
          background: charId ? rarityColor[AVATAR.rarity] : 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: charId ? 'none' : '2px dashed rgba(255, 255, 255, 0.2)'
        }}
      >
        {charId ? (
          <Box sx={{ position: 'relative', height: '100%' }}>
            <Box
              component="img"
              alt={AVATAR?.name}
              src={AVATAR_ASSETS[`./${gameId}/${charId}.webp`]?.default}
              sx={{ width: 120, height: 120, objectFit: 'contain', p: 1 }}
            />
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              width: '100%', 
              bgcolor: 'rgba(0,0,0,0.7)',
              p: 0.5,
              textAlign: 'center'
            }}>
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                {character?.name}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Add fontSize="large" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
              Add Character
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <Paper sx={{
      p: 4,
      borderRadius: "16px",
      border: `1px solid rgba(255, 255, 255, 0.1)`,
    }}>
      <Stack direction="row" alignItems="center">
        {editingName ? (
          <TextField
            autoFocus
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setEditingName(false)}>
                      <Close />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingName(false);
              }
            }}
            sx={{ 
              mb: 1, 
              maxWidth: "480px",
              mx: "auto",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
              }
            }}
          />
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="center" width="100%" spacing={1}>
            <Typography variant="h4" fontWeight="bold">
              {teamName}
            </Typography>
            <IconButton onClick={() => setEditingName(true)}>
              <Edit />
            </IconButton>
          </Stack>
        )}
      </Stack>
      
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        {team.map((charId, index) => (
          <Grid key={index}>
            <CharacterSlot charId={charId} index={index} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          startIcon={<Analytics />}
          disabled={team.every(slot => !slot)}
          sx={{ 
            px: 4,
            py: 1,
            color: '#000',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#FFD180',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(255, 177, 59, 0.3)',
              color: 'rgba(0, 0, 0, 0.5)'
            }
          }}
        >
          View Team Analytics
        </Button>
      </Box>
    </Paper>
  )
};

export default TeamsView;
