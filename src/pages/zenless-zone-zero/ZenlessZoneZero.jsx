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
import { db } from "../../firebase";
import Back from "../../components/Back";
import Save from "./components/Save";
import Delete from "./components/Delete";
import WEAPONS from "./data/WEAPONS";
import SETS from "./data/SETS";
import toPascalCase from "../../components/toPascalCase";

const cImgs = import.meta.glob("./assets/char/*.webp", { eager: true });
const wImgs = import.meta.glob("./assets/weap/*.webp", { eager: true });
const sImgs = import.meta.glob("./assets/set/*.webp", { eager: true });

const ZenlessZoneZero = ({ uid }) => {
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [myChars, setMyChars] = useState({});

  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("xl"));

  // Populate myChars when user signs in/out
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        // Fetch character documents from firestore
        const charDocsRef = collection(db, "users", uid, "ZenlessZoneZero");
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
        <Typography variant="h4">Zenless Zone Zero</Typography>
        <Typography variant="body2">Updated for version 1.5</Typography>
        <TableContainer sx={{ maxWidth: 900 }}>
          <Table>
            {/* Table headers */}
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                {isNotMobile && <TableCell>W-Engine</TableCell>}
                {isNotMobile && <TableCell>Drive Disks</TableCell>}
                <TableCell>Score</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            {/* Table data */}
            <TableBody>
              {Object.keys(myChars).length === 0 ? (
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
                        src={cImgs[`./assets/char/${toPascalCase(cid)}.webp`]?.default}
                        alt={"char"}
                        style={{ width: 50, height: 50, objectFit: "contain" }}
                      />
                    </TableCell>
                    <TableCell>{cid}</TableCell>
                    {isNotMobile && (
                      <TableCell>
                        <Tooltip
                          title={
                            <React.Fragment>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {cdata.weapon}
                              </Typography>
                              <Typography variant="body2">
                                {"Base ATK: " + WEAPONS[cdata.weapon].base.ATK} <br />
                                {WEAPONS[cdata.weapon].substat}
                              </Typography>
                              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                {WEAPONS[cdata.weapon].subtitle}
                              </Typography>
                              <Typography variant="body2">
                                {WEAPONS[cdata.weapon].desc.map((line, index) => (
                                  <React.Fragment key={index}>
                                    {line}
                                    {index < WEAPONS[cdata.weapon].desc.length - 1 && <br />}
                                  </React.Fragment>
                                ))}
                              </Typography>
                            </React.Fragment>
                          }
                          arrow
                        >
                          <img
                            src={wImgs[`./assets/weap/${toPascalCase(cdata.weapon)}.webp`]?.default}
                            alt={"weap"}
                            style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                          />
                        </Tooltip>
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
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {cdata.set1}
                                </Typography>
                                <Typography variant="body2">
                                  {SETS[cdata.set1].desc[0]} <br />
                                  {SETS[cdata.set1].desc[1]}
                                </Typography>
                              </React.Fragment>
                            }
                            arrow
                          >
                            <img
                              src={sImgs[`./assets/set/${toPascalCase(cdata.set1)}.webp`]?.default}
                              alt={"set1"}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </Tooltip>
                          <Typography>+</Typography>
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {cdata.set2}
                                </Typography>
                                <Typography variant="body2">
                                  {SETS[cdata.set2].desc[0]} <br />
                                  {SETS[cdata.set2].desc[1]}
                                </Typography>
                              </React.Fragment>
                            }
                            arrow
                          >
                            <img
                              src={sImgs[`./assets/set/${toPascalCase(cdata.set2)}.webp`]?.default}
                              alt={"set2"}
                              style={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
                            />
                          </Tooltip>
                        </Box>
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

export default ZenlessZoneZero;
