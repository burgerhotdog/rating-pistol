import Ocr from "./Ocr";
import Enka from "./Enka";

const Load = ({ gameId, userId, setAvatarCache, saveAvatar, saveAvatarBatch, closeModal }) => {

  if (gameId === "ww") {
    return (
      <Ocr
        gameId={gameId}
        userId={userId}
        setAvatarCache={setAvatarCache}
        saveAvatar={saveAvatar}
        saveAvatarBatch={saveAvatarBatch}
        closeModal={closeModal}
      />
    );
  }

  return (
    <Enka
      gameId={gameId}
      userId={userId}
      saveAvatarBatch={saveAvatarBatch}
      closeModal={closeModal}
    />
  );
};

export default Load;