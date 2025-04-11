import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardMedia, Stack,
  Container, Paper, TextField, InputAdornment, IconButton,
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, Avatar, ListItemText,
  DialogActions, Divider, LinearProgress
} from '@mui/material';
import { Add, Analytics, Close, Edit } from '@mui/icons-material';

// Mock character data
const characters = [
  { id: 'jean', name: 'Jean', element: 'anemo', rarity: 5, icon: 'https://rerollcdn.com/GENSHIN/Characters/Jean.png', role: 'Support/Healer', attributes: { attack: 80, defense: 60, utility: 90 } },
  { id: 'diluc', name: 'Diluc', element: 'pyro', rarity: 5, icon: 'https://rerollcdn.com/GENSHIN/Characters/Diluc.png', role: 'Main DPS', attributes: { attack: 95, defense: 70, utility: 40 } },
  { id: 'venti', name: 'Venti', element: 'anemo', rarity: 5, icon: 'https://rerollcdn.com/GENSHIN/Characters/Venti.png', role: 'Support', attributes: { attack: 70, defense: 50, utility: 100 } },
  { id: 'keqing', name: 'Keqing', element: 'electro', rarity: 5, icon: 'https://rerollcdn.com/GENSHIN/Characters/Keqing.png', role: 'Main DPS', attributes: { attack: 90, defense: 60, utility: 50 } },
  { id: 'qiqi', name: 'Qiqi', element: 'cryo', rarity: 5, icon: 'https://rerollcdn.com/GENSHIN/Characters/Qiqi.png', role: 'Healer', attributes: { attack: 50, defense: 60, utility: 95 } },
  { id: 'mona', name: 'Mona', element: 'hydro', rarity: 5, icon: 'https://rerollcdn.com/GENSHIN/Characters/Mona.png', role: 'Sub DPS/Support', attributes: { attack: 80, defense: 50, utility: 85 } },
  { id: 'fischl', name: 'Fischl', element: 'electro', rarity: 4, icon: 'https://rerollcdn.com/GENSHIN/Characters/Fischl.png', role: 'Sub DPS', attributes: { attack: 85, defense: 50, utility: 70 } },
  { id: 'bennett', name: 'Bennett', element: 'pyro', rarity: 4, icon: 'https://rerollcdn.com/GENSHIN/Characters/Bennett.png', role: 'Support/Healer', attributes: { attack: 70, defense: 65, utility: 90 } },
  { id: 'xingqiu', name: 'Xingqiu', element: 'hydro', rarity: 4, icon: 'https://rerollcdn.com/GENSHIN/Characters/Xingqiu.png', role: 'Sub DPS/Support', attributes: { attack: 75, defense: 70, utility: 85 } },
  { id: 'xiangling', name: 'Xiangling', element: 'pyro', rarity: 4, icon: 'https://rerollcdn.com/GENSHIN/Characters/Xiangling.png', role: 'Sub DPS', attributes: { attack: 80, defense: 60, utility: 75 } },
  { id: 'sucrose', name: 'Sucrose', element: 'anemo', rarity: 4, icon: 'https://rerollcdn.com/GENSHIN/Characters/Sucrose.png', role: 'Support', attributes: { attack: 65, defense: 50, utility: 90 } },
  { id: 'razor', name: 'Razor', element: 'electro', rarity: 4, icon: 'https://rerollcdn.com/GENSHIN/Characters/Razor.png', role: 'Main DPS', attributes: { attack: 90, defense: 75, utility: 40 } },
  { id: 'barbara', name: 'Barbara', element: 'hydro', rarity: 4, icon: 'https://rerollcdn.com/GENSHIN/Characters/Barbara.png', role: 'Healer', attributes: { attack: 40, defense: 50, utility: 90 } },
];

// Theme colors based on Genshin Impact
const theme = {
  primary: '#FFB13B', // Gold
  secondary: '#3C71AE', // Blue
  background: '#1A202C', // Dark blue-gray
  paper: 'rgba(32, 41, 58, 0.8)', // Translucent dark blue
  text: {
    primary: '#FFFFFF',
    secondary: '#CBD5E0'
  },
  rarityColors: {
    5: 'linear-gradient(180deg, #C78D25 0%, #F9D877 100%)',
    4: 'linear-gradient(180deg, #7668AC 0%, #B39DDB 100%)'
  }
};

// Element colors
const elementColors = {
  pyro: '#FF5722',
  hydro: '#03A9F4',
  anemo: '#4CAF50',
  electro: '#9C27B0',
  cryo: '#00BCD4',
  geo: '#FFC107',
  dendro: '#8BC34A'
};

const App = () => {
  const [team, setTeam] = useState(['', '', '', '']);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [characterDialogOpen, setCharacterDialogOpen] = useState(false);
  const [teamName, setTeamName] = useState('My Genshin Team');
  const [editingName, setEditingName] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

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

  const handleCharacterSelect = (charId) => {
    const newTeam = [...team];
    newTeam[selectedSlot] = charId;
    setTeam(newTeam);
    setCharacterDialogOpen(false);
  };

  const handleViewAnalytics = () => {
    setAnalyticsOpen(true);
  };

  const CharacterSlot = ({ charId, index }) => {
    const character = characters.find(c => c.id === charId);
    return (
      <Card 
        sx={{ 
          width: 120,
          height: 150,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': { 
            transform: 'scale(1.05)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.4)'
          },
          background: charId ? theme.rarityColors[character?.rarity] : 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: charId ? 'none' : '2px dashed rgba(255, 255, 255, 0.2)'
        }}
        onClick={() => handleSlotClick(index)}
      >
        {charId ? (
          <Box sx={{ position: 'relative', height: '100%' }}>
            <CardMedia
              component="img"
              height="120"
              image={character?.icon}
              alt={character?.name}
              sx={{ objectFit: 'contain', p: 1 }}
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
      </Card>
    );
  };

  // Add effect to remove margins from body
  useEffect(() => {
    // Add CSS to remove body margins
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    // Create and apply a style tag for html element too
    const style = document.createElement('style');
    style.innerHTML = `
      html, body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
      }
      
      * {
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        background: `url(https://wallpapercave.com/wp/wp8641254.jpg) no-repeat center center fixed`,
        backgroundSize: 'cover',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(20, 26, 40, 0.75))',
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={24} 
          sx={{ 
            p: 4, 
            bgcolor: theme.paper, 
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: `1px solid rgba(255, 255, 255, 0.1)`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
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
                        <IconButton 
                          onClick={() => setEditingName(false)}
                          sx={{ color: theme.text.primary }}
                        >
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setEditingName(false);
                  }
                }}
                sx={{ 
                  mb: 1, 
                  maxWidth: '480px', 
                  mx: 'auto',
                  input: { color: theme.text.primary },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.primary,
                    },
                  }
                }}
              />
            ) : (
              <Stack direction="row" alignItems="center" justifyContent="center" width="100%">
                <Typography 
                  variant="h4" 
                  fontWeight="bold"
                  sx={{ 
                    color: theme.text.primary,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {teamName}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setEditingName(true)}
                  sx={{ color: theme.primary }}
                >
                  <Edit />
                </IconButton>
              </Stack>
            )}
          </Box>
          
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
            {team.map((charId, index) => (
              <Grid key={index}>
                <CharacterSlot charId={charId} index={index} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Analytics />}
              onClick={handleViewAnalytics}
              disabled={team.every(slot => !slot)}
              sx={{ 
                px: 4,
                py: 1,
                bgcolor: theme.primary,
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

          {/* Analytics Modal */}
          <Dialog 
            open={analyticsOpen} 
            onClose={() => setAnalyticsOpen(false)}
            maxWidth="lg"
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  bgcolor: theme.paper,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: `1px solid rgba(255, 255, 255, 0.1)`,
                  color: theme.text.primary,
                  p: 2
                }
              }
            }}
          >
            <DialogTitle sx={{ color: theme.primary, fontWeight: 'bold', fontSize: '1.8rem' }}>
              {teamName} - Team Analytics
            </DialogTitle>
            <DialogContent>
              {team.filter(Boolean).length > 0 ? (
                <>
                  <Typography variant="h6" sx={{ mb: 2, color: theme.text.secondary }}>
                    Team Composition Analysis
                  </Typography>
                  <Grid container spacing={4}>
                    {/* Team Overview */}
                    <Grid size={12}>
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(0,0,0,0.4)', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, color: theme.primary }}>
                          Element Distribution:
                        </Typography>
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          {Object.entries(
                            team.filter(Boolean)
                              .map(id => characters.find(c => c.id === id)?.element)
                              .reduce((acc, element) => {
                                if (element) acc[element] = (acc[element] || 0) + 1;
                                return acc;
                              }, {})
                          ).map(([element, count]) => (
                            <Grid size="auto" key={element}>
                              <Box sx={{ 
                                px: 2, 
                                py: 0.5, 
                                bgcolor: elementColors[element], 
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: '#000',
                                fontWeight: 'bold'
                              }}>
                                <Typography variant="body2">
                                  {element.charAt(0).toUpperCase() + element.slice(1)}
                                </Typography>
                                <Box sx={{ 
                                  bgcolor: 'rgba(0,0,0,0.2)', 
                                  borderRadius: '50%', 
                                  width: 20, 
                                  height: 20,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem'
                                }}>
                                  {count}
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                        
                        <Typography variant="subtitle1" sx={{ mb: 1, color: theme.primary }}>
                          Role Coverage:
                        </Typography>
                        <Grid container spacing={1}>
                          {Object.entries(
                            team.filter(Boolean)
                              .map(id => characters.find(c => c.id === id)?.role)
                              .reduce((acc, role) => {
                                if (role) {
                                  const roles = role.split('/');
                                  roles.forEach(r => acc[r.trim()] = (acc[r.trim()] || 0) + 1);
                                }
                                return acc;
                              }, {})
                          ).map(([role, count]) => (
                            <Grid size="auto" key={role}>
                              <Box sx={{ 
                                px: 2, 
                                py: 0.5, 
                                bgcolor: role.includes('DPS') ? '#F44336' : 
                                        role === 'Support' ? '#2196F3' : 
                                        role === 'Healer' ? '#4CAF50' : '#FF9800',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: '#000',
                                fontWeight: 'bold'
                              }}>
                                <Typography variant="body2">
                                  {role}
                                </Typography>
                                <Box sx={{ 
                                  bgcolor: 'rgba(0,0,0,0.2)', 
                                  borderRadius: '50%', 
                                  width: 20, 
                                  height: 20,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.75rem'
                                }}>
                                  {count}
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Grid>
                    
                    {/* Header for Character Section */}
                    <Grid size={12}>
                      <Typography variant="h6" sx={{ color: theme.text.secondary, mt: 3 }}>
                        Character Details
                      </Typography>
                    </Grid>
                    
                    {/* Character Details - All in second row */}
                    {team.filter(Boolean).map(charId => {
                      const char = characters.find(c => c.id === charId);
                      return (
                        <Grid size={{xs: 12, sm: 6, lg: 3}} key={charId}>
                          <Paper sx={{ 
                            p: 3, 
                            bgcolor: 'rgba(0,0,0,0.4)', 
                            borderRadius: '12px',
                            border: `1px solid rgba(255,255,255,0.1)`,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                              <Avatar 
                                src={char?.icon} 
                                alt={char?.name}
                                sx={{ 
                                  width: 60, 
                                  height: 60,
                                  border: `2px solid ${elementColors[char?.element]}`,
                                  boxShadow: `0 0 8px ${elementColors[char?.element]}`
                                }}
                              />
                              <Box>
                                <Typography variant="h6" sx={{ color: theme.text.primary }}>
                                  {char?.name}
                                </Typography>
                                <Typography 
                                  variant="subtitle2" 
                                  sx={{ 
                                    color: elementColors[char?.element],
                                  }}
                                >
                                  {char?.role}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {Array(char?.rarity).fill(0).map((_, i) => (
                                    <span key={i} style={{ color: '#FFD700' }}>★</span>
                                  ))}
                                </Box>
                              </Box>
                            </Box>
                            
                            <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.1)' }} />
                            
                            <Typography variant="subtitle2" sx={{ color: theme.primary }}>
                              Attributes:
                            </Typography>
                            
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ width: 70, color: theme.text.secondary }}>
                                  Attack:
                                </Typography>
                                <Box sx={{ flex: 1, mx: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={char?.attributes.attack} 
                                    sx={{ 
                                      height: 10, 
                                      borderRadius: 5,
                                      bgcolor: 'rgba(255,87,34,0.2)',
                                      '& .MuiLinearProgress-bar': {
                                        bgcolor: '#FF5722'
                                      }
                                    }} 
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ width: 30, color: theme.text.primary }}>
                                  {char?.attributes.attack}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ width: 70, color: theme.text.secondary }}>
                                  Defense:
                                </Typography>
                                <Box sx={{ flex: 1, mx: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={char?.attributes.defense} 
                                    sx={{ 
                                      height: 10, 
                                      borderRadius: 5,
                                      bgcolor: 'rgba(33,150,243,0.2)',
                                      '& .MuiLinearProgress-bar': {
                                        bgcolor: '#2196F3'
                                      }
                                    }} 
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ width: 30, color: theme.text.primary }}>
                                  {char?.attributes.defense}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ width: 70, color: theme.text.secondary }}>
                                  Utility:
                                </Typography>
                                <Box sx={{ flex: 1, mx: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={char?.attributes.utility} 
                                    sx={{ 
                                      height: 10, 
                                      borderRadius: 5,
                                      bgcolor: 'rgba(76,175,80,0.2)',
                                      '& .MuiLinearProgress-bar': {
                                        bgcolor: '#4CAF50'
                                      }
                                    }} 
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ width: 30, color: theme.text.primary }}>
                                  {char?.attributes.utility}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: theme.text.secondary }}>
                    Add characters to your team to see analytics
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setAnalyticsOpen(false)}
                sx={{ 
                  color: theme.text.primary, 
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } 
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Character Selection Dialog */}
          <Dialog 
            open={characterDialogOpen} 
            onClose={() => setCharacterDialogOpen(false)}
            maxWidth="xs"
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  bgcolor: theme.paper,
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: `1px solid rgba(255, 255, 255, 0.1)`,
                  color: theme.text.primary
                }
              }
            }}
          >
            <DialogTitle sx={{ color: theme.primary, fontWeight: 'bold' }}>Select Character</DialogTitle>
            <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {characters
                  .filter(c => !team.includes(c.id))
                  .map(char => (
                    <ListItem 
                      component="div"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(255, 177, 59, 0.1)' },
                        borderRadius: '8px',
                        mb: 1,
                        background: `linear-gradient(90deg, rgba(255,255,255,0.05) 0%, ${char.rarity === 5 ? 'rgba(255,177,59,0.1)' : 'rgba(179,157,219,0.1)'} 100%)`
                      }}
                      key={char.id} 
                      onClick={() => handleCharacterSelect(char.id)}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={char.icon} 
                          alt={char.name}
                          sx={{ 
                            width: 48, 
                            height: 48,
                            border: `2px solid ${char.rarity === 5 ? '#FFB13B' : '#B39DDB'}`
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={char.name} 
                        secondary={`${char.element.charAt(0).toUpperCase() + char.element.slice(1)} • ${char.rarity}★`}
                        slotProps={{
                          primary: { sx: { color: theme.text.primary } },
                          secondary: { sx: { color: theme.text.secondary } }
                        }}
                      />
                    </ListItem>
                  ))}
              </List>
            </DialogContent>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;