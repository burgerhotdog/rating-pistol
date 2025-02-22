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
import Back from "../components/Back";
import Save from "../components/Save";
import Delete from "../components/Delete";
import Enka from "../components/Enka";
import getScore from "../components/getScore";
import GAME_DATA from "../components/gameData";
const cImgs = import.meta.glob("../assets/char/GI/*.webp", { eager: true });
const wImgs = import.meta.glob("../assets/weap/GI/*.webp", { eager: true });
const sImgs = import.meta.glob("../assets/sets/GI/*.webp", { eager: true });

const GAME_TYPE = "GI";
const VERSION_NUMBER = "5.4";

const GenshinImpact = ({ uid }) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEnkaOpen, setIsEnkaOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [myChars, setMyChars] = useState({});
  const [myCharsWithScores, setMyCharsWithScores] = useState([]);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));

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
  
    scoredChars.sort((a, b) => b.score - a.score);
  
    setMyCharsWithScores(scoredChars);
  }, [myChars]);

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
        <Typography variant="h4">Genshin Impact</Typography>
        <Typography variant="body2">Updated for version {VERSION_NUMBER}</Typography>
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
                // In the case that there are no saved characters
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No characters to display
                  </TableCell>
                </TableRow>
              ) : (
                // Order characters in table by score
                myCharsWithScores.map(({ id, data, score }) => (
                  <TableRow
                    key={id}
                    onMouseEnter={() => setHoveredRow(id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <TableCell>
                      <img
                        src={cImgs[`../assets/char/GI/${id}.webp`]?.default}
                        alt={id}
                        style={{ width: 50, height: 50, objectFit: "contain" }}
                      />
                    </TableCell>
                    <TableCell>{GAME_DATA[GAME_TYPE].CHAR[id].name}</TableCell>
                    {isDesktop && (
                      <TableCell>
                        {data.weapon && (
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {GAME_DATA[GAME_TYPE].WEAP[data.weapon].name}
                                </Typography>
                                <Typography variant="body2">
                                  {"Base ATK: " + GAME_DATA[GAME_TYPE].WEAP[data.weapon].base.FLAT_ATK} <br />
                                  {GAME_DATA[GAME_TYPE].WEAP[data.weapon].substat}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                  {GAME_DATA[GAME_TYPE].WEAP[data.weapon].subtitle}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                  {GAME_DATA[GAME_TYPE].WEAP[data.weapon].desc}
                                </Typography>
                              </React.Fragment>
                            }
                            arrow
                          >
                            <img
                              src={wImgs[`../assets/weap/GI/${data.weapon}.webp`]?.default}
                              alt={data.weapon}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                    {isDesktop && (
                      <TableCell>
                        {data.set1 && (
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {GAME_DATA[GAME_TYPE].SETS[data.set1].name}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                  {GAME_DATA[GAME_TYPE].SETS[data.set1].desc}
                                </Typography>
                              </React.Fragment>
                            }
                            arrow
                          >
                            <img
                              src={sImgs[`../assets/sets/GI/${data.set1}.webp`]?.default}
                              alt={data.set1}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                    <TableCell>{score.toString()}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          visibility: hoveredRow === id ? "visible" : "hidden",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => setIsSaveOpen(id)}
                        >
                          <EditIcon />
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          onClick={() => setIsDeleteOpen(id)}
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
          >
            Load from UID
          </Button>
        </Box>

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

export default GenshinImpact;
