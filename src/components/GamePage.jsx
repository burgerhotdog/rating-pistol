import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Add, ErrorOutline, Star, StarBorder, KeyboardArrowRight } from "@mui/icons-material";
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
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { db } from "../firebase";
import Back from "./Back";
import AddModal from "./AddModal";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import LoadModal from "./LoadModal";
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

  const isModalClosed = () => !Boolean(Object.keys(action).length);

  const handleAdd = () => {
    setAction({
      type: "add",
      id: ""
    });
  };

  const handleDelete = (id) => {
    setAction({
      type: "delete",
      id,
      data: myChars[id]
    });
  };

  const handleLoad = () => {
    setAction({
      type: "load"
    });
  };

  const handleEdit = (item, id) => {
    setAction({
      type: "edit",
      item,
      id,
      data: myChars[id]
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
                <TableCell align="center" sx={{ width: 60 }}>
                  <Stack alignItems="center">
                    <StarBorder sx={{ fontSize: 16 }} />
                  </Stack>
                </TableCell>
                <TableCell align="left" sx={{ width: 180 }}>Character</TableCell>
                <TableCell align="center" sx={{ width: 90 }}>Weapon</TableCell>
                <TableCell align="center" sx={{ width: 150 }}>Gear</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>Skills</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myCharsScored.map(({ id, data, score }) => (
                <TableRow
                  key={id}
                  onMouseEnter={() => setHoveredRow(id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell></TableCell>
                  <TableCell align="center">
                    <Tooltip
                      title={isModalClosed() && (
                        <>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {CHAR[id].name}
                          </Typography>
                        </>
                      )}
                      arrow
                    >
                      <Stack direction="row" alignItems="center" gap={2}>
                        <img
                          src={charIcons[`../assets/char/${gameType}/${id}.webp`]?.default}
                          alt={id}
                          style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                        />
                        <Typography variant="body2">{CHAR[id].name}</Typography>
                      </Stack>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {data.weapon ? (
                      <Tooltip
                        title={isModalClosed() && (
                          <>
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
                          </>
                        )}
                        arrow
                      >
                        <Stack onClick={() => handleEdit("weapon", id)}>
                          <img
                            src={weapIcons[`../assets/weap/${gameType}/${data.weapon}.webp`]?.default}
                            alt={data.weapon}
                            style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                          />
                        </Stack>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={"Add Weapon"}
                        arrow
                      >
                        <ErrorOutline
                          color="error"
                          onClick={() => handleEdit("weapon", id)}
                          cursor="pointer"
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {(data.set1 || data.set2) ? (
                      <Stack direction="row" justifyContent="center" alignItems="center" gap={2}>
                        {data.set1 && (
                          <Tooltip
                            title={isModalClosed() && (
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {SETS[data.set1].name}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                  {SETS[data.set1].desc}
                                </Typography>
                              </React.Fragment>
                            )}
                            arrow
                          >
                            <Stack onClick={() => handleEdit("gear", id)}>
                              <img
                                src={setsIcons[`../assets/sets/${gameType}/${data.set1}.webp`]?.default}
                                alt={data.set1}
                                style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                              />
                            </Stack>
                          </Tooltip>
                        )}
                        {(data.set1 && data.set2) && (<Typography>+</Typography>)}
                        {data.set2 && (
                          <Tooltip
                            title={isModalClosed() && (
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {SETS[data.set2].name}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                  {SETS[data.set2].desc}
                                </Typography>
                              </React.Fragment>
                            )}
                            arrow
                          >
                            <Stack onClick={() => handleEdit("gear", id)}>
                              <img
                                src={setsIcons[`../assets/sets/${gameType}/${data.set2}.webp`]?.default}
                                alt={data.set2}
                                style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                              />
                            </Stack>
                          </Tooltip>
                        )}
                      </Stack>
                    ) : (
                      <Tooltip
                        title={"Add Gear"}
                        arrow
                      >
                        <ErrorOutline
                          color="error"
                          onClick={() => handleEdit("gear", id)}
                          cursor="pointer"
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell align="center">{score.toString()}</TableCell>
                </TableRow>
              ))}
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

        {(gameType === "GI" || gameType === "HSR") && (
          <LoadModal
            uid={uid}
            gameType={gameType}
            gameData={gameData}
            setMyChars={setMyChars}
            action={action}
            setAction={setAction}
          />
        )}

        <DeleteModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          setMyChars={setMyChars}
          action={action}
          setAction={setAction}
        />

        <EditModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          setMyChars={setMyChars}
          action={action}
          setAction={setAction}
        />
      </Stack>
    </Container>
  );
};

export default GamePage;
