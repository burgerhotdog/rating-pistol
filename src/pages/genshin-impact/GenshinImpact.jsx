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
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { db } from "../../firebase";
import Back from "../../components/Back";
import Save from "./components/Save";
import Delete from "./components/Delete";
import Tooltip from "@mui/material/Tooltip";
import WEAPONS from "./data/WEAPONS";
import SETS from "./data/SETS";

const cImgs = import.meta.glob("./assets/char/*.webp", { eager: true });
const wImgs = import.meta.glob("./assets/weap/*.webp", { eager: true });
const sImgs = import.meta.glob("./assets/set/*.webp", { eager: true });

function toPascalCase(str) {
  return str
    .replace(/'s\b/gi, "s") // Step 1: Replace possessive "'s" with "s"
    .match(/[a-z0-9]+/gi) // Step 2: Match alphabetic and numeric substrings
    .map(word =>
      /^[0-9]/.test(word) // Check if the word starts with a number
        ? word // Leave it as is if it starts with a number
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // PascalCase for alphabetic substrings
    )
    .join('');
}

const GenshinImpact = ({ uid }) => {
  // Modal States
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Local Character Objects
  const [myChars, setMyChars] = useState({});

  // Mobile layout breakpoint
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // Populate myChars when user signs in/out
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        // Fetch character documents from firestore
        const charDocsRef = collection(db, "users", uid, "GenshinImpact");
        const charDocs = await getDocs(charDocsRef);
  
        // Convert documents to objects
        const docsToObjs = {};
        charDocs.docs.forEach((charDoc) => {
          docsToObjs[charDoc.id] = charDoc.data();
        });
  
        // Store objects in myChars
        setMyChars(docsToObjs);
      } else {
        // Clear myChars
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
        <Typography variant="body2">Updated for version 5.3</Typography>
        <TableContainer sx={{ maxWidth: 900 }}>
          <Table>
            {/* Table headers */}
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Weapon</TableCell>}
                {!isMobile && <TableCell>Artifacts</TableCell>}
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
                  <TableRow key={cid}>
                    <TableCell>
                      <img
                        src={cImgs[`./assets/char/${toPascalCase(cid)}.webp`]?.default}
                        alt={"char"}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "contain",
                        }}
                      />
                    </TableCell>
                    <TableCell>{cid}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Tooltip
                          title={
                            <React.Fragment>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {cdata.weapon}
                              </Typography>
                              <Typography variant="body2">
                                {"Base ATK: " + WEAPONS[cdata.weapon].base.ATK} <br />
                                {Object.keys(WEAPONS[cdata.weapon].stat)[0] + ": " + 
                                Object.values(WEAPONS[cdata.weapon].stat)[0]}
                              </Typography>
                              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                {WEAPONS[cdata.weapon].subtitle}
                              </Typography>
                              <Typography variant="body2">
                                {WEAPONS[cdata.weapon].desc}
                              </Typography>
                            </React.Fragment>
                          }
                          arrow
                        >
                          <img
                            src={wImgs[`./assets/weap/${toPascalCase(cdata.weapon)}.webp`]?.default}
                            alt={"weap"}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                              cursor: "pointer",
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        <Tooltip
                          title={
                            <React.Fragment>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {cdata.set}
                              </Typography>
                              <Typography variant="body2">
                                {SETS[cdata.set].desc[0]} <br />
                                {SETS[cdata.set].desc[1]}
                              </Typography>
                            </React.Fragment>
                          }
                          arrow
                        >
                          <img
                            src={sImgs[`./assets/set/${toPascalCase(cdata.set)}.webp`]?.default}
                            alt={"set"}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                    )}
                    <TableCell>{cdata.score}</TableCell>
                    <TableCell>
                      {/* Edit button */}
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => setIsSaveOpen(cid)}
                        sx={{ mr: 1 }}
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

        {/* Save modal */}
        <Save
          uid={uid}
          isSaveOpen={isSaveOpen}
          setIsSaveOpen={setIsSaveOpen}
          myChars={myChars}
          setMyChars={setMyChars}
        />

        {/* Delete modal */}
        <Delete
          uid={uid}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setMyChars={setMyChars}
        />
      </Box>        
    </Container>
  );
};

export default GenshinImpact;
