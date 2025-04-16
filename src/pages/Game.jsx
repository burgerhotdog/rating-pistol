import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import { Add, KeyboardArrowRight } from "@mui/icons-material";
import {
  Container, Stack, Button, Typography, Skeleton,
  Box, Grid, Select, MenuItem, InputLabel, FormControl,
  Tabs, Tab,
} from "@mui/material";
import { INFO, LABELS } from "@data/static";
import { VERSION, AVATARS } from "@data/dynamic";
import Back from "@components/Back";
import Modal from "@components/Modal";
import AvatarsView from "@components/AvatarsView";
import TeamsView from "@components/TeamsView";
import { getEquipRatings, getAvatarRating } from "@utils";

const Game = ({ gameId, userId }) => {
  const [localDocs, setLocalDocs] = useState({});
  const [teamDocs, setTeamDocs] = useState({});
  const [pipe, setPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // load firestore data
  useEffect(() => {
    const fetchDB = async () => {
      if (userId) {
        try {
          setIsLoading(true);
          const dataRef = collection(db, "users", userId, gameId);
          const data = await getDocs(dataRef);
          const dataDocs = {};
          for (const doc of data.docs) {
            dataDocs[doc.id] = doc.data();
          }
          setLocalDocs(dataDocs);

          const teamsRef = collection(db, "users", userId, `${gameId}_teams`);
          const teamsData = await getDocs(teamsRef);
          const teamsDocs = {};
          for (const doc of teamsData.docs) {
            teamsDocs[doc.id] = doc.data();
          }
          setTeamDocs(teamsDocs);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setLocalDocs({});
        setTeamDocs({});
      }
    };
    fetchDB();
  }, [userId, gameId]);

  // rate and sort localDocs for display table
  const sortedDocs = useMemo(() => {
    const localEntries = Object.entries(localDocs);
    const ratedDocs = localEntries.map(([id, data]) => {
      const equipRatings = getEquipRatings(gameId, id, data.equipList);
      const avatarRating = getAvatarRating(gameId, equipRatings);
      return { id, data, avatarRating, equipRatings };
    });
  
    ratedDocs.sort((a, b) =>
      a.data.isStar === b.data.isStar
        ? a.avatarRating.percent - b.avatarRating.percent
        : a.data.isStar ? -1 : 1
    );
  
    return ratedDocs;
  }, [localDocs]);

  const handleAdd = () => setPipe({ type: "add", id: null, data: null });
  const handleLoad = () => setPipe({ type: "load", id: null, data: null });

  return (
    <Container maxWidth="lg">
      <Back />
      <Box sx={{ py: 4 }}>
        <Stack spacing={2}>
          <Stack alignItems="center" textAlign="center">
            <Typography variant="h3" fontWeight="bold">
              {INFO[gameId].TITLE}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Updated for Version {VERSION[gameId]}
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
                    {LABELS[gameId].Avatars}
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
                localDocs={localDocs}
                setLocalDocs={setLocalDocs}
                isLoading={isLoading}
                sortedDocs={sortedDocs}
                setPipe={setPipe}
              />

              <Stack direction="row" sx={{ justifyContent: "center", gap: 2 }}>
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
                  disabled={gameId === "ww"}
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
              localDocs={localDocs}
              teamDocs={teamDocs}
              setTeamDocs={setTeamDocs}
              sortedDocs={sortedDocs}
            />
          )}
        </Stack>
      </Box>
      
      <Modal
        gameId={gameId}
        userId={userId}
        pipe={pipe}
        setPipe={setPipe}
        localDocs={localDocs}
        setLocalDocs={setLocalDocs}
      />
    </Container>
  );
};

export default Game;