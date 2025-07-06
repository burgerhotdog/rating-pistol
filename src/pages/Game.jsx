import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@config/firebase";
import { Container, Stack, Button, Typography, Box } from "@mui/material";
import { Add, KeyboardArrowRight } from "@mui/icons-material";
import { VERSION_DATA, INFO_DATA } from "@data";
import { getRating } from "@utils";
import Back from "@components/Back";
import Modal from "@components/Modal";
import AvatarTable from "@components/AvatarTable";

const Game = ({ gameId, userId }) => {
  const [avatarCache, setAvatarCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // load firestore data
  useEffect(() => {
    const fetchDB = async () => {
      if (userId) {
        try {
          setIsLoading(true);
          const avatarRef = collection(db, "users", userId, gameId);
          const avatarDocs = await getDocs(avatarRef);
          const newAvatarCache = {};
          for (const doc of avatarDocs.docs) {
            newAvatarCache[doc.id] = {
              data: doc.data(),
              rating: getRating(gameId, doc.id, doc.data().weaponId, doc.data().equipList),
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

  // sort avatarCache for AvatarsView
  const sortedAvatars = useMemo(() => (  
    Object.entries(avatarCache)
      .sort(([, a], [, b]) => {
        if (a.data.isStar !== b.data.isStar) {
          return a.data.isStar ? -1 : 1;
        }

        if (!a.rating && !b.rating) {
          if ((a.rating === null) === (b.rating === null)) return 0;
          return a.rating === null ? -1 : 1;
        }

        if (!a.rating) return 1;
        if (!b.rating) return -1;

        return b.rating.avatar.percentile - a.rating.avatar.percentile;
      })
      .map(([avatarId]) => avatarId)
  ), [avatarCache]);

  // save avatar to firestore and cache
  const saveAvatar = async (id, newData) => {
    if (userId) {
      const ref = doc(db, "users", userId, gameId, id);
      await setDoc(ref, newData, { merge: true });
    }

    setAvatarCache((prev) => ({
      ...prev,
      [id]: {
        data: { ...newData },
        rating: getRating(gameId, id, newData.weaponId, newData.equipList),
      },
    }));
  };

  const saveAvatarBatch = async (entries) => {
    if (!entries.length) return;
  
    const batch = writeBatch(db);
    const newCache = {};
  
    for (const [id, newData] of entries) {
      if (userId) {
        const ref = doc(db, "users", userId, gameId, id);
        batch.set(ref, newData, { merge: true });
      }
  
      newCache[id] = {
        data: newData,
        rating: getRating(gameId, id, newData.weaponId, newData.equipList),
      };
    }
  
    if (userId) await batch.commit();
  
    setAvatarCache((prev) => ({
      ...prev,
      ...newCache,
    }));
  };

  const handleAdd = () => setModalPipe({ type: "add", id: null, data: null });
  const handleLoad = () => setModalPipe({ type: "load", id: null, data: null });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Back />
      <Box textAlign="center" mb={3}>
        <Typography variant="h3" fontWeight="bold">
          {INFO_DATA[gameId].TITLE}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Updated for Version {VERSION_DATA[gameId]}
        </Typography>
      </Box>

      <Stack spacing={3}>
        <AvatarTable
          gameId={gameId}
          userId={userId}
          avatarCache={avatarCache}
          setAvatarCache={setAvatarCache}
          isLoading={isLoading}
          sortedAvatars={sortedAvatars}
          setModalPipe={setModalPipe}
        />
        <Stack direction="row" justifyContent="center" spacing={2}>
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
        </Stack>
      </Stack>

      <Modal
        gameId={gameId}
        userId={userId}
        modalPipe={modalPipe}
        setModalPipe={setModalPipe}
        avatarCache={avatarCache}
        setAvatarCache={setAvatarCache}
        saveAvatar={saveAvatar}
        saveAvatarBatch={saveAvatarBatch}
      />
    </Container>
  );
};

export default Game;
