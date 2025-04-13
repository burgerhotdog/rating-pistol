import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import { Modal, Box } from "@mui/material";
import Add from "./Add";
import Avatar from "./Avatar";
import Equip from "./Equip";
import Load from "./Load";
import Rating from "./Rating";
import Weapon from "./Weapon";

export default ({
  gameId,
  userId,
  pipe,
  setPipe,
  localDocs,
  setLocalDocs,
}) => {
  const savePipe = async () => {
    const { id, data } = pipe;

    if (userId) {
      const reference = doc(db, "users", userId, gameId, id);
      await setDoc(reference, data, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [id]: data,
    }));
  };

  let modalContent = null;
  switch (pipe.type) {
    case "add":
      modalContent = (
        <Add
          gameId={gameId}
          localDocs={localDocs}
          pipe={pipe}
          setPipe={setPipe}
          savePipe={savePipe}
        />
      );
      break;

    case "avatar":
      modalContent = (
        <Avatar
          gameId={gameId}
          pipe={pipe}
          setPipe={setPipe}
          savePipe={savePipe}
        />
      );
      break;

    case "equip":
      modalContent = (
        <Equip
          gameId={gameId}
          pipe={pipe}
          setPipe={setPipe}
          savePipe={savePipe}
        />
      );
      break;

    case "load":
      modalContent = (
        <Load
          gameId={gameId}
          userId={userId}
          setPipe={setPipe}
          setLocalDocs={setLocalDocs}
        />
      );
      break;

    case "rating":
      modalContent = (
        <Rating
          gameId={gameId}
          pipe={pipe}
        />
      );
      break;

    case "weapon":
      modalContent = (
        <Weapon
          gameId={gameId}
          pipe={pipe}
          setPipe={setPipe}
          savePipe={savePipe}
        />
      );
      break;
  }

  return (
    <Modal open={Boolean(pipe.type)} onClose={() => setPipe({})}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "background.paper",
        p: 4,
        borderRadius: 2,
        maxHeight: "80vh",
        maxWidth: "80vw",
        overflow: "auto",
      }}>
        {modalContent}
      </Box>
    </Modal>
  );
};
