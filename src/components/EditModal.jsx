import React from "react";
import { doc, setDoc } from "firebase/firestore";
import {
  Box,
  Button,
  Modal,
  Stack,
  useTheme,
} from "@mui/material";
import { db } from "../firebase";
//import EditModalCharacter from "./EditModalCharacter";
import EditModalWeapon from "./EditModalWeapon";
import EditModalGear from "./EditModalGear";
//import EditModalSkills from "./EditModalSkills";

const EditModal = ({
  uid,
  gameType,
  gameData,
  gameIcons,
  setMyChars,
  action,
  setAction,
}) => {
  const theme = useTheme();
  const { CHAR, WEAP, SETS } = gameData;
  const { charIcons, weapIcons, setsIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };

  const handleSave = async () => {
    // Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, action.id);
      await setDoc(charDocRef, action.data, { merge: true });
    }

    // Local
    setMyChars((prev) => ({
      ...prev,
      [action.id]: action.data,
    }));

    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.type === "edit"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack gap={2}>
          {action?.item === "character" ? (
            /*<EditModalCharacter
              gameType={gameType}
              gameData={gameData}
              gameIcons={gameIcons}
              action={action}
              setAction={setAction}
            />*/""
          ) : action?.item === "weapon" ? (
            <EditModalWeapon
              gameType={gameType}
              gameData={gameData}
              gameIcons={gameIcons}
              action={action}
              setAction={setAction}
            />
          ) : action?.item === "gear" ? (
            <EditModalGear
              gameType={gameType}
              gameData={gameData}
              gameIcons={gameIcons}
              action={action}
              setAction={setAction}
            />
          ) : action?.item === "gear" && (
            /*<EditModalSkills
              gameType={gameType}
              gameData={gameData}
              gameIcons={gameIcons}
              action={action}
              setAction={setAction}
            />*/""
          )}

          <Stack direction="row" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ width: 80 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ width: 80 }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditModal;
