import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Add, Edit as EditIcon, Delete as DeleteIcon, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { db } from "../firebase";
import Back from "./Back";
import AddModal from "./AddModal";
import DeleteModal from "./DeleteModal";
import EditWeap from "./EditWeap";
import EditSets from "./EditSets";
import Enka from "./Enka";
import getScore from "./getScore";

const GamePage = ({ uid, gameType, gameData, gameIcons }) => {
  const { INFO, CHAR, WEAP, SETS } = gameData;
  const { charIcons, weapIcons, setsIcons } = gameIcons;
  const theme = useTheme();
  const [myChars, setMyChars] = useState({});
  const [myCharsScored, setMyCharsScored] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [action, setAction] = useState({});

  // Load myChars from Firestore
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        const charDocsRef = collection(db, "users", uid, gameType);
        const charDocs = await getDocs(charDocsRef);
        const docsToObjs = {};

        charDocs.docs.forEach((charDoc) => {
          docsToObjs[charDoc.id] = charDoc.data();
        });

        setMyChars(docsToObjs);
      } else {
        setMyChars({});
      }
    };
    fetchDB();
  }, [uid]);

  // Load myCharsScored from myChars
  useEffect(() => {
    const scoredChars = Object.entries(myChars).map(([id, data]) => ({
      id,
      data,
      score: getScore(gameType, gameData, id, data),
    }));

    scoredChars.sort((a, b) => b.score - a.score);

    setMyCharsScored(scoredChars);
  }, [myChars]);

  const handleAdd = () => {
    setAction({ e: "add", id: "" });
  };

  const handleLoad = () => {
    setAction({ e: "load" });
  };

  const handleWeap = (id) => {
    setAction({ e: "weap", id, data: myChars[id] });
  };

  const handleSets = (id) => {
    setAction({ e: "sets", id, data: myChars[id] });
  };

  const handleEdit = (id) => {
    setAction({ e: "edit", id, data: myChars[id] });
  };

  const handleDelete = (id) => {
    setAction({ e: "delete", id, data: myChars[id] });
  };

  return (
    <Container>
      <Back />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
        <Typography variant="h4">{INFO.TITLE}</Typography>
        <Typography variant="body2">Updated for version {INFO.VERSION}</Typography>
        <TableContainer sx={{ maxWidth: 900 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Weapon</TableCell>
                <TableCell align="center">Artifacts</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(myChars).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No characters to display</TableCell>
                </TableRow>
              ) : (
                myCharsScored.map(({ id, data, score }) => (
                  <TableRow
                    key={id}
                    onMouseEnter={() => setHoveredRow(id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <TableCell align="center">
                      <img
                        src={charIcons[`../assets/char/${gameType}/${id}.webp`]?.default}
                        alt={id}
                        style={{ width: 50, height: 50, objectFit: "contain" }}
                      />
                    </TableCell>
                    <TableCell align="center">{CHAR[id].name}</TableCell>
                    <TableCell align="center">
                      {data.weapon ? (
                        <Tooltip
                          title={
                            !action?.e && (
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {WEAP[data.weapon].name}
                                </Typography>
                                <Typography variant="body2">
                                  {gameType === "HSR" && (
                                    <>
                                      {"Base HP: " + WEAP[data.weapon].base.FLAT_HP}
                                      <br />
                                    </>
                                  )}
                                  {"Base ATK: " + WEAP[data.weapon].base.FLAT_ATK}
                                  <br />
                                  {gameType === "HSR" ? (
                                    "Base DEF: " + WEAP[data.weapon].base.FLAT_DEF
                                  ) : (
                                    WEAP[data.weapon].substat
                                  )}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                  {WEAP[data.weapon].subtitle}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                  {WEAP[data.weapon].desc}
                                </Typography>
                              </React.Fragment>
                            )
                          }
                          arrow
                        >
                          <div onClick={() => handleWeap(id)} style={{ display: "inline-block" }}>
                            <img
                              src={weapIcons[`../assets/weap/${gameType}/${data.weapon}.webp`]?.default}
                              alt={data.weapon}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </div>
                        </Tooltip>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleWeap(id)}
                        >
                          <Add />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {(data.set1 || data.set2) ? (
                        <Box sx={(theme) => theme.customStyles.row}>
                          {data.set1 && (
                            <Tooltip
                              title={
                                !action?.e && (
                                  <React.Fragment>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {SETS[data.set1].name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                      {SETS[data.set1].desc}
                                    </Typography>
                                  </React.Fragment>
                                )
                              }
                              arrow
                            >
                              <div onClick={() => handleSets(id)} style={{ display: "inline-block" }}>
                                <img
                                  src={setsIcons[`../assets/sets/${gameType}/${data.set1}.webp`]?.default}
                                  alt={data.set1}
                                  style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                                />
                              </div>
                            </Tooltip>
                          )}
                          {(data.set1 && data.set2) && (<Typography>+</Typography>)}
                          {data.set2 && (
                            <Tooltip
                              title={
                                !action?.e && (
                                  <React.Fragment>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                      {SETS[data.set2].name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                      {SETS[data.set2].desc}
                                    </Typography>
                                  </React.Fragment>
                                )
                              }
                              arrow
                            >
                              <div onClick={() => handleSets(id)} style={{ display: "inline-block" }}>
                                <img
                                  src={setsIcons[`../assets/sets/${gameType}/${data.set2}.webp`]?.default}
                                  alt={data.set2}
                                  style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                                />
                              </div>
                            </Tooltip>
                          )}
                        </Box>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleSets(id)}
                        >
                          <Add />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center">{score.toString()}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          visibility: hoveredRow === id ? "visible" : "hidden"
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleDelete(id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add & Load Buttons */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
        </Box>

        {/* Modals */}
        <AddModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          myChars={myChars}
          setMyChars={setMyChars}
          action={action}
          setAction={setAction}
        />
        <EditWeap
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          myChars={myChars}
          setMyChars={setMyChars}
          action={action}
          setAction={setAction}
        />
        <EditSets
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          myChars={myChars}
          setMyChars={setMyChars}
          action={action}
          setAction={setAction}
        />
        <DeleteModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          setMyChars={setMyChars}
          action={action}
          setAction={setAction}
        />
        {(gameType === "GI" || gameType === "HSR") && (
          <Enka
            uid={uid}
            gameType={gameType}
            gameData={gameData}
            setMyChars={setMyChars}
            action={action}
            setAction={setAction}
          />
        )}
      </Box>
    </Container>
  );
};

export default GamePage;
