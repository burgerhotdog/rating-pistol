import React from "react";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";

const TableWeapon = ({
  gameType,
  WEAP,
  weapIcons,
  setAction,
  id,
  data,
  isModalClosed,
}) => {
  const openModal = () => {
    setAction({
      type: "edit",
      item: "weapon",
      id,
      data,
    });
  };

  return (
    <TableCell align="center">
      {data.info.weapon ? (
        <Tooltip
          title={isModalClosed() && (
            <Stack>
              <Typography variant="subtitle1" fontWeight="bold">
                {WEAP[data.info.weapon].name}
              </Typography>
              <Typography variant="body2">
                {gameType === "HSR"
                  && `Base HP: ${WEAP[data.info.weapon].base.FLAT_HP}`}
              </Typography>
              <Typography variant="body2">
                {`Base ATK: ${WEAP[data.info.weapon].base.FLAT_ATK}`}
              </Typography>
              <Typography variant="body2">
                {gameType === "HSR"
                  ? `Base DEF: ${WEAP[data.info.weapon].base.FLAT_DEF}`
                  : WEAP[data.info.weapon].substat}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" mt={1}>
                {WEAP[data.info.weapon].subtitle}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {WEAP[data.info.weapon].desc}
              </Typography>
            </Stack>
          )}
          arrow
        >
          <Stack 
            onClick={openModal}
            alignItems="center"
            sx={{ cursor: "pointer" }}
          >
            <Box
              component="img"
              alt={data.info.weapon}
              src={weapIcons[`../assets/weap/${gameType}/${data.info.weapon}.webp`]?.default}
              sx={{ width: 50, height: 50, objectFit: "contain" }}
            />
          </Stack>
        </Tooltip>
      ) : (
        <Tooltip
          title={isModalClosed && (
            <Typography>Add Weapon</Typography>
          )}
          arrow
        >
          <Add
            onClick={openModal}
            cursor="pointer"
          />
        </Tooltip>
      )}
    </TableCell>
  );
};

export default TableWeapon;
