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
import AddModal from "./Modal/Add/AddModal";
import DeleteModal from "./Modal/Delete/DeleteModal";
import EditModal from "./Modal/Edit/EditModal";
import LoadModal from "./Modal/Load/LoadModal";
import RatingModal from "./Modal/Rating/RatingModal";
import getRating from "./getRating/getRating";
import TableStar from "./Table/TableStar";
import TableAvatar from "./Table/TableAvatar";
import TableWeapon from "./Table/TableWeapon";
import TableEquipList from "./Table/TableEquipList";
import TableSkillMap from "./Table/TableSkillMap";
import TableRating from "./Table/TableRating";
import TableDelete from "./Table/TableDelete";
import getData from "./getData";

const GamePage = ({ gameId, userId }) => {
  const { generalData } = getData(gameId);
  const [localDocs, setLocalDocs] = useState({});
  const [sortedDocs, setSortedDocs] = useState([]);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [action, setAction] = useState({});
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
    const ratedObjs = Object.entries(localDocs).map(([id, data]) => ({
      id,
      data,
      rating: getRating(gameId, id, data),
    }));

    ratedObjs.sort((a, b) => a.data.isStar === b.data.isStar
      ? b.rating.final - a.rating.final
      : a.data.isStar ? -1 : 1);

    setSortedDocs(ratedObjs);
  }, [localDocs]);

  const handleAdd = () => {
    setAction({
      type: "add",
      id: "",
    });
  };

  const handleLoad = () => {
    setAction({
      type: "load",
    });
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
              <TableRow>
                <TableCell sx={{ width: 60, borderBottom: "none" }} />
                <TableCell align="center" sx={{ width: 60 }} />
                <TableCell align="left" sx={{ width: 180 }}>{generalData.SECTION_NAMES[0]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{generalData.SECTION_NAMES[1]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{generalData.SECTION_NAMES[2]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{generalData.SECTION_NAMES[3]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>Rating</TableCell>
                <TableCell sx={{ width: 60, borderBottom: "none" }} />
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }} />
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "none" }} />
                </TableRow>
              ) : (
                sortedDocs.map(({ id, data, rating }) => (
                  <TableRow
                    key={id}
                    onMouseEnter={() => setHoveredRowId(id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                  >
                    <TableCell sx={{ borderBottom: "none" }} />
                    <TableCell>
                      <TableStar
                        gameId={gameId}
                        userId={userId}
                        setLocalDocs={setLocalDocs}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell>
                      <TableAvatar
                        gameId={gameId}
                        setAction={setAction}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell>
                      <TableWeapon
                        gameId={gameId}
                        setAction={setAction}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell>
                      <TableEquipList
                        gameId={gameId}
                        setAction={setAction}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSkillMap
                        gameId={gameId}
                        setAction={setAction}
                        id={id}
                        data={data}
                        rating={rating}
                      />
                    </TableCell>
                    <TableCell>
                      <TableRating
                        gameId={gameId}
                        setAction={setAction}
                        id={id}
                        data={data}
                        rating={rating}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <TableDelete
                        setAction={setAction}
                        id={id}
                        data={data}
                        hoveredRowId={hoveredRowId}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" spacing={2} my={2}>
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
            disabled={gameId === "ww" || gameId === "zzz"}
          >
            Load from UID
          </Button>
        </Stack>

        <AddModal
          gameId={gameId}
          userId={userId}
          action={action}
          setAction={setAction}
          localDocs={localDocs}
          setLocalDocs={setLocalDocs}
        />
        <DeleteModal
          gameId={gameId}
          userId={userId}
          action={action}
          setAction={setAction}
          setLocalDocs={setLocalDocs}
        />
        <EditModal
          gameId={gameId}
          userId={userId}
          action={action}
          setAction={setAction}
          setLocalDocs={setLocalDocs}
        />
        {(gameId === "gi" || gameId === "hsr") && (
          <LoadModal
            gameId={gameId}
            userId={userId}
            action={action}
            setAction={setAction}
            setLocalDocs={setLocalDocs}
          />
        )}
        <RatingModal
          gameId={gameId}
          action={action}
          setAction={setAction}
        />
      </Stack>
    </Container>
  );
};

export default GamePage;
