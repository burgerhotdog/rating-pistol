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
import getRating from "./getRating";

const GamePage = ({ uid, gameType, gameData, gameIcons }) => {
  const { INFO, CHAR, WEAP, SETS } = gameData;
  const { charIcons, weapIcons, setsIcons } = gameIcons;
  const theme = useTheme();
  const [localObjs, setLocalObjs] = useState({});
  const [ratedObjs, setRatedObjs] = useState([]);
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

  // Load ratedObjs from localObjs
  useEffect(() => {
    const ratedChars = Object.entries(localObjs).map(([id, data]) => ({
      id,
      info: data.info,
      rating: getRating(gameType, gameData, id, data),
    }));

    ratedChars.sort((a, b) => b.rating.final - a.rating.final);

    setRatedObjs(ratedChars);
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

  const handleEdit = (item, id) => {
    setAction({
      type: "edit",
      item,
      id,
      data: localObjs[id],
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
                <TableCell align="left" sx={{ width: 180 }}>{INFO.HEADER_NAMES[0]}</TableCell>
                <TableCell align="center" sx={{ width: 90 }}>{INFO.HEADER_NAMES[1]}</TableCell>
                <TableCell align="center" sx={{ width: 150 }}>{INFO.HEADER_NAMES[2]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>{INFO.HEADER_NAMES[3]}</TableCell>
                <TableCell align="center" sx={{ width: 120 }}>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ratedObjs.map(({ id, info, rating }) => (
                <TableRow
                  key={id}
                  onMouseEnter={() => setHoveredRow(id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell></TableCell>
                  <TableCell align="center">
                    <Tooltip>
                      <Stack direction="row" alignItems="center" gap={2}>
                        <Box
                          component="img"
                          alt={id}
                          src={charIcons[`../assets/char/${gameType}/${id}.webp`]?.default}
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: "contain",
                            cursor: "pointer",
                          }}
                        />
                        <Typography variant="body2">{CHAR[id].name}</Typography>
                      </Stack>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {info.weapon ? (
                      <Tooltip
                        title={isModalClosed() && (
                          <>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {WEAP[info.weapon].name}
                            </Typography>
                            <Typography variant="body2">
                              {gameType === "HSR" && (
                                <>
                                  {"Base HP: " + WEAP[info.weapon].base.FLAT_HP}
                                  <br />
                                </>
                              )}
                              {"Base ATK: " + WEAP[info.weapon].base.FLAT_ATK}
                              <br />
                              {gameType === "HSR" ? (
                                "Base DEF: " + WEAP[info.weapon].base.FLAT_DEF
                              ) : (
                                WEAP[info.weapon].substat
                              )}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ mt: 1 }}>
                              {WEAP[info.weapon].subtitle}
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                              {WEAP[info.weapon].desc}
                            </Typography>
                          </>
                        )}
                        arrow
                      >
                        <Stack direction="row" justifyContent="center">
                          <Box
                            component="img"
                            alt={info.weapon}
                            onClick={() => handleEdit("weapon", id)}
                            src={weapIcons[`../assets/weap/${gameType}/${info.weapon}.webp`]?.default}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                              cursor: "pointer",
                            }}
                          />
                        </Stack>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <Add
                          onClick={() => handleEdit("weapon", id)}
                          cursor="pointer"
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {(info.set[0] || info.setExtra) ? (
                      <Stack direction="row" justifyContent="center" alignItems="center" gap={2}>
                        {info.set[0] && (
                          <Tooltip
                            title={isModalClosed() && (
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {SETS[info.set[0]].name}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                  {SETS[info.set[0]].desc}
                                </Typography>
                              </React.Fragment>
                            )}
                            arrow
                          >
                            <Box
                              component="img"
                              alt={info.set[0]}
                              onClick={() => handleEdit("gear", id)}
                              src={setsIcons[`../assets/sets/${gameType}/${info.set[0]}.webp`]?.default}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        )}
                        {(info.set[0] && info.setExtra) && (<Typography>+</Typography>)}
                        {info.setExtra && (
                          <Tooltip
                            title={isModalClosed() && (
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {SETS[info.setExtra].name}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                  {SETS[info.setExtra].desc}
                                </Typography>
                              </React.Fragment>
                            )}
                            arrow
                          >
                            <Box
                              component="img"
                              alt={info.setExtra}
                              onClick={() => handleEdit("gear", id)}
                              src={setsIcons[`../assets/sets/${gameType}/${info.setExtra}.webp`]?.default}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        )}
                      </Stack>
                    ) : (
                      <Tooltip>
                        <Add
                          onClick={() => handleEdit("gear", id)}
                          cursor="pointer"
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip
                      arrow
                    >
                      <Typography
                        onClick={() => handleEdit("skills", id)}
                        sx={{ cursor: "pointer" }}
                      >
                        {rating.skills.toString() + "%"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    {rating.final !== -1 ? (
                      <Tooltip>
                        <Typography
                          sx={{ cursor: "pointer" }}
                        >
                          {rating.final.toString()}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip arrow>
                        <ErrorOutline
                          color="error"
                          cursor="pointer"
                        />
                      </Tooltip>
                    )}
                  </TableCell>
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
        <AddModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          localObjs={localObjs}
          setLocalObjs={setLocalObjs}
          action={action}
          setAction={setAction}
        />

        {(gameType === "GI" || gameType === "HSR") && (
          <LoadModal
            uid={uid}
            gameType={gameType}
            gameData={gameData}
            setLocalObjs={setLocalObjs}
            action={action}
            setAction={setAction}
          />
        )}

        <DeleteModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          setLocalObjs={setLocalObjs}
          action={action}
          setAction={setAction}
        />

        <EditModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          setLocalObjs={setLocalObjs}
          action={action}
          setAction={setAction}
        />
      </Stack>
    </Container>
  );
};

export default GamePage;
