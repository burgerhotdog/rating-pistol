import { Typography } from "@mui/material";
import { LABEL_DATA } from "@data";

const AvatarHead = ({ gameId }) => {
  return (
    <Typography variant="body1" fontWeight="bold">
      {LABEL_DATA[gameId].Avatar}
    </Typography>
  );
};

export default AvatarHead;
