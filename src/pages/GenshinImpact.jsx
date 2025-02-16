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
import toPascalCase from "../components/toPascalCase";
import Enka from "../components/Enka";

const cImgs = import.meta.glob("../assets/char/GI/*.webp", { eager: true });
const wImgs = import.meta.glob("../assets/weap/GI/*.webp", { eager: true });
const sImgs = import.meta.glob("../assets/set/GI/*.webp", { eager: true });

const GenshinImpact = ({ uid }) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEnkaOpen, setIsEnkaOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [myChars, setMyChars] = useState({});

  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("xl"));

  // Populate myChars when user signs in/out
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        // Fetch character documents from firestore
        const charDocsRef = collection(db, "users", uid, "GI");
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
        <Typography variant="body2">Updated for version 5.4</Typography>
        <TableContainer sx={{ maxWidth: 900 }}>
          <Table>
            {/* Table headers */}
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                {isNotMobile && <TableCell>Weapon</TableCell>}
                {isNotMobile && <TableCell>Artifacts</TableCell>}
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
                Object.entries(myChars)
                .sort(([, a], [, b]) => Number(b.score) - Number(a.score))
                .map(([cid, cdata]) => (
                  <TableRow
                    key={cid}
                    onMouseEnter={() => setHoveredRow(cid)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <TableCell>
                      <img
                        src={cImgs[`../assets/char/GI/${toPascalCase(cid)}.webp`]?.default}
                        alt={"char"}
                        style={{ width: 50, height: 50, objectFit: "contain" }}
                      />
                    </TableCell>
                    <TableCell>{cid}</TableCell>
                    {isNotMobile && (
                      <TableCell>
                        {cdata.weapon && (
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {GAME_DATA["GI"].WEAPONS[cdata.weapon].name}
                                </Typography>
                                <Typography variant="body2">
                                  {"Base ATK: " + GAME_DATA["GI"].WEAPONS[cdata.weapon].base.ATK} <br />
                                  {GAME_DATA["GI"].WEAPONS[cdata.weapon].substat}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                  {GAME_DATA["GI"].WEAPONS[cdata.weapon].subtitle}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                  {GAME_DATA["GI"].WEAPONS[cdata.weapon].desc}
                                </Typography>
                              </React.Fragment>
                            }
                            arrow
                          >
                            <img
                              src={wImgs[`../assets/weap/GI/${cdata.weapon}.webp`]?.default}
                              alt={"weap"}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                    {isNotMobile && (
                      <TableCell>
                        {cdata.set && (
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {cdata.set}
                                </Typography>
                                <Typography variant="body2">
                                  {GAME_DATA["GI"].SETS[cdata.set].desc[0]} <br />
                                  {GAME_DATA["GI"].SETS[cdata.set].desc[1]}
                                </Typography>
                              </React.Fragment>
                            }
                            arrow
                          >
                            <img
                              src={sImgs[`../assets/set/GI/${toPascalCase(cdata.set)}.webp`]?.default}
                              alt={"set"}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                    <TableCell>{cdata.score}</TableCell>
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

        {/* Enka button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEnkaOpen(true)}
          sx={{ mt: 2 }}
        >
          Load from uid
        </Button>

        {/* Save modal */}
        <Save
          gameType={"GI"}
          uid={uid}
          isSaveOpen={isSaveOpen}
          setIsSaveOpen={setIsSaveOpen}
          myChars={myChars}
          setMyChars={setMyChars}
        />

        {/* Delete modal */}
        <Delete
          gameType={"GI"}
          uid={uid}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setMyChars={setMyChars}
        />

        {/* Enka modal */}
        <Enka
          gameType={"GI"}
          uid={uid}
          isEnkaOpen={isEnkaOpen}
          setIsEnkaOpen={setIsEnkaOpen}
          myChars={myChars}
          setMyChars={setMyChars}
        />
      </Box>        
    </Container>
  );
};

export default GenshinImpact;
