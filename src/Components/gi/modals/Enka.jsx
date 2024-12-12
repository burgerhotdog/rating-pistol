import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';

const Enka = ({
  isEnkaOpen,
  setIsEnkaOpen,
}) => {
  const [enkaUid, setEnkaUid] = useState('');

  const fetchEnkaData = async () => {
    try {
      console.log(enkaUid);
      const response = await fetch(`https://enka.network/api/uid/${enkaUid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Enka data');
      }
      const data = await response.json();
      
      console.log(data);
    } catch (error) {
      console.error('Enka API Error:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleCancel = () => {
    setNewId('');
    setIsEnkaOpen(false);
  };

  return (
    <Modal open={isEnkaOpen} onClose={handleCancel}>
      <Box
        sx={{
          backgroundColor: '#1c1c1c',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Load characters from Enka
        </Typography>
        <TextField
          label="Enka UID"
          value={enkaUid}
          onChange={(e) => setEnkaUid(e.target.value)}
          type="text"
          size="small"
          fullWidth
          margin="normal"
          placeholder="Enter Genshin UID"
        />
        
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchEnkaData}
            disabled={!enkaUid}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Enka;