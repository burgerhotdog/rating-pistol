import React from "react";
import { Box, Stack, TableCell, Tooltip } from "@mui/material";
import Add from "@mui/icons-material/Add";

const TableWeapon = ({
  gameType,
  gameData,
  weapIcons,
  setAction,
  id,
  data,
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

  const addOrEdit = data.info.weapon ? "Edit " : "Add ";
  const sectionName = INFO.SECTION_NAMES[1];

  return (
    <TableCell>
      <Stack alignItems="center">
        <Tooltip title={`${addOrEdit} ${sectionName}`} arrow>
          {data.info.weapon ? (
            <Box
              onClick={openModal}
              component="img"
              alt={data.info.weapon}
              src={weapIcons[`../assets/weap/${gameType}/${data.info.weapon}.webp`]?.default}
              sx={{ width: 50, height: 50, objectFit: "contain", cursor: "pointer" }}
            />
          ) : (
            <Add onClick={openModal} cursor="pointer" />
          )}
        </Tooltip>
      </Stack>
    </TableCell>
  );
};

export default TableWeapon;
