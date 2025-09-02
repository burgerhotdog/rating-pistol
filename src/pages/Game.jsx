import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, writeBatch, deleteDoc } from 'firebase/firestore';
import { db } from '@config/firebase';
import { Container, Box, Button, Typography } from '@mui/material';
import { Add, KeyboardArrowRight } from '@mui/icons-material';
import { Modal, Table } from '@components';
import { VERSION_DATA, INFO_DATA } from '@data';
import { rateBuild } from '@utils';

const Game = ({ gameId, userId }) => {
  const [avatarCache, setAvatarCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { TITLE } = INFO_DATA[gameId];
  const VERSION = VERSION_DATA[gameId];

  // load firestore data
  useEffect(() => {
    const fetchDB = async () => {
      if (userId) {
        try {
          setIsLoading(true);
          const avatarRef = collection(db, 'users', userId, gameId);
          const avatarDocs = await getDocs(avatarRef);
          const newAvatarCache = {};
          for (const doc of avatarDocs.docs) {
            newAvatarCache[doc.id] = {
              data: doc.data(),
              rating: rateBuild(gameId, doc.id, doc.data().weaponId, doc.data().equipList),
            };
          }
          setAvatarCache(newAvatarCache);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAvatarCache({});
      }
    };
    fetchDB();
  }, [userId, gameId]);

  // save avatar to firestore and cache
  const saveAvatar = async (id, newData) => {
    if (userId) {
      const ref = doc(db, 'users', userId, gameId, String(id));
      await setDoc(ref, newData, { merge: true });
    }

    setAvatarCache((prev) => ({
      ...prev,
      [id]: {
        data: { ...newData },
        rating: rateBuild(gameId, id, newData.weaponId, newData.equipList),
      },
    }));
  };

  const saveAvatarBatch = async (entries) => {
    if (!entries.length) return;
  
    const batch = writeBatch(db);
    const newCache = {};
  
    for (const [id, newData] of entries) {
      if (userId) {
        const ref = doc(db, 'users', userId, gameId, String(id));
        batch.set(ref, newData);
      }
  
      newCache[id] = {
        data: newData,
        rating: rateBuild(gameId, id, newData.weaponId, newData.equipList),
      };
    }
  
    if (userId) await batch.commit();
  
    setAvatarCache((prev) => ({
      ...prev,
      ...newCache,
    }));
  };

  const deleteAvatar = async (id) => {
    if (userId) {
      const ref = doc(db, 'users', userId, gameId, String(id));
      await deleteDoc(ref);
    }

    setAvatarCache((prev) => {
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
          {TITLE}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Updated for Version {VERSION}
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
