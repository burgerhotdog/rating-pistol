import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Modal, Box, useTheme } from "@mui/material";
import AddModal from "./Add/AddModal";
import AvatarModal from "./Avatar/AvatarModal";
import EquipModal from "./Equip/EquipModal";
import LoadModal from "./Load/LoadModal";
import RatingModal from "./Rating/RatingModal";
import WeaponModal from "./Weapon/WeaponModal";

const ModalSwitcher = ({
  gameId,
  userId,
  modalPipe,
  setModalPipe,
  localDocs,
  setLocalDocs,
}) => {
  const theme = useTheme();

  const saveAction = async (id, data) => {
    if (userId) {
      const docRef = doc(db, "users", userId, gameId, id);
      await setDoc(docRef, data, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [id]: data,
    }));
  };

  const closeAction = () => {
    setModalPipe({});
  };

  let modalContent = null;
  switch (modalPipe.type) {
    case "add":
      modalContent = (
        <AddModal
          gameId={gameId}
          localDocs={localDocs}
          saveAction={saveAction}
          closeAction={closeAction}
        />
      );
      break;

    case "avatar":
      modalContent = (
        <AvatarModal
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          saveAction={saveAction}
        />
      );
      break;

    case "equip":
      modalContent = (
        <EquipModal
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          saveAction={saveAction}
        />
      );
      break;

    case "load":
      modalContent = (
        <LoadModal
          gameId={gameId}
          userId={userId}
          setModalPipe={setModalPipe}
          setLocalDocs={setLocalDocs}
          saveAction={saveAction}
          closeAction={closeAction}
        />
      );
      break;

    case "rating":
      modalContent = (
        <RatingModal
          gameId={gameId}
          modalPipe={modalPipe}
        />
      );
      break;

    case "weapon":
      modalContent = (
        <WeaponModal
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          saveAction={saveAction}
        />
      );
      break;
  }

  return (
    <Modal open={Boolean(modalPipe.type)} onClose={closeAction}>
      <Box sx={theme.customStyles.modal}>
        {modalContent}
      </Box>
    </Modal>
  );
};

export default ModalSwitcher;
