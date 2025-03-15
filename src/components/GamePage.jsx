import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Add, KeyboardArrowRight } from "@mui/icons-material";
import {
  Container,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { db } from "../firebase";
import Back from "./Back";
import ModalSwitcher from "./Modal/ModalSwitcher";
import getRating from "./getRating/getRating";
import DeleteAll from "./Table/DeleteAll";
import Table0Star from "./Table/Table0Star";
import Table1Avatar from "./Table/Table1Avatar";
import Table2Weapon from "./Table/Table2Weapon";
import Table3EquipList from "./Table/Table3EquipList";
import Table4Rating from "./Table/Table4Rating";
import Table5Delete from "./Table/Table5Delete";
import getData from "./getData";

const GamePage = ({ gameId, userId }) => {
  const { generalData } = getData[gameId];
  const [localDocs, setLocalDocs] = useState({});
  const [sortedDocs, setSortedDocs] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredHead, setHoveredHead] = useState(false);
  const [modalPipe, setModalPipe] = useState({});
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
  useEffect(() => {
    const localEntries = Object.entries(localDocs);
    const ratedDocs = localEntries.map(([id, data]) => {
      const rating = getRating(gameId, id, data);
      return { id, data, rating };
    });

    ratedDocs.sort((a, b) => a.data.isStar === b.data.isStar
      ? b.rating.combined - a.rating.combined
      : a.data.isStar ? -1 : 1
    );

    setSortedDocs(ratedDocs);
  }, [localDocs]);

  const handleAdd = () => {
    setModalPipe({ type: "add", id: null, data: null });
  };

  const handleLoad = () => {
    setModalPipe({ type: "load", id: null, data: null });
  };

  return (
    <Container>
      <Back />
      <Stack alignItems="center" sx={{ mt: 4 }}>
        <Typography variant="h4">{generalData.TITLE}</Typography>
        <Typography variant="body2">Updated for version {generalData.VERSION}</Typography>

        <TableContainer sx={{ maxWidth: 900 }}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow
                onMouseEnter={() => setHoveredHead(true)}
                onMouseLeave={() => setHoveredHead(false)}
              >
                <TableCell sx={{ width: 50, borderBottom: "none" }} />
                <TableCell sx={{ width: 50 }} />
                <TableCell sx={{ width: 250 }}>{generalData.SECTIONS[0]}</TableCell>
                <TableCell align="center" sx={{ width: 125 }}>{generalData.SECTIONS[1]}</TableCell>
                <TableCell align="center" sx={{ width: 250 }}>{generalData.SECTIONS[2]}</TableCell>
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

                    <TableCell align="center">
                      <Table0Star
                        gameId={gameId}
                        userId={userId}
                        setLocalDocs={setLocalDocs}
                        id={id}
                        data={data}
                      />
                    </TableCell>

                    <TableCell>
                      <Table1Avatar
                        gameId={gameId}
                        setModalPipe={setModalPipe}
                        id={id}
                        data={data}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Table2Weapon
                        gameId={gameId}
                        setModalPipe={setModalPipe}
                        id={id}
                        data={data}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Table3EquipList
                        gameId={gameId}
                        setModalPipe={setModalPipe}
                        id={id}
                        data={data}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Table4Rating
                        gameId={gameId}
                        setModalPipe={setModalPipe}
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
            Add character
          </Button>
          
          <Button
            onClick={handleLoad}
            variant="contained"
            endIcon={<KeyboardArrowRight />}
            disabled={gameId === "ww"}
          >
            Load from UID
          </Button>
        </Stack>

        <ModalSwitcher
          gameId={gameId}
          userId={userId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          localDocs={localDocs}
          setLocalDocs={setLocalDocs}
        />
      </Stack>
    </Container>
  );
};

export default GamePage;
