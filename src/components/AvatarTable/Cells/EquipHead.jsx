import { Typography } from "@mui/material";
import { LABEL_DATA } from "@data";

const EquipHead = ({ gameId }) => {
  return (
    <Typography variant="body1" fontWeight="bold">
      {LABEL_DATA[gameId].Equips}
    </Typography>
  );
};

export default EquipHead;
