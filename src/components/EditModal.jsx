import React from "react";
import { writeBatch, doc, setDoc } from "firebase/firestore";
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
  setLocalObjs,
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
    if (uid) {
      const batch = writeBatch(db);
      const infoDocRef = doc(db, "users", uid, gameType, action.id);
      batch.set(infoDocRef, action.data.info, { merge: true });
      for (const [index, gearObj] of action.data.gearList.entries()) {
        const gearDocRef = doc(db, "users", uid, gameType, action.id, "gearList", index.toString());
        batch.set(gearDocRef, gearObj, { merge: true });
      }
      await batch.commit();
    }

    setLocalObjs((prev) => ({
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
