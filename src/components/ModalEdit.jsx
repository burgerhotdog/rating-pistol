import React from "react";
import { writeBatch, doc } from "firebase/firestore";
import {
  Box,
  Button,
  Modal,
  Stack,
  useTheme,
} from "@mui/material";
import { db } from "../firebase";
import ModalEditCharacter from "./ModalEditCharacter";
import ModalEditWeapon from "./ModalEditWeapon";
import ModalEditGear from "./ModalEditGear";
import ModalEditSkills from "./ModalEditSkills";

const ModalEdit = ({
  uid,
  gameType,
  gameData,
  gameIcons,
  action,
  setAction,
  setLocalObjs,
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
            <ModalEditCharacter
              gameType={gameType}
              gameData={gameData}
              gameIcons={gameIcons}
              action={action}
              setAction={setAction}
            />
          ) : action?.item === "weapon" ? (
            <ModalEditWeapon
              gameType={gameType}
              gameData={gameData}
              gameIcons={gameIcons}
              action={action}
              setAction={setAction}
            />
          ) : action?.item === "gear" ? (
            <ModalEditGear
              gameType={gameType}
              gameData={gameData}
              gameIcons={gameIcons}
              action={action}
              setAction={setAction}
            />
          ) : action?.item === "skills" && (
            <ModalEditSkills
              gameType={gameType}
              gameData={gameData}
              gameIcons={gameIcons}
              action={action}
              setAction={setAction}
            />
          )}

          <Stack direction="row" justifyContent="center" gap={2}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              color="secondary"
              sx={{ width: 80 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
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

export default ModalEdit;
