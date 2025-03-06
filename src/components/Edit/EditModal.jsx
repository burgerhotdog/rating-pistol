import React, { useState } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Modal,
  Box,
  Stack,
  Button,
  useTheme,
} from "@mui/material";
import EditCharacter from "./Character/EditCharacter";
import EditWeapon from "./Weapon/EditWeapon";
import EditGear from "./Gear/EditGear";
import EditSkills from "./Skills/EditSkills";

const EditModal = ({
  user,
  gameType,
  action,
  setAction,
  setLocalObjs,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    
    if (user) {
      const batch = writeBatch(db);
      const infoDocRef = doc(db, "users", user.uid, gameType, action.id);
      batch.set(infoDocRef, action.data.info, { merge: true });
      for (const [index, gearObj] of action.data.gearList.entries()) {
        const gearDocRef = doc(db, "users", user.uid, gameType, action.id, "gearList", index.toString());
        batch.set(gearDocRef, gearObj, { merge: true });
      }
      await batch.commit();
    }

    setLocalObjs((prev) => ({
      ...prev,
      [action.id]: action.data,
    }));

    setIsLoading(false);
    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.type === "edit"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack alignItems="center" spacing={2}>
          {action?.item === "character" ? (
            <EditCharacter
              gameType={gameType}
              action={action}
              setAction={setAction}
            />
          ) : action?.item === "weapon" ? (
            <EditWeapon
              gameType={gameType}
              action={action}
              setAction={setAction}
            />
          ) : action?.item === "gear" ? (
            <EditGear
              gameType={gameType}
              action={action}
              setAction={setAction}
            />
          ) : action?.item === "skills" && (
            <EditSkills
              gameType={gameType}
              action={action}
              setAction={setAction}
            />
          )}
          <Button
            onClick={handleSave}
            loading={isLoading}
            variant="contained"
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditModal;
