import { Star } from "@mui/icons-material";

const StarHead = ({ starOnly, setStarOnly }) => {
  const toggleStar = () => {
    setStarOnly(!starOnly);
  };

  return (
    <Star
      onClick={toggleStar}
      cursor="pointer"
      fontSize="small"
      sx={{
        color: starOnly ? "gold !important" : "rgba(0, 0, 0, 0)",
        stroke: starOnly ? "gold !important" : "rgba(255, 255, 255, 0.3)",
        strokeWidth: 2,
        transition: "color 0.25s ease-in-out, stroke 0.25s ease-in-out",
        "&:hover": { stroke: "gold !important" },
      }}
    />
  );
};

export default StarHead;
