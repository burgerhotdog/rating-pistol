import { doc, setDoc } from "firebase/firestore";
import { db } from "@config/firebase";
import { Star } from "@mui/icons-material";

const StarBody = ({ gameId, userId, setAvatarCache, id, data }) => {
  const { isStar } = data;

  const toggleStar = async () => {
    if (userId) {
      const infoDocRef = doc(db, "users", userId, gameId, id);
      setDoc(infoDocRef, { isStar: !Boolean(isStar) }, { merge: true });
    }

    setAvatarCache((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        data: {
          ...prev[id].data,
          isStar: !Boolean(isStar),
        },
      },
    }));
  }

  return (
    <Star
      onClick={toggleStar}
      cursor="pointer"
      fontSize="small"
      sx={{
        color: isStar ? "gold !important" : "rgba(0, 0, 0, 0)",
        stroke: isStar ? "gold !important" : "rgba(255, 255, 255, 0.3)",
        strokeWidth: 2,
        transition: "color 0.25s ease-in-out, stroke 0.25s ease-in-out",
        "&:hover": { stroke: "gold !important" },
      }}
    />
  );
};

export default StarBody;
