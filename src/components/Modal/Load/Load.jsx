import Ocr from "./Ocr";
import Enka from "./Enka";

const Load = ({ gameId, userId, setAvatarCache, saveAvatar, closeModal }) => {
  if (gameId === "ww") {
    return (
      <Ocr
        gameId={gameId}
        userId={userId}
        setAvatarCache={setAvatarCache}
        saveAvatar={saveAvatar}
        closeModal={closeModal}
      />
    );
  }

  return (
    <Enka
      gameId={gameId}
      userId={userId}
      setAvatarCache={setAvatarCache}
      closeModal={closeModal}
    />
  );
};

export default Load;