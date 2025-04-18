import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import { Modal, Box } from "@mui/material";
import { getEquipRatings, getAvatarRating } from "@utils";
import Add from "./Add";
import Avatar from "./Avatar";
import Equip from "./Equip";
import Load from "./Load";
import Rating from "./Rating";
import Weapon from "./Weapon";

export default ({
  gameId,
  userId,
  modalPipe,
  setModalPipe,
  avatarCache,
  setAvatarCache,
}) => {
  const pushModalPipe = async (updateRatings = false) => {
    const { id, data } = modalPipe;
    let equipRatings = {}, avatarRating = {};
    if (updateRatings) {
      equipRatings = getEquipRatings(gameId, id, data.equipList);
      avatarRating = getAvatarRating(gameId, equipRatings);
    }

    if (userId) {
      const ref = doc(db, "users", userId, gameId, id);
      await setDoc(ref, data, { merge: true });
    }

    setAvatarCache((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        data,
        ...updateRatings ? { equipRatings, avatarRating } : {},
      },
    }));
  };

  let modalContent = null;
  switch (modalPipe.type) {
    case "add":
      modalContent = (
        <Add
          gameId={gameId}
          avatarCache={avatarCache}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          pushModalPipe={pushModalPipe}
        />
      );
      break;

    case "avatar":
      modalContent = (
        <Avatar
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          pushModalPipe={pushModalPipe}
        />
      );
      break;

    case "equip":
      modalContent = (
        <Equip
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          pushModalPipe={pushModalPipe}
        />
      );
      break;

    case "load":
      modalContent = (
        <Load
          gameId={gameId}
          userId={userId}
          setModalPipe={setModalPipe}
          setAvatarCache={setAvatarCache}
        />
      );
      break;

    case "rating":
      modalContent = (
        <Rating
          gameId={gameId}
          modalPipe={modalPipe}
        />
      );
      break;

    case "weapon":
      modalContent = (
        <Weapon
          gameId={gameId}
          modalPipe={modalPipe}
          setModalPipe={setModalPipe}
          pushModalPipe={pushModalPipe}
        />
      );
      break;
  }

  return (
    <Modal open={Boolean(modalPipe.type)} onClose={() => setModalPipe({})}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "background.paper",
        p: 4,
        borderRadius: 2,
        maxHeight: "90vh",
        maxWidth: "90vw",
        overflow: "auto",
      }}>
        {modalContent}
      </Box>
    </Modal>
  );
};
