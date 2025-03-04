import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Add, Delete, ErrorOutline, Star, StarBorder, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { db } from "../firebase";
import Back from "./Back";
import ModalAdd from "./ModalAdd";
import ModalDelete from "./ModalDelete";
import ModalEdit from "./ModalEdit";
import ModalLoad from "./ModalLoad";
import getRating from "./getRating";
import TableStar from "./TableStar";
import TableCharacter from "./TableCharacter";
import TableWeapon from "./TableWeapon";
import TableGear from "./TableGear";
import TableSkills from "./TableSkills";
import TableRating from "./TableRating";
import TableDelete from "./TableDelete";

const GamePage = ({ uid, gameType, gameData, gameIcons }) => {
  const { INFO, CHAR, WEAP, SETS } = gameData;
  const { charIcons, weapIcons, setsIcons } = gameIcons;
  const [localObjs, setLocalObjs] = useState({});
  const [sortedObjs, setSortedObjs] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [action, setAction] = useState({});

  // Load localObjs from Firestore
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
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
      } else {
        setLocalObjs({});
      }
    };
    fetchDB();
  }, [uid]);

  useEffect(() => {
    const ratedObjs = Object.entries(localObjs).map(([id, data]) => ({
      id,
      data,
      rating: getRating(gameType, gameData, id, data),
    }));

    ratedObjs.sort((a, b) =>
      a.data.info.isStar === b.data.info.isStar
        ? b.rating.final - a.rating.final
        : a.data.info.isStar ? -1 : 1
    );

    setSortedObjs(ratedObjs);
  }, [localObjs]);

  const isModalClosed = () => !Boolean(Object.keys(action).length);

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
                <TableCell align="left" sx={{ width: 180 }}>{INFO.HEADER_NAMES[0]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{INFO.HEADER_NAMES[1]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{INFO.HEADER_NAMES[2]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{INFO.HEADER_NAMES[3]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>Rating</TableCell>
                <TableCell sx={{ width: 60, borderBottom: "none" }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedObjs.map(({ id, data, rating }) => (
                <TableRow
                  key={id}
                  onMouseEnter={() => setHoveredRow(id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell sx={{ borderBottom: "none" }} />

                  <TableStar
                    uid={uid}
                    gameType={gameType}
                    setLocalObjs={setLocalObjs}
                    id={id}
                    data={data}
                    hoveredRow={hoveredRow}
                  />

                  <TableCharacter
                    gameType={gameType}
                    CHAR={CHAR}
                    charIcons={charIcons}
                    setAction={setAction}
                    id={id}
                    data={data}
                  />

                  <TableWeapon
                    gameType={gameType}
                    INFO={INFO}
                    weapIcons={weapIcons}
                    setAction={setAction}
                    id={id}
                    data={data}
                    isModalClosed={isModalClosed}
                  />

                  <TableGear
                    gameType={gameType}
                    SETS={SETS}
                    setsIcons={setsIcons}
                    setAction={setAction}
                    id={id}
                    data={data}
                    isModalClosed={isModalClosed}
                  />

                  <TableSkills
                    gameType={gameType}
                    setAction={setAction}
                    id={id}
                    data={data}
                    rating={rating}
                    isModalClosed={isModalClosed}
                  />

                  <TableRating
                    gameType={gameType}
                    setAction={setAction}
                    id={id}
                    data={data}
                    rating={rating}
                    isModalClosed={isModalClosed}
                  />

                  <TableDelete
                    setAction={setAction}
                    id={id}
                    data={data}
                    hoveredRow={hoveredRow}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add & Load Buttons */}
        <Stack direction="row" gap={2} my={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add character
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<KeyboardArrowRight />}
            onClick={handleLoad}
            disabled={gameType === "WW" || gameType === "ZZZ"}
          >
            Load from UID
          </Button>
        </Stack>

        {/* Modals */}
        <ModalAdd
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          action={action}
          setAction={setAction}
          localObjs={localObjs}
          setLocalObjs={setLocalObjs}
        />

        {(gameType === "GI" || gameType === "HSR") && (
          <ModalLoad
            uid={uid}
            gameType={gameType}
            gameData={gameData}
            action={action}
            setAction={setAction}
            setLocalObjs={setLocalObjs}
          />
        )}

        <ModalDelete
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          action={action}
          setAction={setAction}
          setLocalObjs={setLocalObjs}
        />

        <ModalEdit
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          action={action}
          setAction={setAction}
          setLocalObjs={setLocalObjs}
        />
      </Stack>
    </Container>
  );
};

export default GamePage;
