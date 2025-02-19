import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Tooltip from "@mui/material/Tooltip";
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
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { db } from "../firebase";
import Back from "../components/Back";
import Save from "../components/Save";
import Delete from "../components/Delete";
import GAME_DATA from "../components/gameData";
import Enka from "../components/Enka";
import getScore from "../components/getScore";
const cImgs = import.meta.glob("../assets/char/HSR/*.webp", { eager: true });
const wImgs = import.meta.glob("../assets/weap/HSR/*.webp", { eager: true });
const sImgs = import.meta.glob("../assets/set/HSR/*.webp", { eager: true });

const GAME_TYPE = "HSR";
const VERSION_NUMBER = "3.0";

const HonkaiStarRail = ({ uid }) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEnkaOpen, setIsEnkaOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [myChars, setMyChars] = useState({});
  const [myCharsWithScores, setMyCharsWithScores] = useState([]);

  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("xl"));

  // Populate myChars when user signs in/out
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        // Fetch character documents from firestore
        const charDocsRef = collection(db, "users", uid, GAME_TYPE);
        const charDocs = await getDocs(charDocsRef);
  
        // Convert documents to objects
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

  useEffect(() => {
    const scoredChars = Object.entries(myChars).map(([cid, cdata]) => ({
      cid,
      cdata,
      score: getScore(GAME_TYPE, cid, cdata),
    }));
  
    // Sort once when computed
    scoredChars.sort((a, b) => b.score - a.score);
  
    setMyCharsWithScores(scoredChars);
  }, [myChars]); // Runs only when myChars changes

  return (
    <Container>
      <Back />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4">Honkai Star Rail</Typography>
        <Typography variant="body2">Updated for version {VERSION_NUMBER}</Typography>
        <TableContainer sx={{ maxWidth: 900 }}>
          <Table>
            {/* Table headers */}
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                {isNotMobile && <TableCell>Light Cone</TableCell>}
                {isNotMobile && <TableCell>Relics</TableCell>}
                <TableCell>Score</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table data */}
            <TableBody>
              {Object.keys(myChars).length === 0 ? (
                // In the case that there are no saved characters
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No characters to display
                  </TableCell>
                </TableRow>
              ) : (
                // Order characters in table by score
                myCharsWithScores.map(({ cid, cdata, score }) => (
                  <TableRow
                    key={cid}
                    onMouseEnter={() => setHoveredRow(cid)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <TableCell>
                      <img
                        src={cImgs[`../assets/char/HSR/${cid}.webp`]?.default}
                        alt={"char"}
                        style={{ width: 50, height: 50, objectFit: "contain" }}
                      />
                    </TableCell>
                    <TableCell>{GAME_DATA[GAME_TYPE].CHARACTERS[cid].name}</TableCell>
                    {isNotMobile && (
                      <TableCell>
                        {cdata.weapon && (
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {GAME_DATA[GAME_TYPE].WEAPONS[cdata.weapon].name}
                                </Typography>
                                <Typography variant="body2">
                                  {"Base HP: " + GAME_DATA[GAME_TYPE].WEAPONS[cdata.weapon].base.HPDelta} <br />
                                  {"Base ATK: " + GAME_DATA[GAME_TYPE].WEAPONS[cdata.weapon].base.AttackDelta} <br />
                                  {"Base DEF: " + GAME_DATA[GAME_TYPE].WEAPONS[cdata.weapon].base.DefenceDelta}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                  {GAME_DATA[GAME_TYPE].WEAPONS[cdata.weapon].subtitle}
                                </Typography>
                                <Typography variant="body2">
                                  {GAME_DATA[GAME_TYPE].WEAPONS[cdata.weapon].desc}
                                </Typography>
                              </React.Fragment>
                            }
                            arrow
                          >
                            <img
                              src={wImgs[`../assets/weap/HSR/${cdata.weapon}.webp`]?.default}
                              alt={"weap"}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                    {isNotMobile && (
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {cdata.set1 && (
                            <Tooltip
                              title={
                                <React.Fragment>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {GAME_DATA[GAME_TYPE].SETS_RELIC[cdata.set1].name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                    {GAME_DATA[GAME_TYPE].SETS_RELIC[cdata.set1].desc}
                                  </Typography>
                                </React.Fragment>
                              }
                              arrow
                            >
                              <img
                                src={sImgs[`../assets/set/HSR/${cdata.set1}.webp`]?.default}
                                alt={"set1"}
                                style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                              />
                            </Tooltip>
                          )}
                          {(cdata.set1 && cdata.set2) && (<Typography>+</Typography>)}
                          {cdata.set2 && (
                            <Tooltip
                              title={
                                <React.Fragment>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {GAME_DATA[GAME_TYPE].SETS_PLANAR[cdata.set2].name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                    {GAME_DATA[GAME_TYPE].SETS_PLANAR[cdata.set2].desc}
                                  </Typography>
                                </React.Fragment>
                              }
                              arrow
                            >
                              <img
                                src={sImgs[`../assets/set/HSR/${cdata.set2}.webp`]?.default}
                                alt={"set2"}
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
                          visibility: hoveredRow === cid ? "visible" : "hidden",
                        }}
                      >
                        {/* Edit button */}
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => setIsSaveOpen(cid)}
                        >
                          <EditIcon />
                        </Button>

                        {/* Delete button */}
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => setIsDeleteOpen(cid)}
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

        {/* Add character button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsSaveOpen(true)}
          sx={{ mt: 2 }}
        >
          Add character
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEnkaOpen(true)}
          sx={{ mt: 2 }}
        >
          Load from uid
        </Button>

        {/* Modals */}
        <Save
          gameType={GAME_TYPE}
          uid={uid}
          isSaveOpen={isSaveOpen}
          setIsSaveOpen={setIsSaveOpen}
          myChars={myChars}
          setMyChars={setMyChars}
        />

        <Delete
          gameType={GAME_TYPE}
          uid={uid}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setMyChars={setMyChars}
        />

        <Enka
          gameType={GAME_TYPE}
          uid={uid}
          isEnkaOpen={isEnkaOpen}
          setIsEnkaOpen={setIsEnkaOpen}
          setMyChars={setMyChars}
        />
      </Box>        
    </Container>
  );
};

export default HonkaiStarRail;
