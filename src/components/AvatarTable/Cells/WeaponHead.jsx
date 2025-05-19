import { Typography } from "@mui/material";
import { LABEL_DATA } from "@data";

const WeaponHead = ({ gameId }) => {
  return (
    <Typography variant="body1" fontWeight="bold">
      {LABEL_DATA[gameId].Weapon}
    </Typography>
  );
};

export default WeaponHead;
