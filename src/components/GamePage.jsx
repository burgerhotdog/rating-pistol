import React, { useEffect, useState } from "react";
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
import AddModal from "./Add/AddModal";
import DeleteModal from "./Delete/DeleteModal";
import EditModal from "./Edit/EditModal";
import LoadModal from "./Load/LoadModal";
import getRating from "./getRating/getRating";
import TableStar from "./Table/TableStar";
import TableCharacter from "./Table/TableCharacter";
import TableWeapon from "./Table/TableWeapon";
import TableGear from "./Table/TableGear";
import TableSkills from "./Table/TableSkills";
import TableRating from "./Table/TableRating";
import TableDelete from "./Table/TableDelete";
import getData from "./getData";

const GamePage = ({ uid, gameType }) => {
  const { INFO } = getData(gameType);
  const [localObjs, setLocalObjs] = useState({});
  const [sortedObjs, setSortedObjs] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [action, setAction] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // get localObjs from firestore
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        setIsLoading(true);
        const infoDocsRef = collection(db, "users", uid, gameType);
        const infoDocs = await getDocs(infoDocsRef);
        const dataObjs = {};
        for (const infoDoc of infoDocs.docs) {
          const gearDocsRef = collection(db, "users", uid, gameType, infoDoc.id, "gearList");
          const gearDocs = await getDocs(gearDocsRef);
          const gearList = [];
          for (const gearDoc of gearDocs.docs) {
            gearList.push(gearDoc.data());
          };
          dataObjs[infoDoc.id] = {
            info: infoDoc.data(),
            gearList,
          };
        };
        setLocalObjs(dataObjs);
        setIsLoading(false);
      } else {
        setLocalObjs({});
      }
    };
    fetchDB();
  }, [uid]);

  // rate and sort localObjs for display table
  useEffect(() => {
    const ratedObjs = Object.entries(localObjs).map(([id, data]) => ({
      id,
      data,
      rating: getRating(gameType, id, data),
    }));
    ratedObjs.sort((a, b) =>
      a.data.info.isStar === b.data.info.isStar
        ? b.rating.final - a.rating.final
        : a.data.info.isStar ? -1 : 1
    );
    setSortedObjs(ratedObjs);
  }, [localObjs]);

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
        <Typography variant="h4">{INFO.TITLE}</Typography>
        <Typography variant="body2">Updated for version {INFO.VERSION}</Typography>

        <TableContainer sx={{ maxWidth: 900 }}>
          <Table sx={{ tableLayout: "fixed", width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60, borderBottom: "none" }} />
                <TableCell align="center" sx={{ width: 60 }} />
                <TableCell align="left" sx={{ width: 180 }}>{INFO.SECTION_NAMES[0]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{INFO.SECTION_NAMES[1]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{INFO.SECTION_NAMES[2]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{INFO.SECTION_NAMES[3]}</TableCell>
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
                sortedObjs.map(({ id, data, rating }) => (
                  <TableRow
                    key={id}
                    onMouseEnter={() => setHoveredRow(id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <TableCell sx={{ borderBottom: "none" }} />
                    <TableCell>
                      <TableStar
                        uid={uid}
                        gameType={gameType}
                        setLocalObjs={setLocalObjs}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell>
                      <TableCharacter
                        gameType={gameType}
                        setAction={setAction}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell>
                      <TableWeapon
                        gameType={gameType}
                        setAction={setAction}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell>
                      <TableGear
                        gameType={gameType}
                        setAction={setAction}
                        id={id}
                        data={data}
                      />
                    </TableCell>
                    <TableCell>
                      <TableSkills
                        gameType={gameType}
                        setAction={setAction}
                        id={id}
                        data={data}
                        rating={rating}
                      />
                    </TableCell>
                    <TableCell>
                      <TableRating
                        gameType={gameType}
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
                        hoveredRow={hoveredRow}
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
            disabled={gameType === "WW" || gameType === "ZZZ"}
          >
            Load from UID
          </Button>
        </Stack>

        <AddModal
          uid={uid}
          gameType={gameType}
          action={action}
          setAction={setAction}
          localObjs={localObjs}
          setLocalObjs={setLocalObjs}
        />
        <DeleteModal
          uid={uid}
          gameType={gameType}
          action={action}
          setAction={setAction}
          setLocalObjs={setLocalObjs}
        />
        <EditModal
          uid={uid}
          gameType={gameType}
          action={action}
          setAction={setAction}
          setLocalObjs={setLocalObjs}
        />
        {(gameType === "GI" || gameType === "HSR") && (
          <LoadModal
            uid={uid}
            gameType={gameType}
            action={action}
            setAction={setAction}
            setLocalObjs={setLocalObjs}
          />
        )}
      </Stack>
    </Container>
  );
};

export default GamePage;
