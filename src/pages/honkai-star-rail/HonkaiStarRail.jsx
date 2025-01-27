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
import blankCdata from "./blankCdata";

const cImgs = import.meta.glob("./assets/char/*.webp", { eager: true });
const wImgs = import.meta.glob("./assets/weap/*.webp", { eager: true });
const sImgs = import.meta.glob("./assets/set/*.webp", { eager: true });

const HonkaiStarRail = ({ uid }) => {
  // Modal States
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Local Character Objects
  const [myChars, setMyChars] = useState({});

  // New Character Object
  const [newCharId, setNewCharId] = useState("");
  const [newCharObj, setNewCharObj] = useState(blankCdata);

  // Mobile layout breakpoint
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // Populate myChars when user signs in/out
  useEffect(() => {
    const fetchDB = async () => {
      if (uid) {
        // Fetch character documents from firestore
        const charDocsRef = collection(db, "users", uid, "HonkaiStarRail");
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

  // Add character button handler
  const handleAdd = () => {
    setNewCharId("");
    setNewCharObj(blankCdata());
    setIsEditMode(false);
    setIsSaveOpen(true);
  };

  // Edit button handler
  const handleEdit = (id) => {
    setNewCharId(id);
    setNewCharObj(myChars[id]);
    setIsEditMode(true);
    setIsSaveOpen(true);
  };

  // Delete button handler
  const handleDelete = (id) => {
    setNewCharId(id);
    setIsDeleteOpen(true);
  };

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
        <Typography variant="body2">Updated for version 2.7</Typography>
        <TableContainer sx={{ maxWidth: 900 }}>
          <Table>
            {/* Table headers */}
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Light Cone</TableCell>}
                {!isMobile && <TableCell>Relics</TableCell>}
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
                .map(([id, char]) => (
                  <TableRow key={id}>
                    <TableCell>
                      <img
                        src={cImgs[`./assets/char/${id}.webp`]?.default}
                        alt={"char"}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "contain",
                        }}
                      />
                    </TableCell>
                    <TableCell>{char.name}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        <img
                          src={wImgs[`./assets/weap/${char.weapon}.webp`]?.default}
                          alt={"weap"}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "contain",
                          }}
                        />
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        <Box sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 1,
                        }}>
                          <img
                            src={sImgs[`./assets/set/${char.set1}.webp`]?.default}
                            alt={"set1"}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                            }}
                          />
                          <Typography>+</Typography>
                          <img
                            src={sImgs[`./assets/set/${char.set2}.webp`]?.default}
                            alt={"set2"}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                      </TableCell>
                    )}
                    <TableCell>{char.score}</TableCell>
                    <TableCell>
                      {/* Edit button */}
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(id)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </Button>

                      {/* Delete button */}
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(id)}
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
          onClick={handleAdd}
          sx={{ mt: 2 }}
        >
          Add character
        </Button>

        {/* Save modal */}
        <Save
          uid={uid}
          isSaveOpen={isSaveOpen}
          setIsSaveOpen={setIsSaveOpen}
          isEditMode={isEditMode}
          myChars={myChars}
          setMyChars={setMyChars}
          newCharId={newCharId}
          setNewCharId={setNewCharId}
          newCharObj={newCharObj}
          setNewCharObj={setNewCharObj}
        />

        {/* Delete modal */}
        <Delete
          uid={uid}
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          myChars={myChars}
          setMyChars={setMyChars}
          newCharId={newCharId}
        />
      </Box>        
    </Container>
  );
};

export default HonkaiStarRail;
