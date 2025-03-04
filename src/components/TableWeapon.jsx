import React from "react";
import { Box, Stack, TableCell, Tooltip, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";

const TableWeapon = ({
  gameType,
  INFO,
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
            <Typography variant="body2">
              Edit {INFO.HEADER_NAMES[1]}
            </Typography>
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
          title={isModalClosed() && (
            <Typography variant="body2">
              Add {INFO.HEADER_NAMES[1]}
            </Typography>
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
