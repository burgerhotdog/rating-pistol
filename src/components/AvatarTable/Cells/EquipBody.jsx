import { Tooltip, Avatar, Stack } from "@mui/material";
import { Add } from "@mui/icons-material";
import { SET_ASSETS } from "@assets";
import { LABEL_DATA } from "@data";

const EquipBody = ({ gameId, setModalPipe, id, data }) => {
  const openModal = () => setModalPipe({ type: "equip", id, data });

  return (
    <Tooltip title={`Edit ${LABEL_DATA[gameId].Equips}`} arrow>
      <Stack
        onClick={openModal}
        display="inline-flex"
        direction="row"
        spacing={1}
        sx={{ cursor: "pointer" }}
      >
        {data.equipList.map(({ setId }, index) => {
          if (!setId) return (
            <Avatar key={index} sx={{ bgcolor: "action.hover" }}>
              <Add />
            </Avatar>
          );
          const srcFolder = SET_ASSETS[gameId][setId];
          const src = (gameId === "gi" || gameId === "hsr")
            ? srcFolder[index]
            : srcFolder;
          return (
            <Avatar
              key={index}
              alt={setId}
              src={src}
            />
          );
        })}
      </Stack>
    </Tooltip>
  );
};

export default EquipBody;
