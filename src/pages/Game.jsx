import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { Add, KeyboardArrowRight } from "@mui/icons-material";
import { db } from "@config/firebase";
import {
  Container, Stack, TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, Button, Typography, Skeleton,
  Box, Grid, Select, MenuItem, InputLabel, FormControl,
} from "@mui/material";
import { INFO, LABELS } from "@data/static";
import { VERSION, AVATARS } from "@data/dynamic";
import Back from "@components/Back";
import Modal from "@components/Modal";
import {
  DeleteAll, Table0Star, Table1Avatar, Table2Weapon,
  Table3EquipList, Table4Rating, Table5Delete,
} from "@components/Table";

const Game = ({ gameId, userId }) => {
  const [localDocs, setLocalDocs] = useState({});
  const [teamDocs, setTeamDocs] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredHead, setHoveredHead] = useState(false);
  const [pipe, setPipe] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // get localDocs from firestore
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
        // Allow a brief moment to show the skeleton
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    fetchDB();
  }, [userId, gameId]);

  // rate and sort localDocs for display table
  const sortedDocs = useMemo(() => {
    const localEntries = Object.entries(localDocs);
    const ratedDocs = localEntries.map(([id, data]) => {
      //const rating = getRating(gameId, id, data);
      return { id, data, rating: 0 };
    });
  
    ratedDocs.sort((a, b) =>
      a.data.isStar === b.data.isStar
        ? b.rating - a.rating
        : a.data.isStar ? -1 : 1
    );
  
    return ratedDocs;
  }, [localDocs]);

  const handleAdd = () => setPipe({ type: "add", id: null, data: null });
  const handleLoad = () => setPipe({ type: "load", id: null, data: null });

  const hoverStyle = (id) => ({
    backgroundColor: hoveredId === id ? "rgba(255, 255, 255, 0.03)" : "inherit",
  });

  const handleTeamChange = async (teamId, slot, characterId) => {
    setTeamDocs(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [slot]: characterId,
      },
    }));

    if (userId) {
      await setDoc(doc(db, "users", userId, `${gameId}_teams`, teamId), {
        [slot]: characterId,
      }, { merge: true });
    }
  };

  return (
    <Container>
      <Back />
      <Stack alignItems="center" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" fontWeight="bold">
          {INFO[gameId].TITLE}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Updated for Version {VERSION[gameId]}
        </Typography>
        <TableContainer sx={{ maxWidth: 900, mt: 2 }}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow
                onMouseEnter={() => setHoveredHead(true)}
                onMouseLeave={() => setHoveredHead(false)}
              >
                <TableCell sx={{ width: 50, borderBottom: "none" }} />
                <TableCell sx={{ width: 50 }} />
                <TableCell sx={{ width: 250 }}>{LABELS[gameId].Avatar}</TableCell>
                <TableCell align="center" sx={{ width: 125 }}>{LABELS[gameId].Weapon}</TableCell>
                <TableCell align="center" sx={{ width: 250 }}>{LABELS[gameId].Equip}</TableCell>
                <TableCell align="center" sx={{ width: 125 }}>Rating</TableCell>
                <TableCell sx={{ width: 50, borderBottom: "none" }}>
                  {Boolean(Object.entries(localDocs).length) && (
                    <DeleteAll
                      gameId={gameId}
                      userId={userId}
                      localDocs={localDocs}
                      setLocalDocs={setLocalDocs}
                      hoveredHead={hoveredHead}
                    />
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ borderBottom: "none" }} />
                    <TableCell align="center"><Skeleton variant="circular" width={30} height={30} /></TableCell>
                    <TableCell><Skeleton variant="text" width="80%" height={40} /></TableCell>
                    <TableCell align="center"><Skeleton variant="rounded" width={80} height={40} /></TableCell>
                    <TableCell align="center"><Skeleton variant="text" width="90%" height={40} /></TableCell>
                    <TableCell align="center"><Skeleton variant="rounded" width={60} height={40} /></TableCell>
                    <TableCell sx={{ borderBottom: "none" }} />
                  </TableRow>
                ))
              ) : (
                sortedDocs.map(({ id, data, rating }) => (
                  <TableRow
                    key={id}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <TableCell sx={{ borderBottom: "none" }} />
                    <TableCell align="center" sx={hoverStyle(id)}>
                      <Table0Star
                        gameId={gameId}
                        userId={userId}
                        setLocalDocs={setLocalDocs}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell sx={hoverStyle(id)}>
                      <Table1Avatar
                        gameId={gameId}
                        setPipe={setPipe}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell align="center" sx={hoverStyle(id)}>
                      <Table2Weapon
                        gameId={gameId}
                        setPipe={setPipe}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell align="center" sx={hoverStyle(id)}>
                      <Table3EquipList
                        gameId={gameId}
                        setPipe={setPipe}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell align="center" sx={hoverStyle(id)}>
                      <Table4Rating
                        setPipe={setPipe}
                        id={id}
                        data={data}
                        rating={rating}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Table5Delete
                        gameId={gameId}
                        userId={userId}
                        id={id}
                        setLocalDocs={setLocalDocs}
                        hoveredId={hoveredId}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" spacing={2} mt={2} mb={4}>
          <Button
            onClick={handleAdd}
            variant="contained"
            startIcon={<Add />}
          >
            New Build
          </Button>
          <Button
            onClick={handleLoad}
            variant="contained"
            endIcon={<KeyboardArrowRight />}
            disabled={gameId === "ww"}
          >
            Lookup UID
          </Button>
        </Stack>
        <Modal
          gameId={gameId}
          userId={userId}
          pipe={pipe}
          setPipe={setPipe}
          localDocs={localDocs}
          setLocalDocs={setLocalDocs}
        />

        {/* Teams Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Teams</Typography>
          <Grid container spacing={2}>
            {isLoading ? (
              [...Array(8)].map((_, index) => (
                <Grid key={index} size={3}>
                  <Box border={1} p={2} borderRadius={1}>
                    <Typography variant="h6"><Skeleton width={100} /></Typography>
                    {[...Array(4)].map((_, slotIndex) => (
                      <Box key={slotIndex} sx={{ mb: 1 }}>
                        <Skeleton variant="rounded" height={56} />
                      </Box>
                    ))}
                  </Box>
                </Grid>
              ))
            ) : (
              [...Array(8)].map((_, index) => {
                const teamId = `0${index + 1}`.slice(-2);
                return (
                  <Grid key={teamId} size={3}>
                    <Box border={1} p={2} borderRadius={1}>
                      <Typography variant="h6">Team {teamId}</Typography>
                      {[...Array(4)].map((_, slotIndex) => {
                        const slot = slotIndex.toString();
                        const selectedIds = Object.values(teamDocs[teamId] || {}).filter(Boolean);
                        const currentId = teamDocs[teamId]?.[slot];

                        const availableOptions = sortedDocs.filter(({ id }) => {
                          return id === currentId || !selectedIds.includes(id);
                        });
                        return (
                          <FormControl fullWidth key={slot} sx={{ mb: 1 }}>
                            <InputLabel>Slot {slotIndex + 1}</InputLabel>
                            <Select
                              value={teamDocs[teamId]?.[slot] || ""}
                              onChange={(e) => handleTeamChange(teamId, slot, e.target.value)}
                              label={`Slot ${slotIndex + 1}`}
                            >
                              <MenuItem value="">None</MenuItem>
                              {availableOptions.map(({ id }) => (
                                <MenuItem key={id} value={id}>{AVATARS[gameId][id].name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      })}
                    </Box>
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default Game;