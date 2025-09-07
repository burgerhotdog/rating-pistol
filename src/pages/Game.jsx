import { useState, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { Add, KeyboardArrowRight } from '@mui/icons-material';
import { Modal, Table } from '@components';
import { VERSION_DATA, INFO_DATA } from '@data';
import { rateBuild, updateBatch, updateDoc, deleteDoc, fetchDatabase } from '@utils';

const Game = ({ gameId, userId }) => {
  const [avatarCache, setAvatarCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // load database from firestore
  useEffect(() => {
    const fetchDB = async () => {
      if (!userId) return setAvatarCache({});
      try {
        setIsLoading(true);
        const database = await fetchDatabase(gameId, userId);
        const newAvatarCache = {};
        for (const doc of database.docs) {
          const id = doc.id;
          const data = doc.data();
          const rating = rateBuild(gameId, id, data.weaponId, data.equipList);
          newAvatarCache[id] = { data, rating };
        }
        setAvatarCache(newAvatarCache);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDB();
  }, [userId, gameId]);

  // save avatar to firestore and cache
  const saveAvatar = async (id, data) => {
    if (userId) updateDoc(gameId, userId, id, data);
    const rating = rateBuild(gameId, id, data.weaponId, data.equipList);
    setAvatarCache(prev => ({ ...prev, [id]: { data, rating } }));
  };

  const saveAvatarBatch = async (entries) => {
    if (!entries.length) return;
    if (userId) updateBatch(gameId, userId, entries);
    const newCache = {};
    for (const [id, data] of entries) {
      const rating = rateBuild(gameId, id, data.weaponId, data.equipList);
      newCache[id] = { data, rating };
    }
    setAvatarCache(prev => ({ ...prev, ...newCache }));
  };

  const deleteAvatar = async (id) => {
    if (userId) deleteDoc(gameId, userId, id);
    setAvatarCache(prev => {
      const newCache = { ...prev };
      delete newCache[id];
      return newCache;
    });
  };

  const handleAdd = () => setModalPipe({ type: 'add', id: null, data: null });
  const handleLoad = () => setModalPipe({ type: 'load', id: null, data: null });

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100dvh',
        py: 4,
        gap: 3,
      }}
    >
      <Box textAlign="center">
        <Typography variant="h3" fontWeight="bold">
          {INFO_DATA[gameId].TITLE}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Updated for Version {VERSION_DATA[gameId]}
        </Typography>
      </Box>

      <Table
        gameId={gameId}
        userId={userId}
        avatarCache={avatarCache}
        setAvatarCache={setAvatarCache}
        isLoading={isLoading}
        setModalPipe={setModalPipe}
      />

      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          New Build
        </Button>
        <Button
          onClick={handleLoad}
          variant="outlined"
          endIcon={<KeyboardArrowRight />}
        >
          Load Data
        </Button>
      </Box>

      <Modal
        gameId={gameId}
        userId={userId}
        modalPipe={modalPipe}
        setModalPipe={setModalPipe}
        avatarCache={avatarCache}
        setAvatarCache={setAvatarCache}
        saveAvatar={saveAvatar}
        saveAvatarBatch={saveAvatarBatch}
        deleteAvatar={deleteAvatar}
      />
    </Container>
  );
};

export default Game;
