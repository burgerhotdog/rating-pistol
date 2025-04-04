import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Add, KeyboardArrowRight } from "@mui/icons-material";
import {
  Container, Stack, TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, Button, Typography, CircularProgress,
} from "@mui/material";
import { db } from "../firebase";
import Back from "./Back";
import Modal from "./Modal";
import getRating from "./getRating";
import {
  DeleteAll, Table0Star, Table1Avatar, Table2Weapon,
  Table3EquipList, Table4Rating, Table5Delete,
} from "./Table";
import { DATA } from "./importData";

const GamePage = ({ gameId, userId }) => {
  const { TITLE, VERSION, HEADERS } = DATA[gameId];
  const [localDocs, setLocalDocs] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredHead, setHoveredHead] = useState(false);
  const [pipe, setPipe] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
          };
          setLocalDocs(dataDocs);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setLocalDocs({});
      }
    };
    fetchDB();
  }, [userId]);

  // rate and sort localDocs for display table
  const sortedDocs = useMemo(() => {
    const localEntries = Object.entries(localDocs);
    const ratedDocs = localEntries.map(([id, data]) => {
      const rating = getRating(gameId, id, data);
      return { id, data, rating };
    });
  
    ratedDocs.sort((a, b) =>
      a.data.isStar === b.data.isStar
        ? b.rating.combined - a.rating.combined
        : a.data.isStar ? -1 : 1
    );
  
    return ratedDocs;
  }, [localDocs]);

  const handleAdd = () => setPipe({ type: "add", id: null, data: null });
  const handleLoad = () => setPipe({ type: "load", id: null, data: null });

  const hoverStyle = (id) => ({
    backgroundColor: hoveredId === id ? "rgba(255, 255, 255, 0.03)" : "inherit",
  });

  return (
    <Container>
      <Back />
      <Stack alignItems="center" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" fontWeight="bold">
          {TITLE}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Updated for Version {VERSION}
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
                <TableCell sx={{ width: 250 }}>{HEADERS.avatar}</TableCell>
                <TableCell align="center" sx={{ width: 125 }}>{HEADERS.weapon}</TableCell>
                <TableCell align="center" sx={{ width: 250 }}>{HEADERS.equips}</TableCell>
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
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }} />
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} />
                </TableRow>
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
      </Stack>
    </Container>
  );
};

export default GamePage;
