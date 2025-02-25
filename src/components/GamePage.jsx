import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
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
  useMediaQuery,
} from "@mui/material";
import { db } from "../firebase";
import Back from "./Back";
import Save from "./Save";
import Edit from "./Edit";
import Delete from "./Delete";
import Enka from "./Enka";
import getScore from "./getScore";

const GamePage = ({ uid, gameType, gameData, charIcons, weapIcons, setsIcons }) => {
  const { INFO, CHAR, WEAP, SETS } = gameData;
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isEnkaOpen, setIsEnkaOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [myChars, setMyChars] = useState({});
  const [myCharsScored, setMyCharsScored] = useState([]);
  const [addMode, setAddMode] = useState("");
  const [editEntry, setEditEntry] = useState({});
  const [deleteEntry, setDeleteEntry] = useState({});

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));

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

  const handleEdit = (id) => {
    setEditEntry({ id, data: myChars[id] });
  };

  const handleDelete = (id) => {
    setDeleteEntry({ id, data: myChars[id] });
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
                <TableCell>Name</TableCell>
                {isDesktop && <TableCell>Weapon</TableCell>}
                {isDesktop && <TableCell>Artifacts</TableCell>}
                <TableCell>Score</TableCell>
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
                    <TableCell>
                      <img
                        src={charIcons[`../assets/char/${gameType}/${id}.webp`]?.default}
                        alt={id}
                        style={{ width: 50, height: 50, objectFit: "contain" }}
                      />
                    </TableCell>
                    <TableCell>{CHAR[id].name}</TableCell>
                    {isDesktop && (
                      <TableCell>
                        {data.weapon && (
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {WEAP[data.weapon].name}
                                </Typography>
                                <Typography variant="body2">
                                  {"Base ATK: " + WEAP[data.weapon].base.FLAT_ATK}
                                  <br />
                                  {gameType === "HSR" ? (
                                    <React.Fragment>
                                      {"Base ATK: " + WEAP[data.weapon].base.FLAT_ATK}
                                      <br />
                                      {"Base DEF: " + WEAP[data.weapon].base.FLAT_DEF}
                                    </React.Fragment>
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
                            }
                            arrow
                          >
                            <img
                              src={weapIcons[`../assets/weap/${gameType}/${data.weapon}.webp`]?.default}
                              alt={data.weapon}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                    {isDesktop && (
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {data.set1 && (
                            <Tooltip
                              title={
                                <React.Fragment>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {SETS[data.set1].name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                    {SETS[data.set1].desc}
                                  </Typography>
                                </React.Fragment>
                              }
                              arrow
                            >
                              <img
                                src={setsIcons[`../assets/sets/${gameType}/${data.set1}.webp`]?.default}
                                alt={data.set1}
                                style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                              />
                            </Tooltip>
                          )}
                          {(data.set1 && data.set2) && (<Typography>+</Typography>)}
                          {data.set2 && (
                            <Tooltip
                              title={
                                <React.Fragment>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {SETS[data.set2].name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                    {SETS[data.set2].desc}
                                  </Typography>
                                </React.Fragment>
                              }
                              arrow
                            >
                              <img
                                src={setsIcons[`../assets/sets/${gameType}/${data.set2}.webp`]?.default}
                                alt={data.set2}
                                style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    )}
                    <TableCell>{score.toString()}</TableCell>
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
                          color="primary"
                          onClick={() => handleEdit(id)}
                        >
                          <EditIcon />
                        </Button>
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
            onClick={() => setIsSaveOpen(true)}
          >
            Add character
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEnkaOpen(true)}
            disabled={gameType === "WW" || gameType === "ZZZ"}
          >
            Load from UID
          </Button>
        </Box>

        {/* Modals */}
        <Save
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          isSaveOpen={isSaveOpen}
          charIcons={charIcons}
          weapIcons={weapIcons}
          setsIcons={setsIcons}
          setIsSaveOpen={setIsSaveOpen}
          myChars={myChars}
          setMyChars={setMyChars}
          addMode={addMode}
          setAddMode={setAddMode}
        />
        <Edit
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          charIcons={charIcons}
          weapIcons={weapIcons}
          setsIcons={setsIcons}
          myChars={myChars}
          setMyChars={setMyChars}
          editEntry={editEntry}
          setEditEntry={setEditEntry}
        />
        <Delete
          uid={uid}
          gameType={gameType}
          gameData={gameData}
          deleteEntry={deleteEntry}
          setDeleteEntry={setDeleteEntry}
          setMyChars={setMyChars}
        />
        {(gameType === "GI" || gameType === "HSR") && (
          <Enka
            uid={uid}
            gameType={gameType}
            gameData={gameData}
            isEnkaOpen={isEnkaOpen}
            setIsEnkaOpen={setIsEnkaOpen}
            setMyChars={setMyChars}
          />
        )}
      </Box>
    </Container>
  );
};

export default GamePage;
