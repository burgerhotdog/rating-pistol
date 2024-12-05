import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Box, Typography, Select, MenuItem, Button, Modal } from '@mui/material';
import template from '../data/template';

const Save = ({
  uid,
  isAddEditOpen,
  setIsAddEditOpen,
  editIndex,
  setEditIndex,
  myChars,
  setMyChars,
  newChar,
  setNewChar,
}) => {
  // error state
  const [error, setError] = useState('');

  // handle form inputs
  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewChar({ ...newChar, [name]: value });
  };

  const characterNames = ['character1', 'character2', 'character3'];
  const constellations = [0, 1, 2, 3, 4, 5, 6];
  const weapons = ['weapon1', 'weapon2', 'weapon3'];
  const refinements = [1, 2, 3, 4, 5];

  // valid character check before saving
  const validate = () => {
    const errors = [];
    if (!newChar.id) errors.push("No name selected");
    if (!newChar.weapon) errors.push("No weapon selected");
    if (errors.length) {
      setError(errors.join(', '));
      return false;
    }
    setError('');
    return true;
  };

  // save
  const handleConfirmAddEdit = async () => {
    if (!validate()) return;
    if (editIndex === null) { // add char
      let updatedChars = [...myChars, newChar];
      setMyChars(updatedChars);

      const { id, ...charWithoutId } = newChar;
      const charDocRef = doc(db, 'users', uid, 'GenshinImpact', newChar.id);
      await setDoc(charDocRef, charWithoutId, { merge: true });
    } else { // edit char
      let updatedChars = [...myChars];
      updatedChars[editIndex] = newChar;
      setMyChars(updatedChars);

      const { id, ...charWithoutId } = newChar;
      const charDocRef = doc(db, 'users', uid, 'GenshinImpact', newChar.id);
      await setDoc(charDocRef, charWithoutId, { merge: true });
    }
    setError('');
    setEditIndex(null);
    setNewChar(template());
    setIsAddEditOpen(false);
  };

  // cancel
  const handleCancelAddEdit = () => {
    setError('');
    setEditIndex(null);
    setNewChar(template());
    setIsAddEditOpen(false);
  };

  return (
    <Modal
      open={isAddEditOpen}
      onClose={handleCancelAddEdit}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#242424',
          width: 400,
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {editIndex === null ? 'Add New Character' : 'Edit Character'}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Name
        </Typography>
        <Select
          fullWidth
          name="id"
          value={newChar.id || "(select)"}
          onChange={handleInput}
        >
          <MenuItem value="(select)" disabled style={{ color: 'gray' }}>
            (select)
          </MenuItem>
          {characterNames.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Constellation
        </Typography>
        <Select
          fullWidth
          name="constellation"
          value={newChar.constellation}
          onChange={handleInput}
        >
          {constellations.map((item) => (
            <MenuItem key={item} value={item}>
              {'C' + item}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Weapon
        </Typography>
        <Select
          fullWidth
          name="weapon"
          value={newChar.weapon || "(select)"}
          onChange={handleInput}
        >
          <MenuItem value="(select)" disabled style={{ color: 'gray' }}>
            (select)
          </MenuItem>
          {weapons.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Refinement
        </Typography>
        <Select
          fullWidth
          name="refinement"
          value={newChar.weaponRefinement}
          onChange={handleInput}
        >
          {refinements.map((item) => (
            <MenuItem key={item} value={item}>
              {'R' + item}
            </MenuItem>
          ))}
        </Select>

        {/* error message */}
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}
        
        {/* buttons */}
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="outlined" color="secondary" onClick={handleCancelAddEdit}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirmAddEdit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Save;
