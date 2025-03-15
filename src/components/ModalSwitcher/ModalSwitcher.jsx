import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Modal, Box, useTheme } from "@mui/material";
import AddModal from "./Add";
import AvatarModal from "./Avatar";
import EquipModal from "./Equip";
import LoadModal from "./Load";
import RatingModal from "./Rating";
import WeaponModal from "./Weapon";

const ModalSwitcher = ({
  gameId,
  userId,
  modalPipe,
  setModalPipe,
  localDocs,
  setLocalDocs,
}) => {
  const theme = useTheme();

  const savePipe = async () => {
    const id = modalPipe.id;
    const data = modalPipe.data;

    if (userId) {
      const docRef = doc(db, "users", userId, gameId, id);
      await setDoc(docRef, data, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [id]: data,
    }));
  };

  const closeModal = () => {
    setModalPipe({});
  };

  let modalContent = null;
  switch (modalPipe.type) {
    case "add":
      modalContent = (
        <AddModal
          gameId={gameId}
          localDocs={localDocs}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          savePipe={savePipe}
        />
      );
      break;

    case "avatar":
      modalContent = (
        <AvatarModal
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          savePipe={savePipe}
        />
      );
      break;

    case "equip":
      modalContent = (
        <EquipModal
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          savePipe={savePipe}
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
          savePipe={savePipe}
        />
      );
      break;
  }

  return (
    <Modal open={Boolean(modalPipe.type)} onClose={closeModal}>
      <Box sx={theme.customStyles.modal}>
        {modalContent}
      </Box>
    </Modal>
  );
};

export default ModalSwitcher;
