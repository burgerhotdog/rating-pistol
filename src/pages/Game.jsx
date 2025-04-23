import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@config/firebase";
import { Container, Stack, Button, Typography, Box, Tabs, Tab } from "@mui/material";
import { Add, KeyboardArrowRight } from "@mui/icons-material";
import { VERSION_DATA, INFO_DATA, LABEL_DATA } from "@data";
import { getRating } from "@utils";
import Back from "@components/Back";
import Modal from "@components/Modal";
import AvatarsView from "@components/AvatarsView";
import TeamsView from "@components/TeamsView";

const Game = ({ gameId, userId }) => {
  const [avatarCache, setAvatarCache] = useState({});
  const [teamCache, setTeamCache] = useState({});
  const [modalPipe, setModalPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
              rating: getRating(gameId, doc.id, doc.data().equipList),
            };
          }
          setAvatarCache(newAvatarCache);
          console.log(newAvatarCache);

          const teamRef = collection(db, "users", userId, `${gameId}_teams`);
          const teamDocs = await getDocs(teamRef);
          const newTeamCache = {};
          for (const doc of teamDocs.docs) {
            newTeamCache[doc.id] = doc.data();
          }
          setTeamCache(newTeamCache);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAvatarCache({});
        setTeamCache({});
      }
    };
    fetchDB();
  }, [userId, gameId]);

  // sort avatarCache for AvatarsView
  const sortedAvatars = useMemo(() => (  
    Object.entries(avatarCache)
      .sort(([, a], [, b]) => (
        a.data.isStar === b.data.isStar
          ? b.rating.avatar.percentile - a.rating.avatar.percentile
          : a.data.isStar ? -1 : 1
      ))
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
        data: {
          ...(prev[id]?.data ?? {}),
          ...newData,
        },
        ...(newData.equipList && {
          rating: getRating(gameId, id, newData.equipList),
        }),
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
        rating: getRating(gameId, id, newData.equipList),
      };
    }
  
    if (userId) await batch.commit();
  
    // Update cache
    setAvatarCache((prev) => ({
      ...prev,
      ...newCache,
    }));
  };

  const handleAdd = () => setModalPipe({ type: "add", id: null, data: null });
  const handleLoad = () => setModalPipe({ type: "load", id: null, data: null });

  return (
    <Container maxWidth="lg">
      <Back />
      <Box sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Stack alignItems="center" textAlign="center">
            <Typography variant="h3" fontWeight="bold">
              {INFO_DATA[gameId].TITLE}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Updated for Version {VERSION_DATA[gameId]}
            </Typography>
          </Stack>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              centered
            >
              <Tab 
                label={
                  <Typography variant="subtitle1" fontWeight="bold">
                    {LABEL_DATA[gameId].Avatars}
                  </Typography>
                }
                sx={{ textTransform: "none" }}
              />
              <Tab 
                label={
                  <Typography variant="subtitle1" fontWeight="bold">
                    Teams (Unfinished)
                  </Typography>
                }
                sx={{ textTransform: "none" }}
              />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Stack spacing={2}>
              <AvatarsView
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
                  disabled={gameId === "ww"}
                  variant="outlined"
                  endIcon={<KeyboardArrowRight />}
                >
                  Lookup UID
                </Button>
              </Stack>
            </Stack>
          )}

          {activeTab === 1 && (
            <TeamsView
              gameId={gameId}
              userId={userId}
              avatarCache={avatarCache}
              teamCache={teamCache}
              setTeamCache={setTeamCache}
              sortedAvatars={sortedAvatars}
            />
          )}
        </Stack>
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
      />
    </Container>
  );
};

export default Game;