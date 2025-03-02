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
  const [localCollection, setLocalCollection] = useState({});
  const [localCollectionRated, setLocalCollectionRated] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [action, setAction] = useState({});

  // Load localCollection from Firestore
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        const infoDocsRef = collection(db, "users", uid, gameType);
        const infoDocs = await getDocs(infoDocsRef);
        const infoDocsCollection = {};

        for (const infoDoc of infoDocs.docs) {
          const gearDocsRef = collection(db, "users", uid, gameType, infoDoc.id);
          const gearDocs = await getDocs(gearDocsRef);
          const gearDocsCollection = {};

          for (const gearDoc of gearDocs.docs) {
            gearDocsCollection[gearDoc.id] = gearDoc.data();
          };

          infoDocsCollection[infoDoc.id] = {
            info: infoDoc.data(),
            gear: gearDocsCollection,
          };
        };

        setLocalCollection(infoDocsCollection);
      } else {
        setLocalCollection({});
      }
    };
    fetchDB();
  }, [uid]);

  // Load localCollectionRated from localCollection
  useEffect(() => {
    const ratedChars = Object.entries(localCollection).map(([id, data]) => ({
      id,
      info: data.info,
      gear: data.gear,
      rating: getRating(gameType, gameData, id, data),
    }));

    ratedChars.sort((a, b) => b.rating.final - a.rating.final);

    setLocalCollectionRated(ratedChars);
  }, [localCollection]);

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
      data: localCollection[id],
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
              {localCollectionRated.map(({ id, info, gear, rating }) => (
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
                  <TableCell></TableCell>
                  <TableCell align="center">
                    {rating.final !== -1 ? (
                      <Tooltip>
                        <>{rating.final.toString()}</>
                      </Tooltip>
                    ) : (
                      <Tooltip>
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
          localCollection={localCollection}
          setLocalCollection={setLocalCollection}
          action={action}
          setAction={setAction}
        />

        {(gameType === "GI" || gameType === "HSR") && (
          <LoadModal
            uid={uid}
            gameType={gameType}
            gameData={gameData}
            setLocalCollection={setLocalCollection}
            action={action}
            setAction={setAction}
          />
        )}

        <DeleteModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          setLocalCollection={setLocalCollection}
          action={action}
          setAction={setAction}
        />

        <EditModal
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          gameIcons={gameIcons}
          setLocalCollection={setLocalCollection}
          action={action}
          setAction={setAction}
        />
      </Stack>
    </Container>
  );
};

export default GamePage;
