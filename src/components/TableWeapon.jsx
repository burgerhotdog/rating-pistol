import React from "react";
import { Box, Stack, TableCell, Tooltip, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";

const TableWeapon = ({
  gameType,
  gameData,
  weapIcons,
  setAction,
  id,
  data,
  isModalClosed,
}) => {
  const { INFO } = gameData;
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
      <Tooltip
        title={isModalClosed() && (
          <Typography variant="body2">
            {data.info.weapon ? "Edit" : "Add"} {INFO.SECTION_NAMES[1]}
          </Typography>
        )}
        arrow
      >
        <Stack 
          onClick={openModal}
          alignItems="center"
          sx={{ cursor: "pointer" }}
        >
          {data.info.weapon ? (
            <Box
              component="img"
              alt={data.info.weapon}
              src={weapIcons[`../assets/weap/${gameType}/${data.info.weapon}.webp`]?.default}
              sx={{ width: 50, height: 50, objectFit: "contain" }}
            />
          ) : (
            <Add />
          )}
        </Stack>
      </Tooltip>
    </TableCell>
  );
};

export default TableWeapon;
